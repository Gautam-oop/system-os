import requests

BASE_URL = "http://localhost:8080/api"

def test_flow():
    print("1. Testing Login...")
    payload = {
        "email": "admin@missionops.dev",
        "password": "password123"
    }
    res = requests.post(f"{BASE_URL}/auth/login", json=payload)
    if res.status_code != 200:
        print(f"Login Failed: {res.status_code} - {res.text}")
        return
        
    data = res.json().get("data", {})
    token = data.get("access_token")
    print(f"Login Successful. Token: {token[:10]}...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    endpoints = [
        "/mission",
        "/tasks",
        "/activity",
        "/timeline",
        "/analytics"
    ]
    
    for endpoint in endpoints:
        print(f"2. Testing GET {endpoint}...")
        r = requests.get(f"{BASE_URL}{endpoint}", headers=headers)
        print(f"Result: {r.status_code}")
        if r.status_code != 200:
            print(f"Error: {r.text}")

if __name__ == "__main__":
    test_flow()
