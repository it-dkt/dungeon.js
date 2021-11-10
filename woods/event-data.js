
// イベント定義
const moveStone = function(myIndex){

    function isMovable(x, y){
        // 移動先のイベント番号取得
        let nextEvent = getMapEvent(x, y);
        // 移動可能なら
        if(nextEvent != OUT_OF_MAP_EVENT_IDX && eventData[nextEvent].isWalkable()){
            for(var i=0; i<enemies.length; i++){
                // 敵がいる場所はNG
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
    //playerX, playerY
    if(playerY == myTmpY){
        if(playerX < myTmpX){
            // 左から押された
            if(isMovable(myTmpX + 1, myTmpY)){
                // 移動可能なら主人公と自分の座標をx+1
                myTmpX++;
                playerX++;
                isMove = true;
            }
        }else{
            // 右から押された
            if(isMovable(myTmpX - 1, myTmpY)){
                // 移動可能なら主人公と自分の座標をx-1
                myTmpX--;
                playerX--;
                isMove = true;
            }
       }
    }else if(playerX == myTmpX){
        if(playerY < myTmpY){
            // 上から押された
            if(isMovable(myTmpX, myTmpY + 1)){
                // 移動可能なら主人公と自分の座標をy+1
                myTmpY++;
                playerY++;
                isMove = true;
            }
        }else{
            // 下から押された
            if(isMovable(myTmpX, myTmpY - 1)){
                // 移動可能なら主人公と自分の座標をy-1
                myTmpY--;
                playerY--;
                isMove = true;
            }
       }
    }
    
	if(isMove){
        // 自分の座標移動
    
        var mapIdxOld = getMapIdx(myEvent.posX, myEvent.posY);
        // 以前いた位置の状態を復元する
        mapData[mapIdxOld] = myEvent.oldEvent;

        // 座標を移動
        myEvent.posX = myTmpX;
        myEvent.posY = myTmpY;

        var mapIdxNew = getMapIdx(myEvent.posX, myEvent.posY);

        var targetEventIdx = mapData[mapIdxNew];

        if(targetEventIdx == 5){
            // 乗せた
            stoneOnTheTarget();
        }

        // 移動先のevent番号を保持する（復元用）
        myEvent.oldEvent = mapData[mapIdxNew];
        // 移動先のチップ番号を保持する（背景表示用）
        myEvent.getTile = eventData[myEvent.oldEvent].getTile;
        // mapデータ更新
        mapData[mapIdxNew] = myIndex;
        
        // 背景描画
        drawMap();
    }

}

let isStoneOnTheTarget = false;
function stoneOnTheTarget(){
    shake();
    isStoneOnTheTarget = true;
}

const fSimpleTrue = function(){ return true; }
const fSimpleFalse = function(){ return false; }

const startMessage = 'Escape from this woods.<br>Don\'t be catched by the monster!';
const restartGame = () => {
    document.location.href = '../index.html';
}

//
// Mapイベント
//
const eventData = [];
eventData[0] = { getTile: function(){ return 0; }, isWalkable: fSimpleFalse, hasMessage: fSimpleFalse, title: '', msg: '', onClose: function(){} };
eventData[1] = { getTile: function(){ return 1; }, isWalkable: fSimpleTrue, hasMessage: fSimpleFalse, title: '', msg: '', onClose: function(){} };
eventData[2] = { getTile: function(){ return 2; }, isWalkable: fSimpleFalse, hasMessage: fSimpleFalse, title: '', msg: '', onClose: function(){} };
eventData[3] = { getTile: function(){ return 3; }, isWalkable: fSimpleFalse, hasMessage: fSimpleFalse, title: '', msg: '', onClose: function(){} };
eventData[4] = { getTile: function(){ return 1; }, isWalkable: fSimpleFalse, hasMessage: fSimpleFalse, title: '', msg: '', 
    onClose: function(){ moveStone(4) }, posX: 4, posY: 4, objectImgIdx: 0, oldEvent: null };
eventData[5] = { getTile: function(){ return 4 }, isWalkable: fSimpleTrue, hasMessage: fSimpleFalse, title: '', msg: '', onClose: function(){} };
eventData[6] = {
    getTile: function(){ return isStoneOnTheTarget ? 5 : 3; },
    isWalkable: function(){ return isStoneOnTheTarget; },
    hasMessage: fSimpleFalse, title: '', msg: '',
    onClose: function(){
        if(isStoneOnTheTarget){
            restartGame();
        }
    } };

const OUT_OF_MAP_EVENT_IDX = 0;
const OBJECT_IMAGES = [
    'woods-stone.png'
]






