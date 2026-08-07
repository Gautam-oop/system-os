import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))

from backend.app.llm.providers.nvidia_provider import NVIDIAProvider

def test_nvidia():
    print("Testing NVIDIA Provider...")
    try:
        provider = NVIDIAProvider()
        print("Provider initialized successfully.")
        
        prompt = "Reply with exactly one word: SUCCESS"
        print(f"Sending prompt: {prompt}")
        
        response = provider.generate(
            role="Test Bot", 
            prompt=prompt, 
            context={}
        )
        print(f"Response: {response}")
        
        if "SUCCESS" in response.upper():
            print("Test Passed! Model replied correctly.")
        else:
            print("Test Failed! Model did not reply with SUCCESS.")
            
    except Exception as e:
        print(f"Initialization or Execution Failed: {str(e)}")

if __name__ == "__main__":
    test_nvidia()
