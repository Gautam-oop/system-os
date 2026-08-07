import sys
import os

# Ensure the root directory is in the sys.path so 'backend' can be imported
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Export the FastAPI app for Vercel Serverless Functions
from backend.app.main import app
