import MeCab

syugo = ['私', '僕', '俺', '自分']
zyoshi = ['の', 'は', 'も', 'が']

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
    persona_info = {}
    sentence = ""
    persona_info["is_persona"] = False

    while node:
        token = node.surface
        sentence += token
        # persona文に該当すればis_persona=Trueで登録
        if (judge_persona(node, token)):
            persona_info["is_persona"] = True
        if (token=='.' or token=='。' or token=='．'):
            persona_info["sentence"] = sentence
            sentences.append(persona_info)
            sentence = ""
        node = node.next
    if len(sentences) == 0:
        persona_info["sentence"] = sentence
        sentences.append(persona_info)
    return sentences
