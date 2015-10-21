var turn;
var winner;
var piece;
var last_position;
var $possible_moves;

$(document).ready(function(){
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
		//console.log('click');
		
		if (turn%2 == 0){
			document.getElementById('result').innerHTML = "";
			piece = $(this)[0].innerHTML;
			last_position= $(this)[0].id;
			game(piece, $(this), 0);
		}
		else if (turn%2 == 1){
			//$(this).append(piece);
			//document.getElementById(last_position).innerHTML = "";
			game(piece, $(this), 1);
		}
		else{
			current_image = '';
			last_position = '';
			//Ai's turn
		}
		turn++;

	});
});

function reset(){
	$('td').text('');
	$('#box_1').append($('<img />').attr('src', 'static/img/enemy_giraffe.png').attr('alt', 'giraffe'));
	$('#box_2').append($('<img />').attr('src', 'static/img/enemy_lion.png').attr('alt', 'lion'));
	$('#box_3').append($('<img />').attr('src', 'static/img/enemy_elephant.png').attr('alt', 'elephant'));
	$('#box_5').append($('<img />').attr('src', 'static/img/enemy_chick.png').attr('alt', 'enemy_chick'));

	$('#box_10').append($('<img />').attr('src', 'static/img/my_giraffe.png').attr('alt', 'giraffe'));
	$('#box_11').append($('<img />').attr('src', 'static/img/my_lion.png').attr('alt', 'lion'));
	$('#box_12').append($('<img />').attr('src', 'static/img/my_elephant.png').attr('alt', 'elephant'));
	$('#box_8').append($('<img />').attr('src', 'static/img/my_chick.png').attr('alt', 'my_chick'));
	
	/*
	document.getElementById('box_1').innerHTML = "<img src=\"static/img/enemy_giraffe.png\" alt=\"giraffe\">";
	*/
	document.getElementById('result').innerHTML = "";
};

function game(piece, turn, location){
	if (piece){
		if (location){
			//to
			var incorrect = false;
			//console.log($possible_moves.get());

			for (var i=0; i< $possible_moves.get().length; i++){
				
				if (turn[0].id == $possible_moves.get()[i].id){

					if (turn.children('img').attr('alt')){
						
						if ((turn.children('img').attr('alt')).match(/^enemy_([a-z]+)$/)){
							incorrect = false;
						}
						else{
							incorrect = true;
							break;
						}
					}
					
					document.getElementById(turn[0].id).innerHTML = "";
					$(turn).append(piece);
					document.getElementById(last_position).innerHTML = "";
					incorrect = false;
					break;

					/*
					document.getElementById(turn[0].id).innerHTML = "";
					$(turn).append(piece);
					document.getElementById(last_position).innerHTML = "";
					incorrect = false;
					break;*/
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
			//from
			var index = $('#'+last_position).index(), $tr= $('#'+last_position).parent();
			if (turn.children('img').attr('alt') == 'enemy_elephant' || turn.children('img').attr('alt') == 'my_elephant'){
				$possible_moves = $tr.prev().find('td').eq(index+1);
				$possible_moves = $possible_moves.add($tr.next().find('td').eq(index+1));
				$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index-1)); //find the td with the same index-1 in prev row
				$possible_moves = $possible_moves.add($tr.next().find('td').eq(index-1)); //find the td with the same index-1 in next row
				//console.log($possible_moves.get());
			}
			else if (turn.children('img').attr('alt') == 'enemy_lion' || turn.children('img').attr('alt') == 'my_lion'){
				$possible_moves = $('#'+last_position).prev();
				$possible_moves = $possible_moves.add($('#'+last_position).next());
				$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index));
				$possible_moves = $possible_moves.add($tr.next().find('td').eq(index));
				$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index+1));
				$possible_moves = $possible_moves.add($tr.next().find('td').eq(index+1));
				$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index-1));
				$possible_moves = $possible_moves.add($tr.next().find('td').eq(index-1));
				//console.log($possible_moves.get());
			}
			else if (turn.children('img').attr('alt') == 'enemy_giraffe' || turn.children('img').attr('alt') == 'my_giraffe'){
				$possible_moves = $('#'+last_position).prev();
				$possible_moves = $possible_moves.add($('#'+last_position).next());
				$possible_moves = $possible_moves.add($tr.prev().find('td').eq(index));
				$possible_moves = $possible_moves.add($tr.next().find('td').eq(index));
				//console.log($possible_moves.get());
			}
			else if (turn.children('img').attr('alt') == 'enemy_chick'){
				$possible_moves = $tr.next().find('td').eq(index);
			}
			else if(turn.children('img').attr('alt') == 'my_chick'){
				$possible_moves = $tr.prev().find('td').eq(index);
			}
		}

	}
};