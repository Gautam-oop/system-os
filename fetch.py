import urllib.request
import urllib.error

req = urllib.request.Request('https://system-os-five.vercel.app/api/auth/login')
req.get_method = lambda: 'GET'
try:
    res = urllib.request.urlopen(req)
    print(res.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print(e.read().decode('utf-8'))
