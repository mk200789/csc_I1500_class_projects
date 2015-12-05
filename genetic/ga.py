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


print distinct_list
print "sum: " + str(sum(list_a)) + "  list_a: " + str(list_a)
print "sum: " + str(sum(list_b)) + "  list_b: " + str(list_b)

