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
	a = 3201
	c = 1013904223
	x = 0

	distinct_list = []

	for i in range(10):
		x = (a*x +c)%m
		#stores [100] 10 distinct positive integers in distinct_list
		distinct_list.append(x)

	return distinct_list

def generate_strings(population):
	# generates strings of equal # of 1's and 0's
	strings = []
	random.seed(0)
	for i in range(population):
		#generate a population of strings with equal 1's and 0s
		sample = [0 for x in range(5)] + [1 for x in range(5)]
		random.shuffle(sample)
		strings.append(''.join(str(x) for x in sample))
		#strings.append([])

	return strings

def partition(string, distinct_list):
	#handles partition of list in two subset
	#print "======================== partition() ========================"
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


def print_table(pop):
	x = PrettyTable(["Sum Difference", "String" ,"Subset 1", "Subset 2"])
	for i in pop:
		x.add_row([i[0], i[3] ,i[1], i[2]])
	print x
	return

def check_dup(indiv, pop):
	#returns the amount of dups
	dups = 0
	for i in pop:
		if i[3] == indiv:
			dups += 1

	return dups

def fitness(pop):
	total_fitness, max_fitness, avg_fitness = 0, 0, 0.0
	pop_with_fitness = []

	for i in range(len(pop)):
		pop_with_fitness.append([len(pop)-i-1, pop[i][0], pop[i][1], pop[i][2], pop[i][3]])
		total_fitness += len(pop)-1-i

	max_fitness = len(pop)-1
	avg_fitness = float(total_fitness) / len(pop)

	for i in range(len(pop_with_fitness)):
		#the probability selection for each string
		pop_with_fitness[i].append(float(pop_with_fitness[i][0])/total_fitness)
		

	x = PrettyTable(["String", "Subset 1", "Subset 2", "Sum Difference" ,"Fitness", "P(s)"])
	for i in range(len(pop_with_fitness)):#-1, -1, -1):
		x.add_row([pop_with_fitness[i][4], pop_with_fitness[i][2], pop_with_fitness[i][3], pop_with_fitness[i][1], pop_with_fitness[i][0], pop_with_fitness[i][5] ])
	
	print x
	print "total_fitness: ", total_fitness , "\nmax_fitness: ", max_fitness, "\navg_fitness: ", avg_fitness
	return total_fitness, max_fitness, avg_fitness, pop_with_fitness


def roulette_wheel(pop_with_fitness):
	#random.seed()
	r = random.random()
	previous_prob = 0

	match = 0
	for i in range(len(pop_with_fitness)):
		if r <= previous_prob:
			return pop_with_fitness[i]
		previous_prob += pop_with_fitness[i][5]


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
	random.seed()
	k = random.randint(0,10)
	wentover = []

	paren1 = [ int(x) for x in selection[0][4] ]
	paren2 = [ int(x) for x in selection[1][4] ]
	
	#print "point for crossover: ", k
	child1 = paren1[:k] + paren2[k:]
	child2 = paren2[:k] + paren1[k:]

	is_balanced1 = check_balanced_string(child1)
	is_balanced2 = check_balanced_string(child2)

	while is_balanced1 and is_balanced2:

		k = random.randint(0,10)
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
	random.seed()
	temp = copy.deepcopy(child)

	for i in range(len(temp)):
		for bit in range(len(temp[i])):
			#apply mutation if less than rate on each 
			x = random.random()
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


##########################################################################
#holds the population in the format [sum_diff, sub1, sub2]
generation = 1

pop = []
#create a list of [100]10 distinct positive integers
distinct_list = rng()

#create list of randomized strings population size = [50] 20
string_list = generate_strings(20)

print "in the begining: \n", string_list

# going through string_list, to obtain more information
for i in range(len(string_list)):
	#call partition
	sub1, sub2 = partition(string_list[i], distinct_list)
	sum_diff = abs(sum([ int(a) for a in sub1]) - sum([ int(a) for a in sub2]))
	pop.append([ sum_diff ,sub1, sub2, string_list[i] ])

#sort the population by lowest sum difference
pop = sorted(pop, key=itemgetter(0))
print_table(pop)

#assign fitness values
#compare itself to how much better it is compared to other strings
#fitness = how much people you're better based on your current position
total_fitness, max_fitness, avg_fitness, pop_with_fitness = fitness(pop)

while generation < 100:
	print "GENERATION: ", generation
	#roulette wheel
	selection = []
	while (len(selection) < 2):
		select = roulette_wheel(pop_with_fitness)
		if select:
			if len(selection):
				#make sure it's not the same as first selection
				if select[0] != selection[0][0]:
					# different then add to selection list
					selection.append(select)
			else:
				selection.append(select)


	print "CROSSOVER"
	#crossover
	childrens = crossover(selection)

	print "MUTATION"
	#mutation
	#defined mutation rate
	mutation_rate = 0.1
	childrens = mutation(childrens, mutation_rate)

	print "REPLACING YOUR PARENTS"
	#replacing parents with offsprings
	parent1 = selection[0][4]
	parent2 = selection[1][4]

	childrens[0] = ''.join(str(x) for x in childrens[0])
	childrens[1] = ''.join(str(x) for x in childrens[1])

	string_list[string_list.index(parent1)] = childrens[0]
	string_list[string_list.index(parent2)] = childrens[1]

	#[223, [2046, 7115, 9338, 5161, 4584], [4223, 3469, 8492, 7607, 4230], '0100111100']
	#compute fitness
	pop = []

	for i in range(len(string_list)):
		#call partition
		sub1, sub2 = partition(string_list[i], distinct_list)
		sum_diff = abs(sum([ int(a) for a in sub1]) - sum([ int(a) for a in sub2]))
		pop.append([ sum_diff ,sub1, sub2, string_list[i] ])

	pop = sorted(pop, key=itemgetter(0))

	total_fitness, max_fitness, avg_fitness, pop_with_fitness = fitness(pop)

	generation+=1

