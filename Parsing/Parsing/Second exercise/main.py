import requests

from bs4 import BeautifulSoup

import csv

def get_html(url):
	r = requests.get(url)
	return r.text


def write_csv(data):
	with open('cmc.csv', 'a') as f:
		writer = csv.writer(f)
		
		writer.writerow([data['name'],
			data['symbol'],
			data['url'],
			data['price']])

def readable(s):
	r = s.replace(",", "")
	return r.replace("$", "")

def get_data(html):
	soup = BeautifulSoup(html, 'lxml')

	trs = soup.find("table").find("tbody").find_all("tr")
	lens = 1
	for tr in trs:
		tds = tr.find_all("td")

		url = 'https://coinmarketcap.com' + tds[2].find('a').get('href')

		price = tds[3].find('span').text

		name = tds[2].find('a').find('p', class_="sc-e225a64a-0 ePTNty")
		if name:
			name = tds[2].find('a').find('p', class_="sc-e225a64a-0 ePTNty").text
		else:
			name = tds[2].find_all('span')[1].text

		symbol = tds[2].find('a').find('p', class_="sc-e225a64a-0 dfeAJi coin-item-symbol")
		if symbol:
			symbol = tds[2].find('a').find('p', class_="sc-e225a64a-0 dfeAJi coin-item-symbol").text
		else:
			symbol = tds[2].find_all('span')[2].text

		data ={"name" : name,
			   "symbol" : symbol,
			   "price" : readable(price),
			   "url" : url}

		write_csv(data)
		
	
def main():
	url = "https://coinmarketcap.com/"
	get_data(get_html(url))


if __name__ == '__main__':
	main()