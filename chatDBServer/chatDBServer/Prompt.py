from setting import MODEL
import tiktoken
from tiktoken.core import Encoding

class Prompt:
    def __init__(self) -> None:
        self.scenario_template = """
        # 設定概要
        - 患者(Patient:P)と医師(Doctor:D)が対話をする状況である
        - GPTは患者(P)役として，医師(D)の発話に続く返答例を一つ挙げよ
        - なお，以下に続く「患者の背景」「患者の返答の条件」に逸脱しないことを条件とする

        # 患者の背景
        「{0}」

        # 患者の返答の条件
        - 返答は無難でなるべく簡潔なものにする
        - 対話の文脈に矛盾のない返答にする
        - 返答例は箇条書きで患者の返答文一つのみ出力する
        - 患者の背景に書かれていないことは返答になるべく含まれないようにする
        - 患者の背景に書かれていないこと出力する必要があるときは患者の背景を元にその内容を推測して出力に反映させる
        - 返答は P:「内容」の形式で，鍵括弧を使うこと

        """
        self.last_template = """
        
        
        """

        self.role_template = {
            # user は医師 Doctor
            "user" : 'D:"{0}"',
            # GPT は患者 Patient
            "assistant" : 'P:"{0}"'
        }

        self.observation_template = """
        # 概要
        - 「患者の背景」に対して，医師が推測した「医師の所見」が与えられる
        -「 医師の所見」がどの程度「患者の背景」に合致するかを評点(0~100点)と，その評点の理由を記述せよ

        # 患者の背景
        「{0}」

        # 医師の所見
        「{1}」
        """

        self.encoding: Encoding = tiktoken.encoding_for_model(MODEL)
        self.MAX_TOKEN = 3500
        self.token_margin = 200

    def apply_scenario(self, scenario) -> str:
        return self.scenario_template.format(scenario)

    def apply_role(self, role, content) -> str:
        if role in self.role_template.keys():
            return self.role_template[role].format(content)
        else:
            print("role:{0} was Not Found".format(role))
            return "ERROR"
    
    def apply_observation(self, scenario, observation):
        return self.observation_template.format(scenario, observation)
    
    def _culc_token(self, text:str):
        tokens = self.encoding.encode(text)
        tokens_count = len(tokens)
        return tokens_count
    
    def _apply_context2plain_prompt(self, utt):
        return "{0}:'{1}'".format(utt["role"], utt["content"])
    
    def adjust_context(self, context):
        current_tokens = [ self._culc_token(self._apply_context2plain_prompt(utt)) for utt in context]
        # 概算
        approximate_current_tokens = [t+2 for t in current_tokens]
        print("each toknes :", approximate_current_tokens)
        print("sum : ", sum(approximate_current_tokens))
    
        if sum(approximate_current_tokens) < (self.MAX_TOKEN-self.token_margin):
            return context
        
        # [0]と[1:]のtoken数が問題
        sum_token = approximate_current_tokens[0]
        for i, appro_utt_token in enumerate(reversed(approximate_current_tokens)):
            sum_token += appro_utt_token
            if sum_token >= (self.MAX_TOKEN-self.token_margin):
                return [context[0]]+context[len(context)-i:]
        return context
