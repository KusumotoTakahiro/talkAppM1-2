import uuid
from openai import OpenAI
import environ
import json

env = environ.Env()
env.read_env()
client = OpenAI(
    # This is the default and can be omitted
    api_key=env('OPENAI_SECRET_KEY') 
)

# 無駄に使いたくない時はココのパラメータで切り替える．
use_chatgpt = True

def create_response(request_data, UserPersona, SystemPersona):
    """
    ユーザからの応答を受け取り、chatgptを用いて返答を生成します。

    Parameters
    ----------
    request_data : dict
        リクエストデータの辞書型オブジェクト。以下のキーを含む必要があります。
        - 'content' (string): ユーザからの応答テキスト。
        - 'talker' (string): ユーザの発言者名（'user'）。
        - 'thread' (string): トークセッションを指定する外部キー。

    Returns
    -------
    dict
        生成された返答情報を含む辞書型オブジェクト。以下のキーを持ちます。
        - 'content' (string): システムからの返答テキスト。
        - 'talker' (string): システムの発言者名（'system'）。
        - 'thread' (string): トークセッションを指定する外部キー。

    Note
    ----
    ひとまずシステムからの応答として定型文を返すだけであり、
    chatgptの実際の返答生成はまだ行われていない.
    """

    if (use_chatgpt):
        try:
            thread = uuid.UUID(request_data['thread'])
            up_data = UserPersona.objects.filter(thread=thread)
            sp_data = SystemPersona.objects.filter(thread=thread)
            now_user = [] #userのpersonaデータ
            now_system = [] #systemのpersonaデータ
            for d in up_data:
                now_user.append(d.persona)
            for d in sp_data:
                now_system.append(d.persona)
            now_user_string = '\n'.join(now_user)
            now_system_string = '\n'.join(now_system)
            prompt = f"""
                You are an agent who does the chatting in your daily life.

                The output should be a markdown code snippet formatted in the following schema in Japanese:

                \'\'\'
                {{
                    utterance: string, // A response statement to the previous input
                }}
                \'\'\'

                NOTES:
                * Please do not include anything other than JSON in your answer
                * Response must be Japanese
                * Response is up to 30 tokens
                * Don't be too formal. Keep the conversation casual

                Your name is Cataro.
                Your persona is [{now_system_string}].
                Your conversation partner's persona is [{now_user_string}].
                Answer the following questions, taking into account the above settings.

                Your conversation partner's said "{request_data['content']}"
            """
            print(prompt)
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
                response_json = json.loads(content)
                return {
                    'content': response_json['utterance'],
                    'talker': 'system',
                    'thread': request_data['thread']
                }
            except json.JSONDecodeError as e:
                print(f"Error decoding JSON: {e}")
            except KeyError as e:
                print(f"Error accessing 'utterance' key: {e}")
        except Exception as e:
            print(f"Error: {e}")
    
    return {
        'content': 'ごめんね，今日は少し調子が悪いみたい．．．',
        'talker': 'system',
        'thread': request_data['thread']
    }