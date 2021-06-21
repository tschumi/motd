import logging
import webview

from contextlib import redirect_stdout
from io import StringIO
from server import server

logger = logging.getLogger(__name__)


if __name__ == '__main__':

    stream = StringIO()
    with redirect_stdout(stream):
        window = webview.create_window('motd', server, width=600, height=130, hidden=1)
        webview.start(debug=True)
