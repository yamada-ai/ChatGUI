import requests
import json

api_url = "https://api.adviceslip.com/advice"
res = requests.get(url=api_url)

import openai
from setting import *

openai.api_key = GPT_API_KEY

def get_api_response(param=None):
    res = requests.get(url=api_url)
    return res.json()["slip"]["advice"]

def get_gpt_response(context:list):
    print(context)

    response = openai.ChatCompletion.create(
                model=MODEL,
                messages=context,
                max_tokens=MAX_TOKENS
    )
    print(response['choices'][0]['message']['content'])
    return response['choices'][0]['message']['content']
