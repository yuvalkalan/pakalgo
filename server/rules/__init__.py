import json
import os
import database.constants

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
        rules = json.load(rule_file)
    # hide real default password value from users
    rules['passwordRules']['defaultPassword'] = ''
    return rules


def set_rules(values):
    with open(RULES_FILE, 'w+') as rule_file:
        json.dump(values, rule_file)


def create_dependencies():
    # create rules file
    if not os.path.exists(RULES_FILE):
        with open(RULES_FILE, 'w+') as rule_file:
            json.dump(DEFAULT_RULES, rule_file)


def get_default_password():
    rules = get_rules()
    return rules['passwordRules']['defaultPassword']


def get_default_password_hashed():
    return database.constants.hash_password(get_default_password())
