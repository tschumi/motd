"""
Application stub
"""
import json
import os

from appdirs import user_config_dir


def initialize():
    config = get_config()

    if config != "":
        motd = get_motd(config['motdfile'])

        if motd != "":
            response = {
                'content': motd,
                'speed': config['speed']
            }
            return response

    response = {
        'content': {
            "motd": [
                {
                    "quote": "They can't stop the signal, Mal. They can never stop the signal.",
                    "author": "Mr. Universe"
                }
            ]
        },
        'speed': 0.8
    }

    return response


def guess_config_path():
    config_file_name = 'config.json'

    config_file = os.path.join(os.path.dirname(
        os.path.abspath(__file__)), config_file_name)

    if not os.path.exists(config_file):
        config_file = os.path.join(os.path.dirname(
            os.path.abspath(__file__)), os.pardir, config_file_name)

    if not os.path.exists(config_file):
        config_file = os.path.join(os.path.dirname(
            os.path.abspath(__file__)), os.pardir, os.pardir, config_file_name)

    if not os.path.exists(config_file):
        config_file = os.path.join(user_config_dir('motd'), config_file_name)

    if not os.path.exists(config_file):
        return ""

    return config_file


def get_config():
    try:
        config_file = guess_config_path()
        with open(config_file) as json_file:
            data = json.load(json_file)
        return data
    except FileNotFoundError:
        return ""


def get_motd(motdfile):
    try:
        with open(motdfile) as json_file:
            data = json.load(json_file)
        return data
    except FileNotFoundError:
        return ""
