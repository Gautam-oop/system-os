"""
==========================================================================
MISSIONOPS FASTAPI BACKEND - OPENAI SERVICE (LEVEL 1: FIRST AI CONNECTION)
==========================================================================
Secure server-side OpenAI integration.
The API key is NEVER exposed to the browser or JavaScript.
"""

import os
from dotenv import load_dotenv

# Load .env from the project root (mission-ops/.env)
_env_path = os.path.join(os.path.dirname(__file__), '..', '..', '..', '..', '.env')
load_dotenv(dotenv_path=_env_path)

try:
    from openai import OpenAI, APIConnectionError, AuthenticationError, RateLimitError, APIStatusError
    _openai_available = True
except ImportError:
    _openai_available = False


class OpenAIService:
    """
    Secure, server-side wrapper around the OpenAI Chat Completions API.
    The API key is loaded exclusively from the .env file and never
    leaves the Python process.
    """

    @staticmethod
    def _get_client() -> "OpenAI":
        """Initialise and return an authenticated OpenAI client."""
        api_key = os.getenv("OPENAI_API_KEY", "")
        if not api_key or api_key == "your_openai_key_here":
            raise ValueError("OPENAI_API_KEY is not configured in the .env file.")
        if not _openai_available:
            raise ImportError("The 'openai' package is not installed. Run: pip install openai")
        return OpenAI(api_key=api_key)

    @staticmethod
    def _get_model() -> str:
        """Return the configured model, defaulting to gpt-4o-mini."""
        return os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    @staticmethod
    def chat(
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> str:
        """
        Send a chat completion request to OpenAI and return the response text.

        Args:
            system_prompt: The system role instruction.
            user_prompt:   The user's message / task description.
            temperature:   Sampling temperature (0.0 - 2.0).
            max_tokens:    Maximum tokens to generate.

        Returns:
            The model's response as a plain string.

        Raises:
            ValueError:          Missing or placeholder API key.
            PermissionError:     Invalid / revoked API key (401).
            ConnectionError:     Network error reaching OpenAI.
            RuntimeError:        Rate limit exceeded (429) or other API error.
            TimeoutError:        Request timed out.
        """
        if not user_prompt or not user_prompt.strip():
            raise ValueError("Prompt must not be empty.")

        client = OpenAIService._get_client()
        model = OpenAIService._get_model()

        try:
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=temperature,
                max_tokens=max_tokens,
                timeout=30,
            )
            content = response.choices[0].message.content
            if content is None:
                raise RuntimeError("OpenAI returned an empty response.")
            return content.strip()

        except AuthenticationError as exc:
            raise PermissionError(
                f"Invalid OpenAI API key. Check OPENAI_API_KEY in your .env file. Detail: {exc}"
            ) from exc
        except RateLimitError as exc:
            raise RuntimeError(
                f"OpenAI rate limit exceeded. Please wait before retrying. Detail: {exc}"
            ) from exc
        except APIConnectionError as exc:
            raise ConnectionError(
                f"Could not connect to OpenAI API. Check your internet connection. Detail: {exc}"
            ) from exc
        except APIStatusError as exc:
            raise RuntimeError(
                f"OpenAI API error {exc.status_code}: {exc.message}"
            ) from exc
        except Exception as exc:
            raise RuntimeError(f"Unexpected error communicating with OpenAI: {exc}") from exc


# Module-level convenience alias
openai_service = OpenAIService()
