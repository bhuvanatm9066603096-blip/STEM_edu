import os
import requests

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

MODEL = "gemini-2.5-flash"

API_URL = (
    f"https://generativelanguage.googleapis.com/v1beta/"
    f"models/{MODEL}:generateContent"
)


def get_biology_response(user_message):

    if not user_message or not user_message.strip():
        return "Please enter a biology question."

    if not GEMINI_API_KEY:
        return "Gemini API key is missing. Please configure it."

    prompt = f"""
    You are Human Biology Lab AI, an educational assistant
    for students in Classes 8 to 12.

    Answer questions about:
    - Human body systems
    - Human anatomy
    - Human physiology
    - Cells and tissues
    - Digestive system
    - Respiratory system
    - Circulatory system
    - Nervous system
    - Skeletal system
    - Human organs

    Instructions:
    1. Explain concepts in simple English.
    2. Give accurate scientific information.
    3. Use headings and bullet points when useful.
    4. Give examples where necessary.
    5. Keep answers student-friendly.

    Student question: {user_message}
    """

    try:
        response = requests.post(
            API_URL,
            params={"key": GEMINI_API_KEY},
            json={
                "contents": [
                    {
                        "parts": [
                            {"text": prompt}
                        ]
                    }
                ]
            },
            timeout=30
        )

        response.raise_for_status()

        data = response.json()

        return (
            data["candidates"][0]["content"]["parts"][0]["text"]
        )

    except requests.exceptions.Timeout:
        return "The chatbot took too long to respond. Please try again."

    except requests.exceptions.RequestException:
        return "Unable to connect to the AI service. Please try again."

    except (KeyError, IndexError, TypeError):
        return "The AI returned an unexpected response. Please try again."