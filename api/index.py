import sys
import os

# Ensure the root directory is in the sys.path so 'backend' can be imported
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app.main import app as raw_app

class EnsureApiPrefixMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope.get("type") in ("http", "websocket"):
            path = scope.get("path", "")
            if path == "/openapi.json":
                scope["path"] = "/api/openapi.json"
            elif path == "/docs":
                scope["path"] = "/api/docs"
            elif not path.startswith("/api"):
                scope["path"] = "/api" + path
        await self.app(scope, receive, send)

app = EnsureApiPrefixMiddleware(raw_app)

