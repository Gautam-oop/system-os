import os
import time
from typing import Dict, Any
from openai import OpenAI
from dotenv import load_dotenv
from backend.app.llm.provider import LLMProvider

load_dotenv()

class NVIDIAProvider(LLMProvider):
    """
    NVIDIA Build LLM Provider implementation using OpenAI compatible endpoints.
    """
    def __init__(self, model_name: str = "meta/llama-3.1-70b-instruct"):
        api_key = os.environ.get("NVIDIA_API_KEY")
        if not api_key:
            raise ValueError("NVIDIA_API_KEY environment variable is missing.")
            
        self.model_name = model_name
        self.client = OpenAI(
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=api_key
        )

    def generate(self, role: str, prompt: str, context: Dict[str, Any]) -> str:
        """Generate response via NVIDIA NIM."""
        system_prompt = f"You are acting as the {role} in an autonomous workforce."
        
        # We stringify the context dictionary so the LLM can see what other agents did
        if context:
            system_prompt += f"\n\nContext from previous steps:\n{context}"
            
        for attempt in range(3):
            try:
                completion = self.client.chat.completions.create(
                    model=self.model_name,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.2,
                    top_p=0.7,
                    max_tokens=1024,
                    timeout=30.0
                )
                return completion.choices[0].message.content.strip()
            except Exception as e:
                print(f"[NVIDIA API Warning] Attempt {attempt+1} failed: {e}")
                if attempt == 2:
                    return f"[ERROR] NVIDIA API Failed after 3 attempts: {str(e)}"
                time.sleep(2 ** attempt)
        return ""
