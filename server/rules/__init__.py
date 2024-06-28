import json
import os

RULES_FILE = r'rules.json'
DEFAULT_RULES = {'passwordRules': {'minLength': 8,
                                   'upperLetter': False,
                                   'spacialChar': False,
                                   'defaultPassword': 'Aa123456'},
                 'netRules': {'multiWordOk': False,
                              'maxNetName': 20,
                              'ableNoneVhf': False},
                 'pakalRules': {'enablePullPakal': False}}


def get_rules():
    with open(RULES_FILE, 'r', encoding='utf-8') as rule_file:
        data = json.load(rule_file)
    return data


def set_rules(values):
    with open(RULES_FILE, 'w+') as rule_file:
        json.dump(values, rule_file)


def create_dependencies():
    # create rules file
    if not os.path.exists(RULES_FILE):
        with open(RULES_FILE, 'w+') as rule_file:
            json.dump(DEFAULT_RULES, rule_file)
