def calculate_simple_interest(principal, period_years, interest_rate):
    """
    Calculate simple interest: I = P * N * R / 100
    """
    return principal * period_years * interest_rate / 100

def calculate_total_amount(principal, interest):
    """
    Calculate total amount: A = P + I
    """
    return principal + interest

def calculate_monthly_emi(total_amount, period_years):
    """
    Calculate monthly EMI: EMI = A / (N * 12)
    """
    return total_amount / (period_years * 12)

def calculate_loan_details(principal, period_years, interest_rate):
    """
    Calculate all loan details
    """
    interest = calculate_simple_interest(principal, period_years, interest_rate)
    total_amount = calculate_total_amount(principal, interest)
    monthly_emi = calculate_monthly_emi(total_amount, period_years)
    
    return {
        'interest': round(interest, 2),
        'total_amount': round(total_amount, 2),
        'monthly_emi': round(monthly_emi, 2)
    }

def calculate_emis_from_lump_sum(lump_sum_amount, monthly_emi):
    """
    Calculate how many EMIs a lump sum payment covers
    """
    import math
    return math.floor(lump_sum_amount / monthly_emi)
