import uuid
from openai import OpenAI
import environ
import json

env = environ.Env()
env.read_env()
client = OpenAI(api_key=env('OPENAI_SECRET_KEY'))

use_chatgpt = env('USE_OPENAI')

def create_system_persona_by_chatgpt(user_psersona):
    if (use_chatgpt):
        prompt = f"""
                Create a persona statement that is sympathetic to the following persona statement but has slightly different interests.
                {user_psersona}

                """
        prompt += """"
                The output should be a markdown code snippet formatted in the following schema in Japanese:
                {
                    "persona": string  // new persona
                }

                NOTES:
                * Make it a short sentence.
                * 50 characters max.

                """
        prompt += "{"
    try:
        chatgpt_res = client.chat.completions.create(
            model='gpt-3.5-turbo',
            messages=[
                {
                    'role': 'user',
                    'content': prompt
                },
            ],
            top_p=0.9,
        )
        content = chatgpt_res.choices[0].message.content
        try:
            response_json = json.loads("{"+content)
            return { 'system_persona': response_json['persona'] }
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
        except KeyError as e:
            print(f"Error accessing 'utterance' key: {e}")
    except Exception as e:
        print(f"Error: {e}")
    return { 'system_persona': user_psersona }
