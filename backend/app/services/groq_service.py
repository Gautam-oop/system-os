"""
==========================================================================
MISSIONOPS FASTAPI BACKEND - GROQ SERVICE (LEVEL 1: ONE REAL AI CONNECTION)
==========================================================================
Secure server-side Groq integration using the official OpenAI-compatible API.
"""

import os
from dotenv import load_dotenv
from openai import OpenAI
from backend.app.config import settings

# Load .env from the project root (mission-ops/.env)
_env_path = os.path.join(os.path.dirname(__file__), '..', '..', '..', '.env')
load_dotenv(dotenv_path=_env_path)

class GroqService:
    """
    Secure, server-side wrapper around the Groq API (via OpenAI SDK).
    The API key is loaded exclusively from the .env file and never
    leaves the Python process.
    """

    @staticmethod
    def _get_client() -> OpenAI:
        """Initialise and return an authenticated Groq client."""
        # Try getting key from settings or environment
        api_key = settings.GROQ_API_KEY or os.getenv("GROQ_API_KEY", "")
        if not api_key or api_key in ("your_groq_api_key", ""):
            raise ValueError("GROQ_API_KEY is not configured in the .env file.")
        
        return OpenAI(
            api_key=api_key,
            base_url="https://api.groq.com/openai/v1"
        )

    @staticmethod
    def _get_model() -> str:
        """Return the configured model, defaulting to openai/gpt-oss-120b."""
        return settings.GROQ_MODEL or os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")

    @staticmethod
    def chat(
        system_prompt: str,
        user_prompt: str,
    ) -> str:
        """
        Send a completion request to Groq and return the response text.

        Args:
            system_prompt: The system-level instruction for the model.
            user_prompt:   The user's message / task description.

        Returns:
            The model's response as a plain string.
        """
        if not user_prompt or not user_prompt.strip():
            raise ValueError("Prompt must not be empty.")

        client = GroqService._get_client()
        model = GroqService._get_model()

        try:
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=1024,
            )

            text = response.choices[0].message.content
            if not text:
                raise RuntimeError("Groq returned an empty response.")
            return text.strip()

        except Exception as exc:
            exc_str = str(exc).lower()

            # Classify common Groq/OpenAI API errors
            if "api_key" in exc_str or "api key" in exc_str or "invalid" in exc_str and "key" in exc_str:
                raise PermissionError(
                    f"Invalid GROQ_API_KEY. Check your .env file. Detail: {exc}"
                ) from exc
            if "403" in exc_str or "permission" in exc_str or "forbidden" in exc_str:
                raise PermissionError(
                    f"Permission denied by Groq API (403). Check your API key. Detail: {exc}"
                ) from exc
            if "429" in exc_str or "quota" in exc_str or "rate" in exc_str:
                raise RuntimeError(
                    f"Groq quota exceeded. Please wait before retrying. Detail: {exc}"
                ) from exc
            if "connection" in exc_str or "network" in exc_str or "timeout" in exc_str:
                raise ConnectionError(
                    f"Could not connect to Groq API. Check your internet connection. Detail: {exc}"
                ) from exc
            raise RuntimeError(f"Unexpected error communicating with Groq: {exc}") from exc

# Module-level convenience alias
groq_service = GroqService()
