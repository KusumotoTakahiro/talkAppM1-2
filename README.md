## 使い方

- Docker Desktop を起動する
- VSCode 左下の青いやつを押して，「Reopen in Container」を選ぶ(極力これでコーディングしてください)
- DB を設計している models.py を変更した場合は，Dev Containers を起動しなおすか，以下のコマンドの上 2 つ実行してください

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
