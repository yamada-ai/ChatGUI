from chatDBServer.DB_wrapper import ChatDB
from chatDBServer.Scenario import ScenarioManager
from chatDBServer.Prompt import Prompt
from chatDBServer.api.core.response import convert_for_response, bad_response
# from pokedix.domain.data_converter import convert_json
from chatDBServer.params import createChat, Chat
from chatDBServer.api._gpt_api import get_gpt_response
from chatDBServer.utils import *
import json
import os

import re

def extract_text_between_brackets(text):
    start_index = text.find('「')
    end_index = text.find('」', start_index + 1)
    
    if start_index != -1 and end_index != -1:
        return text[start_index + 1:end_index]
    else:
        return text

def extract_text_between_quotes(text):
    start_index = text.rfind('"')  # 最後から2番目の " を探す
    print(start_index)
    end_index = text.rfind('"', 0, start_index)  # 最後の " を探す
    print(end_index)
    
    if start_index != -1 and end_index != -1:
        return text[end_index + 1:start_index]
    else:
        return text


def decode_request(req:createChat):
    smanager = ScenarioManager()
    prompter = Prompt()
    scenario = smanager.read_patient_scenario(req.user_id, req.room_id)
    
    context = json.loads(req.context)["context"]
    context.append({
        "role" : "user",
        "content" : req.user_text
    })
    context_applied = []

    for ch in context:
        context_applied.append({
            "role" : ch["role"],
            "content" : prompter.apply_role(ch["role"], ch["content"])
        })
    
    context_applied.insert(0, {
        "role" : "user",
        "content" : prompter.apply_scenario(scenario)
    })
    
    context_adjusted = prompter.adjust_context(context_applied)
    print("context_a", context_adjusted)
    gpt_text = get_gpt_response(context_adjusted)
    gpt_text = extract_text_between_brackets(gpt_text)
    gpt_text = extract_text_between_quotes(gpt_text)
    chat = Chat(
        None,
        req.user_id,
        req.room_id,
        req.turn,
        req.user_text,
        # 一旦これでヨシ！！
        gpt_text,
        get_datetime_str()
    )
    return chat


def handler(req:createChat):
    chatdb = ChatDB()
    try:
        print(req)
        chat = decode_request(req)
        print(chat)
        res = chatdb.create_chat(chat)
        # res_json = {"pokemon":[ convert_json(r) for r in res]}
        return convert_for_response(res)
    except Exception as e:
        print(bad_response(e))
        return bad_response(e)