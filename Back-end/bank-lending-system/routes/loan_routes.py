from flask import Blueprint, request, jsonify
from services.loan_service import LoanService

loan_bp = Blueprint('loans', __name__, url_prefix='/api/loans')

@loan_bp.route('/lend', methods=['POST'])
def create_loan():
    """Create a new loan"""
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['customer_id', 'loan_amount', 'loan_period', 'interest_rate']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        loan = LoanService.create_loan(
            customer_id=data['customer_id'],
            principal=float(data['loan_amount']),
            period_years=int(data['loan_period']),
            interest_rate=float(data['interest_rate'])
        )
        
        return jsonify({
            'loan_id': loan.loan_id,
            'total_amount': loan.total_amount,
            'monthly_emi': loan.monthly_emi,
            'message': 'Loan created successfully'
        })
        
    except ValueError as e:
        return jsonify({'error': 'Invalid data type in request'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@loan_bp.route('/<loan_id>', methods=['GET'])
def get_loan(loan_id):
    """Get loan details by ID"""
    try:
        loan = LoanService.get_loan_by_id(loan_id)
        if not loan:
            return jsonify({'error': 'Loan not found'}), 404
        
        return jsonify(loan.to_dict())
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@loan_bp.route('/customer/<customer_id>', methods=['GET'])
def get_customer_loans(customer_id):
    """Get all loans for a customer"""
    try:
        loans = LoanService.get_loans_by_customer(customer_id)
        return jsonify({
            'customer_id': customer_id,
            'loans': [loan.to_dict() for loan in loans]
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
