from openai import OpenAI
import environ
import json

env = environ.Env()
env.read_env()
client = OpenAI(api_key=env('OPENAI_SECRET_KEY'))

use_chatgpt = env('USE_OPENAI')

def determination_flow(dialogue_data):
    """
    直近5往復の発話から会話の話題を推定する
    """
    dialog_length = len(dialogue_data)
    last_dialog = ""
    if dialog_length < 9:
        for i in range(0, dialog_length):
            data = dialogue_data[i]
            last_dialog += f"{data.talker}: [{data.content}]\n"
    else:
        for i in range(dialog_length - 9, dialog_length):
            data = dialogue_data[i]
            last_dialog += f"{data.talker}: [{data.content}]\n"
    # print('会話履歴 : \n' + last_dialog)
    if (use_chatgpt):
        prompt = f"""
Summarize the current conversation from the following conversation.
{last_dialog}

                """
        prompt += """"
The output should be a markdown code snippet formatted in the following schema in Japanese:
{
    "summary": string  // Conversation Summary Results
}

Notes
* The summary should be no more than 70-100 words.

{
                """
    success_post = False
    for i in range(5):
        if (success_post == False):
            print('chat_categorizer: ' + str(i) + '回目の実行')
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
                print(content)
                try:
                    response_json = json.loads("{"+content)
                except json.JSONDecodeError as e:
                    print(f"Error decoding JSON: {e}")
                except KeyError as e:
                    print(f"Error accessing 'utterance' key: {e}")
                else:
                    success_post = True
                    return response_json
            except Exception as e:
                print(f"Error: {e}")
    return { 'summary': 'None' }