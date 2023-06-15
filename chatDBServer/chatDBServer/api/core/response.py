import  json

import sys
import os
import traceback
import datetime

# date, datetimeの変換関数
def json_serial(obj):
    # 日付型の場合には、文字列に変換します
    if isinstance(obj, datetime.datetime):
        return obj.isoformat()
    # 上記以外はサポート対象外.
    raise TypeError ("Type %s not serializable" % type(obj))

def convert_for_response(body):
    # return {
    #     "statusCode": 200,
    #     "isBase64Encoded": False,
    #     "body": json.dumps(body, ensure_ascii=False),
    #     "headers": {
    #         "Access-Control-Allow-Origin": "*",
    #         "Access-Control-Allow-Methods": "POST,GET,PUT,DELETE",
    #         "Access-Control-Allow-Headers" : "Content-Type",
    #         "Content-Type": "application/json",
    #     },
    #     # "Access-Control-Allow-Origin": "*",
        
    #     # "Content-Type": "application/json",
    # }
    return json.dumps(body, ensure_ascii=False, default=json_serial)

def extract_error_data(e:Exception):
    _, _, exc_tb = sys.exc_info()
    fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
    error_data = {
        "code" : str(e),
        "filename" : fname,
        "line" : int(exc_tb.tb_lineno),
    }
    return error_data

def bad_response(e:Exception):
    body = extract_error_data(e)
    return {
        "statusCode": 500,
        "isBase64Encoded": False,
        "body": json.dumps(body, ensure_ascii=False),
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers" : "Content-Type",
            "Content-Type": "application/json",

        },
        # "Access-Control-Allow-Origin": "*",
        # "Access-Control-Allow-Headers" : "Content-Type",
        # "Content-Type": "application/json",
    }
