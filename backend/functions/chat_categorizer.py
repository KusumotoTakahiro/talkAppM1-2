from openai import OpenAI
import environ
import json

env = environ.Env()
env.read_env()
client = OpenAI(api_key=env('OPENAI_SECRET_KEY'))

use_chatgpt = env('USE_OPENAI')

def categorize(utterance_content):
    if (use_chatgpt):
        prompt = f"""
                What is the most appropriate response to the following statement?
                {utterance_content}
                """
        prompt += """"
                The output should be a markdown code snippet formatted in the following schema in Japanese:
                {
                    "option": string  // A or B or C or D
                }
                A Digging deeper into an uncommon word
                B Presenting a new topic
                C Presenting a controversial topic
                D Empathy

                Notes
                * Be aware that the conversation should be confrontational.

                {
                """
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
            return { 'system_persona': response_json['option'] }
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
        except KeyError as e:
            print(f"Error accessing 'utterance' key: {e}")
    except Exception as e:
        print(f"Error: {e}")
    return { 'system_persona': 'A' }