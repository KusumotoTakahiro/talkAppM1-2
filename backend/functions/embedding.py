from openai import OpenAI
import environ
import json
import numpy as np

env = environ.Env()
env.read_env()
client = OpenAI(api_key=env('OPENAI_SECRET_KEY'))

use_chatgpt = env('USE_OPENAI')

def get_embedding(text, model="text-embedding-3-small"):
    text = text.replace("\n", " ")
    return client.embeddings.create(input = [text], model=model).data[0].embedding


def cosine_similarity(vec1, vec2):
    dot_product = np.dot(vec1, vec2)
    norm_vec1 = np.linalg.norm(vec1)
    norm_vec2 = np.linalg.norm(vec2)
    similarity = dot_product / (norm_vec1 * norm_vec2)
    return similarity


def embedding(userUtterance, userPersona, systemPersona):
    """
    userの発言からuser,system両者で近いペルソナを推定する
    """
    max_s = -1
    similar_persona_user = ""
    similar_persona_system = ""
    threshold = 0.3
    v1 = np.array(get_embedding(userUtterance))
    for text in userPersona:
        v2 = np.array(get_embedding(text))
        s =  cosine_similarity(v1, v2)
        if s > max_s:
            similar_persona_user = text
            max_s = s
    if max_s < threshold:
        similar_persona_user = ""
    max_s = -1
    for text in systemPersona:
        v2 = np.array(get_embedding(text))
        s =  cosine_similarity(v1, v2)
        if s > max_s:
            similar_persona_system = text
            max_s = s
    if max_s < threshold:
        similar_persona_system = ""
    return { 
        'user_persona': similar_persona_user, 
        'system_persona': similar_persona_system 
        }