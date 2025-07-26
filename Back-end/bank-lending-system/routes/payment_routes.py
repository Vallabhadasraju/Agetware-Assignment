from flask import Blueprint, request, jsonify
from services.payment_service import PaymentService

payment_bp = Blueprint('payments', __name__, url_prefix='/api/payments')

@payment_bp.route('/payment', methods=['POST'])
def make_payment():
    """Make a payment for a loan"""
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['loan_id', 'amount']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        result = PaymentService.make_payment(
            loan_id=data['loan_id'],
            amount=float(data['amount']),
            payment_type=data.get('payment_type', 'EMI')
        )
        
        if 'error' in result:
            return jsonify(result), 400
        
        return jsonify(result)
        
    except ValueError as e:
        return jsonify({'error': 'Invalid data type in request'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payment_bp.route('/ledger/<loan_id>', methods=['GET'])
def get_ledger(loan_id):
    """Get transaction ledger for a loan"""
    try:
        ledger = PaymentService.get_loan_ledger(loan_id)
        
        if 'error' in ledger:
            return jsonify(ledger), 404
        
        return jsonify(ledger)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payment_bp.route('/account-overview/<customer_id>', methods=['GET'])
def get_account_overview(customer_id):
    """Get account overview for a customer"""
    try:
        overview = PaymentService.get_account_overview(customer_id)
        return jsonify(overview)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
