import urllib.request
try:
    req = urllib.request.Request("http://localhost:8080/css/tokens.css")
    with urllib.request.urlopen(req) as response:
        print("Status:", response.status)
        print("Headers:", response.headers)
        body = response.read()
        print("Body length:", len(body))
        print("Body snippet:", body[:100])
except Exception as e:
    print("Error:", e)
