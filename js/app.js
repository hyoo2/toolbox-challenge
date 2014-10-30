// app.js: our main javascript file for this app
"use strict"; // avoid errors when misspelling a variable name

// 4 variables
// track image in 1st movement, compare to 2nd movement (can use 1 variable)
// match or not, increase state game variable
// matches = 8 or remaining = 0
// can't flip until done flipping --> delay --> (window.setTimeout(function() { .... }, 1000);
// variable boolean true/false resetting between clicks in game, resetting after game is over, true = flip.....
// set & clear at right time
// return to ignore

var tiles = [];
var idx;

for (idx = 1; idx <= 32; ++idx) {
    tiles.push({
        tileNum: idx,
        src: 'img/tile' + idx + '.jpg',
        flipped: false,
        matched: false
    });
} // for each tile

console.log(tiles);

// when document is ready...
$(document).ready(function() {
    // catch click event of start game button
    $('#start-game').click(function(){
        console.log('start game button clicked!');
        tiles = _.shuffle(tiles);
        var selectedTiles = tiles.slice(0,8);
        var tilePairs = [];

        _.forEach(selectedTiles, function(tile) {
           tilePairs.push(tile);
           tilePairs.push(_.clone(tile));
        });

        tilePairs = _.shuffle(tilePairs);
        console.log(tilePairs);

        var gameBoard = $('#game-board');
        var row = $(document.createElement('div'));
        var img;
        _.forEach(tilePairs, function(tile, elemIndex) {
            if (elemIndex > 0 && 0 === elemIndex % 4) {
                gameBoard.append(row);
                row =$(document.createElement('div'));
            }

            img = $(document.createElement('img'));
            img.attr({
               src: 'img/tile-back.png',
               alt: 'tile ' + tile.tileNum
            });

            img.data('tile', tile);
            row.append(img);
        });
        gameBoard.append(row);

        // get starting milliseconds
        var startTime = Date.now();
        window.setInterval(function() {
            var elapsedSeconds = (Date.now() - startTime) / 1000;
            elapsedSeconds = Math.floor(elapsedSeconds);
            // add 1 second condition
            $('#elapsed-seconds').text(elapsedSeconds + ' seconds');
        }, 1000);

       $('#game-board img').click(function() {
           //console.log(this.alt);
           var clickedImg = $(this);
           var tile = clickedImg.data('tile');
           console.log(tile);
           flipTile(tile, clickedImg);
       });

    }); // start game button click

}); // document ready function


function flipTile(tile, img) {
    img.fadeOut(100, function() {
        if (tile.flipped) {
            img.attr('src', 'img/tile-back.png');
        }
        else {
            img.attr('src', tile.src);
        }
        tile.flipped = !tile.flipped;
        img.fadeIn(100);
    });
}