from bs4 import BeautifulSoup
import re

# .find()
# .find_all()
# 
# .parent
# .find_parent()
# 
# .parents
# .find_parents()
# 
# .find_next_sibling()
# .find_previous_sibling()
# 
def get_developer(tag):
	whois = tag.find('div', id='who-is').text.strip()
	if "Developer" in whois:
		return tag
	return None

def get_salary(s):
	# 3333 usd per month
	pattern = r'\d{1,9}'
	# salary = re.findall(pattern, s) #always return []
	salary = re.search(pattern, s).group()
	return(salary)

def main():
	file = open('idnex.html').read()
	
	soup = BeautifulSoup(file, 'lxml')

	# row = soup.find_all("div", {"data-set":"salary"})
	# petr = soup.find("div", text="Peter")


	# developers = []

	# persons = soup.find_all("div", class_="row")
	# for person in persons:
	# 	dev = get_developer(person)
	# 	if dev:
	# 		developers.append(dev)

	# print(developers)
	

	# salary = soup.find_all("div", {"data-set":"salary"})

	# for i in salary:
	# 	get_salary(i.text.strip())
	

	# salary = soup.find_all("div", text=re.compile(r'\d{1,9}'))

	# for i in salary:
	# 	print(i.text.strip())


	# 	^ - начало строки
	# 	$ - конец строки
	# 	. - любой символ
	# 	+ - неограниченное кол-во вхождений
	# 	'\d' - цифрa
	# 	'\w' - буква, цифра, _

	mail@gmail.com
	@twitter
	r'^@\w+'
if __name__ == "__main__":
	main()