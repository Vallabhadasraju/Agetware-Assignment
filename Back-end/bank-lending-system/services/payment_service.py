from models.transaction import Transaction
from services.loan_service import LoanService
from database.db_setup import get_db_connection
from utils.calculations import calculate_emis_from_lump_sum
import math

class PaymentService:
    @staticmethod
    def make_payment(loan_id, amount, payment_type='EMI'):
        """Process a payment for a loan"""
        # Get loan details
        loan = LoanService.get_loan_by_id(loan_id)
        if not loan:
            return {'error': 'Loan not found'}
        
        # Calculate new payment details
        new_amount_paid = loan.amount_paid + amount
        
        if payment_type == 'EMI':
            new_emis_paid = loan.emis_paid + 1
        elif payment_type == 'LUMP_SUM':
            # Calculate how many EMIs this lump sum covers
            additional_emis = calculate_emis_from_lump_sum(amount, loan.monthly_emi)
            new_emis_paid = loan.emis_paid + additional_emis
        else:
            return {'error': 'Invalid payment type'}
        
        # Create transaction record
        transaction = Transaction(
            loan_id=loan_id,
            amount=amount,
            payment_type=payment_type
        )
        
        # Save transaction to database
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO transactions (transaction_id, loan_id, amount, 
                                    payment_type, transaction_date)
            VALUES (?, ?, ?, ?, ?)
        ''', (transaction.transaction_id, transaction.loan_id, transaction.amount,
              transaction.payment_type, transaction.transaction_date))
        
        conn.commit()
        conn.close()
        
        # Update loan payment details
        LoanService.update_loan_payment(loan_id, new_amount_paid, new_emis_paid)
        
        return {
            'success': True,
            'transaction_id': transaction.transaction_id,
            'amount_paid': new_amount_paid,
            'emis_paid': new_emis_paid
        }
    
    @staticmethod
    def get_transactions_by_loan(loan_id):
        """Get all transactions for a loan"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM transactions 
            WHERE loan_id = ? 
            ORDER BY transaction_date
        ''', (loan_id,))
        rows = cursor.fetchall()
        conn.close()
        
        return [Transaction.from_db_row(row) for row in rows]
    
    @staticmethod
    def get_loan_ledger(loan_id):
        """Get complete ledger for a loan"""
        loan = LoanService.get_loan_by_id(loan_id)
        if not loan:
            return {'error': 'Loan not found'}
        
        transactions = PaymentService.get_transactions_by_loan(loan_id)
        
        # Calculate remaining details
        total_emis = loan.period_years * 12
        emis_left = max(0, total_emis - loan.emis_paid)
        balance_amount = max(0, loan.total_amount - loan.amount_paid)
        
        return {
            'loan_id': loan_id,
            'loan_details': loan.to_dict(),
            'transactions': [t.to_dict() for t in transactions],
            'balance_amount': round(balance_amount, 2),
            'monthly_emi': loan.monthly_emi,
            'emis_left': emis_left
        }
    
    @staticmethod
    def get_account_overview(customer_id):
        """Get account overview for a customer"""
        loans = LoanService.get_loans_by_customer(customer_id)
        
        overview = []
        for loan in loans:
            total_emis = loan.period_years * 12
            emis_left = max(0, total_emis - loan.emis_paid)
            total_interest = loan.total_amount - loan.principal
            
            overview.append({
                'loan_id': loan.loan_id,
                'principal': loan.principal,
                'total_amount': loan.total_amount,
                'monthly_emi': loan.monthly_emi,
                'total_interest': round(total_interest, 2),
                'amount_paid': loan.amount_paid,
                'emis_left': emis_left,
                'created_date': loan.created_date
            })
        
        return {
            'customer_id': customer_id,
            'total_loans': len(loans),
            'loans': overview
        }
