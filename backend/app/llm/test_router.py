import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))

from backend.app.llm.router import get_llm_router

def run_test():
    router = get_llm_router()
    
    print("Testing Mock LLM Router...\n")
    
    roles = ["CEO", "Project Manager", "Backend Engineer"]
    prompt = "Give me a summary of your planned architecture."
    context = {"mission": "Build a scalable microservices architecture", "priority": "high"}

    for role in roles:
        response = router.generate(role=role, prompt=prompt, context=context)
        print(f"Role: {role}\nResponse: {response}\n")

if __name__ == "__main__":
    run_test()
