# TalkApp M1-2

## 使い方

- Docker Desktop を起動する
- docker compose up 　でコンテナを立ち上げ，プログラムを実行
- （初めての場合はページ最後尾を参照）

URL<br>
http://127.0.0.1:3000/

DRF の URL<br>
http://127.0.0.1:8080/

## コマンド

models.py に基づいて変更の差分からマイグレーションファイル（データベースに反映させるための SQL を記述したファイル）を生成する

```sh
python manage.py makemigrations
```

<br>

マイグレーションファイルに基づいてテーブルの作成・変更を行う

```sh
python manage.py migrate
```

<br>

開発用のローカルサーバーを起動する

```sh
python manage.py runserver 8080
```

<br>

システム管理者（スーパーユーザー）を作成する<br>
対話型でユーザー名、メールアドレス、パスワードを入力してユーザーを作成します。システム管理者を作成することで管理サイトにログインできるようになります。
作成したユーザーの権限は、is_superuser と is_staff、is_active が True で登録されます。

```sh
python manage.py createsuperuser
```

現在は，
username admin
password takahiro921
で設定されている.(bitwarden で管理している．一般ユーザをある)

## 初めて Clone した場合

- main を Clone した後を仮定する．
- docker compose up する前に以下のファイルとディレクトリを追加する．
  - backend/login/の直下に migrations/`__init__.py`を作成（ファイルは空で）．
  - backend/chatgptHandleAPI の直下も同上．
  - .env ファイルをディレクトリの root 直下に保存．
- 上記の作業後に docker compose up を実行する．
- 管理者アカウントを作成（上記の createsupseruser を参照）
- admin ページにアクセスし，管理者アカウントで一般ユーザを作成（bitwarden で共有済み）

### ※ 時々失敗することがある．だいたい DB が原因だと思うから．以下を確認してください．

> <database/db ディレクトリが存在した場合>

- db ディレクトリを削除．
- コンテナ内部のキャッシュを全削除．
- docker compose up
- DBeaver で確認してみる．
- ![db_er1](https://github.com/KusumotoTakahiro/talkAppM1-2/assets/99956025/90344c68-ef4e-4dd8-bb38-bcbf0f233505)

## 以下デプロイについて

deploy で Eagle5 にあけてるポート
location /talkAppM1/ {
proxy_pass http://localhost:3000/;
}

location /talkAppM1-back/ {
proxy_pass http://localhost:8081/;
}

location /talkAppM1-db/ {
proxy_pass http://localhost:3306/;
}

### DRF のデプロイでの注意点

Python のアプリなので wisgi 経由で配信しないといけない．
とはいっても実は python manage.py runserver の代わりに以下の一行を実行するだけ．
gunicorn -w 4 -b 0.0.0.0:8080 backend.wsgi:application
意味としては 4 つ使って 8080 番ポートで配信せよ！ってこと．
あと，DRF だとあまり弊害はなさそうだけど，一応 collectstatic で静的ファイルはまとめとかないといけない．管理サイトの CSS に使われるみたい．
allowhost とか staticurl とか settings.py 周りの変更はあったけど，他はあんまり触れてない．

コンテナを立ち上げた時は以下のポートで接続確認ができる．
https://eagle5.fu.is.saga-u.ac.jp/talkAppM1-back/

### React のデプロイでの注意点

docker compose up --build の中で，npm run build してたら，
途中で実行が中断されて，再起動して，また中断されて，再起動して，以下繰り返し．．．
という現象が起きてた．そのせいで build が一生終わらない．
解決策は npm run build はコンテナ起動後に手動で行うこと．これしかなさそうだった．
あと，baseURL はデプロイ環境用に変更が必要．（一応，確認のため）

### DB(MYSQL サーバ)

イマイチわかってない．とりあえずコンテナは起動しているので問題ない？
多分，マウントで永続化させる方法とかは確認する必要がありそう．

### 本番環境用実行コマンド

docker compose -f docker-compose.prod.yml up
