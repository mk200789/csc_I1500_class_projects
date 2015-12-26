/*
heuristics: manhattan distance + check if there is opponent 
			if so check if there's a backing to that opponent
			+ how many pieces attacked

two ways of winning:
	- capturing ("catching") the opponent's Lion
	- advancing one's own Lion into the promotion zone (farthest rank), 
	  as long as doing so does not place one's Lion in check.
*/

var turn, piece;
var winner = false;
var last_position; //Save last position of the current piece
var $possible_moves =[]; //Holds the possible moves
var player = false; //always starts with enemy first: [True: player, False: opponent]
var incorrect = false; //checks if the current piece has right move
var valid_piece = true; //check if the current piece is valid;

var player_pieces = []; //holds pieces the player's attacked pieces
var opponent_pieces = []; //holds pieces the opponent's attacked pieces

var sum_heuristic = []; //holds heuristic
var players_possible_moves = [];//holds all player possible moves
var enemies_possible_moves = [];
var board = []; //holds current board position 

$(document).ready(function(){
	//When everything is ready place the pieces on board.
	$('#1').append($('<img />').attr('src', 'static/img/enemy_giraffe.png').attr('alt', 'enemy_giraffe').attr('class', 'enemy_giraffe'));
	$('#2').append($('<img />').attr('src', 'static/img/enemy_lion.png').attr('alt', 'enemy_lion').attr('class', 'enemy_lion'));
	$('#3').append($('<img />').attr('src', 'static/img/enemy_elephant.png').attr('alt', 'enemy_elephant').attr('class', 'enemy_elephant'));
	$('#5').append($('<img />').attr('src', 'static/img/enemy_chick.png').attr('alt', 'enemy_chick').attr('class', 'enemy_chick'));

	$('#10').append($('<img />').attr('src', 'static/img/my_giraffe.png').attr('alt', 'player_giraffe').attr('class', 'player_giraffe'));
	$('#11').append($('<img />').attr('src', 'static/img/my_lion.png').attr('alt', 'player_lion').attr('class', 'player_lion'));
	$('#12').append($('<img />').attr('src', 'static/img/my_elephant.png').attr('alt', 'player_elephant').attr('class', 'player_elephant'));
	$('#8').append($('<img />').attr('src', 'static/img/my_chick.png').attr('alt', 'player_chick').attr('class', 'player_chick'));

	document.getElementById('output').innerHTML = "######### GAME START ########\n";
	turn = 0;

	board = get_board();
	enemyAI();

	$('#table').find('td').on('click', function(){
		if (!winner){
			if (player){
				console.log("player turn");
				if (turn == 0){
					//Handles the first move: selecting player piece
					piece = $(this);
					last_position = $(this)[0].id;
					document.getElementById('result').innerHTML = "";
					document.getElementById('output').innerHTML = document.getElementById('output').innerHTML+ "\nPlayer's Turn.\n";
					game(piece, $(this), 0);
				}
				else{
					//Handles the second move: Destination
					//second move: perform the move, set player false, then call enemyAI()
					game(piece, $(this), 1);
					//console.log(incorrect);
					if (!incorrect && valid_piece){
						//if the second move is incorrect the turn the current player is still at turm
						player = !player;
					}
					else{
						player = false;

						setTimeout(function(){
							enemyAI();
						}, 500);
					}
				}
			}
		}
		else{
			//there is a winner so output game.
			document.getElementById('output').innerHTML = document.getElementById('output').innerHTML+ "Game over. Click reset to play game again.\n";
		}
	});
});


function get_possible_moves(current){
	/*
		Obtain the possible moves for the current piece selected.
	*/
	
	var index = $('#'+last_position).index(), $tr= $('#'+last_position).parent();
	if (player){
		//player
		if (current.children('img').attr('alt') == 'player_elephant'){
			$possible_moves = $tr.prev().find('td').eq(index+1);
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index+1));
			$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index-1)); //find the td with the same index-1 in prev row
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index-1)); //find the td with the same index-1 in next row
		}
		else if (current.children('img').attr('alt') == 'player_lion'){
			$possible_moves = $('#'+last_position).prev();
			$possible_moves = $possible_moves.add($('#'+last_position).next());
			$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index));
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index));
			$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index+1));
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index+1));
			$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index-1));
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index-1));
		}
		else if (current.children('img').attr('alt') == 'player_giraffe'){
			$possible_moves = $('#'+last_position).prev();
			$possible_moves = $possible_moves.add($('#'+last_position).next());
			$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index));
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index));
		}
		else if(current.children('img').attr('alt') == 'player_chick'){
			$possible_moves = $tr.prev().find('td').eq(index);
		}
		else{
			//console.log('invalid piece');
			valid_piece = false;
		}
	}
	else{
		//opponent
		//if (current.children('img').attr('alt') == 'enemy_elephant'){
		last_position = current[2];
		var index = $('#'+last_position).index(), $tr= $('#'+last_position).parent();
		if (current[1] == 'enemy_elephant'){
			//console.log('enemy_elephant');
			$possible_moves = $tr.prev().find('td').eq(index+1);
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index+1));
			$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index-1)); //find the td with the same index-1 in prev row
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index-1)); //find the td with the same index-1 in next row
		}
		else if (current[1] == 'enemy_lion'){
			//console.log('enemy_lion');
			$possible_moves = $('#'+last_position).prev();
			$possible_moves = $possible_moves.add($('#'+last_position).next());
			$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index));
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index));
			$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index+1));
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index+1));
			$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index-1));
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index-1));
		}
		else if (current[1] == 'enemy_giraffe'){
			//console.log('enemy_giraffe');
			$possible_moves = $('#'+last_position).prev();
			$possible_moves = $possible_moves.add($('#'+last_position).next());
			$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index));
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index));
		}
		else if (current[1] == 'enemy_chick'){
			//console.log('enemy_chick');
			$possible_moves = $tr.next().find('td').eq(index);
		}

		if (current[1] == 'player_elephant'){
			//console.log('player_elephant');
			$possible_moves = $tr.prev().find('td').eq(index+1);
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index+1));
			$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index-1)); //find the td with the same index-1 in prev row
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index-1)); //find the td with the same index-1 in next row
		}
		if (current[1] == 'player_lion'){
			//console.log('player_lion');
			$possible_moves = $('#'+last_position).prev();
			$possible_moves = $possible_moves.add($('#'+last_position).next());
			$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index));
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index));
			$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index+1));
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index+1));
			$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index-1));
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index-1));
		}
		else if (current[1] == 'player_giraffe'){
			//console.log('my_giraffe');
			$possible_moves = $('#'+last_position).prev();
			$possible_moves = $possible_moves.add($('#'+last_position).next());
			$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index));
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index));
		}
		else if(current[1] == 'player_chick'){
			//console.log('player_chick');
			$possible_moves = $tr.prev().find('td').eq(index);
		}
	}
};


function display(current){
	/*
		Display moves to output.
	*/
	
	var message, who;
	var test;
	console.log("current: ", current);
	console.log(last_position);

	if (player){
		who = "Player";
		console.log(current[0].innerHTML);
		document.getElementById('player').innerHTML = document.getElementById('player').innerHTML + current[0].innerHTML;
		
		if (current.children('img').attr('alt')){
			//message = $(piece).children('img').attr('alt') + " has moved from Cell " + piece[0].id + " to  Cell " + current[0].id + " and captured " + current.children('img').attr('alt');
			message = who + " has moved from Cell " + piece[0].id + " to  Cell " + current[0].id + " and captured " + current.children('img').attr('alt');
		}
		else{
			//message = $(piece).children('img').attr('alt') + " has moved from Cell " + piece[0].id + " to  Cell " + current[0].id;
			message = who + " has moved from Cell " + piece[0].id + " to  Cell " + current[0].id;
		}
	}
	else{
		who = "Opponent";
		if (current[1] == 0){
		}
		else{
			document.getElementById('opponent').innerHTML = document.getElementById('opponent').innerHTML + current[1];
		}
		//document.getElementById('opponent').innerHTML = document.getElementById('opponent').innerHTML + current[1];
		console.log(current[1]);

		if (current[1]){
			message = who + " has moved from Cell " + piece[2] + " to Cell " + current[0][2] +  " and captured " + current[0][1];
		}
		else{

			message = who + " has moved from Cell " + piece[2] + " to cell " + current[0][2];
		}


	}

	document.getElementById('output').innerHTML = document.getElementById('output').innerHTML+message;

};

function reset(){
	/*
		Resets the board/game.
	*/

	$('td').text('');
	$('#1').append($('<img />').attr('src', 'static/img/enemy_giraffe.png').attr('alt', 'enemy_giraffe').attr('class', 'enemy_giraffe'));
	$('#2').append($('<img />').attr('src', 'static/img/enemy_lion.png').attr('alt', 'enemy_lion').attr('class', 'enemy_lion'));
	$('#3').append($('<img />').attr('src', 'static/img/enemy_elephant.png').attr('alt', 'enemy_elephant').attr('class', 'enemy_elephant'));
	$('#5').append($('<img />').attr('src', 'static/img/enemy_chick.png').attr('alt', 'enemy_chick').attr('class', 'enemy_chick'));

	$('#10').append($('<img />').attr('src', 'static/img/my_giraffe.png').attr('alt', 'my_giraffe').attr('class', 'my_giraffe'));
	$('#11').append($('<img />').attr('src', 'static/img/my_lion.png').attr('alt', 'my_lion').attr('class', 'my_lion'));
	$('#12').append($('<img />').attr('src', 'static/img/my_elephant.png').attr('alt', 'my_elephant').attr('class', 'my_elephant'));
	$('#8').append($('<img />').attr('src', 'static/img/my_chick.png').attr('alt', 'my_chick').attr('class', 'my_chick'));
	
	document.getElementById('result').innerHTML = "";
	document.getElementById('output').innerHTML = "";
	document.getElementById('output').innerHTML = "######### GAME START ########\n";
	document.getElementById('opponent').innerHTML = "";
	document.getElementById('player').innerHTML="";
	turn = 0;
	$possible_moves = [];
	piece = [];
	player = false;
	valid_piece = true;
	winner = false;

	//after reset enemyAI starts
	enemyAI();
};

function check_win(user, current){
	/*
		Checks if there's any winner.
		If there's a winner, winner will be displayed in output textarea, and set winner to true
		to stop further plays until game is reset.

		Two ways of winning:
			1. Capturing opponents/player's Lion.
			2. Advancing one's ow Lion into the farthest zone.
	*/

	if (user){
		if (user.match(/lion$/)){
			if (player){
				document.getElementById('output').innerHTML = document.getElementById('output').innerHTML + "Player wins!\n";
			}
			else{
				document.getElementById('output').innerHTML = document.getElementById('output').innerHTML + "Opponent wins!\n";
			}
			winner = true;
		}
	}
	else if (current.children('img').attr('alt').match(/^player_lion$/)){
		if (current.parent()[0].rowIndex == 0){
			document.getElementById('output').innerHTML = document.getElementById('output').innerHTML + "Player wins!\n";
			winner = true;
		}
	}
	else if (current.children('img').attr('alt').match(/^enemy_lion/)){
		if (current.parent()[0].rowIndex == 3){
			document.getElementById('output').innerHTML = document.getElementById('output').innerHTML + "Opponent wins!\n";
			winner = true;
		}
	}

};

function transition(piece, current){
	/*
		If chick has reached the opponents/player the last/first row respectively,
		the chick will transition to a hen.
	*/
	var id = current[0].id;

	if (piece.children('img').attr('alt').match(/^player_chick$/)){
		if (current.parent()[0].rowIndex == 0)
		{
			console.log('change this chick to hen!');
			document.getElementsByClassName('player_chick')[0].src ='static/img/my_hen.png';
			document.getElementsByClassName('player_chick')[0].alt = 'player_hen';
			document.getElementsByClassName('player_chick')[0].class = 'player_hen';
		}
	}
	else if (piece.children('img').attr('alt').match(/^enemy_chick$/)){
		if (current.parent()[0].rowIndex == 3)
		{
			console.log('change this chick to hen!');
			document.getElementsByClassName('enemy_chick')[0].src ='static/img/enemy_hen.png';
			document.getElementsByClassName('enemy_chick')[0].alt = 'enemy_hen';
			document.getElementsByClassName('enemy_chick')[0].class = 'enemy_hen';
		}
	}
};

function get_board(){
	board = [];
	$("table#table tr").each(function(){
		var thisRow = [];
		var tableData = $(this).find('td');
		
		if (tableData.length > 0){
			tableData.each(function(){
				if ($(this).children('img').attr('alt') != undefined){
					if (($(this).children('img').attr('alt')).match(/^enemy_lion/)){
						//console.log(($(this).children('img').attr('alt')).match(/^enemy_lion/));
						thisRow.push([10, 'enemy_lion', $(this)[0].id]);
					}
					else if (($(this).children('img').attr('alt')).match(/^player_lion/)){
						thisRow.push([-10, 'player_lion', $(this)[0].id]);
					}
					else if (($(this).children('img').attr('alt')).match(/^enemy_([a-z]*)$/)){
						//console.log(($(this).children('img').attr('alt')).match(/^enemy_([a-z]*)$/));
						thisRow.push([1, ($(this).children('img').attr('alt')).match(/^enemy_([a-z]*)$/)[0], $(this)[0].id]);
					}
					else if (($(this).children('img').attr('alt')).match(/^player_chick/)){
						//console.log(($(this).children('img').attr('alt')).match(/^my_([a-z]*)$/));
						thisRow.push([-1, 'player_chick' , $(this)[0].id]);
					}
					else if (($(this).children('img').attr('alt')).match(/^player_([a-z]*)$/)){
						//console.log(($(this).children('img').attr('alt')).match(/^my_([a-z]*)$/));
						thisRow.push([-2, ($(this).children('img').attr('alt')).match(/^player_([a-z]*)$/)[0], $(this)[0].id]);
					}
				}
				else{
					thisRow.push([0, '' , $(this)[0].id]);
				}
			});
			board.push(thisRow);
		}
	});


	return board;
};

function convert_to_boardval(piece){
	var r, c;
	//console.log(piece);
	if (piece > 3){
		if (piece % 3 == 0){
			console.log("eh1");
			//c = (piece % 3);
			c = 2;
			r = (piece /3) - 1;
		}
		else{
			console.log("eh2");
			c = (piece % 3) -1;
			r = Math.ceil(piece/3) - 1;
		}
	}
	else{
		r = 0;
		c = piece -1;
	}
	//console.log("row, col: "+ r +','+c);
	return [r, c];
};



function get_neighbor(piece, board){
	/*
		Returns the neighboring pieces.
	*/
	//var position = piece[2];
	var neighbors = [];
	var board_values = [];
	var r, c;

	board_values= convert_to_boardval(piece);

	r = board_values[0];
	c = board_values[1];

	console.log("row, col: "+ r +','+c);

	if (r == 0){
		//if piece is in the first row, check only neighbors afront and side;
		if (c == 0){
			//piece in corner left
			neighbors.push(board[r][c+1]);
			neighbors.push(board[r+1][c]);
			neighbors.push(board[r+1][c+1]);
		}
		else if ( c == 2){
			//piece in corner right
			neighbors.push(board[r][c-1]);
			neighbors.push(board[r+1][c-1]);
			neighbors.push(board[r+1][c]);
		}
		else{
			//piece in center
			//console.log("CENTER");
			neighbors.push(board[r][c-1]);
			neighbors.push(board[r][c+1]);
			neighbors.push(board[r+1][c-1]);
			neighbors.push(board[r+1][c]);
			neighbors.push(board[r+1][c+1]);
		}
	}
	else{
		//rows after first row
		//console.log("not in first row BUDDY");
		if( r > 0 && r < 3){
			if(c == 1){
				//console.log("center column");
				neighbors.push(board[r][c-1]);
				neighbors.push(board[r][c+1]);
				neighbors.push(board[r+1][c-1]);
				neighbors.push(board[r+1][c]);
				neighbors.push(board[r+1][c+1]);
				neighbors.push(board[r-1][c]);
				neighbors.push(board[r-1][c+1]);
				neighbors.push(board[r-1][c-1]);
			}
			else if (c == 0){
				//console.log("left most column");
				neighbors.push(board[r-1][c]);
				neighbors.push(board[r+1][c]);
				neighbors.push(board[r][c+1]);
				neighbors.push(board[r-1][c+1]);
				neighbors.push(board[r+1][c+1]);
			}
			else if (c == 2){
				//console.log("right most column");
				neighbors.push(board[r+1][c]);
				neighbors.push(board[r-1][c]);
				neighbors.push(board[r][c-1]);
				neighbors.push(board[r-1][c-1]);
				neighbors.push(board[r+1][c-1]);

			}
		}
		else{
			//last row
			if ( c == 1){
				neighbors.push(board[r][c-1]);
				neighbors.push(board[r][c+1]);
				neighbors.push(board[r-1][c+1]);
				neighbors.push(board[r-1][c-1]);
				neighbors.push(board[r-1][c]);
			}
			else if (c == 0){
				//left most
				neighbors.push(board[r][c+1]);
				neighbors.push(board[r-1][c+1]);
				neighbors.push(board[r-1][c]);
			}
			else if (c == 2){
				neighbors.push(board[r][c-1]);
				neighbors.push(board[r-1][c-1]);
				neighbors.push(board[r-1][c]);
			}
		}

		
	}

	return neighbors;
};


function neighbor_points(neighbor){
	var points = 0;
	for (var i=0; i<neighbor.length; i++){
		points += neighbor[i][0];
	}

	return points;
};

function get_enemies(){
	var enemies = [];
	board = get_board();

	for(var i=0; i<board.length; i++){
		for (var j=0; j<board[0].length; j++){	
			if (board[i][j][0] > 0){
				//console.log(board[i][j][0]);
				enemies.push(board[i][j]);
			}
		}
	}
	return enemies;
};

function get_players(){
	var players = [];
	board = get_board();

	for(var i=0; i<board.length; i++){
		for (var j=0; j<board[0].length; j++){	
			if (board[i][j][0] < 0){
				//console.log(board[i][j][0]);
				players.push(board[i][j]);
			}
		}
	}
	return players;
};

function filter_possible_moves(who, moves){
	//w is who we filtering the possible moves for
	// false for players, true for enemy

	var filter_moves = [];
	
	if (who){
		//for enemies
		for (var i=0; i<moves.length; i++){
			for (var x=0; x<board.length; x++){
				for (var y=0; y<board[0].length; y++){
					if (moves[i].id == board[x][y][2] && board[x][y][0] <= 0){
						filter_moves.push(board[x][y]);
					}
				}

			}
		}

	}
	else{
		//for players
		for (var i=0; i<moves.length; i++){
			for (var x=0; x<board.length; x++){
				for (var y=0; y<board[0].length; y++){
					if (moves[i].id == board[x][y][2] && board[x][y][0] >= 0){
						filter_moves.push(board[x][y]);
					}
				}

			}
		}
	}
	return filter_moves;
};

function minimax(){
	console.log("\nMINIMAX");

	var players;
	var filter_moves;
	
	//get all players on board
	players = get_players();
	console.log("players: ", players);

	//checking possible moves on the player end
	for (var i=0; i<players.length; i++){
		//for each player check its possible moves
		get_possible_moves(players[i]);
		filter_moves = filter_possible_moves(false, $possible_moves);
		console.log("player: ", players[i]);
		console.log("possible_moves: ", filter_moves);
		players_possible_moves.push([players[i], filter_moves]);

	}

	return;
	
};

function evaluate(){
	console.log("\nEVALUATE");
	
	var enemies;
	var filter_moves;

	//get all enemies on board
	enemies = get_enemies();
	console.log("enemies: ", enemies);

	//checking possible moves on the enemy end
	for(var i=0; i<enemies.length; i++){
		get_possible_moves(enemies[i]);
		filter_moves = filter_possible_moves(true, $possible_moves);
		console.log("enemy: ", enemies[i]);
		console.log("possible_moves: ", filter_moves);
		enemies_possible_moves.push([enemies[i], filter_moves]);
	}

	return;
};

function enemyAI(){
	console.log("############################################");
	console.log("enemyAI()");

	//calling mimimax();
	minimax();
	//calling evaluate on players_possible_moves[]
	evaluate();

	//resetting
	players_possible_moves = [];

	console.log("############################################");

	return;
};

function game(piece, current, location){
	/*
		Perform the game logistics.
	*/

	//console.log(player);

	if (piece[0].innerHTML){
		if (location){
			//Destination
			if (valid_piece){
				//if piece selected is valid
				for (var i=0; i< $possible_moves.get().length; i++){
					
					if (current[0].id == $possible_moves.get()[i].id){
						var user = current.children('img').attr('alt');

						if (piece.children('img').attr('alt').match(/^player_([a-z]*)$/)){
							//player is me
							if (user == undefined || user.match(/^enemy_([a-z]*)$/)){
								incorrect = false;
								//turn++;
								transition(piece, current);
							}
							else{
								incorrect = true;
								break;
							}
						}
						else if (piece.children('img').attr('alt').match(/^enemy_([a-z]*)$/)){
							//player is apponent
							if (user == undefined || user.match(/^player_([a-z]*)$/)){
								incorrect = false;
								//turn++;
								transition(piece, current);
							}
							else{
								incorrect = true;
								break;
							}
						}
						
						display(current);
						document.getElementById(current[0].id).innerHTML = "";
						$(current).append(piece[0].innerHTML);
						document.getElementById(last_position).innerHTML = "";
						incorrect = false;

						break;
					}
					else{
						incorrect = true;
					}
				}
			}
			else{
				//if the piece is invalid
				document.getElementById('result').innerHTML = "Choose a valid piece";
				turn -= 1;

			}

			if (incorrect){ 
				document.getElementById('result').innerHTML = "Wrong movement";
				turn -= 2;
			}
			else{
				check_win(user, current);
				$possible_moves = [];
			}
		}
		else{
			/*
			Origin: setting up possible moves
			*/
			get_possible_moves(current);
			if (!valid_piece){
				document.getElementById('result').innerHTML = "Invalid piece. Please select your own piece.";
				turn -= 1;
				valid_piece = true;
			}
		}
		//console.log("THE end of the game()" + player);
		turn++;
	}
};