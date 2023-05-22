from chatDBServer.DB_wrapper import chatDB
from chatDBServer.api.core.response import convert_for_response, bad_response
# from pokedix.domain.data_converter import convert_json
from chatDBServer.params import createUser, User
import json
import os


def decode_request(req:createUser):
    user = User(
        None,
        req.user_name
    )
    return user


def handler(req:createUser):
    chatdb = chatDB()
    try:
        user = decode_request(req)
        res = chatdb.create_user(user)
        # res_json = {"pokemon":[ convert_json(r) for r in res]}
        return convert_for_response(res)
    except Exception as e:
        print(bad_response(e))
        return bad_response(e)