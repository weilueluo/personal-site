from deep_translator import GoogleTranslator
import json
from copy import deepcopy
from pathlib import Path

# SOURCE = ('../../public/messages/en.json', 'en')
# TARGETS = [
#     ('../../public/messages/zh.json', 'zh-CN'),
#     ('../../public/messages/jp.json', 'ja'),
# ]

SOURCE = ('../../public/messages/en.json', 'en')
TARGETS = [
    ('../../public/messages/zh.json', 'zh-CN'),
    ('../../public/messages/jp.json', 'ja'),
]


def main():
    
    source_json = json.load(open(SOURCE[0], 'r'))
    for target_file, lang in TARGETS:
        if Path(target_file).exists():
            target_json = json.load(open(target_file, 'r'))
        else:
            target_json = {}
        translator = GoogleTranslator(source=SOURCE[1], target=lang)
        result_json = translate_json(source_json, target_json, translator)
        json.dump(result_json, open(target_file, 'w'), indent=2, ensure_ascii=False, sort_keys=True)
    
    # also pretty write the source json, so that the format is consistent
    json.dump(source_json, open(SOURCE[0], 'w'), indent=2, ensure_ascii=False, sort_keys=True)

    
    
def translate_json(source_json, target_json, translator):
    target_json = deepcopy(target_json)
    for k, v in source_json.items():
        if isinstance(v, dict):
            target_json[k] = translate_json(v, target_json.get(k, {}), translator)
        elif k not in target_json:
            target_json[k] = translator.translate(v)
            print(f'{v} ===> {target_json[k]}')
    return target_json