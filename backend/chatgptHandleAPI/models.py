import uuid
from django.db import models
from login.models import CustomUser


class Thread(models.Model):
  """対話管理テーブル
  1対話(:= Utterance(発話)の集合)ごとにuuidで識別,管理する

  Args:
    uuid(uuid): 対話識別のためのUUID
    createdAt(DateTime): threadの作成日時
    title(string): threadのタイトル,任意(現状は使用予定未定)
  """
  uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
  created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
  title = models.TextField(null=True)
  user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)



class Utterance(models.Model):
  """発話管理テーブル
  1発話(:= このシステムでは一回で入力される発言)ごとにuuidで識別し,管理する

  Args:
    uuid(uuid): 発話識別のためのUUID
    content(string): 発話内容
    createdAt(DateTime): 発話の作成日時
    talker(string): 発話者(systemかuserの二択)
    thread(Thread): どのThreadに属する発話なのかを識別する外部キー
  """
  uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
  content = models.TextField()
  created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
  talker = models.CharField(max_length=128)
  thread = models.ForeignKey(Thread, on_delete=models.CASCADE)



class Persona(models.Model):
  """ペルソナを管理するための抽象クラス
  ペルソナ(:= ThreadごとのUtteranceの内,発言者(talker)の性質を表す文章のこと)

  Args:
    uuid(uuid): ペルソナ識別のためのUUID
    createdAt(DateTime): ペルソナが追加された日時
    thread(Thread): どのThreadでのペルソナか
    utterance(Utterance): 元になったUtterance
    persona(string): ペルソナ記述(utteranceの一部または全て.多少の加工も考慮される)
  """
  uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
  created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
  thread = models.ForeignKey(Thread, on_delete=models.CASCADE)
  utterance = models.ForeignKey(Utterance, on_delete=models.CASCADE)
  persona = models.TextField()

  class Meta:
    abstract = True



class UserPersona(Persona):
  """ユーザーのペルソナを管理するテーブル
  """
  pass #Personaのまま



class SystemPersona(Persona):
  """システムのペルソナを管理するテーブル

  Arg:
    similarity(int):  元の文章(utterance)とpersonaのcos類似度.(研究対象)
  """
  similarity = models.IntegerField()