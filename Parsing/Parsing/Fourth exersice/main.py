import csv 

def write_csv(data):
	with open("names.csv", 'a') as file:
		writer = csv.writer(file)
		writer.writerow((data['name'], data['surname'], data['age']))

def write_csv2(data):
	with open("names.csv", 'a') as file:
		order = ['name', 'surname', 'age']
		writer = csv.DictWriter(file, fieldnames=order)

		writer.writerow(data)

def main():
	data = {'name' : 'Peter', 'surname' : 'Petrov', 'age' : 21}
	data1 = {'name' : 'Ivan', 'surname' : 'Ivanov', 'age' : 22}
	data2 = {'name' : 'Ksu', 'surname' : 'Petrova', 'age' : 13}

	fieldnames = ['name', 'short_name', 'url', 'price']
	l = [data, data1, data2]

	with open("cmc.csv") as f:
		reader = csv.DictReader(f, fieldnames=fieldnames)

		for row in reader:
			print(row)

if __name__ == "__main__":
	main()