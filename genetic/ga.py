import collections
#Xn+1 = (a*Xn + c) mod m.

# m and c are coprime
# a - 1 is divisible by all prime factors of m
# a - 1 is divisible by 4 if m is divisble by 4
m = 10000
a = 3201
c = 1013904223
x = 0

distinct_list = []
list_a = []
list_b = []

list_a1 = []
list_b1 = []

"""
def exist(l, item):
	exist = True

	if len(l) == 0:
		return False
	else:
		for i in range(len(l)):
			if l[i] == str(item):
				break
			else:
				exist = False

		return exist
"""


for i in range(10):
	x = (a*x +c)%m
	#stores 10 distinct positive integers in distinct_list
	distinct_list.append(x)

for i in range(len(distinct_list)):
	if i < 5:
		list_a1.append(distinct_list[i])
	else:
		list_b1.append(distinct_list[i])


for i in sorted(distinct_list, reverse=True):
	#divide distinct list into two sublist list_a and list_b 
	#such that the difference of the sum between to the two
	#sublist is minimized.
	if sum(list_a) < sum(list_b):
		list_a.append(i)
	else:
		list_b.append(i)


number_difference = abs(sum(list_a)-sum(list_b))

print "\n\n############################################################"
print distinct_list
print "sum difference: " + str(abs(sum(list_a)-sum(list_b)))
print "sum: " + str(sum(list_a)) + "  list_a: " + str(list_a)
print "sum: " + str(sum(list_b)) + "  list_b: " + str(list_b)
print "############################################################\n\n"

swap = {}

for a in list_a:
	for b in list_b:
		if abs(a - b) < number_difference:

			swap[abs(a-b)] = [list_a.index(a), list_b.index(b), a, b]

if swap:
	sum_a = sum(list_a)
	sum_b = sum(list_b)
	
	smallest = swap[swap.keys()[0]]
	s = abs((sum_a - swap[swap.keys()[0]][2] + swap[swap.keys()[0]][3]) - (sum_b + swap[swap.keys()[0]][2] - swap[swap.keys()[0]][3]))
	smallest.append(s)

	print "swap list: " + str(swap)
	for i in swap:
		if abs((sum_a - swap[i][2] + swap[i][3]) - (sum_b + swap[i][2] - swap[i][3])) < abs((sum_a - smallest[2]  + smallest[3]) - (sum_b +smallest[2] - smallest[3])):
			smallest = swap[i]
			

	print "smallest: "+ str(smallest)
	list_a[smallest[0]] = smallest[3]
	list_b[smallest[1]] = smallest[2]

	print "\n\n############################################################"
	print distinct_list
	print "MINIMIZED sum difference: " + str(abs(sum(list_a)-sum(list_b)))
	print "sum: " + str(sum(list_a)) + "  list_a: " + str(list_a)
	print "sum: " + str(sum(list_b)) + "  list_b: " + str(list_b)
	print "############################################################"

else:
	print "no minimizing"


