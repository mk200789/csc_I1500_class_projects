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

var board = []; //holds current board position

var placing = false; //determine if the use is placing a piece from the bench to board or just playing
var piece_return; //holds the piece you will be returning


$(document).ready(function(){
	//When everything is ready place the pieces on board.
	$('#1').append($('<img />').attr('src', 'static/img/enemy_giraffe.png').attr('alt', 'enemy_giraffe').attr('class', 'enemy_giraffe'));
	$('#2').append($('<img />').attr('src', 'static/img/enemy_lion.png').attr('alt', 'enemy_lion').attr('class', 'enemy_lion'));
	$('#3').append($('<img />').attr('src', 'static/img/enemy_elephant.png').attr('alt', 'enemy_elephant').attr('class', 'enemy_elephant'));
	$('#5').append($('<img />').attr('src', 'static/img/enemy_chick.png').attr('alt', 'enemy_chick').attr('class', 'enemy_chick'));

	$('#10').append($('<img />').attr('src', 'static/img/my_elephant.png').attr('alt', 'player_elephant').attr('class', 'player_elephant'));
	$('#11').append($('<img />').attr('src', 'static/img/my_lion.png').attr('alt', 'player_lion').attr('class', 'player_lion'));
	$('#12').append($('<img />').attr('src', 'static/img/my_giraffe.png').attr('alt', 'player_giraffe').attr('class', 'player_giraffe'));
	$('#8').append($('<img />').attr('src', 'static/img/my_chick.png').attr('alt', 'player_chick').attr('class', 'player_chick'));

	document.getElementById('output').innerHTML = "######### GAME START ########\n";
	
	turn = 0;
	
	setTimeout(function(){
		enemyAI();
		player = true;
	}, 500);


	$('#table').find('td').on('click', function(){

		if (placing){
			//your clicking cause you're placing an animal back on board
			return_piece($(this)[0]);
		}
		else{
			//begin else
			if (!winner){
				if (player){
					if (turn%2 == 0){
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
						
						if (incorrect && valid_piece){
							//if the second move is incorrect the turn the current player is still at turm
							player = true;
						}
						else{
							if (!winner){
								setTimeout(function(){
									player = false;
									enemyAI();
									player = true;
									console.log(player);
								}, 10);
							}
							else{
								//winner do nothing finish
							}
						}
					}
				}
			}
			else{
				//there is a winner so output game.
				document.getElementById('output').innerHTML = document.getElementById('output').innerHTML+ "Game over. Click reset to play game again.\n";
			}

			//end of else
		}
	});
	
	$('.player_bench').find('td').on('click', function(){
		if (!placing){
			piece_return = $(this)[0].innerHTML;
			placing = true;
			last_position = $(this)[0].id;
		}
	});
});

function check_bench(){
	var bench = $('.opponent_bench').find('td');
	for (var i=0; i<bench.length; i++){
		if (bench[i].children.length > 0 ){
			//there are players on bench that can be place back on board
			return true;
		}
	}
	return false;
};

function name_value(piece1){
	//returns the weight value for the given piece
	var values = {'enemy_chick': 1 ,'enemy_hen': 1, 'enemy_giraffe': 2,'enemy_elephant': 2};
	
	return values[piece1];
};

function assignment(){
	//looking for which piece to return back to board
	//the chosen piece will be the one with most weight
	get_board();
	var chosen =[];
	
	var bench = $('.opponent_bench').find('td');

	for (var i = 0; i< bench.length; i++){
		if (bench[i].children.length > 0){
			console.log(bench[i].id);
			var t = name_value(bench[i].children[0].alt);
			if (i==0){
				chosen[0] = t;
				chosen[1] = bench[i].children[0].alt;
				chosen[2] = bench[i].children[0].outerHTML;
				chosen[3] = bench[i].id;
			}
			else{
				if(t > chosen[0]){
					chosen[0] = t;
					chosen[1] = bench[i].children[0].alt;
					chosen[2] = bench[i].children[0].outerHTML;
					chosen[3] = bench[i].id;
				}
			}
		}
	}
	return chosen;
}

function return_piece(p){
	console.log(player);
	// returning piece back on the board
	if (player){
		$("#"+p.id).append(piece_return);
		piece_return ='';
		placing =  false;

		//console.log("return_piece: ", p.children[0].alt);
		if((p.children[0].alt).match(/hen$/)){
			//hen will be changed to a chick
			if (player){
				//if player, change to player chick
				$("#"+p.id).text('');
				$("#"+p.id).append($('<img />').attr('src', 'static/img/my_chick.png').attr('alt', 'player_chick').attr('class', 'player_chick'));
			}
			else{
				$("#"+p.id).text('');
				$("#"+p.id).append($('<img />').attr('src', 'static/img/enemy_chick.png').attr('alt', 'enemy_chick').attr('class', 'enemy_chick'));	
			}
		}
		else{
			document.getElementById(p.id).children[0].style.transform = "rotate(180deg) scale(0.8, 0.8)";
		}

		//console.log(document.getElementById(p.id).innerHTML);

		document.getElementById(last_position).innerHTML = "";
		last_position = "";
		setTimeout(function(){
			player = false;
			enemyAI();
			player = true;
		}, 10);	
	}
	else{
		//enemy ai placing piece back on board
		console.log("PLACED");
		$('#'+p[0][2]).append(p[1][2]);
		document.getElementById(p[0][2]).children[0].style.transform = "rotate(180deg) scale(0.8, 0.8)";
		document.getElementById(p[1][3]).children[0].outerHTML = "";

	}
	return;
};


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
		else if(current.children('img').attr('alt') == 'player_hen'){
			$possible_moves = $('#'+last_position).prev(); // left
			$possible_moves = $possible_moves.add($('#'+last_position).next()); //right
			$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index)); //back
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index)); //front
			$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index+1)); //back right
			$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index-1)); //bacl left
			
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
		else if (current[1] == 'enemy_lion' || current[1] == 'player_lion'){
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
		else if(current[1] == 'enemy_hen'){
			$possible_moves = $('#'+last_position).prev(); // left
			$possible_moves = $possible_moves.add($('#'+last_position).next()); //right
			$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index)); //back
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index)); //front
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index+1)); //front right
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index-1)); //front left
			
		}

		else if (current[1] == 'player_elephant'){
			//console.log('player_elephant');
			$possible_moves = $tr.prev().find('td').eq(index+1);
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index+1));
			$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index-1)); //find the td with the same index-1 in prev row
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index-1)); //find the td with the same index-1 in next row
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
		else if(current[1] == 'player_hen'){
			$possible_moves = $('#'+last_position).prev(); // left
			$possible_moves = $possible_moves.add($('#'+last_position).next()); //right
			$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index)); //back
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index)); //front
			$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index+1)); //back right
			$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index-1)); //bacl left
			
		}
		valid_piece = true;
	}
};


function display(current){
	/*
		Display moves to output.
	*/
	
	var message, who;
	var test;

	if (player){
		who = "Player";
		//document.getElementById('player').innerHTML = document.getElementById('player').innerHTML + current[0].innerHTML;
		if (current.children('img').attr('alt')){
			insert_bench(current[0].innerHTML, 'player_bench');
		}
		else{}
		
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
			//document.getElementById('opponent').innerHTML = document.getElementById('opponent').innerHTML + current[1];
			insert_bench(current[1], 'opponent_bench');

		}
		//document.getElementById('opponent').innerHTML = document.getElementById('opponent').innerHTML + current[1];
		//console.log("piece", piece);

		if (current[1]){
			message = who + " has moved from Cell " + piece[2] + " to Cell " + current[0][2] +  " and captured " + current[0][1];
		}
		else{

			message = who + " has moved from Cell " + piece[2] + " to cell " + current[0][2];
		}


	}

	document.getElementById('output').innerHTML = document.getElementById('output').innerHTML+message+"\n";

};
function insert_bench(piece, bench){


	for (var i=0; i<document.getElementById(bench).rows.length; i++){
		
		if (document.getElementById(bench).rows[i].cells[0].innerHTML == ''){
			document.getElementById(bench).rows[i].cells[0].innerHTML = piece;

			var playeralt = document.getElementById(bench).rows[i].cells[0].children[0].alt;
			var playerclassname = document.getElementById(bench).rows[i].cells[0].children[0].className;
			if (bench == "opponent_bench"){
				//console.log("opponent_bench");
				playeralt = playeralt.replace("player", "enemy");
				playerclassname = playerclassname.replace("player", "enemy");
			}
			else if (bench == "player_bench"){
				//console.log("player_bench");
				playeralt = playeralt.replace("enemy", "player");
				playerclassname = playerclassname.replace("enemy", "player");
			}

			document.getElementById(bench).rows[i].cells[0].children[0].alt = playeralt;
			document.getElementById(bench).rows[i].cells[0].children[0].className = playerclassname;
			document.getElementById(bench).rows[i].cells[0].children[0].style.transform = "rotate(180deg) scale(0.5, 0.5)"; 
			//console.log(document.getElementById(bench).rows[i].cells[0].children[0].alt);
			break;
		}
	}


	return;
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

	$('#12').append($('<img />').attr('src', 'static/img/my_giraffe.png').attr('alt', 'player_giraffe').attr('class', 'player_giraffe'));
	$('#11').append($('<img />').attr('src', 'static/img/my_lion.png').attr('alt', 'player_lion').attr('class', 'player_lion'));
	$('#10').append($('<img />').attr('src', 'static/img/my_elephant.png').attr('alt', 'player_elephant').attr('class', 'player_elephant'));
	$('#8').append($('<img />').attr('src', 'static/img/my_chick.png').attr('alt', 'player_chick').attr('class', 'player_chick'));
	
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
	board = get_board();

	//after reset enemyAI starts
	enemyAI();
};

function check_win(user, current){
	/*
		current: location moving to
		user: whose spot you took over

		Checks if there's any winner.
		If there's a winner, winner will be displayed in output textarea, and set winner to true
		to stop further plays until game is reset.

		Two ways of winning:
			1. Capturing opponents/player's Lion.
			2. Advancing one's ow Lion into the farthest zone.
	*/

	if (player){
		//is player
		if (user){
			//someone currently occupied this spot
			if (user.match(/lion$/)){
				//win: if this spot had a lion
				document.getElementById('output').innerHTML = document.getElementById('output').innerHTML + "Player wins!\n";
				winner = true;
			}
		}
		else{
			//win: no one in this spot, but if your lion in this spot which is on the enemy starting row
			if (current[0].id == 1 || current[0].id == 2 || current[0].id == 3){
				//check if it's lion
				if (document.getElementById(current[0].id).children[0].alt == 'player_lion'){
					document.getElementById('output').innerHTML = document.getElementById('output').innerHTML + "Player wins!\n";
					winner = true;
				}
			}
		}
	}else{
		//is enemy
		if (user[1].match(/lion$/)){
			document.getElementById('output').innerHTML = document.getElementById('output').innerHTML + "Enemy wins!\n";
			winner = true;
		}
		else {
			if (user[2] == 10 || user[2] == 11 || user[2] == 12){
				//check if it's a lion player
				if (current[1] == "enemy_lion"){
					document.getElementById('output').innerHTML = document.getElementById('output').innerHTML + "Enemy wins!\n";
					winner = true;
				}
			}

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
			//console.log('change this chick to hen! player');
			document.getElementsByClassName('player_chick')[0].style.transform = "";
			document.getElementsByClassName('player_chick')[0].src ='static/img/my_hen.png';
			document.getElementsByClassName('player_chick')[0].alt = 'player_hen';
			document.getElementsByClassName('player_chick')[0].class = 'player_hen';
		}
	}
	else if (piece.children('img').attr('alt').match(/^enemy_chick$/)){
		if (current.parent()[0].rowIndex == 3)
		{
			//console.log('change this chick to hen!');
			document.getElementsByClassName('enemy_chick')[0].style.transform = "";
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
					else if (($(this).children('img').attr('alt')).match(/^enemy_chick/)){
						thisRow.push([1, 'enemy_chick', $(this)[0].id]);
					}
					else if (($(this).children('img').attr('alt')).match(/^enemy_hen/)){
						thisRow.push([5, 'enemy_hen', $(this)[0].id]);
					}
					else if (($(this).children('img').attr('alt')).match(/^enemy_([a-z]*)$/)){
						//console.log(($(this).children('img').attr('alt')).match(/^enemy_([a-z]*)$/));
						//console.log(($(this).children('img').attr('alt')).match(/^enemy_([a-z]*)$/)[0]);
						thisRow.push([2, ($(this).children('img').attr('alt')).match(/^enemy_([a-z]*)$/)[0], $(this)[0].id]);
					}
					else if (($(this).children('img').attr('alt')).match(/^player_chick/)){
						//console.log(($(this).children('img').attr('alt')).match(/^my_([a-z]*)$/));
						thisRow.push([-1, 'player_chick' , $(this)[0].id]);
					}
					else if (($(this).children('img').attr('alt')).match(/^player_hen/)){
						//console.log(($(this).children('img').attr('alt')).match(/^my_([a-z]*)$/));
						thisRow.push([-5, 'player_hen' , $(this)[0].id]);
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


	//return board;
	return;
};


function convert_to_boardval(piece){
	var r, c;
	//console.log(piece);
	if (piece > 3){
		if (piece % 3 == 0){
			c = 2;
			r = (piece /3) - 1;
		}
		else{
			c = (piece % 3) -1;
			r = Math.ceil(piece/3) - 1;
		}
	}
	else{
		r = 0;
		c = piece -1;
	}

	return [r, c];
};


function get_neighbor(piece, board1){
	/*
		Returns the neighboring pieces.
	*/

	var neighbors = [];
	var board_values = [];
	var r, c;

	board_values= convert_to_boardval(piece);

	r = board_values[0];
	c = board_values[1];

	//console.log("row, col: "+ r +','+c);

	if (r == 0){
		//if piece is in the first row, check only neighbors afront and side;
		if (c == 0){
			//piece in corner left
			neighbors.push(board1[r][c+1]);
			neighbors.push(board1[r+1][c]);
			neighbors.push(board1[r+1][c+1]);
		}
		else if ( c == 2){
			//piece in corner right
			neighbors.push(board1[r][c-1]);
			neighbors.push(board1[r+1][c-1]);
			neighbors.push(board1[r+1][c]);
		}
		else{
			//piece in center
			neighbors.push(board1[r][c-1]);
			neighbors.push(board1[r][c+1]);
			neighbors.push(board1[r+1][c-1]);
			neighbors.push(board1[r+1][c]);
			neighbors.push(board1[r+1][c+1]);
		}
	}
	else{
		//rows after first row
		if( r > 0 && r < 3){
			if(c == 1){
				neighbors.push(board1[r][c-1]);
				neighbors.push(board1[r][c+1]);
				neighbors.push(board1[r+1][c-1]);
				neighbors.push(board1[r+1][c]);
				neighbors.push(board1[r+1][c+1]);
				neighbors.push(board1[r-1][c]);
				neighbors.push(board1[r-1][c+1]);
				neighbors.push(board1[r-1][c-1]);
			}
			else if (c == 0){
				neighbors.push(board1[r-1][c]);
				neighbors.push(board1[r+1][c]);
				neighbors.push(board1[r][c+1]);
				neighbors.push(board1[r-1][c+1]);
				neighbors.push(board1[r+1][c+1]);
			}
			else if (c == 2){
				neighbors.push(board1[r+1][c]);
				neighbors.push(board1[r-1][c]);
				neighbors.push(board1[r][c-1]);
				neighbors.push(board1[r-1][c-1]);
				neighbors.push(board1[r+1][c-1]);

			}
		}
		else{
			//last row
			if ( c == 1){
				neighbors.push(board1[r][c-1]);
				neighbors.push(board1[r][c+1]);
				neighbors.push(board1[r-1][c+1]);
				neighbors.push(board1[r-1][c-1]);
				neighbors.push(board1[r-1][c]);
			}
			else if (c == 0){
				//left most
				neighbors.push(board1[r][c+1]);
				neighbors.push(board1[r-1][c+1]);
				neighbors.push(board1[r-1][c]);
			}
			else if (c == 2){
				neighbors.push(board1[r][c-1]);
				neighbors.push(board1[r-1][c-1]);
				neighbors.push(board1[r-1][c]);
			}
		}

		
	}

	return neighbors;
};

function get_enemies(board1){
	var enemies = [];

	for(var i=0; i<board1.length; i++){
		for (var j=0; j<board1[0].length; j++){	
			if (board1[i][j][0] > 0){
				//console.log(board[i][j][0]);
				enemies.push(board1[i][j]);
			}
		}
	}

	return enemies;
};

function get_players(board1){
	var players = [];

	for(var i=0; i<board1.length; i++){
		for (var j=0; j<board1[0].length; j++){	
			if (board1[i][j][0] < 0){
				//console.log(board[i][j][0]);
				players.push(board1[i][j]);
			}
		}
	}

	return players;
};

function filter_possible_moves(who, moves, board1){
	//w is who we filtering the possible moves for
	// false for players, true for enemy

	var filter_moves = [];

	if (who){
		//for enemies
		for (var i=0; i<moves.length; i++){
			for (var x=0; x<board1.length; x++){
				for (var y=0; y<board1[0].length; y++){
					if (moves[i].id == board1[x][y][2] && board1[x][y][0] <= 0){
						filter_moves.push(board1[x][y]);
					}
				}

			}
		}

	}
	else{
		//for players
		for (var i=0; i<moves.length; i++){
			for (var x=0; x<board1.length; x++){
				for (var y=0; y<board1[0].length; y++){
					if (moves[i].id == board1[x][y][2] && board1[x][y][0] >= 0){
						filter_moves.push(board1[x][y]);
					}
				}

			}
		}
	}
	return filter_moves;
};

function possible_board_state(moves, board1){
	var moveFrom, moveTo;
	//get copy of the current board
	var newboard = $.extend(true, [], board1);

	moveFrom = convert_to_boardval(moves[0][2]);
	moveTo = convert_to_boardval(moves[1][2]);
	
	newboard[moveTo[0]][moveTo[1]] = [moves[0][0], moves[0][1], moves[1][2]];
	newboard[moveFrom[0]][moveFrom[1]] = [0, '', moves[0][2]];

	return newboard;
};

function get_moves(player1, board1){
	var player_moves = [];
	var players;

	if (player1){
		players = get_players(board1);
	}
	else{
		players = get_enemies(board1);
	}

	for (var i=0; i<players.length; i++){
		get_possible_moves(players[i]);
		//filter out to only include legal moves
		player_moves.push([players[i], filter_possible_moves(!player1, $possible_moves, board1)]);
	}

	return player_moves;	
};


function minimax(depth, player1, board1){
	//minimax called on that depth of the tree for the player of that depth
	var  mm, move; //value for maximizing or minimizing , move holds the next best move
	var temp; //holds the return value of minimax calls
	var players, enemies; //get all players and enemies on board
	var enemy_moves = [];
	var player_moves =[]; //player/enemy possible moves
	var possible_board; //holds the possible board if a move was made

	move = -1;
	
	if (player1){
		//is player, then give positive value for minimizing
		//mm = 500;
		mm = 500;
	}
	else{
		//is enemy, then give negative value for maximizing
		//mm = -500;
		mm = -500;
	}

	player_moves = get_moves(player1, board1);

	if (depth > 0){
		for (var i=0; i<player_moves.length; i++){
			var playerPiece = player_moves[i][0];
			var playerMoves = player_moves[i][1];

			for (var j=0; j<playerMoves.length; j++){
				possible_board = possible_board_state([playerPiece, playerMoves[j]], board1);

				if (player1){
					//player
					temp = minimax(depth-1, false, possible_board);

					if(temp[0] < mm){
						mm = temp[0];
						move = [playerPiece, playerMoves[j]];
					}
				}
				else{

					temp = minimax(depth-1, true, possible_board);

					if(temp[0] > mm){
						mm = temp[0];
						move = [playerPiece, playerMoves[j]];
					}
				}
			}
		}

	}
	else if (depth == 0){
		//depth is 0
		mm = evaluate(board1);

	}

	return [mm, move];
};


	var danger = 0;
	var enemylionDanger = false;
	var playerLionNeighbor = false;
function evaluate(board1){
	//console.log("\nEVALUATE");
	
	var piece_on_board = {'enemy_lion': 0, 'enemy_chick': 0, 'enemy_elephant': 0, 'enemy_giraffe': 0, 'player_hen': 0,
						  'player_lion': 0, 'player_chick': 0, 'player_elephant': 0, 'player_giraffe': 0, 'enemy_hen': 0}; //list of which pieces are on board
	/*
	holds the scoring of the board base on possible movements, where each piece assign different values , 
	if all pieces on board score will be 0.
	enemy scores are positive, and player scores are positive
	*/
	var board_score = 0; 
	var total_no_moves = 0;

	//vars check if lion in danger
	var enemylionneighbor = 0;
	danger = 0;
	enemylionDanger = false;
	playerLionNeighbor = false;

	//get possible moves for players and enemies
	var enemy_moves = get_moves(false ,board1);
	var player_moves = get_moves(true, board1);

	//check which pieces on board
	for(var i=0; i<board1.length; i++){
		for(var j=0; j<board1[0].length; j++){
			if (board1[i][j][0] !=  0){
				piece_on_board[board1[i][j][1]] += board1[i][j][0];
				//get board score
				board_score += board[i][j][0];
			}
		}
	}

	for(var i=0; i<board1.length; i++){
		for(var j=0; j<board1[0].length; j++){
			//get enemy lion neighbors
			if (board1[i][j][1] ==  'enemy_lion'){
				enemylionneighbor = get_neighbor(board1[i][j][2], board1);
				break;
			}
		}
	}
	
	//go through enemy lion neighbor if lion is in danger
	for(var i=0; i<enemylionneighbor.length; i++){
		if (enemylionneighbor[i][0] < 0){
			enemylionDanger = true;
			break;
		}
	}

	for(var i=0; i<enemylionneighbor.length; i++){
		if (enemylionneighbor[i][1] == 'player_lion'){
			playerLionNeighbor = true;
			break;
		}
	}
	
	//there is danger to enemy lion and player lion is nearby, set danger to  a large neg #
	if (enemylionDanger){
		if (playerLionNeighbor){
			danger = Number.NEGATIVE_INFINITY;	
		}
		else{
			danger = 0;
		}
		
	}

	return player_moves.length+ enemy_moves.length + board_score + danger;
};

function select_location(t, board1){

	for(var i=0; i<board1.length; i++){
		for(var j=0; j<board1[0].length; j++){
			if (board1[i][j][1] == 'player_lion'){
				var lion_loc = convert_to_boardval(board1[i][j][2]);
				var spot = get_neighbor(board1[i][j][2], board1);
				for (var s=0; s<spot.length; s++){
					if (spot[s][0] == 0){
						//empty location
						if (t == 'enemy_chick'){
							//check front is available to put
							var convert_spot = convert_to_boardval(spot[s][2]);
							if (convert_spot[1] == lion_loc[1]){
								return spot[s];
							}
							else{
								var select_spot = spot[s];
							}
						}
						else{
							var select_spot = spot[s];
						}
					}
				}
			}
		}
	}
	return select_spot;
};


function enemyAI(){
	var move, enemy_piece, player_piece;
	var bench = check_bench(); //holds value of which piece on bench
	var enemylionDanger = false;
	var enemylionneighbor =0;
	
	get_board();

	
	for(var i=0; i<board.length; i++){
		for(var j=0; j<board[0].length; j++){
			//get enemy lion neighbors
			if (board[i][j][1] ==  'enemy_lion'){
				enemylionneighbor = get_neighbor(board[i][j][2], board);
				break;
			}
		}
	}
	var space = false;
	
	//go through enemy lion neighbor if lion is in danger
	for(var i=0; i<enemylionneighbor.length; i++){
		if (enemylionneighbor[i][0] == 0){
			space = true;
			break;
		}
	}

	console.log(enemylionDanger);
	//see if any piece to place back on board 
	//and also that the enemy lion isn't threatened
	if (bench && space){ //&& !enemylionDanger){
		get_board();
		//something in bench
		setTimeout(function(){
			console.log("bench");
			var chosen = assignment();
			player = false;
			console.log(chosen);
			
			//find spot to place it
			var selected = select_location(chosen[1], board);
			console.log(player);
			console.log(selected);

			return_piece([selected, chosen]);
			player = true;

		}, 300);

	}
	else{
		//calling mimimax();
		var board1 = $.extend(true, [], board);
		move = minimax(5, player, board1);
		console.log(move);
		console.log("danger: ", danger);
		console.log("enemylionDanger: ", enemylionDanger);
		console.log("playerLionNeighbor: ", playerLionNeighbor);

		get_board();

		//moving
		enemy_piece = document.getElementById(move[1][0][2]).innerHTML;
		player_piece = document.getElementById(move[1][1][2]).innerHTML;
		
		piece = move[1][0];
		display([move[1][0], player_piece]);
		
		document.getElementById(move[1][1][2]).innerHTML = "";
		$('#'+move[1][1][2]).append(enemy_piece);
		last_position = piece[2];
		document.getElementById(last_position).innerHTML = "";
		check_win(move[1][1], move[1][0]);
		player = true;
	
	}

	//console.log("move: ", move);

	//console.log("############################################");

	return;
};

function game(piece, current, location){
	/*
		Perform the game logistics.
	*/

	if (piece[0].innerHTML){
		if (location){
			//Destination
			if (valid_piece){
				//if piece selected is valid
				for (var i=0; i< $possible_moves.get().length; i++){
					
					if (current[0].id == $possible_moves.get()[i].id){
						var user = current.children('img').attr('alt');

						if (user == undefined || user.match(/^enemy_([a-z]*)$/)){
							//console.log("incorrect is false");
							incorrect = false;
							//turn++;
							transition(piece, current);
						}
						else{
							//console.log("incorrect is true");
							incorrect = true;
							break;
						}
						
						display(current);
						document.getElementById(current[0].id).innerHTML = "";
						$(current).append(piece[0].innerHTML);
						document.getElementById(last_position).innerHTML = "";
						incorrect = false;

						break;
					}
					else{
						//console.log("incorrect");
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
			//$possible_moves = [];
			get_possible_moves(current);

			if (!valid_piece){
				document.getElementById('result').innerHTML = "Invalid piece. Please select your own piece.";
				turn -= 1;
				valid_piece = true;
			}
		}

		turn++;
	};
};

function neighbor_exist(player_moves, board1){
	for (var i=0; i<player_moves.length; i++){
		if (player_moves[i][1]){
			for (var j=0; j<player_moves[i][1].length; j++){
				var n = get_neighbor(player_moves[i][1][j][2], board1);
				//check neighbor if player lion there
				for (var k=0; k<n.length; k++){
					for (var l=0; l<n[0].length; l++){
						if (n[k][l] == 'player_lion'){
							//console.log("yes");
							return true
						}
					}
				}
			}
		}
	}

	return false;
};