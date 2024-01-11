def create_response(request_data):
    """
    ユーザからの応答を受け取り、chatgptを用いて返答を生成します。

    Parameters
    ----------
    request_data : dict
        リクエストデータの辞書型オブジェクト。以下のキーを含む必要があります。
        - 'content' (string): ユーザからの応答テキスト。
        - 'talker' (string): ユーザの発言者名（'user'）。
        - 'thread' (Thread): トークセッションを指定する外部キー。

    Returns
    -------
    dict
        生成された返答情報を含む辞書型オブジェクト。以下のキーを持ちます。
        - 'content' (string): システムからの返答テキスト。
        - 'talker' (string): システムの発言者名（'system'）。
        - 'thread' (Thread): トークセッションを指定する外部キー。

    Note
    ----
    ひとまずシステムからの応答として定型文を返すだけであり、
    chatgptの実際の返答生成はまだ行われていない.
    """
    
    return {
        'content': 'Systemからの応答',
        'talker': 'system',
        'thread': request_data['thread']
    }