robber(a).
robber(b).
robber(c).

commits_crime_with(c, a).

can_drive(a).
can_drive(c).

driver(X, truck) :- can_drive(X).
driver(X, truck) :- commits_crime_with(X, Y), can_drive(Y).

guilty(X) :- robber(X), driver(X, truck).