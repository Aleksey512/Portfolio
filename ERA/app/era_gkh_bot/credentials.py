import os

import environ

env = environ.Env()
# Do not remove these 2 lines:
APP_NAME = 'era_gkh_bot'
BOT_TOKEN = env("TELEGRAM_TOKEN")

