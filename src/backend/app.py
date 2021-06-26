"""
Application stub
"""
import json
import os

def initialize():
    config = get_config()
   
    response = {
        'content': get_motd(config['motdfile']),
        'speed': config['speed']
    }
    
    return response


def get_config():
    try:
        config_file = os.path.join(os.path.dirname(os.path.abspath( __file__ )), 'config.json')
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