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
  　- backend/login/の直下に migrations ディレクトリを追加し，内部に**init**.py ファイルを作成（中身は空）
  　- backend/chagGPThandleAPI の直下も同上．
  　- .env ファイルをディレクトリの root 直下に保存．
- 上記の作業後に docker compose up を実行する．

  ※ 時々失敗することがある．だいたい DB が原因だと思うから．以下を確認してください．
  <database/db ディレクトリが存在した場合>

- db ディレクトリを削除．
- コンテナ内部のキャッシュを全削除．
- docker compose up
- DBeber で確認してみる．
