var combos={
	"also": ["person","woman"],
	"day": ["day","door","moon"],
	"door": ["day","moon","mouth","one","person","wood"],
	"horse": ["mouth","woman"],
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

var mySound = new sound("audio/ding.ogg");

function increaseScore(){
	mySound.play();
	var score = Number(document.getElementById("score").innerHTML.slice(3));
	score = score + 1;
	document.getElementById("score").innerHTML = "分數: " + String(score);
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
			increaseScore();
			changeImage2(arr[0][0]);
			changeImage2(arr[1][0]);
			changeCombined(`${[arr[0][1],arr[1][1]].sort().join("")}`);
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
	document.getElementById("score").innerHTML = "分數: 0";
	document.getElementById("start_grid").style.display = "none";
	document.getElementById("start_button").style.display = "none";
	document.getElementById("cursor").style.display = "block";
	document.getElementById("combined").style.opacity = 0;
	for (let i = 1; i < 17; i++) {
		changeImage(`image${i}`)
	}
	countdown();
}

function alertFunc() {
	document.getElementById("start_button").style.display = "block";
	document.getElementById("start_grid").style.display = "block";
	document.getElementById("cursor").style.display = "none";
  alert("Game Over!");
}

function countdown() {
  var seconds = 121;
  function tick() {
    var timer = document.getElementById("timer");
    seconds--;
    timer.innerHTML = `時間: ${Math.floor(seconds/60)}:${seconds%60 < 10 ? "0" : ""}${seconds%60}`;
    if (seconds > -1) {
      setTimeout(tick, 1000);
    }
    if (seconds === -1) {
      document.getElementById("timer").innerHTML = "";
      alertFunc()
    }
  }
  tick();
}

for (let i = 1; i < 17; i++) {
	document.getElementById(`image${i}`).addEventListener("click",function(){doSomething(`#image${i}`,combo,combos)});
}

setPos("timer",550,200)
setPos("combined",580,254)
setPos("score",550,378)
