import uuid


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
        print(now_user)
        print(now_system)
    except:
        pass
    
    return {
        'content': 'こんにちは，僕はキャタローです．',
        'talker': 'system',
        'thread': request_data['thread']
    }