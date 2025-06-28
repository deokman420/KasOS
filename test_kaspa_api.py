import requests
import json

def test_kaspa_api(address):
    """Test an address with the Kaspa API"""
    url = f"https://api.kaspa.org/addresses/{address}/balance"
    
    try:
        response = requests.get(url, timeout=10)
        
        return {
            'address': address,
            'status': response.status_code,
            'valid': response.status_code == 200,
            'response': response.json() if response.status_code == 200 else response.text
        }
    except requests.RequestException as e:
        return {
            'address': address,
            'error': str(e)
        }

def run_tests():
    """Run tests with various address formats"""
    
    # Test addresses - including some known valid formats
    test_addresses = [
        # Properly formatted but possibly invalid addresses
        'kaspa:qqvmgvj5vcqjrz9xmz3nqzgl9hk5xrmqzmdwrjfggcwtpj0qhvd8s6p9fhyav',
        'kaspa:qpzry9x8gf2tvdw0s3jn54khce6mua7l0000000000000000000000000000',
        'kaspa:qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq',
        
        # These should be invalid formats
        'invalid-address',
        'kaspa:invalid',
        
        # Test a known valid address format (if we can find one)
        'kaspa:qpamkvhy2jbmsyvjn6kt24t8h6v8q2g6vw8dkp5q4t2h8y7n9v4xwwxdlpxqs',
    ]
    
    print("🔍 Testing Kaspa address validation with API...\n")
    
    for address in test_addresses:
        print(f"Testing: {address}")
        
        result = test_kaspa_api(address)
        
        if 'error' in result:
            print(f"⚠️ ERROR: {result['error']}\n")
            continue
        
        if result['valid']:
            print(f"✅ VALID (API accepted)")
            if isinstance(result['response'], dict):
                balance = result['response'].get('balance', 0)
                print(f"   Balance: {balance} satoshis")
            print()
        else:
            print(f"❌ INVALID (Status: {result['status']})")
            if result['status'] == 400:
                print("   Error: Invalid address format")
            else:
                print(f"   Response: {result['response']}")
            print()

if __name__ == "__main__":
    try:
        run_tests()
    except KeyboardInterrupt:
        print("\nTest interrupted by user")
    except Exception as e:
        print(f"Error running tests: {e}")
