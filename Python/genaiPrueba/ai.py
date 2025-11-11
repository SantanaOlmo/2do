from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client()

# The client gets the API key from the environment variable `GEMINI_API_KEY`.

response = client.models.generate_content(
    model="gemini-2.5-flash", contents="Explain how AI works in a few words"
)
print(response.text)