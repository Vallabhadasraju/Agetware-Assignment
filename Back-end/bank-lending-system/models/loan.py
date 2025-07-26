from datetime import datetime
import uuid

class Loan:
    def __init__(self, customer_id, principal, period_years, interest_rate, 
                 loan_id=None, total_amount=None, monthly_emi=None, 
                 amount_paid=0, emis_paid=0, created_date=None):
        self.loan_id = loan_id or str(uuid.uuid4())
        self.customer_id = customer_id
        self.principal = principal
        self.period_years = period_years
        self.interest_rate = interest_rate
        self.total_amount = total_amount
        self.monthly_emi = monthly_emi
        self.amount_paid = amount_paid
        self.emis_paid = emis_paid
        self.created_date = created_date or datetime.now().isoformat()
    
    def to_dict(self):
        return {
            'loan_id': self.loan_id,
            'customer_id': self.customer_id,
            'principal': self.principal,
            'period_years': self.period_years,
            'interest_rate': self.interest_rate,
            'total_amount': self.total_amount,
            'monthly_emi': self.monthly_emi,
            'amount_paid': self.amount_paid,
            'emis_paid': self.emis_paid,
            'created_date': self.created_date
        }
    
    @staticmethod
    def from_db_row(row):
        return Loan(
            loan_id=row[0],
            customer_id=row[1],
            principal=row[2],
            period_years=row[3],
            interest_rate=row[4],
            total_amount=row[5],
            monthly_emi=row[6],
            amount_paid=row[7],
            emis_paid=row[8],
            created_date=row[9]
        )
