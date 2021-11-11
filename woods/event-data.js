/**
 * variables
 */
 let isStoneOnTheTarget = false;

 const fSimpleTrue = function(){ return true; }
 const fSimpleFalse = function(){ return false; }
 
 const startMessage = 'Escape from this woods.<br>You can move a stone!';
 const restartGame = () => {
     document.location.href = '../index.html';
 }
 const OUT_OF_MAP_EVENT_IDX = 2;
 const OBJECT_IMAGES = [
     'woods-stone.png'
 ]
 
 /**
  * events
  */
 const eventData = [];
 eventData[0] = { getTile: function(){ return 0; }, isWalkable: fSimpleFalse, hasMessage: fSimpleFalse, title: '', msg: '', onClose: function(){} };
 eventData[1] = { getTile: function(){ return 1; }, isWalkable: fSimpleTrue, hasMessage: fSimpleFalse, title: '', msg: '', onClose: function(){} };
 eventData[2] = { getTile: function(){ return 2; }, isWalkable: fSimpleFalse, hasMessage: fSimpleFalse, title: '', msg: '', onClose: function(){} };
 eventData[3] = { getTile: function(){ return 3; }, isWalkable: fSimpleFalse, hasMessage: fSimpleFalse, title: '', msg: '', onClose: function(){} };
 
 // the movable stone
 eventData[4] = { getTile: function(){ return 1; }, isWalkable: fSimpleFalse, hasMessage: fSimpleFalse, title: '', msg: '', 
     onClose: function(){ moveStone(4) }, posX: 4, posY: 4, objectImgIdx: 0, oldEvent: null };
 // the target position to move the stone on
 eventData[5] = { getTile: function(){ return 4 }, isWalkable: fSimpleTrue, hasMessage: fSimpleFalse, title: '', msg: '', onClose: function(){} };
 // the door (hidden initially)
 eventData[6] = {
     getTile: function(){ return isStoneOnTheTarget ? 5 : 3; },
     isWalkable: function(){ return isStoneOnTheTarget; },
     hasMessage: fSimpleFalse, title: '', msg: '',
     onClose: function(){
         if(isStoneOnTheTarget){
             restartGame();
         }
     } };


const moveStone = function(myIndex){

    // Is the new position is movable?
    function isMovable(x, y){
        let nextEvent = getMapEvent(x, y);
        if(nextEvent != OUT_OF_MAP_EVENT_IDX && eventData[nextEvent].isWalkable()){
            for(var i=0; i<enemies.length; i++){
                if(x == enemies[i].posX && y == enemies[i].posY){
                    return false;
                }
            }
            return true;
        }
        return false;
    };

    var myEvent = eventData[myIndex];
    var myTmpX = myEvent.posX;
    var myTmpY = myEvent.posY;
    var isMove = false;

    if(playerY == myTmpY){
        if(playerX < myTmpX){
            // pushed from left
            if(isMovable(myTmpX + 1, myTmpY)){
                // move the player and the stone to right
                myTmpX++;
                playerX++;
                isMove = true;
            }
        }else{
            // pushed from right
            if(isMovable(myTmpX - 1, myTmpY)){
                // move the player and the stone to left
                myTmpX--;
                playerX--;
                isMove = true;
            }
       }
    }else if(playerX == myTmpX){
        if(playerY < myTmpY){
            // pushed from top
            if(isMovable(myTmpX, myTmpY + 1)){
                // move the player and the stone down
                myTmpY++;
                playerY++;
                isMove = true;
            }
        }else{
             // pushed from bottm
            if(isMovable(myTmpX, myTmpY - 1)){
                // move the player and the stone up
                myTmpY--;
                playerY--;
                isMove = true;
            }
       }
    }

    // after moved
	if(isMove){
        // restore event index of the position the stone was before
        var mapIdxOld = getMapIdx(myEvent.posX, myEvent.posY);
        mapData[mapIdxOld] = myEvent.oldEvent;

        // update the stone's position
        myEvent.posX = myTmpX;
        myEvent.posY = myTmpY;

        // get the event index of the new position
        var mapIdxNew = getMapIdx(myEvent.posX, myEvent.posY);
        var targetEventIdx = mapData[mapIdxNew];

        if(targetEventIdx == 5){
            isStoneOnTheTarget = true;
            shake();
        }else{
            if(myEvent.oldEvent == 5){
                // when leave the target index also
                shake();
            }
            isStoneOnTheTarget = false;
        }

        // keep the old event index of the new position 
        myEvent.oldEvent = mapData[mapIdxNew];
        // keep the getTile() of the new position for drawing background
        myEvent.getTile = eventData[myEvent.oldEvent].getTile;

        // update map
        mapData[mapIdxNew] = myIndex;
        drawMap();
    }
}









