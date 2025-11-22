import os

# Railway provides PORT environment variable
port = os.environ.get('PORT', '8080')
bind = f"0.0.0.0:{port}"
workers = 2
threads = 2
timeout = 120
accesslog = "-"
errorlog = "-"
loglevel = "info"
