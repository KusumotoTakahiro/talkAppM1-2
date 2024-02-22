from openai import OpenAI
import environ
import json

env = environ.Env()
env.read_env()
client = OpenAI(api_key=env('OPENAI_SECRET_KEY'))

use_chatgpt = env('USE_OPENAI')

def categorize(dialogue_data):
    """
    直近３往復の発話から次の発話として適切な発話のタイプを判定する．
    """
    dialog_length = len(dialogue_data)
    last_dialog = ""
    if dialog_length < 5:
        for i in range(0, dialog_length):
            data = dialogue_data[i]
            last_dialog += f"{data.talker}: [{data.content}]\n"
    else:
        for i in range(dialog_length - 5, dialog_length):
            data = dialogue_data[i]
            last_dialog += f"{data.talker}: [{data.content}]\n"
    print('会話履歴 : \n' + last_dialog)
    if (use_chatgpt):
        prompt = f"""
                Choose the appropriate next utterance in the following conversation flow.
                {last_dialog}

                """
        prompt += """"
                The output should be a markdown code snippet formatted in the following schema in Japanese:
                {
                    "option": string  // QUESTION or TOPIC or DISCUUSION or EMPATHY
                    "target": string   // answer in one word.
                }

                QUESTION:  Digging deeper into an uncommon word
                TOPIC: Offering a completely different topic from previous topics
                DISCUSSION: Providing contrasting topics of discussion in the chat partner's statements
                EMPATHY: Sympathy for the statements of the dialogue partner

                Notes
                * If the option is QUESTION, Answer in a word what the question is about.
                * If the option is TOPIC, Answer what topic is appropriate.
                * If the option is DISCUSSION, Answer in a word what the DISCUSSION is about.
                * IF the option is EMPATHY, Answer in one word what you empathize with.

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
        print(content)
        try:
            response_json = json.loads("{"+content)
            return response_json
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
        except KeyError as e:
            print(f"Error accessing 'utterance' key: {e}")
    except Exception as e:
        print(f"Error: {e}")
    return { 'system_persona': 'A' }