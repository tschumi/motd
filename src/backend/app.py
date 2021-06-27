"""
Application stub
"""
import json
import os

from appdirs import user_config_dir


def initialize():
    config = get_config()

    response = {
        'content': get_motd(config['motdfile']),
        'speed': config['speed']
    }

    return response


def guess_config_path():
    config_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'config.json')

    if not os.path.exists(config_file):
        config_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), os.pardir, 'config.json')

    if not os.path.exists(config_file):
        config_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), os.pardir, os.pardir, 'config.json')

    if not os.path.exists(config_file):
        config_file = os.path.join(user_config_dir('motd'), 'config.json')

    return config_file


def get_config():
    try:
        config_file = guess_config_path()
        with open(config_file) as json_file:
            data = json.load(json_file)
        return data
    except:
        raise Exception('Sorry, no valid config file found..')


def get_motd(motdfile):
    try:
        with open(motdfile) as json_file:
            data = json.load(json_file)
        return data
    except:
        raise Exception('Sorry, no valid motd file found..')