import requests

from bs4 import BeautifulSoup

import csv 

def get_html(url):
	response = requests.get(url)
	if response.ok:
		return response.text
	print(response.status_code)


def readable(s):
	r = s.replace(",", "")
	return r.replace("$", "")


def write_csv(data):
	with open("cmc.csv", "a") as f:
		writer = csv.writer(f)
		writer.writerow([data['name'],
						data['symbol'],
						data['url'],
						data['price']])


def get_data(html):
	soup = BeautifulSoup(html, 'lxml')

	table = soup.find("table").find("tbody")

	trs = table.find_all("tr")

	for tr in trs:

		td = tr.find_all("td")

		try:
			name = td[2].find('a').find('p', class_="sc-e225a64a-0 ePTNty").text
		except:
			name = td[2].find_all('span')[1].text

		try:
			symbol = td[2].find('a').find('p', class_="sc-e225a64a-0 dfeAJi coin-item-symbol").text
		except:
			symbol = td[2].find_all('span')[2].text

		try:
			bad_price = td[3].find('span').text
			price =	readable(bad_price)
		except:
			price = ''

		try:
			url = 'https://coinmarketcap.com' + td[2].find('a').get('href')
		except:
			url = ''
		
		data ={"name" : name,
			   "symbol" : symbol,
			   "price" : price,
			   "url" : url}

		write_csv(data)


def main():
	pattern = "https://coinmarketcap.com/?page={}"

	for i in range(1, 93):
		url = pattern.format(str(i))
		get_data(get_html(url))



if __name__ == "__main__":
	main()