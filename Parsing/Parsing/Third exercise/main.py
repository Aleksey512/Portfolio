import requests

from bs4 import BeautifulSoup

import csv 

def get_html(url):
	response = requests.get(url)
	if response.ok:
		return response.text
	else:
		print(response.status_code)


def refine(s):
	# ТИЦ: 3432112 -> ['ТИЦ:', '3432112']
	return s.split(' ')[-1]

def write_csv(data):
	with open("yandex.csv", "a") as f:
		writer = csv.writer(f)
		writer.writerow((data['name'], 
						 data['url'], 
						 data['snippet'], 
						 data['cy']))


def get_data(html):
	soup = BeautifulSoup(html, "lxml")

	lis = soup.find_all("li", class_="yaca-snippet")
	for li in lis:
		try:
			name = li.find("h2").text
		except:
			name = ""
		
		try:
			url = li.find("a").get("href")
		except:
			url =" "

		try:
			snippet = li.find("div", class_="yaca-snippet__text").text.strip()
		except:
			snippet = ""

		try:
			c = li.find("div", class_="yaca-snippet__cy").text.strip()
			cy = refine(c)
		except:
			cy = ""
		
		data = {
				"name" : name,
				"url" : url,
				"snippet" : snippet,
				"cy" : cy
				}

		write_csv(data)

def main():
	pattern = "https://xn----8sbam6aiv3a7i.xn--p1ai/cat/Computers/{}.html"

	for i in range(1, 6):
		url = pattern.format(str(i))
		get_data(get_html(url))

	



if __name__ == "__main__":
	main()