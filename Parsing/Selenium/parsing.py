import requests
from requests.auth import HTTPDigestAuth

from bs4 import BeautifulSoup

import csv
import re

def get_html(url):
	headers = requests.utils.default_headers()
	headers.update(
    {
        'User-Agent': 'My User Agent 1.0',
    }
	)
	user = ""
	password = ""

	res = requests.post(url, auth=HTTPDigestAuth(user, password), headers=headers)

	return res.status_code


def get_data(html):
	soup = BeautifulSoup(html, "lxml")

	spans = soup.find_all("span")

	for span in spans:
		print(span.text)

url = "https://orel.hh.ru/account/login"

print(get_html(url))
