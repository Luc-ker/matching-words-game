const combos = {
	"also": ["horse", "person", "woman"],
	"day": ["day", "door", "moon"],
	"door": ["day", "horse", "moon", "mouth", "one", "person", "wood"],
	"horse": ["also", "door", "mouth", "woman"],
	"moon": ["day", "door", "moon"],
	"mouth": ["door", "horse", "ten", "woman", "wood"],
	"one": ["door", "one", "ten", "two", "wood"],
	"person": ["also", "door", "son", "ten", "two", "wood"],
	"son": ["person", "woman", "wood"],
	"ten": ["mouth", "one", "person"],
	"two": ["one", "person"],
	"woman": ["also", "horse", "mouth", "son"],
	"wood": ["door", "mouth", "one", "person", "son", "wood"]
};
const clears = {
	1: 5,
	2: 15,
	3: 30,
	4: 50
};
const cellListeners = new Map();
const images = ["also", "day", "door", "horse", "moon", "mouth",
    "one", "person", "son", "ten", "two", "woman", "wood"];
var words = [];

// Sound functions
var ding = new sound("audio/ding.ogg");
var levelUpSound = new sound("audio/level up.mp3");

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

document.getElementById("bgm").addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    },
false);
document.getElementById("bgm").loop = true;

document.getElementById("mute").addEventListener('click', function() {
        const newStatus = !document.getElementById("bgm").muted;
        updateSoundElements(newStatus);
    }
);

function updateSoundElements(newStatus) {
    document.getElementById("bgm").muted = newStatus;
    document.getElementById("volume-img").src = newStatus ? "images/volume-mute-fill.png" : "images/volume-up-fill.png";
    document.cookie = `mute=${newStatus}; path=/;`;
}

// Variable-related functions
function increaseScore() {
    if (!document.getElementById("bgm").muted) {
        ding.play();
    }
    score ++;
	updateScoreDisplay();
}

function updateScoreDisplay() {
    document.getElementById("score").innerHTML = "分數 (Score): " + String(score);
}

function levelUp() {
	levelUpSound.play();
    level ++;
    updateLevelDisplay();
	alert(`You are now at level ${level}!`);
}

function updateLevelDisplay() {
    document.getElementById("level").innerHTML = "等級 (Level): " + String(level);
}

// Handling word selection
function storeWord(image){
	let path = document.getElementById(image).src;
	var word = path.slice(0, -4).split("/").pop();
	words.push([image, word]);
	console.log(image, word);
}

function checkMatch() {
    if (words.length < 2) {
        return;
    }

    const firstWord = words[0][1];
    const secondWord = words[1][1];

    if (combos[firstWord] && combos[firstWord].includes(secondWord)) {
        changeCombined([firstWord, secondWord].sort().join(""));
        changeImage(words[0][0]);
        changeImage(words[1][0]);
        words = [];
        resetCellBg();
        increaseScore();
        if (score === clears[level]){
            levelUp();
        }
    } else {
        words = words.slice(-1);
    }
}

function selectCell(cell_num) {
    const cell = document.getElementById(`cell${cell_num}`);
    if (cell) {
        if (currentImage !== -1) {
            resetCellBg();
        }
        cell.style.backgroundColor = "red";
        currentImage = cell_num;
    }
    storeWord(`image${cell_num}`);
    checkMatch();
}

// Image functions
function changeImage(image){	
	var newImage = images[Math.floor(Math.random() * images.length)];
	document.getElementById(image).src=`./images/${newImage}.png`;
	console.log(newImage);
}

function resetCellBg() {
    const previousCell = document.getElementById(`cell${currentImage}`);
    if (previousCell) {
        previousCell.style.backgroundColor = "";
    }
}

function changeCombined(image){
	var d = document.getElementById("combined");
	d.src=`./images/${image}.png`;
	d.style.display = "block";
	console.log(image);
}

function shuffleBoard() {
    for (let i = 1; i < 17; i++) {
        changeImage(`image${i}`);
    }
    resetCellBg();
}

function resetBoard() {
    for (let i = 1; i < 17; i++) {
    	document.getElementById(`image${i}`).src=`./images/blank.png`;
    }
    resetCellBg();
}

// Timer functions
function countdown() {
    var seconds = 181;
    function tick() {
        if (!running) {
            document.getElementById("timer").innerHTML = "時間 (Time): 3:00";
            return;
        }
        var timer = document.getElementById("timer");
        seconds--;
        timer.innerHTML = `時間 (Time): ${Math.floor(seconds/60)}:${seconds%60 < 10 ? "0" : ""}${seconds%60}`;
        if (seconds > -1) {
            const counter = setTimeout(tick, 1000);
        }
        if (seconds === -1) {
            document.getElementById("timer").innerHTML = "時間 (Time): 0:00";
            endGame();
        }
    }
    tick();
}

// Listener functions
function addCellListeners() {
    for (let i = 1; i < 17; i++) {
        // Define the listener function and store it
        const listener = () => selectCell(i);
        cellListeners.set(i, listener);
        document.getElementById(`cell${i}`).addEventListener("click", listener);
    }
}

function removeCellListeners() {
    for (let i = 1; i < 17; i++) {
        const cell = document.getElementById(`cell${i}`);
        const listener = cellListeners.get(i);
        if (listener) {
            cell.removeEventListener("click", listener);
        }
    }
}

function addButtonListeners() {
    document.getElementById("reset_button").addEventListener("click", shuffleBoard);
    document.getElementById("end_button").addEventListener("click", endGame);
}

function removeButtonListeners() {
    document.getElementById("reset_button").removeEventListener("click", shuffleBoard);
    document.getElementById("end_button").removeEventListener("click", endGame);
}

function endGame() {
    resetBoard();
    resetCellBg();
    removeCellListeners();
    removeButtonListeners();
    running = false;
    updateScoreDisplay();
    updateLevelDisplay();
	document.getElementById("start_button").style.display = "block";
	document.getElementById("reset_button").style.display = "none";
	document.getElementById("end_button").style.display = "none";
	document.getElementById("combined").style.display = "none";
    var highScore = getHighScoreCookie();
    if (typeof highScore == 0) {
        highScoreString = "New high score!";
        document.cookie = `highScore=${score}; path=/;`;
    } else {
        if (score > highScore) {
            highScoreString = `You beat your previous high score of ${highScore}!`;
            document.cookie = `highScore=${score}; path=/;`;
        } else if (score == highScore) {
            highScoreString = "You tied your previous high score!";
        } else {
            highScoreString = `Your highest score is: ${highScore}`;
        }
    }
    alert(`Game Over!\nYour final score is: ${score}\n${highScoreString}`);
    currentImage = -1;
    score = 0;
    level = 1;
}

function startGame() {
    shuffleBoard();
    addCellListeners();
    addButtonListeners();
    running = true;
	document.getElementById("start_button").style.display = "none";
	document.getElementById("reset_button").style.display = "block";
	document.getElementById("end_button").style.display = "block";
	document.getElementById("bgm").play()
	countdown();
}

// Cookie functions
function getCookie(cname) {
    const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${cname}=`))
        ?.split("=")[1];
    return cookieValue;
}

function getMuteCookie() {
    var mute = getCookie("mute");
    if (mute == "true") {
        mute = true;
    } else {
        mute = false;
    }
    return mute;
}

function getHighScoreCookie() {
    var highScore = getCookie("highScore");
    if (typeof highScore === "undefined") {
        highScore = 0;
    } else {
        highScore = Number(highScore);
    }
    return highScore;
}

// Driver Code
// Add event listeners to each image element
document.getElementById("start_button").addEventListener("click", function() {
        startGame();
    }
);

var currentImage = -1;
var score = 0;
var level = 1;
var running = false;
var mute = getMuteCookie();
var highScore = getHighScoreCookie();
updateSoundElements(mute);  // true = muted, false = sound on