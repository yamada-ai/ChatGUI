

class Prompt:
    def __init__(self) -> None:
        self.scenario_template = """
        # 設定概要
        - 患者(Patient:P)と医師(Doctor:D)が対話をする状況である
        - 
        - GPTは患者(P)役として，医師(D)の発話に続く返答例を一つ挙げよ。
        - なお，以下に続く「患者の背景」「患者の返答の条件」に逸脱しないことを条件とする

        # 患者の背景
        「{0}」

        # 患者の返答の条件
        - 返答は無難でなるべく簡潔なものにする
        - 対話の文脈に矛盾のない返答にする
        - 返答例は箇条書きで患者の返答文一つのみ出力する
        - 患者の背景に書かれていないことは返答になるべく含まれないようにする
        - 患者の背景に書かれていないこと出力する必要があるときは患者の背景を元にその内容を推測して出力に反映させる

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
