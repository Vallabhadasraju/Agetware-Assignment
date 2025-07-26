from flask import Flask
from database.db_setup import init_database
from routes.loan_routes import loan_bp
from routes.payment_routes import payment_bp

def create_app():
    """Application factory"""
    app = Flask(__name__)
    
    # Initialize database
    init_database()
    
    # Register blueprints
    app.register_blueprint(loan_bp)
    app.register_blueprint(payment_bp)
    
    @app.route('/')
    def home():
        return {
            'message': 'Bank Lending System API',
            'version': '1.0',
            'endpoints': {
                'create_loan': 'POST /api/loans/lend',
                'get_loan': 'GET /api/loans/<loan_id>',
                'make_payment': 'POST /api/payments/payment',
                'get_ledger': 'GET /api/payments/ledger/<loan_id>',
                'account_overview': 'GET /api/payments/account-overview/<customer_id>'
            }
        }
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
