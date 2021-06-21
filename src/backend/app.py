"""
Application stub
"""
import json

def initialize():
    config = get_config()
   
    response = {
        'content': get_motd(config['motdfile']),
        'speed': config['speed']
    }
    
    return response


def get_config():
    try:
        with open('config.json') as json_file:
            data = json.load(json_file)
        return data
    except:
        print("Sorry, no valid config file found..")
    

def get_motd(motdfile):
    try:
        with open(motdfile) as json_file:
            data = json.load(json_file)
        return data
    except:
        print("Sorry, no valid motd file found..")