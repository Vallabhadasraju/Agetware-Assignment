from models.loan import Loan
from database.db_setup import get_db_connection
from utils.calculations import calculate_loan_details

class LoanService:
    @staticmethod
    def create_loan(customer_id, principal, period_years, interest_rate):
        """Create a new loan"""
        # Calculate loan details
        details = calculate_loan_details(principal, period_years, interest_rate)
        
        # Create loan object
        loan = Loan(
            customer_id=customer_id,
            principal=principal,
            period_years=period_years,
            interest_rate=interest_rate,
            total_amount=details['total_amount'],
            monthly_emi=details['monthly_emi']
        )
        
        # Save to database
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO loans (loan_id, customer_id, principal, period_years, 
                             interest_rate, total_amount, monthly_emi, 
                             amount_paid, emis_paid, created_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (loan.loan_id, loan.customer_id, loan.principal, loan.period_years,
              loan.interest_rate, loan.total_amount, loan.monthly_emi,
              loan.amount_paid, loan.emis_paid, loan.created_date))
        
        conn.commit()
        conn.close()
        
        return loan
    
    @staticmethod
    def get_loan_by_id(loan_id):
        """Get loan by ID"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM loans WHERE loan_id = ?', (loan_id,))
        row = cursor.fetchone()
        conn.close()
        
        if row:
            return Loan.from_db_row(row)
        return None
    
    @staticmethod
    def get_loans_by_customer(customer_id):
        """Get all loans for a customer"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM loans WHERE customer_id = ?', (customer_id,))
        rows = cursor.fetchall()
        conn.close()
        
        return [Loan.from_db_row(row) for row in rows]
    
    @staticmethod
    def update_loan_payment(loan_id, amount_paid, emis_paid):
        """Update loan payment details"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE loans SET amount_paid = ?, emis_paid = ?
            WHERE loan_id = ?
        ''', (amount_paid, emis_paid, loan_id))
        
        conn.commit()
        conn.close()
