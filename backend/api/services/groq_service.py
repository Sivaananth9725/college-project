import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv('GROQ_API_KEY'))

def get_chatbot_response(query, language='english'):
    try:
        prompt = f"""You are an agricultural expert. Answer this farmer's question in {language}.
        Question: {query}
        
        Provide practical, actionable advice about crops, fertilizers, or farming practices.
        Keep response concise and helpful."""
        
        completion = client.chat.completions.create(
            model="mixtral-8x7b-32768",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=500
        )
        
        return completion.choices[0].message.content
    except:
        return "I'm here to help! Please ask about fertilizers, manure amounts, or crop care."