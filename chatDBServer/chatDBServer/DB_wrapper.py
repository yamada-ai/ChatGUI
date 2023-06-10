import json
import sqlite3
from chatDBServer.params import User, Room, Chat, Observation
import dataclasses

class ChatDB:
    def __init__(self, db_name="chatgui-patient-test.db") -> None:
        self.table_user = "User"
        self.table_room = "Room"
        self.table_chat = "Chat"
        self.table_observation = "Observation"
        
        # 
        self.db_path = "./chatDBServer/DB/" + db_name
        self.connector = sqlite3.connect(self.db_path)
        self.cursor = self.connector.cursor()

        self.user_items = {
            "user_id" : "INTEGER PRIMARY KEY AUTOINCREMENT",
            "user_name" : "varchar(128)",
            # ユーザごとに，用意したシナリオIDをランダムに写像する
            # 例 : シナリオID:0 -> ユーザAからは:6 で見える　
            "patient_dict" : "varchar(2048)",
            # "user_icon"
        }
        self.room_items = {
            "room_id" : "INTEGER PRIMARY KEY AUTOINCREMENT",
            "user_id" : "int",
            "room_title" : "varchar(128)",
            "room_created_at" : "datetime",
            # チャットが終了しているか
            # 0: 終了していない，1: 終了している
            "is_end" : "int",
            "patient_id" : "int"
        }
        self.chat_items = {
            "chat_id" : "INTEGER PRIMARY KEY AUTOINCREMENT",
            "user_id" : "int",
            "room_id" : "int",
            "turn" : "int",
            # 0:False, 1:True
            # "is_bot" : "int",
            "user_text" : "varchar(2048)",
            "gpt_text" : "varchar(2048)",
            "chat_created_at": "datetime"
        }
        self.obs_items = {
            "obs_id" : "INTEGER PRIMARY KEY AUTOINCREMENT",
            "user_id" : "int",
            "room_id" : "int",
            "user_text" : "varchar(2048)",
            "gpt_text" : "varchar(2048)",
            "obs_created_at": "datetime"
        }

        self.primary_dict = {
            self.table_user : "user_id",
            self.table_room : "room_id",
            self.table_chat : "chat_id",
            self.table_observation : "obs_id"
        }

        self.tables = [self.table_user, self.table_room, self.table_chat, self.table_observation]
        self.items_dicts = [self.user_items, self.room_items, self.chat_items, self.obs_items]
    
    def create_table(self, table_name, items_dict):
        query_list = []
        for k in items_dict:
            query_list.append("{0} {1}".format(k, items_dict[k]))
        create_sql = ", ".join(query_list)
        self.cursor.execute('CREATE TABLE IF NOT EXISTS {0}({1})'.format(
            table_name, 
            create_sql
            )
        )

    def create_all_tables(self):
        for table_name, items_dict in zip(self.tables, self.items_dicts):
            self.create_table(table_name, items_dict)

    def reset_all_tables(self):
        for table_name in self.tables:
            self.reset_table(table_name)
    
    def reset_table(self, table_name):
        sql = 'DROP TABLE IF EXISTS {0}'.format(table_name)
        self.cursor.execute(sql)
    
    def dataclass2sql(self, params):
        att_dict:dict = type(params).__dict__["__annotations__"]
        params_dict = dataclasses.asdict(params)
        sql_items = []
        for att, p_key in zip(att_dict.keys(), params_dict.keys()):
            type_ = att_dict[att]
            if params_dict[p_key] is None:
                sql_items.append("NULL")
                continue
            # 数値
            if type_ == int:
                sql_items.append(str(params_dict[p_key]))
            elif type_ == str:
                sql_items.append("'"+params_dict[p_key]+"'")
            else:
                sql_items.append("'"+params_dict[p_key]+"'")
        return ", ".join(sql_items)

    # def table2insert_syntax(self, table):

    def find_all(self, term:str, mode=["race", "base"]):
        base_sql = "SELECT * FROM {0}".format(self.table_pokemon)
        sql = base_sql + " WHERE " + term
        self.cursor.execute(sql)
        result = self.cursor.fetchall()
        return result

    def get_last_id(self, table_name):
        if table_name not in self.primary_dict.keys():
            print("get_last_id: no much table name '{0}'".format(table_name))
            return -1
        sql = "SELECT max({0}) FROM {1}".format(self.primary_dict[table_name], table_name)
        try:
            self.cursor.execute(sql)
            result = self.cursor.fetchone()
            return result[0]
        except Exception as e:
            print(e)
            # {"status code":-1, "message":"get id error"}
            return -1
    
    def get_user_id(self, user_name):
        sql = "SELECT user_id FROM {0} where user_name='{1}'".format(self.table_user, user_name)
        try:
            self.cursor.execute(sql)
            result = self.cursor.fetchone()
            return result[0]
        except Exception as e:
            print(e)
            # {"status code":-1, "message":"get id error"}
            return -1
    
    def get_user(self, user_id):
        sql = "SELECT * FROM {0} where user_id='{1}'".format(self.table_user, user_id)
        try:
            self.cursor.execute(sql)
            result = self.cursor.fetchone()
            return result
        except Exception as e:
            print(e)
            # {"status code":-1, "message":"get id error"}
            return {}

    def create_user(self, params:User):
        sql = "INSERT INTO {0} VALUES({1})".format(self.table_user, self.dataclass2sql(params))
        try:
            self.cursor.execute(sql)
            self.connector.commit()
            return {"status code":0}
        except Exception as e:
            print(e)
            return {"status code":-1}
    
    def create_room(self, params:Room):
        sql = "INSERT INTO {0} VALUES({1})".format(self.table_room, self.dataclass2sql(params))
        try:
            self.cursor.execute(sql)
            self.connector.commit()
            return {"status code":0}
        except Exception as e:
            print(e)
            return {"status code":-1}
    
    def create_chat(self, params:Chat):
        sql = "INSERT INTO {0} VALUES({1})".format(self.table_chat, self.dataclass2sql(params))
        # print(sql)
        try:
            self.cursor.execute(sql)
            self.connector.commit()
            return {"status code":0}
        except Exception as e:
            print(e)
            return {"status code":-1}
    
    def create_observation(self, params:Observation):
        sql = "INSERT INTO {0} VALUES({1})".format(self.table_observation, self.dataclass2sql(params))
        # print(sql)
        try:
            self.cursor.execute(sql)
            self.connector.commit()
            return {"status code":0}
        except Exception as e:
            print(e)
            return {"status code":-1}
    
    def read_rooms(self, user_id:int):
        sql = "SELECT * FROM {0} WHERE user_id={1} ORDER BY {2}".format(self.table_room, user_id, self.primary_dict[self.table_room])
        try:
            self.cursor.execute(sql)
            # self.connector.commit()
            result = self.cursor.fetchall()
            return result
        except Exception as e:
            print(e)
            return {}
    
    def read_rooms_order_patientID(self, user_id:int):
        sql = "SELECT * FROM {0} WHERE user_id={1} ORDER BY {2}".format(self.table_room, user_id, "patient_id")
        try:
            self.cursor.execute(sql)
            # self.connector.commit()
            result = self.cursor.fetchall()
            return result
        except Exception as e:
            print(e)
            return {}
    
    def read_room(self, room_id:int):
        sql = "SELECT * FROM {0} WHERE room_id={1}".format(self.table_room, room_id)
        try:
            self.cursor.execute(sql)
            result = self.cursor.fetchone()
            return result
        except Exception as e:
            print(e)
            # {"status code":-1, "message":"get id error"}
            return {}
    
    def read_chats(self, user_id:int, room_id:int):
        sql = "SELECT * FROM {0} WHERE user_id={1} and room_id={2} ORDER BY {3}".format(self.table_chat, user_id, room_id, "turn")

        try:
            self.cursor.execute(sql)
            # self.connector.commit()
            result = self.cursor.fetchall()
            return result
        except Exception as e:
            print(e)
            return {}
    
    def read_observations(self, user_id:int, room_id:int):
        sql = "SELECT * FROM {0} WHERE user_id={1} and room_id={2} ORDER BY {3}".format(self.table_observation, user_id, room_id, self.primary_dict[self.table_observation])

        try:
            self.cursor.execute(sql)
            result = self.cursor.fetchall()
            return result
        except Exception as e:
            print(e)
            return {}
    
    def update_room_title(self, params:Room):
        # # 権限確認
        # sql = "SELECT user_id FROM {0} WHERE room_id={1}".format(self.table_room, params.room_id)
        # try:
        #     self.cursor.execute(sql)
        #     result = self.cursor.fetchone()
        #     user_id_ = result[0]
        # except Exception as e:
        #     print(e)
        #     return {"status code":-3}
        # # 権限なし
        # if user_id_ != params.user_id:
        #     return {"status code":-2}
        
        # 更新
        sql = "UPDATE {0} SET room_title='{1}' WHERE user_id={2} and room_id={3}".format(self.table_room, params.room_title, params.user_id, params.room_id)
        try:
            self.cursor.execute(sql)
            self.connector.commit()
            return {"status code":0}
        except Exception as e:
            print(e)
            return {"status code":-1}
    
    def update_patient_status(self, params:Room):        
        # 更新
        sql = "UPDATE {0} SET is_end={1} WHERE user_id={2} and room_id={3}".format(self.table_room, params.is_end, params.user_id, params.room_id)
        try:
            self.cursor.execute(sql)
            self.connector.commit()
            return {"status code":0}
        except Exception as e:
            print(e)
            return {"status code":-1}

    def delete_room(self, user_id, room_id):
        # 権限確認
        # sql = "SELECT user_id FROM {0} WHERE room_id={1}".format(self.table_room, room_id)
        # try:
        #     self.cursor.execute(sql)
        #     result = self.cursor.fetchone()
        #     user_id_ = result[0]
        # except Exception as e:
        #     print(e)
        #     return {"status code":-3}
        # # 権限なし
        # if user_id_ != user_id:
        #     return {"status code":-2}
        sql = "DELETE FROM {0} WHERE user_id={1} and room_id={2}".format(self.table_room, user_id, room_id)
        try:
            self.cursor.execute(sql)
            self.connector.commit()
            return {"status code":0}
        except Exception as e:
            print(e)
            return {"status code":-1}