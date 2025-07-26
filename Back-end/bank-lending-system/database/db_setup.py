import sqlite3
import os

DATABASE_PATH = 'database/bank.db'

def init_database():
    """Initialize the database with required tables"""
    # Create database directory if it doesn't exist
    os.makedirs(os.path.dirname(DATABASE_PATH), exist_ok=True)
    
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Create loans table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS loans (
            loan_id TEXT PRIMARY KEY,
            customer_id TEXT NOT NULL,
            principal REAL NOT NULL,
            period_years INTEGER NOT NULL,
            interest_rate REAL NOT NULL,
            total_amount REAL NOT NULL,
            monthly_emi REAL NOT NULL,
            amount_paid REAL DEFAULT 0,
            emis_paid INTEGER DEFAULT 0,
            created_date TEXT NOT NULL
        )
    ''')
    
    # Create transactions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS transactions (
            transaction_id TEXT PRIMARY KEY,
            loan_id TEXT NOT NULL,
            amount REAL NOT NULL,
            payment_type TEXT NOT NULL,
            transaction_date TEXT NOT NULL,
            FOREIGN KEY (loan_id) REFERENCES loans (loan_id)
        )
    ''')
    
    # Create customers table (optional for future use)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS customers (
            customer_id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT,
            phone TEXT
        )
    ''')
    
    conn.commit()
    conn.close()

def get_db_connection():
    """Get database connection"""
    return sqlite3.connect(DATABASE_PATH)
