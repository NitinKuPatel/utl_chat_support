import requests
import sys

BASE_URL = "http://127.0.0.1:8000"
EMAIL = "admin@system.local"
PASSWORD = "admin@123"

def verify_logout():
    print(f"1. logging in as {EMAIL}...")
    try:
        login_resp = requests.post(f"{BASE_URL}/auth/login", json={
            "email": EMAIL,
            "password": PASSWORD
        })
    except Exception as e:
        print(f"Failed to connect to backend: {e}")
        return False

    if login_resp.status_code != 200:
        print(f"Login failed: {login_resp.status_code} - {login_resp.text}")
        return False
    
    tokens = login_resp.json()
    refresh_token = tokens.get("refresh_token")
    if not refresh_token:
        print("No refresh token returned!")
        return False
    
    print("Login success. Got refresh token.")
    
    print("2. Logging out...")
    logout_resp = requests.post(f"{BASE_URL}/auth/logout", json={
        "refresh_token": refresh_token
    })
    
    if logout_resp.status_code != 200:
        print(f"Logout failed: {logout_resp.status_code} - {logout_resp.text}")
        return False
    
    print(f"Logout response: {logout_resp.json()}")
    
    print("3. Verifying refresh failure (optional check)...")
    refresh_resp = requests.post(f"{BASE_URL}/auth/refresh", json={
        "refresh_token": refresh_token
    })
    
    if refresh_resp.status_code == 401:
        print("Refresh failed as expected (Token revoked).")
        return True
    else:
        print(f"Refresh unexpectedly succeeded or failed with wrong code: {refresh_resp.status_code}")
        return False

if __name__ == "__main__":
    success = verify_logout()
    if success:
        print("VERIFICATION SUCCESS: Logout works correctly.")
        sys.exit(0)
    else:
        print("VERIFICATION FAILED.")
        sys.exit(1)
