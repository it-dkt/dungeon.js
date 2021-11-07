//----------------------------------------------------------
// maze-main.js
//----------------------------------------------------------

// constants
const MAP_BLOCK_WIDTH = 32;	// pixel
const IMG_NUM_TO_LOAD = 2 + ENEMY_IMAGES.length;	// map, player and enemies
const DIRECTION_LEFT = 1;
const DIRECTION_RIGHT = 2;
const DIRECTION_UP = 3;
const DIRECTION_DOWN = 4;
const BASIC_DIRECTION_NUM = 4;
const ADDITIONAL_DIRECTION_NUM = 2;

// variables
let imgMap;
let imgPlayer;
let imgEnemies = [];
let playerX, playerY;
let numLoadedFiles;
let isEnemyMoved = false;
let isDead = false;
let isShowingMessage = false;

//----------------------------------------------------------
window.onload = function () {
	checkDeviceOrientation();
	loadImages();
	// add keydown event handler
	document.addEventListener('keydown', document_onkeydown);

	// create allow key (for smart phone) DOM elements
	$('#controller-container').append($('<div>', { id: 'up-key-container' }));
	$('#controller-container').append($('<div>', { id: 'horizonal-key-container' }));
	$('#controller-container').append($('<div>', { id: 'down-key-container' }));
	
	$('#up-key-container').append($('<div>', { id: 'up-key' }));
	$('#horizonal-key-container').append($('<div>', { id: 'left-key' })).append($('<div>', { id: 'right-key' }));
	$('#down-key-container').append($('<div>', { id: 'down-key' }));
	
	// add allow key event handler
	createDirectionKeyEvent(getElementById('up-key'));
	createDirectionKeyEvent(getElementById('down-key'));
	createDirectionKeyEvent(getElementById('left-key'));
	createDirectionKeyEvent(getElementById('right-key'));

};

function createDirectionKeyEvent(element) {
	element.ontouchstart = function (e) {
		e.preventDefault();
		var t = e.touches;
		mapCanvas_ontouch(e.target, t[0]);
	};
}

function loadImages() {
	showMessage("Now loading",
	"<img src='../controller-img/loader.gif'> Wait a moment...");

	numLoadedFiles = 0;

	// when a file is loaded
	const file_onload = function () {
		numLoadedFiles++;
		// Return if there remains any image to load.
		if (numLoadedFiles < IMG_NUM_TO_LOAD) return;
		// If all images are loaded 
		closeMessage();
		initGame();
	};
	
	// load tip images
	imgMap = loadImage("../img/" + MAP_IMAGE_FILENAME, file_onload);
	imgPlayer = loadImage("../img/player.png", file_onload);
	for(var i=0; i<ENEMY_IMAGES.length; i++){
		imgEnemies[i] = loadImage("../img/" + ENEMY_IMAGES[i], file_onload);
	}
}

function loadImage(src, onload) {
	var i = new Image();
	i.onload = onload;
	i.src = src + "?m=" + (new Date()).getTime();
	return i;
}

function initGame() {
	// initial position of player
	playerX = 1;
	playerY = 1;

	drawMap();

	doInterval();
	setInterval(doInterval, 1000);
	doEnemyInterval();
	setInterval(doEnemyInterval, 500);

	// startMessage is defined in the map specific event data
	showMessage("START", startMessage);
}

// called at first in document_onkeydown 
function preKeyDown(){
	if(isShowingMessage){
		// close message and trigger onClose if defined 
		$('#messageArea').click();
	}
}

/**
 * called at last in document_onkeydown
 * @param {number} dx number to add to x position of player
 * @param {number} dy number to add to y position of player
 */
function postKeyDown(dx, dy){
	movePlayer(playerX + dx, playerY + dy);
	drawEnemies();
	drawMap();
}

// keydown event for PC
function document_onkeydown(e) {
	preKeyDown();

	let keycode = e.keyCode;
	let dx = 0, dy = 0;
	switch (keycode) {
	case 38: // up key
		dy = -1;
		break;
	case 40: // down key
		dy = 1;
		break;
	case 37: // left key
		dx = -1;
		break;
	case 39: // right key
		dx = 1;
		break;
	}

	postKeyDown(dx, dy);
}

//
// touch event for smart phone
//
function mapCanvas_ontouch(target, e) {
	preKeyDown();

	let targetId = target.id;
	let dx = 0; dy = 0;
	
	if(targetId == 'up-key'){
		dy--;
	}else if(targetId == 'down-key'){
		dy++;
	}else if(targetId == 'left-key'){
		dx--;
	}else if(targetId == 'right-key'){
		dx++;
	}
	
	postKeyDown(dx, dy);
}

/**
 * @param px x position to move
 * @param py y position to move
 * @returns true if player moved
 */
function movePlayer(px, py) {
	
	if (isDead) return false;

	// can't go out of the map
	if (px < 0 || px >= MAP_COLS) return false;
	if (py < 0 || py >= MAP_ROWS) return false;
	
	// get event of target position
	var event_no = getMapEvent(px, py);

	var isMoved = false;
	
	// update player position if the position is walkable
	if (eventData[event_no].isWalkable()) {
		playerX = px;
		playerY = py;
		isMoved = true;
	}

	// check collision with enemies
	checkCollision();
	
	// exec position event
	if (eventData[event_no].hasMessage)
	{
		// exec dispatcher function if defined, returns event number to execute
		if(typeof(eventData[event_no].dispatcher) == "function") {
			event_no = eventData[event_no].dispatcher();
		}
		executeEvent(event_no);
	}
	
	return isMoved;
}

function executeEvent(event_no) {

	showMessage(eventData[event_no].title, eventData[event_no].msg, eventData[event_no].onClose);
}

// redraw player image periodically
var doInterval = function(){
	if(isShowingMessage){
		return;
	}
	drawPlayerChar();
}

// move and redraw enemies periodically
var doEnemyInterval = function(){
	if(isShowingMessage || isDead){
		return;
	}

	moveEnemies();
	if(isEnemyMoved){
		drawEnemies();
	}
	
	checkCollision()
}

var moveEnemies = function(){

	var min = 1;
	// four options (up, down, right, left) and additionals(to adjust)
	var max = BASIC_DIRECTION_NUM + ADDITIONAL_DIRECTION_NUM;
	
	isEnemyMoved = false;
	
	for(var i=0; i<enemies.length; i++){
		// dicide direction randomly
		var direction = Math.floor( Math.random() * (max + 1 - min) ) + min ;
		
		var tmpX = enemies[i].posX;
		var tmpY = enemies[i].posY;

		// adjust direction
		var addDirections = getAdditionalDirections(tmpX, tmpY, playerX, playerY);
		if(direction > BASIC_DIRECTION_NUM && addDirections.length > 0){
			direction = addDirections[direction - BASIC_DIRECTION_NUM - 1];
		}
		
		// get target position
		var targetXY = getTargetXY(direction, tmpX, tmpY);
		
		var eneEvent = getMapEvent(targetXY.x, targetXY.y);
		if(eventData[eneEvent].isWalkable()){
			if(enemies[i].posX == targetXY.x && enemies[i].posY == targetXY.y){
				// NOT walkable
			}else{
				// update postion if walkable
				enemies[i].posX = targetXY.x;
				enemies[i].posY = targetXY.y;
				isEnemyMoved = true;
			}
		}
	}
}

function getTargetXY(direction, tmpX, tmpY){
	var targetX = tmpX;
	var targetY = tmpY;
	if(direction == DIRECTION_LEFT){
		targetX = targetX - 1;
	}else if(direction == DIRECTION_RIGHT){
		targetX = targetX + 1;
	}else if(direction == DIRECTION_UP){
		targetY = targetY - 1;
	}else if(direction == DIRECTION_DOWN){
		targetY = targetY + 1;
	}
	return { x : targetX, y : targetY };
}

// Addtional directions give a bias to the way enemies move.
function getAdditionalDirections(eX, eY, hX, hY){
	// distance to player
	var dx = eX - hX;
	var dy = eY - hY;

	var directions = [];
	var option1, option2;
	// if player is close, move towards player
	if( dx >= -3 && dx <= 3 && dy >= -3 && dy <= 3){
		var adx = Math.abs(dx);
		var ady = Math.abs(dy);

		if(adx > ady){
			// horizonal
			if(dx > 0){
				option1 = DIRECTION_LEFT;
			}else{
				option1 = DIRECTION_RIGHT;
			}
			option2 = option1;
		}else if(adx < ady){
			// vertical
			if(dy > 0){
				option1 = DIRECTION_UP;
			}else{
				option1 = DIRECTION_DOWN;
			}
			option2 = option1;
		}else{
			// both
			if(dx > 0){
				option1 = DIRECTION_LEFT;
			}else{
				option1 = DIRECTION_RIGHT;
			}
			if(dy > 0){
				option2 = DIRECTION_UP;
			}else{
				option2 = DIRECTION_DOWN;
			}
		}

		directions.push(option1);
		directions.push(option2);
	}

	return directions;
}

function checkCollision(){
	for(var i=0; i<enemies.length; i++){
		if(enemies[i].posX == playerX && enemies[i].posY == playerY){
			shake();
			isDead = true;
			// restartGame is defined in the map specific event data
			showMessage('GAME OVER', 'You are dead.', restartGame);
			return true;
		}
	}
	
	return false;
}

let drawCharAnime = 0;
function drawPlayerChar() {
	var cvs = getElementById("charCanvas");
	var ctx = cvs.getContext("2d");
	ctx.clearRect(0,0,MAP_BLOCK_WIDTH,MAP_BLOCK_WIDTH);
	var x = drawCharAnime * MAP_BLOCK_WIDTH;
	ctx.drawImage(imgPlayer, 
		x, 0, MAP_BLOCK_WIDTH, MAP_BLOCK_WIDTH,
		0, 0, MAP_BLOCK_WIDTH, MAP_BLOCK_WIDTH);
	drawCharAnime = (drawCharAnime + 1) % 2;
}

function drawMap() {
	var mapCanvas = getElementById("mapCanvas");
	var mapContext = mapCanvas.getContext("2d");

	mapContext.fillStyle = "gray";
	mapContext.fillRect(0,0,320,320);

	var cvs = getElementById("enemyCanvas");
	var ctx = cvs.getContext("2d");
	
	for (var y = 0; y < 9; y++) {
		for (var x = 0; x < 9; x++) {
			var cx = playerX + x - 4;
			var cy = playerY + y - 4;

			var eventIdx = getMapEvent(cx, cy);
			var tileIdx = eventData[eventIdx].getTile();
	       
			var sx = tileIdx * MAP_BLOCK_WIDTH;
			var sy = 0; 
			var dx = x * MAP_BLOCK_WIDTH;
			var dy = y * MAP_BLOCK_WIDTH;
			mapContext.drawImage(imgMap,
				sx, sy, MAP_BLOCK_WIDTH, MAP_BLOCK_WIDTH, 
				dx, dy, MAP_BLOCK_WIDTH, MAP_BLOCK_WIDTH);
		}
	}
}

function drawEnemies(){
	var cvs = getElementById("enemyCanvas");
	var ctx = cvs.getContext("2d");
	
	for (var y = 0; y < 9; y++) {
		for (var x = 0; x < 9; x++) {
			drawEnemyXY(ctx, x, y);
		}
	}
}

function drawEnemyXY(ctx, x, y){

	var cx = playerX + x - 4;
	var cy = playerY + y - 4;
	var dx = x * MAP_BLOCK_WIDTH;
	var dy = y * MAP_BLOCK_WIDTH;
	ctx.clearRect(dx, dy, MAP_BLOCK_WIDTH, MAP_BLOCK_WIDTH);
	
	for(var i=0; i<enemies.length; i++){
		if(cx == enemies[i].posX && cy == enemies[i].posY){

			var enemyTip = imgEnemies[enemies[i].imgIdx];
			var sx = drawCharAnime * MAP_BLOCK_WIDTH;
			ctx.drawImage(enemyTip, 
				sx, 0, MAP_BLOCK_WIDTH, MAP_BLOCK_WIDTH,
				dx, dy, MAP_BLOCK_WIDTH, MAP_BLOCK_WIDTH);
			break;
		}
	}
}

function getMapIdx(x, y) {
	if (x < 0 || x >= MAP_COLS) return -1;
	if (y < 0 || y >= MAP_ROWS) return -1;

	return (y * MAP_COLS) + x;
}

function getMapEvent(x, y) {
	// return 1 means not walkable
	if (x < 0 || x >= MAP_COLS) return 1;
	if (y < 0 || y >= MAP_ROWS) return 1;

	var i = (y * MAP_COLS) + x;
	return mapData[i];
}

function showMessage(title, msg, onClose) {
	isShowingMessage = true;

	var msgArea = getElementById('messageArea');
	msgArea.innerHTML = "<h3>" + title + "</h3>" +
		"<div>" + msg + "</div>";
	$("#messageArea").show();

	msgArea.onclick = function() {
		closeMessage(onClose);
	};
}

function closeMessage(onClose){
	isShowingMessage = false;
	$("#messageArea").hide();
	if(typeof(onClose) == "function"){
		onClose();
	}
}

function shake(){
	$("#main-area").addClass('shake');
	setTimeout(function(){
		$("#main-area").removeClass('shake');
		}, 1000);
}

function getElementById(id){
	var elm = $('#' + id).get(0);
	//console.log(id + ' - ' + elm);
	return elm;
}

function checkDeviceOrientation() {
	if (Math.abs(window.orientation) == 90) {
		alert("Portrait orientation only!");
		return;
	}
}
