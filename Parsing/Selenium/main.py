import requests

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

from selenium.webdriver.support import expected_conditions as EC

def login(browser):
	delay = 3 # seconds
	try:
		assert 'Вход в личный кабинет' in browser.title

		enter_with_password = browser.find_element(By.XPATH, '//*[@id="HH-React-Root"]/div/div[3]/div[1]/div/div/div/div/div/div[1]/div[1]/div[1]/div/div[2]/div/form/div[4]/button[2]')
		enter_with_password.click()

		username = browser.find_element(By.XPATH, '//*[@id="HH-React-Root"]/div/div[3]/div[1]/div/div/div/div/div/div[1]/div[1]/div[1]/div/div[2]/form/div[1]/fieldset/input')
		password = browser.find_element(By.XPATH, '//*[@id="HH-React-Root"]/div/div[3]/div[1]/div/div/div/div/div/div[1]/div[1]/div[1]/div/div[2]/form/div[2]/fieldset/input')

		username.send_keys("yakunina1111@gmail.com")
		password.send_keys("Aleksey512" + Keys.ENTER)

		browser.implicitly_wait(delay)

		view_all = browser.find_element(By.XPATH, '//*[@id="HH-React-Root"]/div/div[3]/div[1]/div[2]/div/div[1]/div[3]/div/div/div[11]/div/span/a')
		view_all.click()

	except Exception as e:
		print(e)


def search(browser):
	login(browser)




def main():
	url = "https://orel.hh.ru/account/login?backurl=%2F&hhtmFrom=main"
	browser = webdriver.Edge()
	browser.get(url)

	search(browser)
	
	
if __name__=="__main__":
	main()		