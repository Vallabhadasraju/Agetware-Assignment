from datetime import datetime
import uuid

class Transaction:
    def __init__(self, loan_id, amount, payment_type, 
                 transaction_id=None, transaction_date=None):
        self.transaction_id = transaction_id or str(uuid.uuid4())
        self.loan_id = loan_id
        self.amount = amount
        self.payment_type = payment_type  # 'EMI' or 'LUMP_SUM'
        self.transaction_date = transaction_date or datetime.now().isoformat()
    
    def to_dict(self):
        return {
            'transaction_id': self.transaction_id,
            'loan_id': self.loan_id,
            'amount': self.amount,
            'payment_type': self.payment_type,
            'transaction_date': self.transaction_date
        }
    
    @staticmethod
    def from_db_row(row):
        return Transaction(
            transaction_id=row[0],
            loan_id=row[1],
            amount=row[2],
            payment_type=row[3],
            transaction_date=row[4]
        )
