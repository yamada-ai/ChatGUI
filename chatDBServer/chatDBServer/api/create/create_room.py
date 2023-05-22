from chatDBServer.DB_wrapper import chatDB
from chatDBServer.api.core.response import convert_for_response, bad_response
# from pokedix.domain.data_converter import convert_json
from chatDBServer.params import createRoom, Room
from chatDBServer.utils import *
import json
import os


def decode_request(req:createRoom):
    room = Room(
        None,
        req.user_id,
        req.room_title,
        room_created_at=get_datetime_str()
    )
    return room


def handler(req:createRoom):
    chatdb = chatDB()
    try:
        room = decode_request(req)
        res = chatdb.create_room(room)
        # res_json = {"pokemon":[ convert_json(r) for r in res]}
        return convert_for_response(res)
    except Exception as e:
        print(bad_response(e))
        return bad_response(e)