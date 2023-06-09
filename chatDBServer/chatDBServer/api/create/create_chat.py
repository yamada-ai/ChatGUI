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
    print("context_a", context_applied)
    chat = Chat(
        None,
        req.user_id,
        req.room_id,
        req.turn,
        req.user_text,
        # 一旦これでヨシ！！
        get_gpt_response(context_applied),
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