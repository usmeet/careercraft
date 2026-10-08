import http.server
import socketserver
import sys

PORT = 8081

class ThreadingSimpleServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    pass

Handler = http.server.SimpleHTTPRequestHandler
Handler.extensions_map.update({
    ".css": "text/css",
    ".js": "application/javascript",
    ".html": "text/html",
})

print("Serving on port", PORT, "with threading")
try:
    with ThreadingSimpleServer(("", PORT), Handler) as httpd:
        httpd.serve_forever()
except OSError as e:
    print(f"Error binding to port {PORT}: {e}", file=sys.stderr)
