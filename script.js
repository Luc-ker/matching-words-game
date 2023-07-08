var combos={
	"also": ["horse","person","woman"],
	"day": ["day","door","moon"],
	"door": ["day","horse","moon","mouth","one","person","wood"],
	"horse": ["also","door","mouth","woman"],
	"moon": ["day","door","moon"],
	"mouth": ["door","horse","ten","woman","wood"],
	"one": ["door","one","ten","two","wood"],
	"person": ["also","door","son","ten","two","wood"],
	"son": ["person","woman","wood"],
	"ten": ["mouth","one","person"],
	"two": ["one","person"],
	"woman": ["also","horse","mouth","son"],
	"wood": ["door","mouth","one","person","son","wood"]
};

var clears={
	1: 5,
	2: 15,
	3: 30,
	4: 50
}

var combo = [];
var timeout;

function changeImage(image){
	images = ["also","day","door","horse","moon","mouth","one","person","son","ten","two","woman","wood"];
	let newImage = images[getRndInteger(0,images.length-1)];
	document.getElementById(image).src=`./images/${newImage}.png`
	console.log(newImage);
}

function changeImage2(image){
	images = ["also","day","door","horse","moon","mouth","one","person","son","ten","two","woman","wood"];
	let newImage = images[getRndInteger(0,images.length-1)];
	document.querySelector(image).src=`./images/${newImage}.png`;
	console.log(newImage);
}

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

var ding = new sound("audio/ding.ogg");
var levelUpSound = new sound("audio/level up.mp3");
/*var bgMusic = new sound("audio/4-01-Mods_de_Chocobo.mp3");*/

function increaseScore(){
	ding.play();
	var score = Number(document.getElementById("score").innerHTML.slice(11));
	document.getElementById("score").innerHTML = "分數 (Score): " + String(score+1);
	return score+1;
}

function levelUp(){
	levelUpSound.play();
	var level = Number(document.getElementById("level").innerHTML.slice(10));
	document.getElementById("level").innerHTML = " (Level): " + String(level+1);
	alert(`You are now at level ${level+1}!`);
}

function placeCursor(image) {
	var d = document.getElementById("cursor");
	let elem = document.querySelector(image);
	let rect = elem.getBoundingClientRect();
	d.style.left = rect["x"]+'px';
	d.style.top = rect["y"]+'px';
	d.style.opacity = 1;
	console.log(rect);
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function changeCombined(image){
	var d = document.getElementById("combined");
	d.src=`./images/${image}.png`;
	d.style.opacity = 1;
	console.log(image);
}

function getWord(image,arr){
	let path = document.querySelector(image).src;
	var word = path.slice(0,-4).split("/").pop();
	arr.push([image,word]);
	console.log(image,word);
}

function logCombo(arr){
	console.log(arr[0],arr[1]);
}

function doSomething(image,arr,combos){
	placeCursor(image);
	getWord(image,arr);
	logCombo(arr);
	if (arr.length === 2){
		if (combos[arr[0][1]].includes(arr[1][1])){
			var score = increaseScore();
			console.log(score);
			var level = Number(document.getElementById("level").innerHTML.slice(10));
			changeImage2(arr[0][0]);
			changeImage2(arr[1][0]);
			changeCombined(`${[arr[0][1],arr[1][1]].sort().join("")}`);
			if (clears[level] === score){
				levelUp();
			}
		}
		arr.length = 0;
		console.log(arr);
	}
}

function setPos(id,left,top){
	var d = document.getElementById(id);
	d.style.position = "absolute";
	d.style.left = left+'px';
	d.style.top = top+'px';
}

function setTimer() {
	resetBoard()
	document.getElementById("bgm").play()
	document.getElementById("score").innerHTML = "分數 (Score): 0";
	document.getElementById("start_grid").style.display = "none";
	document.getElementById("start_button").style.display = "none";
	document.getElementById("cursor").style.display = "block";
	document.getElementById("combined").style.opacity = 0;
	countdown();
}

function backToStart(){
	document.getElementById("start_button").style.display = "block";
	document.getElementById("start_grid").style.display = "block";
	document.getElementById("cursor").style.display = "none";
}

function alertFunc() {
  alert("Game Over!");
}

function countdown() {
  var seconds = 181;
  function tick() {
    var timer = document.getElementById("timer");
    seconds--;
    timer.innerHTML = `時間 (Time): ${Math.floor(seconds/60)}:${seconds%60 < 10 ? "0" : ""}${seconds%60}`;
    if (seconds > -1) {
      const counter = setTimeout(tick, 1000);
    }
    if (seconds === -1) {
      document.getElementById("timer").innerHTML = "時間 (Time): 0:00";
    	backToStart()
      alertFunc()
    }
  }
  tick();
}

function resetBoard(){
	for (let i = 1; i < 17; i++) {
		changeImage(`image${i}`)
	}
}

document.getElementById("bgm").addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);
document.getElementById("bgm").loop = true

resetBoard()
for (let i = 1; i < 17; i++) {
	document.getElementById(`image${i}`).addEventListener("click",function(){doSomething(`#image${i}`,combo,combos)});
}
setPos("level",510,176)
setPos("rules",762,176)
setPos("timer",510,284)
setPos("combined",572,392)
setPos("rules2",762,390)
setPos("score",510,516)
setPos("reset_button",510,626)


