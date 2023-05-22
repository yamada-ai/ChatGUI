from chatDBServer.DB_wrapper import chatDB
from chatDBServer.api.core.response import convert_for_response, bad_response
# from pokedix.domain.data_converter import convert_json
from chatDBServer.params import createChat, Chat
from chatDBServer.api._gpt_api import get_gpt_response
from chatDBServer.utils import *
import json
import os


def decode_request(req:createChat):

    chat = Chat(
        None,
        req.user_id,
        req.room_id,
        req.turn,
        req.user_text,
        # 一旦これでヨシ！！
        get_gpt_response(req.user_text, json.loads(req.context)["context"]),
        get_datetime_str()
    )
    return chat


def handler(req:createChat):
    chatdb = chatDB()
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