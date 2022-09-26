# dungeon.js
*Javascript fremework for 2D dungeon game*

### Sample dungeon game
https://main.d31hnum9uhgtm2.amplifyapp.com/
<dl>
  <dt>How to play (on PC)</dt>
  <dd>Move player charactor by arrow keys(← → ↑ ↓) on keyboard. If some message is shown, read it, then press Enter (or any) key to close it.</dd>
  <dt>How to play (on smartphone)</dt>
  <dd>Move player charactor by touching 4 direction buttons shown on screen. If some message is shown, read it, then touch the message to close it.</dd>
</dl>

### Overview
Dungeon.js is a simple javascript framework for making dungeon kind of game like sample shown above.<br>
You can make your own game by customizing map data, event data, and so on.

### Getting started
First, clone this repository.<br>
Open index.html on your browser, and click 'Sample dungeon' link. It links dungeon-1.html in dungeon-1 folder. This is the same as the sample game shown above.<br>
Play sample game and enjoy it!<br>
Then, create a copy of the dungeon-1 folder, and rename the folder itself and files in the folder. (ex: dungeon-1 to my-dungon, and dungeon-1.html to my-dungeon.html).<br>
Next, open my-dungon.html (or the file you renamed from dungeon-1.html) on your code editor (like VSCode). Then edit the script filenames as you renamed, and save it.<br>
Open mydungon.html on your browser. If you can play the same sample game as you played first, with no javascript errors, you succeed to copy resources, and you are ready to make your own game!

### Files to edit for your own game
Suppose you renamed *dungeon-1* folder to *my-dungeon*, and renamed the files in it by the same rule.<br>
#### my-dungeon.html
The location of your game. There are some script links. In most cases, you only need to change the script filename.<br>
*Changing the order of script tag may leads some javascript errors*. So, be carefull.
#### my-map-data.js
The array 'mapData' is defined in this file. The array has length of MAP_ROWS x MAP_COLS. <br>
Each element of the array indicates the position in the map. If you need more wide map, increase MAP_ROWS and MAP_COLS value.<br>
The value of each element is the 'event' of that position, and this is actually the index of array 'eventData' defined in my-event-data.js.<br>
Most elements of mapData have value 0 or 1. 0 means floor (walkable). 1 means wall (not walkable). But some elements have other values. This means that positions have a specific event.
MAP_IMAGE_FILENAME is the name of image file of the map. The file needs to be in {dungeon.js root}/img folder. (ex. {dungeon.js root}/img/map.png )
#### my-event-data.js
Some functions and flags are defined in this file. These are the logics of specific events.<br>
And array 'eventData' is also defined. This array defines all events occur in corresponding mapData.<br>
Each element of the array has properties shown below.<br>
##### getTile
The function returns the index of tile of this event. <br>
Tile means a piece of a map image. As you see in {dungeon.js root}/img/map.png, all pieces of a certain map are need to be together in one file, and ordered horizonaly.<br>
Index 0 indicates the leftmost piece, and increases to right.<br>
If getTile of an event returns the index of a tree image, map positions that have this event all shows tree image.<br>
##### isWalkable
The function returns whether a map position that has this event is walkable or not.<br>
If Walkable, the player character can walk that position.<br>
##### hasMessage
The function returns boolean indicates weather this event has a message to show or not.<br>
Walkable events and unwalkable events both can have a message. When an unwakable event has a message, the message is shown when player operate to move towards the position. The charactor remains former position, because the target position is not walkable, but the message of target position is shown. (ex. stone boards in sample)
##### title
The title of the message of this event.
##### msg
The message of this event.
##### onClose
The function triggerd when the player closes the message.
##### dispatcher
The funciton returns another index of eventData.<br>
If dispatcher is defined, Dungeon.js don't show the message of the event immediately, but call dispatcher and get another element of eventData by returned index, then shows the message of that dispatched event. By this, you can change the message of current event.<br>
Of course, dispatcher can return the same index of current event.
#### my-enemy-data.js
The array ENEMY_IMAGES is the paths of image files of enemies.<br>
The array enemies defines the initial position of enemiy characters.<br>
##### imgIdx
Index of ENEMY_IMAGES.
##### posX
Initial x position of the ememy on the map. (starts from 0)
##### posY
Initial y position of the ememy of the map. (starts from 0)





