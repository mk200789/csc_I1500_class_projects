#solution is the most smallest sum diff
import collections
import random
from operator import itemgetter
#Xn+1 = (a*Xn + c) mod m.
from prettytable import PrettyTable
import operator
import copy

def rng():
	m = 10000
	a = 3201 #3
	c = 1013904223 #2
	x = 0 #5

	distinct_list = []

	for i in range(100):
		x = (a*x +c)%m
		#stores [100] 10 distinct positive integers in distinct_list
		distinct_list.append(x)

	return distinct_list

def generate_strings(population):
	# generates strings of equal # of 1's and 0's
	strings = []
	#random.seed(0)
	for i in range(population):
		#generate a population of strings with equal 1's and 0s
		sample = [0 for x in range(50)] + [1 for x in range(50)]
		random.shuffle(sample)
		strings.append(''.join(str(x) for x in sample))
		#strings.append([])

	return strings

def partition(string, distinct_list):
	#handles partition of list in two subset
	sub_list1 = [] 
	sub_list2 = []

	for i in range(len(string)):
		#go through each string
		if (string[i] == '1'):
			#string 1 goes in sub_list1
			sub_list1.append(distinct_list[i]);
		else:
			#string 0 goes in sub_list2
			sub_list2.append(distinct_list[i]);

	return sub_list1, sub_list2 

def check_dup(indiv, population):
	#returns the amount of dups
	dups = 0
	for i in population:
		if i[3] == indiv:
			dups += 1

	return dups

def fitness(population):
	total_fitness, max_fitness, avg_fitness = 0, 0, 0.0
	population_with_fitness = []

	for i in range(len(population)):
		population_with_fitness.append([len(population)-i-1, population[i][0], population[i][1], population[i][2], population[i][3]])
		total_fitness += len(population)-1-i

	max_fitness = len(population)-1
	avg_fitness = float(total_fitness) / len(population)

	for i in range(len(population_with_fitness)):
		#the probability selection for each string
		population_with_fitness[i].append(float(population_with_fitness[i][0])/total_fitness)
	
	return total_fitness, max_fitness, avg_fitness, population_with_fitness


def roulette_wheel(population_with_fitness):
	random.seed()
	r = random.uniform(0.0, 1.0)
	previous_prob = 0

	match = 0
	for i in range(len(population_with_fitness)):
		if r <= previous_prob:
			return population_with_fitness[i]
		previous_prob += population_with_fitness[i][5]


def check_balanced_string(child):
	#check if equal # of 1's and 0's
	no_1 = 0
	for i in child:
		if i == 0:
			no_1+=1
	
	if no_1 == len(child)/2:
		return 0
	else:
		#not balanced 
		return 1


def crossover(selection):
	#crossover point, using single point for crossover
	k = random.randint(0,100)
	wentover = []

	paren1 = [ int(x) for x in selection[0][4] ]
	paren2 = [ int(x) for x in selection[1][4] ]
	
	#print "point for crossover: ", k
	child1 = paren1[:k] + paren2[k:]
	child2 = paren2[:k] + paren1[k:]

	is_balanced1 = check_balanced_string(child1)
	is_balanced2 = check_balanced_string(child2)

	while is_balanced1 and is_balanced2:

		k = random.randint(0,100)
		try:
			wentover.index(k)
		except ValueError:
			#print "point for crossover: ", k
			child1 = paren1[:k] + paren2[k:]
			child2 = paren2[:k] + paren1[k:]
			#check if balanced
			is_balanced1 = check_balanced_string(child1)
			is_balanced2 = check_balanced_string(child2)
			wentover.append(k)


	return [child1, child2]


def mutation(child, rate):
	temp = copy.deepcopy(child)

	for i in range(len(temp)):
		for bit in range(len(temp[i])):
			#apply mutation if less than rate on each 
			x = random.uniform(0.0, 1.0)
			if x < rate:
				#print "mutate!"
				if temp[i][bit] == 0:
					temp[i][bit] = 1
				else:
					temp[i][bit] = 1

	if check_balanced_string(temp[0]) == 0 and check_balanced_string(temp[1]) == 0:
		#if balanced zeroes
		#print "balanced mutation"
		return temp
	else:
		#print "not balanced mutation: ", child
		return child


def select_parent(population_with_fitness):
	selection = []

	while len(selection)< 2:
		select = roulette_wheel(population_with_fitness)

		if select:
			if len(selection):
				#make sure it's not the same as first selection
				if select[0] != selection[0][0]:
					# different then add to selection list
					selection.append(select)
			else:
				selection.append(select)

	return selection

def printValue(population_with_fitness):
	x = PrettyTable(["Sum Difference" ,"Fitness", "P(s)"])
	for i in range(len(population_with_fitness)):#-1, -1, -1):
		x.add_row([population_with_fitness[i][1], population_with_fitness[i][0], population_with_fitness[i][5] ])
	"""
	x = PrettyTable(["String", "Sum Difference" ,"Fitness", "P(s)"])
	for i in range(len(population_with_fitness)):#-1, -1, -1):
		x.add_row([population_with_fitness[i][4], population_with_fitness[i][1], population_with_fitness[i][0], population_with_fitness[i][5] ])
	"""
	print x
	return

def print_stats(stats):
	x = PrettyTable(["Statistics", "Generation Count", "Convergence", "Mutation", "Population"])
	x.add_row(["MIN", stats[1], 0, stats[5], stats[6]])
	x.add_row(["MAX", stats[0], 0, stats[5], stats[6]])
	x.add_row(["AVG", stats[2], 0, stats[5], stats[6]])
	x.add_row(["MED", stats[3], 0, stats[5], stats[6]])
	x.add_row(["RANGE", stats[4], 0, stats[5], stats[6]])
	print x
	return

#################################################################################################################	
#################################################################################################################	
#################################################################################################################	
#################################################################################################################	
#holds the population in the format [sum_diff, sub1, sub2]
generation = 1

population = []
#create a list of [100] 10 distinct positive integers
distinct_list = rng()

#create list of randomized strings population size = [50] 20
population_size = 20

size = population_size/2
p = size

statistics =[]


for i in range(size):
	generation = 1
	
	#generate new population
	population_strings = generate_strings(population_size)
	population = []


	while generation < 8000:
		
		print "GENERATION: ", generation
		# going through population_strings, to obtain more information
		for i in range(len(population_strings)):
			#call partition
			sub1, sub2 = partition(population_strings[i], distinct_list)
			sum_diff = abs(sum([ int(a) for a in sub1]) - sum([ int(a) for a in sub2]))
			population.append([ sum_diff ,sub1, sub2, population_strings[i] ])

		#sort the population by lowest sum difference
		population = sorted(population, key=itemgetter(0))

		#assign fitness values
		#compare itself to how much better it is compared to other strings
		#fitness = how much people you're better based on your current position
		total_fitness, max_fitness, avg_fitness, population_with_fitness = fitness(population)

		#roulette wheel
		selection = select_parent(population_with_fitness)

		#crossover
		childrens = crossover(selection)

		#mutation
		mutation_rate = 0.1
		childrens = mutation(childrens, mutation_rate)

		#print "REPLACING YOUR PARENTS"
		#replacing parents with offsprings
		parent1 = selection[0][4]
		parent2 = selection[1][4]


		childrens[0] = ''.join(str(x) for x in childrens[0])
		childrens[1] = ''.join(str(x) for x in childrens[1])

		population_strings[population_strings.index(parent1)] = childrens[0]
		population_strings[population_strings.index(parent2)] = childrens[1]

		#compute fitness
		population = []

		for i in range(len(population_strings)):
			#call partition
			sub1, sub2 = partition(population_strings[i], distinct_list)
			sum_diff = abs(sum([ int(a) for a in sub1]) - sum([ int(a) for a in sub2]))
			population.append([ sum_diff ,sub1, sub2, population_strings[i] ])
		
		population = sorted(population, key=itemgetter(0))


		#if convergence to 0 add to statistics
		if population[0][0] == 0:
			stats = {}
			stats['Best'] = population[0][0]
			stats['Generation'] = generation
			stats['Iteration'] = i
			statistics.append(stats)
			break
		
		generation+=1


#get statistics
#get maximum generation
max_gen = max(statistics, key=lambda x:x['Generation'])['Generation']

#get minimum generation
min_gen = min(statistics, key=lambda x:x['Generation'])['Generation']

#get average generation
average_of_gen = 0.0
for i in statistics:
	average_of_gen += i['Generation']

average_of_gen = average_of_gen/len(statistics)

#get median
if len(statistics)%2 :
	median_gen = float(statistics[len(statistics)-1]['Generation'] + statistics[len(statistics)-2]['Generation'])/ 2
else:
	median_gen = statistics[len(statistics)/2]['Generation']

#get the range of generation
range_gen = max_gen - min_gen

"""
print "CONVERGENCE: ", min(statistics, key=lambda x:x['Best'])['Best']
print "MAX GENERATION: ", max_gen
print "MIN GENERATION: ", min_gen
print "AVG GENERATION: ", average_of_gen
print "MED GENERATION: ", median_gen
print "RANGE OF GENERATION: ", range_gen
"""
print_stats([max_gen, min_gen, average_of_gen, median_gen, range_gen, mutation_rate, population_size])
