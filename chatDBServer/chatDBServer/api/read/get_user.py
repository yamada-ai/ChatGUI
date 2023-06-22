from chatDBServer.DB_wrapper import ChatDB
from chatDBServer.api.core.response import convert_for_response, bad_response
# from pokedix.domain.data_converter import convert_json
# from chatDBServer.params import createRoom, Room
from chatDBServer.utils import *
from chatDBServer.generetor import *


def handler(user_id:int):
    chatdb = ChatDB()
    try:
        res = chatdb.get_user(user_id=user_id)
        return convert_for_response(generate_User(res))
    except Exception as e:
        print(bad_response(e))
        return bad_response(e)
        