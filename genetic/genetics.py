import collections
import random
from operator import itemgetter
from prettytable import PrettyTable
import operator
import copy
import time

class Genetics:
	def __init__(self, population_size):
		self.distinct_list = self.random_num_gen()
		
		self.population_size = population_size
		
		self.population_strings = []

		self.population = []

		self.population_with_fitness = []

		self.statistics = []

		self.mutation_rate = 0.1


	def random_num_gen(self):
		m = 10000
		a = 3201 
		c = 1013904223
		x = 0

		distinct_list = []

		for i in range(100):
			x = (a*x +c)%m
			#stores [100] 10 distinct positive integers in distinct_list
			distinct_list.append(x)
		return distinct_list


	def generate_strings(self):
		# generates strings of equal # of 1's and 0's
		for i in range(self.population_size):
			#generate a population of strings with equal 1's and 0s
			sample = [0 for x in range(50)] + [1 for x in range(50)]
			random.shuffle(sample)
			self.population_strings.append(''.join(str(x) for x in sample))
		return 


	def partition(self):
		#going through each string
		for i in range(len(self.population_strings)):
			#handles partition of list in two subset
			sub_list1 = [] 
			sub_list2 = []
			#partition string into subsets
			for j in range(len(self.population_strings[i])):
				#go through each string
				if (self.population_strings[i][j] == '1'):
					#string 1 goes in sub_list1
					sub_list1.append(self.distinct_list[j]);
				else:
					#string 0 goes in sub_list2
					sub_list2.append(self.distinct_list[j]);
			sum_diff = abs(sum([ int(a) for a in sub_list1]) - sum([ int(b) for b in sub_list2]))
			self.population.append([sum_diff, sub_list1, sub_list2, self.population_strings[i]])

		#sort the population by lowest sum difference
		self.population = sorted(self.population, key=itemgetter(0))

		return 


	def fitness(self):
		#compare itself to how much better it is compared to other strings
		#fitness = how much people you're better based on your current position
		total_fitness, max_fitness, avg_fitness = 0, 0, 0.0

		for i in range(len(self.population)):
			self.population_with_fitness.append([len(self.population)-i-1, self.population[i][0], self.population[i][1], self.population[i][2], self.population[i][3]])
			total_fitness += len(self.population)-1-i

		max_fitness = len(self.population)-1
		avg_fitness = float(total_fitness) / len(self.population)

		for i in range(len(self.population_with_fitness)):
			#the probability selection for each string
			self.population_with_fitness[i].append(float(self.population_with_fitness[i][0])/total_fitness)

		return 


	def roulette_wheel(self):
		r = random.uniform(0.0, 1.0)
		previous_prob = 0

		match = 0
		for i in range(len(self.population_with_fitness)):
			if r <= previous_prob:
				return self.population_with_fitness[i]
			previous_prob += self.population_with_fitness[i][5]
	
	
	def check_balanced_string(self, child):
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

	def crossover(self, parents):
		#crossover point, using single point for crossover
		k = random.randint(0,99)
		wentover = []

		paren1 = [ int(x) for x in parents[0][4] ]
		paren2 = [ int(x) for x in parents[1][4] ]
		
		child1 = paren1[:k] + paren2[k:]
		child2 = paren2[:k] + paren1[k:]

		is_balanced1 = self.check_balanced_string(child1)
		is_balanced2 = self.check_balanced_string(child2)

		while is_balanced1 and is_balanced2:
			k = random.randint(0,99)
			try:
				wentover.index(k)
			except ValueError:
				#print "point for crossover: ", k
				child1 = paren1[:k] + paren2[k:]
				child2 = paren2[:k] + paren1[k:]
				#check if balanced
				is_balanced1 = self.check_balanced_string(child1)
				is_balanced2 = self.check_balanced_string(child2)
				wentover.append(k)

		return [child1, child2]


	def mutation(self, child):
		temp = copy.deepcopy(child)

		for i in range(len(temp)):
			for bit in range(len(temp[i])):
				#apply mutation if less than rate on each 
				x = random.uniform(0.0, 1.0)
				if x < self.mutation_rate:
					#print "mutate!"
					if temp[i][bit] == 0:
						temp[i][bit] = 1
					else:
						temp[i][bit] = 1

		if self.check_balanced_string(temp[0]) == 0 and self.check_balanced_string(temp[1]) == 0:
			#if balanced zeroes
			return temp
		else:
			#print "not balanced mutation: ", child
			return child


	def select_parent(self):
		selection = []
		while len(selection)< 2:
			select = self.roulette_wheel()
			if select:
				if len(selection):
					#make sure it's not the same as first selection
					if select[0] != selection[0][0]:
						# different then add to selection list
						selection.append(select)
				else:
					selection.append(select)

		return selection


	def get_statistics(self):
		#get maximum generation
		max_gen = max(self.statistics, key=lambda x:x['Generation'])['Generation']

		#get minimum generation
		min_gen = min(self.statistics, key=lambda x:x['Generation'])['Generation']

		#get average generation
		average_of_gen = 0.0
		
		for i in self.statistics:
			average_of_gen += i['Generation']

		average_of_gen = average_of_gen/len(self.statistics)

		#get median
		if len(self.statistics)%2 :
			median_gen = float(self.statistics[len(self.statistics)-1]['Generation'] + self.statistics[len(self.statistics)-2]['Generation'])/ 2
		else:
			median_gen = self.statistics[len(self.statistics)/2]['Generation']

		#get the range of generation
		range_gen = max_gen - min_gen
		
		return [max_gen, min_gen, average_of_gen, median_gen, range_gen, self.mutation_rate, self.population_size]

	def print_statistics(self, stats):
		x = PrettyTable(["Statistics", "Generation Count", "Convergence", "Mutation", "Population"])
		x.add_row(["MIN", stats[1], 0, stats[5], stats[6]])
		x.add_row(["MAX", stats[0], 0, stats[5], stats[6]])
		x.add_row(["AVG", stats[2], 0, stats[5], stats[6]])
		x.add_row(["MED", stats[3], 0, stats[5], stats[6]])
		x.add_row(["RANGE", stats[4], 0, stats[5], stats[6]])
		print x
		return

	def genetic_algorithm(self):

		size = self.population_size/2

		for i in range(size):
		#for i in range(1):
			generation = 1
			
			self.population_strings = []

			self.generate_strings()

			while generation < 10000:
				
				self.population = []
				# call partition
				self.partition()

				self.population_with_fitness = []
				
				#assign fitness values
				self.fitness()

				#select parents
				parents = self.select_parent()

				#perform crossover to obtain kids
				childrens = self.crossover(parents)

				#mutation
				childrens = self.mutation(childrens)

				#replacing parents with offsprings
				childrens[0] = ''.join(str(x) for x in childrens[0])
				childrens[1] = ''.join(str(x) for x in childrens[1])

				self.population_strings[self.population_strings.index(parents[0][4])] = childrens[0]
				self.population_strings[self.population_strings.index(parents[1][4])] = childrens[1]

				#if convergence to 0 add to statistics
				print "GENERATION: ", generation, "\nIteration: ", i, self.population[0][0]
				if self.population[0][0] == 0:
					stats = {}
					stats['Best'] = self.population[0][0]
					stats['Generation'] = generation
					stats['Iteration'] = i
					self.statistics.append(stats)
					break
				
				generation+=1


if __name__ == '__main__':
	genes = Genetics(20)
	start = time.time()
	genes.genetic_algorithm()
	stat = genes.get_statistics()
	genes.print_statistics(stat)
	end = time.time()
	print "Total time: ", (end - start)/60.0, "minutes"