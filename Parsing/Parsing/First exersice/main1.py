import requests
from bs4 import BeautifulSoup
import csv


def get_html(url):
	r = requests.get(url)
	return r.text


def refind(s):
	# 1,981 total ratings
	r = s.split(' ')[0]
	return r.replace(',', '')


def write_csv(data):
	with open('plugins.csv', 'a') as f: 	# 'w'-write, 'a'-append
		writer = csv.writer(f)

		writer.writerow((data['plugins_group'],
						 data['name'],
						 data['url'],
						 data['reviews']))
		writer.writerow(())


def get_data(html):
	soup = BeautifulSoup(html, "lxml")
	block_enabled_all = soup.find_all('section')
	for block_enabled in block_enabled_all:
		plugins = block_enabled.find_all('article')	
		for plugin in plugins:
			plugins_group = block_enabled.find('h2', class_='section-title').text
			name = plugin.find('h3').text
			url = plugin.find('h3').find('a').get('href')

			r = plugin.find('span', class_='rating-count').find('a').text
			reviews = refind(r)

			data = {'plugins_group' : plugins_group,
					'name' : name,
					'url' : url,
					'reviews' : reviews,
				}

			write_csv(data)
	# return plugins


def main():
	url = "https://wordpress.org/plugins/"
	print(get_data(get_html(url)))




if __name__ == "__main__":
	main()