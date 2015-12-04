male(james1).
male(charles1).
male(charles2).
male(james2).
male(george1).
male(thomas).
male(timothy).

female(catherine).
female(elizabeth).
female(sophia).
female(sammy).
female(drew).

parent(charles1, james1).
parent(elizabeth, james1).
parent(charles2, charles1).
parent(catherine, charles1).
parent(james2, charles1).
parent(sophia, elizabeth).
parent(george1, sophia).
parent(sammy, sophia).
parent(drew, sophia).
parent(timothy, james1).
parent(thomas, james1).

mother(M, X)  :- parent(X, M), female(M).
father(F, X)  :- parent(X, F), male(F).
sibling(X, Y) :- parent(X, Z), parent(Y, Z).
sister(X, Y)  :- parent(X, Z), parent(Y, Z), female(X), female(Y).
brother(X, Y) :- parent(X, Z), parent(Y, Z), male(X), male(Y).