from chatDBServer.params import User, Room, Chat, Observation

def generate_User(items):
    user_items = list(User.__dataclass_fields__.keys())
    user_json = {}
    for item, key in zip(items, user_items):
        user_json[key] = item 
    return user_json


def generate_Room(items):
    room_items = list(Room.__dataclass_fields__.keys())
    room_json = {}
    for item, key in zip(items, room_items):
        room_json[key] = item 
    return room_json

def generate_Chat(items):
    chat_items = list(Chat.__dataclass_fields__.keys())
    chat_json = {}
    for item, key in zip(items, chat_items):
        chat_json[key] = item 
    return chat_json

def generate_Observation(items):
    chat_items = list(Observation.__dataclass_fields__.keys())
    chat_json = {}
    for item, key in zip(items, chat_items):
        chat_json[key] = item 
    return chat_json