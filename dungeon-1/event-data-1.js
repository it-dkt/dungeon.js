const OUT_OF_MAP_EVENT_IDX = 1;
const OBJECT_IMAGES = [];
const startMessage = 'Escape from this dungeon.<br>Don\'t be catched by the monster!';

const fSimpleTrue = function(){ return true; }
const fSimpleFalse = function(){ return false; }

const restartGame = function() {
	document.location.href = '../index.html';
}
const onGameClear = function(){
	showMessage('CLEAR', 'You have escaped from the dungeon!', restartGame);
}

// flags
var isCollpsed = false;
var hasKey = false;

//
// eventData 
//
const eventData = [];
// floor
eventData[0] = { getTile: function(){ return 0 }, isWalkable: fSimpleTrue, hasMessage: fSimpleFalse, title: '', msg: '', onClose: function(){} };
// wall
eventData[1] = { getTile: function(){ return 1 }, isWalkable: fSimpleFalse, hasMessage: fSimpleFalse, title: '', msg: '', onClose: function(){} };

// boards
eventData[2] = { getTile:  function(){ return 2 }, isWalkable: fSimpleFalse, hasMessage: fSimpleTrue, dispatcher: null, title: 'board', msg: 'There are three stone boards in this dungeon', onClose: onRead1 };
eventData[3] = { getTile:  function(){ return 2 }, isWalkable: fSimpleFalse, hasMessage: fSimpleTrue, dispatcher: null, title: 'board', msg: 'You need a key to open a door.', onClose: onRead2 };
eventData[4] = { getTile:  function(){ return 2 }, isWalkable: fSimpleFalse, hasMessage: fSimpleTrue, dispatcher: null, title: 'board', msg: 'If you have read all the boards, you have a way.', onClose: onRead3 };

// wall could be collapse
eventData[5] = { getTile:  getWallOrFloorTile, isWalkable: function(){ return isCollpsed; }, hasMessage: fSimpleFalse, dispatcher: null, title: '', msg: '', onClose: function(){} };

// treasure box (not opened yet)
eventData[6] = { getTile:  getTreasureTile, isWalkable: fSimpleFalse, hasMessage: fSimpleTrue, dispatcher: dispatcher_treasure, title: 'treasure box', msg: 'You found a key in the box!', onClose: function(){ hasKey = true; drawMap(); } };
// treasure box (open)
eventData[7] = { getTile:  getTreasureTile, isWalkable: fSimpleFalse, hasMessage: fSimpleFalse, dispatcher: null, title: 'treasure box', msg: 'There is nothing in the box any more.', onClose: function(){} };

// door (when the player don't have the key)
eventData[8] = { getTile:  function(){ return 5 }, isWalkable: fSimpleFalse, hasMessage: fSimpleTrue, dispatcher: dispatcher_door, title: 'door', msg: 'The door seems to be locked.', onClose: function(){} };
// door (when the player has the key)
eventData[9] = { getTile:  function(){ return 5 }, isWalkable: fSimpleFalse, hasMessage: fSimpleTrue, dispatcher: dispatcher_door, title: 'door', msg: 'You opened the door!', onClose: onGameClear };

// board 1 event
var board1 = 0;
var onRead1 = function (){
	board1 = 1;
	checkAllBoradsAreRead();
}

// board 2 event
var board2 = 0;
var onRead2 = function (){
	board2 = 1;
	checkAllBoradsAreRead();
}

// board 3 event
var board3 = 0;
var onRead3 = function (){
	board3 = 1;
	checkAllBoradsAreRead();
}

function checkAllBoradsAreRead(){
	if((board1 + board2 + board3) >= 3){
		isCollpsed = true;
		shake();
	}
}

var getWallOrFloorTile = function(){
	if(isCollpsed){
		return 0; // floor
	}
	 return 6;
}

var getTreasureTile = function(){
	if(hasKey){
		return 4;	// treasure box has already opened
	}
	return 3;	// closed
}

// tresure event dispatcher
var dispatcher_treasure = function() {
	if(hasKey){
		return 7;	// nothing is in treasure box any more
	}
	return 6;	// there is a key in treasure box
}

// door event dispatcher
var dispatcher_door = function (){
	if(hasKey){
		shake();
		return 9;	// can open
	}
	return 8;
}
