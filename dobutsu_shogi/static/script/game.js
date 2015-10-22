var turn, winner, piece;
var last_position; //Save last position of the current piece
var $possible_moves; //Holds the possible moves

$(document).ready(function(){
	//When everything is ready place the pieces on board.
	$('#box_1').append($('<img />').attr('src', 'static/img/enemy_giraffe.png').attr('alt', 'enemy_giraffe'));
	$('#box_2').append($('<img />').attr('src', 'static/img/enemy_lion.png').attr('alt', 'enemy_lion'));
	$('#box_3').append($('<img />').attr('src', 'static/img/enemy_elephant.png').attr('alt', 'enemy_elephant'));
	$('#box_5').append($('<img />').attr('src', 'static/img/enemy_chick.png').attr('alt', 'enemy_chick'));

	$('#box_10').append($('<img />').attr('src', 'static/img/my_giraffe.png').attr('alt', 'my_giraffe'));
	$('#box_11').append($('<img />').attr('src', 'static/img/my_lion.png').attr('alt', 'my_lion'));
	$('#box_12').append($('<img />').attr('src', 'static/img/my_elephant.png').attr('alt', 'my_elephant'));
	$('#box_8').append($('<img />').attr('src', 'static/img/my_chick.png').attr('alt', 'my_chick'));

	turn = 0;
	$('#table').find('td').on('click', function(){
		console.log(turn);
		
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
		}
		turn++;

	});
});


function get_possible_moves(current){
	/*
		Obtain the possible moves for the current piece selected.
	*/

	var index = $('#'+last_position).index(), $tr= $('#'+last_position).parent();
	if (current.children('img').attr('alt') == 'enemy_elephant' || current.children('img').attr('alt') == 'my_elephant'){
		$possible_moves = $tr.prev().find('td').eq(index+1);
		$possible_moves = $possible_moves.add($tr.next().find('td').eq(index+1));
		$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index-1)); //find the td with the same index-1 in prev row
		$possible_moves = $possible_moves.add($tr.next().find('td').eq(index-1)); //find the td with the same index-1 in next row
	}
	else if (current.children('img').attr('alt') == 'enemy_lion' || current.children('img').attr('alt') == 'my_lion'){
		$possible_moves = $('#'+last_position).prev();
		$possible_moves = $possible_moves.add($('#'+last_position).next());
		$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index));
		$possible_moves = $possible_moves.add($tr.next().find('td').eq(index));
		$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index+1));
		$possible_moves = $possible_moves.add($tr.next().find('td').eq(index+1));
		$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index-1));
		$possible_moves = $possible_moves.add($tr.next().find('td').eq(index-1));
	}
	else if (current.children('img').attr('alt') == 'enemy_giraffe' || current.children('img').attr('alt') == 'my_giraffe'){
		$possible_moves = $('#'+last_position).prev();
		$possible_moves = $possible_moves.add($('#'+last_position).next());
		$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index));
		$possible_moves = $possible_moves.add($tr.next().find('td').eq(index));
	}
	else if (current.children('img').attr('alt') == 'enemy_chick'){
		$possible_moves = $tr.next().find('td').eq(index);
	}
	else if(current.children('img').attr('alt') == 'my_chick'){
		$possible_moves = $tr.prev().find('td').eq(index);
	}
};

function reset(){
	/*
		Resets the board/game.
	*/

	$('td').text('');
	$('#box_1').append($('<img />').attr('src', 'static/img/enemy_giraffe.png').attr('alt', 'giraffe'));
	$('#box_2').append($('<img />').attr('src', 'static/img/enemy_lion.png').attr('alt', 'lion'));
	$('#box_3').append($('<img />').attr('src', 'static/img/enemy_elephant.png').attr('alt', 'elephant'));
	$('#box_5').append($('<img />').attr('src', 'static/img/enemy_chick.png').attr('alt', 'enemy_chick'));

	$('#box_10').append($('<img />').attr('src', 'static/img/my_giraffe.png').attr('alt', 'giraffe'));
	$('#box_11').append($('<img />').attr('src', 'static/img/my_lion.png').attr('alt', 'lion'));
	$('#box_12').append($('<img />').attr('src', 'static/img/my_elephant.png').attr('alt', 'elephant'));
	$('#box_8').append($('<img />').attr('src', 'static/img/my_chick.png').attr('alt', 'my_chick'));
	
	document.getElementById('result').innerHTML = "";
};

function game(piece, current, location){
	/*
		Perform the game logistics.
	*/

	if ($(piece)[0].innerHTML){
		if (location){
			//Destination
			var incorrect = false;
			//console.log($possible_moves.get());

			for (var i=0; i< $possible_moves.get().length; i++){
				
				if (current[0].id == $possible_moves.get()[i].id){
					var player = current.children('img').attr('alt');

					if ($(piece).children('img').attr('alt').match(/^my_([a-z]*)$/)){
						//player is me
						console.log('me');
						console.log(current[0].id);
						console.log(last_position);
						if (player == undefined || player.match(/^enemy_([a-z]*)$/)){
							console.log('got enemy');
							incorrect = false;
							//turn++;
						}
						else{
							incorrect = true;
							break;
						}
					}
					else if ($(piece).children('img').attr('alt').match(/^enemy_([a-z]*)$/)){
						//player is apponent
						console.log('enemy');
						if (player == undefined || player.match(/^my_([a-z]*)$/)){
							console.log('got apponent');
							incorrect = false;
							//turn++;
						}
						else{
							incorrect = true;
							break;
						}
					}
					
					document.getElementById(current[0].id).innerHTML = "";
					$(current).append($(piece)[0].innerHTML);
					document.getElementById(last_position).innerHTML = "";
					incorrect = false;
					break;
				}
				else{
					incorrect = true;
				}
			}

			if (incorrect){ 
				document.getElementById('result').innerHTML = "Wrong move"; 
			}
			$possible_moves = "";
		}
		else{
			//Origin: setting up possible moves
			get_possible_moves(current);
		}

	}
};