import urllib.request
import urllib.error
import sys

# Ensure stdout is unbuffered
sys.stdout.reconfigure(line_buffering=True)

url = "http://127.0.0.1:8000/users/"

print(f"Testing URL: {url}")
try:
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as response:
        print(f"Success: {response.status}")
        print(response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print(f"HTTPError: {e.code}")
    print(f"Headers: {e.headers}")
    print(f"Body: {e.read().decode('utf-8')}")
except urllib.error.URLError as e:
    print(f"URLError: {e.reason}")
except Exception as e:
    print(f"Error: {e}")
