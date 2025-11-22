import sys
import os

# Path ke folder backend Anda (GANTI your_username dengan username PythonAnywhere Anda)
path = '/home/your_username/cardiocare/backend'
if path not in sys.path:
    sys.path.append(path)

# Virtual environment path (GANTI your_username)
virtualenv_path = '/home/your_username/.virtualenvs/cardiocare-env'
activate_this = os.path.join(virtualenv_path, 'bin/activate_this.py')
exec(open(activate_this).read(), dict(__file__=activate_this))

# Import Flask app
from app import app as application
