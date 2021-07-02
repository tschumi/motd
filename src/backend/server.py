import json
import os
import time
import webbrowser
from functools import wraps

from flask import Flask, render_template, jsonify, request
import webview
import app

gui_dir = os.path.join(os.path.dirname(__file__), '..',
                       '..', 'gui')  # development path

if not os.path.exists(gui_dir):  # frozen executable path
    gui_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'gui')

server = Flask(__name__, static_folder=gui_dir, template_folder=gui_dir)
server.config['SEND_FILE_MAX_AGE_DEFAULT'] = 1  # disable caching


def verify_token(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        data = json.loads(request.data)
        token = data.get('token')
        if token == webview.token:
            return function(*args, **kwargs)
        else:
            raise Exception('Authentication error')

    return wrapper


@server.after_request
def add_header(response):
    response.headers['Cache-Control'] = 'no-store'
    return response


@server.route('/')
def landing():
    """
    Render index.html. Initialization is performed asynchronously in 
    initialize() function
    """
    return render_template('index.html', token=webview.token)


@server.route('/init', methods=['POST'])
@verify_token
def initialize():
    '''
    Perform heavy-lifting initialization asynchronously.
    :return:
    '''
    receive = app.initialize()

    if receive:
        response = receive
    else:
        response = {
            "content": {
                "quote": "No valid motd found.. go check it!",
                "author": "motd"
            },
            "speed": 0.8,
        }

    return jsonify(response)


@server.route('/window/resize', methods=['POST'])
@verify_token
def resize_window():
    window = webview.windows[0]
    motd_height = request.json['motd_height']
    
    window.resize(window.width, 130 + motd_height)
    window.show()

    return jsonify({})


@server.route('/close', methods=['POST'])
@verify_token
def close():
    time.sleep(0.5)
    os._exit(0)
