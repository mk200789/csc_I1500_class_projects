var turn, piece;
var winner = false;
var last_position; //Save last position of the current piece
var $possible_moves =[]; //Holds the possible moves
var player = true;
var incorrect = false; //checks if the current piece has right move
var valid_piece = true; //check if the current piece is valid;

$(document).ready(function(){
	//When everything is ready place the pieces on board.
	$('#1').append($('<img />').attr('src', 'static/img/enemy_giraffe.png').attr('alt', 'enemy_giraffe').attr('class', 'enemy_giraffe'));
	$('#2').append($('<img />').attr('src', 'static/img/enemy_lion.png').attr('alt', 'enemy_lion').attr('class', 'enemy_lion'));
	$('#3').append($('<img />').attr('src', 'static/img/enemy_elephant.png').attr('alt', 'enemy_elephant').attr('class', 'enemy_elephant'));
	$('#5').append($('<img />').attr('src', 'static/img/enemy_chick.png').attr('alt', 'enemy_chick').attr('class', 'enemy_chick'));

	$('#10').append($('<img />').attr('src', 'static/img/my_giraffe.png').attr('alt', 'my_giraffe').attr('class', 'my_giraffe'));
	$('#11').append($('<img />').attr('src', 'static/img/my_lion.png').attr('alt', 'my_lion').attr('class', 'my_lion'));
	$('#12').append($('<img />').attr('src', 'static/img/my_elephant.png').attr('alt', 'my_elephant').attr('class', 'my_elephant'));
	$('#8').append($('<img />').attr('src', 'static/img/my_chick.png').attr('alt', 'my_chick').attr('class', 'my_chick'));

	document.getElementById('output').innerHTML = "######### GAME START ########\n";

	turn = 0;

	$('#table').find('td').on('click', function(){
		console.log(turn);
		console.log(player);
		if (!winner){
			//if there's no winner yet the game continues
			if (turn%2 == 0){
				//Handles the first move: selecting your piece
				document.getElementById('result').innerHTML = "";
				piece = $(this);
				last_position= $(this)[0].id;
				game(piece, $(this), 0);
			}
			else if (turn%2 == 1){
				//Handles the second move: Destination
				game(piece, $(this), 1);
				//console.log(incorrect);
				if (!incorrect && valid_piece){
					//if the second move is incorrect the turn the current player is still at turm
					player = !player;
				}
			}
		}
		else{
			document.getElementById('output').innerHTML = document.getElementById('output').innerHTML+ "Game over. Click reset to play game again.\n";
		}
		//turn++;
		//console.log(turn);

	});
});


function get_possible_moves(current){
	/*
		Obtain the possible moves for the current piece selected.
	*/
	
	var index = $('#'+last_position).index(), $tr= $('#'+last_position).parent();
	if (player){
		//player
		if (current.children('img').attr('alt') == 'my_elephant'){
			$possible_moves = $tr.prev().find('td').eq(index+1);
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index+1));
			$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index-1)); //find the td with the same index-1 in prev row
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index-1)); //find the td with the same index-1 in next row
		}
		else if (current.children('img').attr('alt') == 'my_lion'){
			$possible_moves = $('#'+last_position).prev();
			$possible_moves = $possible_moves.add($('#'+last_position).next());
			$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index));
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index));
			$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index+1));
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index+1));
			$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index-1));
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index-1));
		}
		else if (current.children('img').attr('alt') == 'my_giraffe'){
			$possible_moves = $('#'+last_position).prev();
			$possible_moves = $possible_moves.add($('#'+last_position).next());
			$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index));
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index));
		}
		else if(current.children('img').attr('alt') == 'my_chick'){
			$possible_moves = $tr.prev().find('td').eq(index);
		}
		else{
			//console.log('invalid piece');
			valid_piece = false;
		}
	}
	else{
		//opponent
		if (current.children('img').attr('alt') == 'enemy_elephant'){
			$possible_moves = $tr.prev().find('td').eq(index+1);
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index+1));
			$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index-1)); //find the td with the same index-1 in prev row
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index-1)); //find the td with the same index-1 in next row
		}
		else if (current.children('img').attr('alt') == 'enemy_lion'){
			$possible_moves = $('#'+last_position).prev();
			$possible_moves = $possible_moves.add($('#'+last_position).next());
			$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index));
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index));
			$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index+1));
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index+1));
			$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index-1));
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index-1));
		}
		else if (current.children('img').attr('alt') == 'enemy_giraffe'){
			$possible_moves = $('#'+last_position).prev();
			$possible_moves = $possible_moves.add($('#'+last_position).next());
			$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index));
			$possible_moves = $possible_moves.add($tr.next().find('td').eq(index));
		}
		else if (current.children('img').attr('alt') == 'enemy_chick'){
			$possible_moves = $tr.next().find('td').eq(index);
		}
		else{
			//console.log('invalid piece');
			valid_piece = false;
		}	
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
	}
	else{
		who = "Opponent";
	}

	if (current.children('img').attr('alt')){
		//message = $(piece).children('img').attr('alt') + " has moved from Cell " + piece[0].id + " to  Cell " + current[0].id + " and captured " + current.children('img').attr('alt');
		message = who + " has moved from Cell " + piece[0].id + " to  Cell " + current[0].id + " and captured " + current.children('img').attr('alt');
	}
	else{
		//message = $(piece).children('img').attr('alt') + " has moved from Cell " + piece[0].id + " to  Cell " + current[0].id;
		message = who + " has moved from Cell " + piece[0].id + " to  Cell " + current[0].id;
	}

	document.getElementById('output').innerHTML = document.getElementById('output').innerHTML+message+"\n";
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
	turn = 0;
	$possible_moves = [];
	piece = [];
	player = true;
	valid_piece = true;
	winner = false;
};

function check_win(user){
	/*
		Checks if there's any winner.
		If there's a winner, winner will be displayed in output textarea, and set winner to true
		to stop further plays until game is reset.
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
};

function transition(piece, current){
	/*
		If chick has reached the opponents/player the last/first row respectively,
		the chick will transition to a hen.
	*/
	var id = current[0].id;

	if (piece.children('img').attr('alt').match(/^my_chick$/)){
		if (current.parent()[0].rowIndex == 0)
		{
			console.log('change this chick to hen!');
			document.getElementsByClassName('my_chick')[0].src ='static/img/my_hen.png';
			document.getElementsByClassName('my_chick')[0].alt = 'my_hen';
			document.getElementsByClassName('my_chick')[0].class = 'my_hen';
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

						if (piece.children('img').attr('alt').match(/^my_([a-z]*)$/)){
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
							if (user == undefined || user.match(/^my_([a-z]*)$/)){
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
				check_win(user);
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
		turn++;
	}
};