// app.js: our main javascript file for this app
"use strict"; // avoid errors when misspelling a variable name

// global variables
var tiles;
var timer;
var matches;
var remainingPairs;
var attempts;
var prevImg;

// when document is ready, create game board and add click handlers
$(document).ready(function() {
    $('#new-game').click(function() {
        newGame();
    });
}); // document ready function

function newGame() {
    resetGame();
    setUpBoard();
    playGame();
}

function playGame() {
    startTimer();
    $('#game-board img').click(function() {
        var currImg = $(this);
        var currTile = currImg.data('tile');

        if (currTile.matched) {
            return;
        }
        if (!prevImg) {
            prevImg = currImg;
            flipTile(currTile, currImg);
            return;
        }

        var prevTile = prevImg.data('tile');
        if (prevTile === currTile) {
            return;
        } else {
            flipTile(currTile, currImg);
            setTimeout(function () {
                compareImg(currImg);
                prevImg = null;
                wonGame();
            }, 1000);
        }
    }); // end of gameboard tile click
}

function wonGame() {
    //matches ==8
    if (matches == 8) {
        $('#restartGame').css('display', 'block');
        $('#play-again').click(function() {
            newGame();
        });
        window.clearInterval(timer);
    } else {
        return;
    }
}

function compareImg(currImg) {
    var prevTile = prevImg.data('tile');
    var currTile = currImg.data('tile');

    attempts++;
    if (prevTile.tileNum == currTile.tileNum) {
        matches++;
        remainingPairs--;
        prevTile.matched = true;
        currTile.matched = true;
    } else {
        flipTile(prevTile, prevImg);
        flipTile(currTile, currImg);
    }
    statsUpdate();
}

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
} // end of flipTile

function resetGame() {
    $('#restartGame').css('display', 'none');
    window.clearInterval(timer);
    $('#elapsed-seconds').text(0 + 'seconds');
    $('#game-board').empty();
    matches = 0;
    remainingPairs = 8;
    attempts = 0;
    prevImg = null;
    statsUpdate();
}

function setUpBoard() {
    tiles = [];

    var idx;
    for (idx = 1; idx <= 32; ++idx) {
        tiles.push({
            tileNum: idx,
            src: 'img/tile' + idx + '.jpg',
            flipped: false,
            matched: false
        });
    } // for each tile

    tiles = _.shuffle(tiles);
    var selectedTiles = tiles.slice(0, 8); // array values of 0-7 (8 total values)
    var tilePairs = [];

    _.forEach(selectedTiles, function (tile) {
        tilePairs.push(tile);
        tilePairs.push(_.clone(tile));
    });

    tilePairs = _.shuffle(tilePairs);

    var gameBoard = $('#game-board');
    var row = $(document.createElement('div'));
    var img;
    var elemIndex = 0;
    _.forEach(tilePairs, function (tile, elemIndex) {
        if (elemIndex > 0 && 0 === elemIndex % 4) {
            gameBoard.append(row);
            row = $(document.createElement('div'));
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
}

// start timer, refresh by second
function startTimer() {
    // get starting milliseconds
    var startTime = Date.now();    // = Date.now();
    timer = window.setInterval(function() {
        // floor trims decimal of number
        var elapsedSeconds = (Date.now() - startTime) / 1000;
        elapsedSeconds = Math.floor(elapsedSeconds);
        // add 1 second condition
        $('#elapsed-seconds').text(elapsedSeconds + ' seconds');
    }, 1000);
}

// update stats on HTML page
function statsUpdate() {
    $('#matches').text(' ' + matches);
    $('#remaining-pairs').text(' ' + remainingPairs);
    $('#attempts').text(' ' + attempts);
}