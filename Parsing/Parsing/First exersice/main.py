import requests

from bs4 import BeautifulSoup

def get_html(url):
	r = requests.get(url)
	return r.text


def get_data(html):
	soup = BeautifulSoup(html, "lxml")
	block_enabled = soup.find_all("section")[0]
	return block_enabled


def main():
	url = "https://wordpress.org/plugins/"
	print(get_data(get_html(url)))



if __name__ == "__main__":
	main()