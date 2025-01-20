var context;
var shape = null
var monster = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var interval2;
var interval3;
var recent = null ;
var rejection = 5 ;
var monsters_counter = 1 ;
var monsters 
var dir = 0 //direction
var t = 0 
var stack  ;
var explored  ;
var solution ;
var arr
var index = 0
var dynamic_p = null;
var eat = false
var balls 
var time
var food_remain = 50;
var get_health = false
var get_clock = false
var neighbor
var random
var eaten = 0
var intro = new Audio('./sounds/intro.mp3')
var song =new Audio('./sounds/sound.mp3');
var eat_sound =new Audio('./sounds/eat.mp3');
var lick_sound =new Audio('./sounds/lick.mp3')
var loser_sound = new Audio('./sounds/die.mp3')
var Winner_sound = new Audio('./sounds/win.mp3')
var gift = new Audio('./sounds/gift.mp3')
//test

$(document).ready(function() {
	context = canvas.getContext("2d");
});
$(intro).ready(function(){
	intro.loop=true
	intro.pause()
})


function introMusic(){
	if (intro.paused){
		intro.loop = true
		intro.play()	
	}else{
		intro.pause()
	}	
}
function backgroundMusic(){
	if (song.paused){
		document.getElementById("voice_img").src = "./images/play.png"
		song.loop = true
		song.play()	
	}else{
		document.getElementById("voice_img").src = "./images/pause.png"
		song.pause()
	}	
}
function lickSound(){
	lick_sound.play()
}
function Start() { //Done
	Get_input_values();
	if(!ok){
		ok=true
		return;
	}
	intro.pause()
	song.play()
	
	clean_the_screan();
	
	show_setting();
	
	create_the_board();
	console.log("here")
	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.keyCode] = true;
		}
		
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		}
		
	);
	document.getElementById("canvas").focus()
	console.log("update")
	interval = setInterval(update,200)
}
var ok = true
function Get_input_values(){ //***Done  */
	var msg = ""
	opts=["ArrowUp","ArrowDown","ArrowRight","ArrowLeft"]
	let up_key = document.getElementById("up").value
	let down_key = document.getElementById("down").value
	let right_key = document.getElementById("right").value
	let left_key = document.getElementById("left").value
	if( ! ( ( (up_key!=' ' && up_key.length==1) || opts.includes(up_key) ) &&
		 ( (down_key!=' ' && down_key.length==1) || opts.includes(down_key) ) &&
	     ( (right_key!=' ' && right_key.length==1) || opts.includes(right_key) ) &&
	     ( (left_key != ' '&& left_key.length==1) || opts.includes(left_key) ) 
	) ){
		msg+="- insert an invalid key to go UP/DOWN/RIGHT/LEFT\n"
		ok = false
	}
	food_remain = document.getElementById("balls").value
	balls = document.getElementById("balls").value
	if( isNaN(food_remain) || food_remain<50 || food_remain>90){ //change to <50
		msg+="- the food must be between 50 and 90 (including)\n"
		ok =false
	}
	time = document.getElementById("time").value
	if(isNaN(time) || time<60){
		msg+="- the time must be greater than 59 secound\n"
		ok=false
	}
	monsters_counter = document.getElementById("monsters").value
	if( isNaN(monsters_counter) || monsters_counter < 1 && monsters_counter > 4){
		msg+="- the number of monsters must be between 1 and 4 (including)\n"
		ok=false
	}
	if( msg!= ""){
		window.alert(msg)
	}
}
function clean_the_screan(){ //Done 
	$(".GameScreen").css("display","block")
	$( ".settings" ).css("display","none");
	document.getElementsByTagName('body')[0].style.background = "#ffffff ";
	document.getElementById("game").style.display = 'block' ;//show the canvas
	document.getElementById("Time").style.display = 'inline';//show the time
	document.getElementById("score").style.display = 'inline';//show the score
	document.getElementById("hl").style.display = 'inline' // Remained
	document.getElementById("voice").style.display = 'block'
	

}
function show_setting(){ /**Done */
	document.getElementById("game setting").style.display ="block"
	$(".dir").css("display","inline-block");
	document.getElementById("hl").style.display ="inline-block"
	document.getElementById("lives").style.display="inline-block"
	document.getElementById("U").innerHTML = "Press " + document.getElementById("up").value + " to go up "
	document.getElementById("D").innerHTML = "Press " + document.getElementById("down").value + " to go down "
	document.getElementById("R").innerHTML = "Press " + document.getElementById("right").value + " to go right "
	document.getElementById("L").innerHTML = "Press " + document.getElementById("left").value + " to go left "
	document.getElementById("B").innerHTML = "Number of balls : " + document.getElementById("balls").value + " "
	document.getElementById("T").innerHTML = "Time : " + time+ " "
	document.getElementById("M").innerHTML = "Number of monsters :" + document.getElementById("monsters").value	
	document.getElementById("hl").innerHTML = "Lives :"
	let lives = document.getElementById("lives")
	for ( var i=0; i < 7; i++){
		if(i<rejection){
			document.getElementById(i).style.display ="inline-block"
		}
		else{
			document.getElementById(i).style.display ="none"
		}
		
	}
	

}
function create_the_board(){ //Done
	console.log("start")
	board = new Array();
	score = 0;
	pac_color = "yellow";
	var cnt = 13*13; // return to 100
	var pacman_remain = 1;
	start_time = new Date();
	//monsters[0] = monster ;
	monsters = new Array()
	for (var i = 0; i < 15; i++) {
		board[i] = new Array();
		for (var j = 0; j < 15; j++) {
			 if( monsters_counter >0 && ( i==2 && j==1 || i==1 && j==13 || i==13 && j==1 || i==12 && j==12 ) ){//monster
				var obj = new Object()
				obj.i = 40*i;
				obj.j = 40*j ;
				obj.index=0
				monsters.push(obj)
				board[i][j] = 5 
				monsters_counter-=1
			}
			else if (
				(i == 0 && j == 0) ||(i == 0 && j == 3) ||
				(i == 1 && j == 2) ||(i == 1 && j == 5) ||(i == 1 && j == 6) ||(i == 1 && j == 11)||
				(i == 2 && j == 3) ||(i == 2 && j == 5) ||(i == 2 && j == 10) ||(i == 2 && j == 11) ||
				(i == 3 && j == 3) ||(i == 3 && j == 6) ||(i == 3 && j == 7) ||
				(i == 4 && j == 3) ||
				(i == 5 && j == 3) ||(i == 5 && j == 3) ||(i == 5 && j == 9) ||(i == 5 && j == 11) ||
				(i == 6 && j == 3) ||(i == 6 && j == 4) ||(i == 6 && j == 9) ||
				(i == 8 && j == 6) ||(i == 8 && j == 7) ||(i == 8 && j == 8) ||(i == 8 && j == 11) ||
				(i == 7 && j == 1) ||(i == 7 && j == 8) ||(i == 7 && j == 9) ||
				(i == 9 && j == 9) ||(i == 9 && j == 5) ||(i == 9 && j == 6) ||
				(i == 10 && j == 3)||(i == 9 && j == 5) ||(i == 9 && j == 13) ||
				(i == 11 && j == 3) || (i == 11 && j == 4) ||(i == 11 && j == 10) || (i == 11 && j == 11) ||(i == 11 && j == 7) || 
				(i == 12 && j == 3) ||(i == 12 && j == 7) ||
				(i == 13 && j == 13) ||(i == 13 && j == 12) ||(i == 13 && j == 11) ||(i == 13 && j == 5) ||
				(i==0)||(j==0)||(i==14)||(j==14)
			) {
				board[i][j] = 4; //obstacle
			} else {
				
					board[i][j] = 0; //Empty
			}
		}
	}
	if (shape == null){
		console.log("pacman")
		shape = new Object()
		var emptyCell = findRandomEmptyCell(board);
		var x = emptyCell[0]
		var y = emptyCell[1]
		while(  x==2 && y==1 || x==1 && y==13 || x==13 && y==1 || x==12 && y==12){
			emptyCell = findRandomEmptyCell(board);
			x = emptyCell[0]
			y = emptyCell[1]
		}
		shape.i = x;
		shape.j = y;
		board[shape.i][shape.j] = 2; //Pacman
		
	}
	let small = Math.floor( 0.6 * food_remain )
	let meduim = Math.floor( 0.3 * food_remain )
	let larg = Math.floor( 0.1 * food_remain )
	while ( small != 0 ) {
		console.log("ball")
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 1;
		small--;
		food_remain--;
	}
	while ( meduim != 0 ) {
		console.log("ball")
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 11;
		meduim--;
		food_remain--;
	}
	while ( larg != 0 ) {
		console.log("ball")
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 111;
		larg--;
		food_remain--;
	}
	while (food_remain !=0){
		console.log("ball")
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 1;
		food_remain--;

	}
	var health = findRandomEmptyCell(board) 
	board[health[0]][health[1]] = 6 // health
	var time_plus = findRandomEmptyCell(board)
	board[time_plus[0]][time_plus[1]] = 7 //add time

}
function update (){ //Done
	
	Update_time();
	canvas.width = canvas.width; //clean board
	UpdatePosition_Pac();
	update_dynamic_point();
	console.log(monsters.length)
	for( let i=0; i< monsters.length; i++)
	{
		UpdatePosition_Monster(monsters[i]);
		Drow_monster_point(monsters[i],i);
	}
	Drow(dir);
	draw_dynamic_point();
	show_setting();
	game_status();
}
function Update_time(){
	//Update Time
	var currentTime = new Date();
	time_elapsed = Math.floor((currentTime - start_time) / 1000);
}
function UpdatePosition_Pac() { //Done
	board[shape.i][shape.j] = 0; //convert location of pacman to be 0 
	t = GetKeyPressed();
	
	if (t == 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
		}
	}
	if (t == 2) {
		if (shape.j < 13 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
		}
	}
	if (t == 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
		}
	}
	if (t == 4) {
		if (shape.i < 13 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
		}
	}
	if (board[shape.i][shape.j] == 1) {
		eat_sound.play()
		score+=5;
		eaten++;
	}
	if (board[shape.i][shape.j] == 11) {
		eat_sound.play()
		score+=15;
		eaten++;
	}
	if (board[shape.i][shape.j] == 111) {
		eat_sound.play()
		score+=25;
		eaten++;
	}
	if(board[shape.i][shape.j] ==6){
		gift.play()
		rejection += 1 
	}
	if(board[shape.i][shape.j] ==7){
		gift.play()
		time = parseInt(time) + 10 
	}
	board[shape.i][shape.j] = 2;
}
function Play_again(){
	//Done
	eaten = 0;
	eat = false;
	rejection = 5;
	$(".Game").css("display","none");
	$("#end_img").css("display","block")
	$(".dir").css("display","none");
	$("#playagain").css("display","block")
	document.getElementById("voice_img").setAttribute("src","./images/play.png")
	document.body.style.background ='rgb(60 67 117)'
	
	

}
function setting(){ //done
	$(".settings").css("display","block");
	$("#score_and_time").css("display","block")

	const inputs = document.querySelectorAll(".input")
	inputs.forEach(input => {
		input.value=''
	})
	$(".GameScreen").css("display","none")
	$("#playagain").css("display","none");
	$("#end_img").css("display","none")
	//$("#hl").css("display","none");
	introMusic()
	
}
function UpdatePosition_Monster( M){ //Done
	if(Math.abs(M.i/40 - shape.i)<0.5 && Math.abs(M.j/40 - shape.j)==0){//rejection between the pacman and the monster
		score -=10
		//( i==2 && j==1 || i==1 && j==13 || i==13 && j==1 || i==12 && j==12 )
		let rnd = generateRandomIntegerInRange(1,4)
		if(rnd%2==0){
			M.i = 40 ;
			M.j = 40 ;
		}
		else{
			M.i = 40*12 ;
			M.j = 40*12 ;
		}
		
		M.index = 0
		rejection -= 1
		lickSound()
	}
	else if( (M.i % 40 == 0 && M.j % 40 == 0 && M.index==0  )  ){ // the packman moved
		
		context.clearRect(M.i , M.j , 40, 40)
		M.arr = DFS(M,shape); 
		M.x = M.arr[M.index].i
		M.y = M.arr[M.index].j
		var x = M.x
		var y = M.y
		if(  40*x - M.i > 0 && 40*y ==M.j ){
				M.i+=10
			}
		else if( 40*x - M.i < 0 && 40*y ==M.j ){
				M.i-=10
			}
		else if( 40*x - M.i == 0 && 40*y < M.j ){
				M.j-=10
			}
		else if( 40*x - M.i == 0 && 40*y > M.j ){
				M.j+=10
			}
		M.index++
	}
	else if(M.i % 40 == 0 && M.j % 40 == 0 && M.index < M.arr.length){ // the monster moved 
		
		context.clearRect(M.i , M.j , 40, 40)
		M.x = M.arr[M.index].i
		M.y = M.arr[M.index].j
		var x=M.x
		var y=M.y
		if(  40*x - M.i > 0 && 40*y ==M.j ){
				M.i+=10
			}
		else if( 40*x - M.i < 0 && 40*y ==M.j ){
				M.i-=10
			}
		else if( 40*x - M.i == 0 && 40*y < M.j ){
				M.j-=10
			}
		else if( 40*x - M.i == 0 && 40*y > M.j ){
				M.j+=10
			}
		M.index++
	}
	else{ // the monster is moving to cell
		var x=M.x
		var y=M.y
		if(  40*x - M.i > 0 && 40*y ==M.j ){
			M.i+=10
		}
		else if( 40*x - M.i < 0 && 40*y ==M.j ){
			M.i-=10
		}
		else if( 40*x - M.i == 0 && 40*y < M.j ){
			M.j-=10
		}
		else if( 40*x - M.i == 0 && 40*y > M.j ){
			M.j+=10
		}
	}
	if( M.arr.length == M.index ){ //try again to search the pacman
		M.index=0
	}
	
	
}
function update_dynamic_point(){ //Done update
	if(!eat)
	{
		if(dynamic_p==null)
		{
			dynamic_p = new Object();
			dynamic_p.i = 4 ;
			dynamic_p.j = 5 ;
		}
		else
		{
			if(dynamic_p.i == shape.i && dynamic_p.j == shape.j ){
				eat = true
				gift.play()
				score+=50
				lblScore.value = score
			}
			else{
				neighbor = neighbors(dynamic_p)
				random = Math.floor((Math.random() * neighbor.length) + 1);
				dynamic_p.i = neighbor[random-1].i
				dynamic_p.j = neighbor[random-1].j	
			}
		}
	}

}
function game_status(){
	
	if(lblTime.value == time){
		window.clearInterval(interval);
		backgroundMusic()
		if(score<100){		
			var msg = " You arr better than " + score + " points!" 
			loser_sound.play()
		}
		else{
			var msg = " Winner!!!"
			Winner_sound.play()
		}
		window.alert(msg);
		
		Play_again()
	}
	if( eaten == balls){
		window.clearInterval(interval);
		backgroundMusic()
		var msg = " Winner!!!"
		Winner_sound.play()
		window.alert(msg);
		Play_again()
	}
	if( rejection == 0 ){
		window.clearInterval(interval);
		backgroundMusic()
		var msg = "LOSER!"
		loser_sound.play()
		window.alert(msg);
		

		
		Play_again()
	}
	else {
		 if(recent == null){
			recent = 1 ;
			Drow(0);
		}
		else if (t==1 || t==2 || t==3 || t==4 ){
			Drow(t);
		}
		else{
			//stay_on_location[i,j] - n key pressed
		}
		
	}

}
function Drow(x) { //Done
	lblScore.value = score;
	lblTime.value = time_elapsed;
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 15; j++) {
			var center = new Object();
			center.x = i * 40 + 22.5;
			center.y = j * 40 + 22.5;
			if (board[i][j] == 2) {
				context.beginPath();
				if(x==1){
					context.arc(center.x, center.y, 15, 1.70 * Math.PI, 1.40 * Math.PI); // half circle up
					dir=1
				}
				if(x==2){
					context.arc(center.x, center.y, 15, 0.60 * Math.PI, 0.25 * Math.PI); // half circle down
					dir=2
				}
				if(x==3){
					context.arc(center.x, center.y, 15, 1.15* Math.PI, 0.85 * Math.PI); // half circle left
					dir=3
				}
				if(x==4 || x==0){
					context.arc(center.x, center.y, 15, 0.15 * Math.PI, 1.85 * Math.PI); // half circle right
					dir=4
				}
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();

				context.beginPath();
				if(x==1){
					context.arc(center.x + 5, center.y + 5 , 2.5, 0, 2 * Math.PI); // circle - eye of pacman
				}
				if(x==2){
					context.arc(center.x + 5, center.y - 5, 2.5, 0, 2 * Math.PI); // circle - eye of pacman
				}
				if(x==3){
					context.arc(center.x , center.y - 7, 2.5, 0, 2 * Math.PI); // circle - eye of pacman
				}
				if(x==4 || x==0){
					context.arc(center.x , center.y -7 , 2.5, 0, 2 * Math.PI); // circle - eye of pacman
				}
				context.fillStyle = "black"; //color
				context.fill();

			} else if (board[i][j] == 1) {
				context.beginPath();
				context.arc(center.x, center.y, 5, 0, 2 * Math.PI); // circle -foord
				context.fillStyle = 'rgb(245, 255, 18)'; //color
				context.fill();
			}else if (board[i][j] == 11) {
				context.beginPath();
				context.arc(center.x, center.y, 7.5, 0, 2 * Math.PI); // circle -foord
				context.fillStyle = 'rgb(255, 161, 8)'; //color
				context.fill();
			}else if (board[i][j] == 111) {
				context.beginPath();
				context.arc(center.x, center.y, 10, 0, 2 * Math.PI); // circle -foord
				context.fillStyle = 'rgb(254, 41, 0)'; //color
				context.fill();
			} else if (board[i][j] == 4) {
				context.beginPath();
				context.rect(center.x - 22.5, center.y - 22.5, 40, 40); //rectangle - obstacle
				context.fillStyle = "black"; //color
				context.fill();
				/**
				var img = new Image();
				img.src='./health.png';
				context.drawImage(img,40*i,40*j,40,40);
				*/

			}

			else if (board[i][j] == 6 ){
				var health = new Object()
				health.i = i 
				health.j = j
				var img = new Image();
				img.src='./images/health.png';
				context.drawImage(img,40*i,40*j,40,40);
			}
			else if (board[i][j] == 7 ){
				var clock = new Object()
				clock.i = i 
				clock.j = j
				var img = new Image();
				img.src='./images/clock.png';
				context.drawImage(img,40*i,40*j,40,40);
			}
		}
	}
		
}
function Drow_monster_point(M,x){ //Done
	var img = new Image();
	if (x%2==0){
		img.src='./images/monster.png';
		context.drawImage(img,M.i,M.j,40,40);
	}else{
		img.src='./images/monster2.png';
		context.drawImage(img,M.i,M.j,40,40);
	}
	
	
}
function draw_dynamic_point(){
	if(!eat){
		var food_image = new Image();
		food_image.src='./images/food.png';
		context.drawImage( food_image, dynamic_p.i*40, dynamic_p.j*40, 40, 40);
		
	}
}
function legal_point(i,j){ //check if (i,j) is a correct point
	if( 0 <=i && i <15 && 0<=j  && j<15){
		return true;
	}
	else{
		return false;
	}
}
function neighbors( node ){ //return neighbors of node
	var x = node.i ;
	var y = node.j;
	let arr = [];
	if(legal_point(x+1,y)){
		if(board[x+1][y]!=4){
			var n = new Object();
			n.i=x+1
			n.j=y
			arr.push(n)
		}
	}
	if(legal_point(x-1,y)){
		if(board[x-1][y]!=4){
			var n = new Object();
			n.i=x-1
			n.j=y
			arr.push(n)
		}
	}
	if(legal_point(x,y+1)){
		if(board[x][y+1]!=4){
			var n = new Object();
			n.i=x
			n.j=y+1
			arr.push(n)
		}
	}
	if(legal_point(x,y-1)){
		if(board[x][y-1]!=4){
			var n = new Object();
			n.i=x
			n.j=y-1
			arr.push(n)
		}
	}	
	return arr 
}
function DFS (start , end ){ //return path from start to end 
	stack = new Stack() ;
 	explored = new Set() ;
 	solution = new Stack();
	 var st = new Object();
	 var en = new Object();
	 st.i = start.i/40
	 st.j = start.j/40
	 en.i = end.i%40
	 en.j = end.j%40
	st.from = null 
	stack.push(st)
	while(!stack.isEmpty()){
		var node = stack.pop()
		var bool = false
		explored.forEach((value) => {
			if(value.i == node.i && value.j == node.j) {
				bool=true
				 }
				}
				);

		if(node.i==en.i && node.j == en.j){//find the goal
			break;
		}
		if(!bool){
			explored.add(node);
		}
		var list = neighbors(node)
		for(i in list){
			bool=false
			explored.forEach((value) => {
				if(value.i == list[i].i && value.j == list[i].j) {
						bool=true } });
				if(!bool){
					list[i].from = node
					stack.push(list[i])
				}
		}
	}
	if(!stack.isEmpty()){
		while(node.from !=null){
			solution.push(node)
			node=node.from
		}
	}
	var arr = new Array()
	while(!solution.isEmpty()){
		 arr.push(solution.pop())
	}
	return arr
}
function findRandomEmptyCell(board) { //find empty cell
	var i = Math.floor(Math.random() * 12 + 1);
	var j = Math.floor(Math.random() * 12 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 12 + 1);
		j = Math.floor(Math.random() * 12 + 1);
	}
	return [i, j];
}
function GetKeyPressed() { //get the key pressed
	if (keysDown[up]) {//up
		return 1;
	}
	if (keysDown[down]) {//down
		return 2;
	}
	if (keysDown[left]) {//left
		return 3;
	}
	if (keysDown[right]) {//right
		return 4;
	}
	return 0
}
class Stack {
    constructor()
    {
        this.items = [];
    }
	push(element)
	{
    this.items.push(element);
	}
	printStack()
	{
    var str = "";
    for (var i = 0; i < this.items.length; i++)
        str += "(" + this.items[i].i + " " +this.items[i].j +")";
	}
	pop()
	{
    if (this.items.length == 0)
        return "Underflow";
    return this.items.pop();
	}
	isEmpty()
	{
    return this.items.length == 0;
	}

}
function random_settings(){
	/*x=["ArrowUp","ArrowDown","ArrowRight","ArrowLeft","1","2","3","4","5","6","7","8","9","0"]
	let random = Math.floor(Math.random() * x.length);
	document.getElementById("up").value =x[random]
	x.splice(random,1)
	 random = Math.floor(Math.random() * x.length);
	document.getElementById("down").value =x[random]
	x.splice(random,1)
	 random = Math.floor(Math.random() * x.length);
	document.getElementById("right").value =x[random]
	x.splice(random,1)
	 random = Math.floor(Math.random() * x.length);
	document.getElementById("left").value =x[random]
	x.splice(random,1)
	console.log(x)*/
	console.log("Hola");
	document.getElementById("up").value ='ArrowUp'
	document.getElementById("down").value ='ArrowDown'
	document.getElementById("right").value ='ArrowRight'
	document.getElementById("left").value ='ArrowLeft'
	document.getElementById("balls").value =generateRandomIntegerInRange(50,90)
	document.getElementById("time").value =generateRandomIntegerInRange(60,100)
	document.getElementById("monsters").value =generateRandomIntegerInRange(1,4) 
	
}
function generateRandomIntegerInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
