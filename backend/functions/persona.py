import MeCab
from openai import OpenAI
import environ
import json

env = environ.Env()
env.read_env()
client = OpenAI(api_key=env('OPENAI_SECRET_KEY'))

use_chatgpt = env('USE_OPENAI')

syugo = ['私', '僕', '俺', '自分']
zyoshi = ['の', 'は', 'も', 'が']
kuten = ['.', '．', '。', '!', '！', '?', '？', '♪']

def judge_persona(node, token):
    """
    入力文(uttrance)がペルソナとして適した文章化を判定する．

    Parameters
    -----------
    - 'node' (array): MeCabから返されたtokenの集合
    
    Returns
    --------
    - 'is_persona' (boolean): 文章がpersonaかどうか
    """
    for x in syugo:
        if (token==x):
            next = node.next.surface
            for y in zyoshi:
                if (next == y):
                    return True
    return False

def judge_persona_by_chatgpt(sentence):
    if (use_chatgpt):
        prompt = f"""
                Please extract from the following sentences any characteristic information that describes the person's inner self or preferences. If not, output "none".
                {sentence}
                """
        prompt += """"
                The output should be a markdown code snippet formatted in the following schema in Japanese:
                {
                    "user_persona": string  // your partner's persona. or none.
                }

                * Please do not include anything other than JSON in your answer
                * Response must be Japanese
                * example) xxxが好き/xxxが嫌い/xxxが得意/...

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
            return { 'user_persona': response_json['user_persona'] }
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
        except KeyError as e:
            print(f"Error accessing 'utterance' key: {e}")
    except Exception as e:
        print(f"Error: {e}")
    return { 'user_persona': 'none' }


def sprit_sentences(request_data):
    """
    uttranceを複数の文章に分割する.(句点単位で)

    Parameter
    -----------
    request_data: dict
        - 'content' (string): ユーザまたはシステムからの入力文

    Returns
    --------
    Array (dict)
        - 'sentance' (string): 句点単位で分割された文章
        - 'is_persona' (boolena): 文章がpersonaかどうか
    """

    uttrance = request_data['content']
    tagger = MeCab.Tagger()
    node   = tagger.parseToNode(uttrance)
    sentences = []
    is_persona = False
    sentence = ""

    while node:
        token = node.surface
        sentence += token
        if (judge_persona(node, token)):
            is_persona = True
        for x in kuten:
            if (x==token):
                responce = judge_persona_by_chatgpt(sentence)
                if (responce['user_persona'] != "none"):
                    sentences.append({
                        'sentence': responce['user_persona'],
                        'is_persona': True,
                    })
                sentences.append({
                    'sentence': sentence,
                    'is_persona': is_persona,
                })
                is_persona = False
                sentence = ""
                break
        node = node.next
    if sentences != 0:
        sentences.append({
            'sentence': sentence,
            'is_persona': is_persona,
        })
    return sentences
