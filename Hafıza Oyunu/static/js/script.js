
// everything is added twice? this could be doubled using code
const deckCards = ["img1.jpg", "img1.jpg", "img2.jpg", "img2.jpg", "img3.jpg", "img3.jpg", "img4.jpg", "img4.jpg", "img5.jpg", "img5.jpg", "img6.jpg", "img6.jpg", "img7.jpg", "img7.jpg", "img8.jpg", "img8.jpg"];


const deck = document.querySelector(".deck");

let opened = [];

let matched = [];

const modal = document.getElementById("modal");


const reset = document.querySelector(".reset-btn");

const playbtn = document.querySelector(".play-btn");

const playAgain = document.querySelector(".play-again-btn");

const shuffleCards = document.querySelector(".shuffle-btn");


const movesCount = document.querySelector(".moves-counter");
let moves = 0;


const star = document.getElementById("star-rating").querySelectorAll(".star");

let starCount = 3;


const timeCounter = document.querySelector(".timer");

let time;

let minutes = 0;
let seconds = 0;

let timeStart = false;
let pressedPlayBtn = false;

// shuffle algorithm is good and efficient
function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
  }
  return array;
}


function startGame() {

	const shuffledDeck = shuffle(deckCards); 

	for (let i = 0; i < shuffledDeck.length; i++) {
		// you could use html templates here
		// most modern frameworks like react js made templates obsolete but they are still good to learn
		// we use handlebars.js but there are many many other ones you can pick from 
		const liTag = document.createElement('LI');

		liTag.classList.add('card');

		const addImage = document.createElement("IMG");

		liTag.appendChild(addImage);

		// what does raw=true do here?
		addImage.setAttribute("src", "static/img/" + shuffledDeck[i] + "?raw=true");

		// alt is not necessary, but random video game references are fun :P
		addImage.setAttribute("alt", "image of vault boy from fallout");

		deck.appendChild(liTag);
	}
}

startGame();


function removeCard() {

	while (deck.hasChildNodes()) {
		deck.removeChild(deck.firstChild);
	}
}


function timer() {
	// i don't recommend keeping time with intervals since they can drift or break easily
	// this video explains a lot about it https://www.youtube.com/watch?v=MCi6AZMkxcU
	time = setInterval(function() {
		seconds++;
			if (seconds === 60) {
				minutes++;
				seconds = 0;
			}

		// here the timer is in a different format than when everything is reset
		// also look into writing this with backticks as `${minutes} Dakika ${seconds} Saniye`, added in ES6
		// https://www.w3schools.com/js/js_string_templates.asp
		timeCounter.innerHTML = "<i class='fa fa-hourglass-start'></i>" + " Süre: " + minutes + " Dakika " + seconds + " Saniye " ;
	}, 1000);
}


// i am very happy to see this code
// a lot of people mess this up and create multiple intervals with no way of stopping them
function stopTime() {
	clearInterval(time);
}


function resetEverything() {

	stopTime();
	timeStart = false;
	seconds = 0;
	minutes = 0;

	// as i mentioned above, inconsistent format of time display, shouldn't this have been 0 Dakika 0 Saniye?
	// best to use templates to make sure such inconsistencies do not happen
	timeCounter.innerHTML = "<i class='fa fa-hourglass-start'></i>" + " Süre: 00:00";

	star[1].firstElementChild.classList.add("fa-star");
	star[2].firstElementChild.classList.add("fa-star");
	starCount = 3;

	moves = 0;
	movesCount.innerHTML = 0;

	matched = [];
	opened = [];

	removeCard();

	startGame();
}


function movesCounter() {
	// technically innerHTML is a string, but ++ is a numeric operator
	// javascript autoconverts to save you here but it's bad practice to rely on that
	movesCount.innerHTML ++;

	moves ++;
}


function starRating() {
	if (moves === 14) {

		star[2].firstElementChild.classList.remove("fa-star");
		starCount--;
	}

	// should this be an else if?
	// since moves can never be 14 and 18 at the same time?
	if (moves === 18) {
		star[1].firstElementChild.classList.remove("fa-star");
		starCount--;
	}
}


function compareTwo() {
	// every single if statement is checking for opened.length === 2
	// whenever code repeats like this, there is probably a better way of doing things
	// take a look at the equivalent alternative function compareTwo2()
	if (opened.length === 2) {

  		document.body.style.pointerEvents = "none";
  }

	if (opened.length === 2 && opened[0].src === opened[1].src) {

		match();

	} else if (opened.length === 2 && opened[0].src != opened[1].src) {

		noMatch();

	}
}

function compareTwo2(){
	if(opened.length !== 2){
		// if 2 cards aren't opened, then we don't need to do anything
		return;
	}

	document.body.style.pointerEvents = "none";
	if (opened[0].src === opened[1].src) {
		match();
	} else {
		noMatch();
	}
}


function match() {

	// i don't usually like timeouts to determine the end of animations
	// but with css animations i don't think there are better options
	setTimeout(function() {
		// could have been written as a loop, or a forEach function
		// even though there are only 2 elements and the code will be longer that way
		opened[0].parentElement.classList.add("match");
		opened[1].parentElement.classList.add("match");

		matched.push(...opened);

		document.body.style.pointerEvents = "auto";

		winGame();
	
		opened = [];
	}, 600);

	movesCounter();
	starRating();
}


function noMatch() {

	setTimeout(function() {
		// so they flip forward but not back?
		opened[0].parentElement.classList.remove("flip");
		opened[1].parentElement.classList.remove("flip");

		document.body.style.pointerEvents = "auto";

		opened = [];
	}, 700);

	movesCounter();
	starRating();
}


function AddStats() {

	const stats = document.querySelector(".modal-content");

	// every time you add stats you are creating 3 more p elements, but you are never removing them
	// they are empty elements so they are not visible, but if you finish the game many times in a row
	// the number of elements in your modal can get very large. this is very small memory leak
	for (let i = 1; i <= 3; i++) {

		const statsElement = document.createElement("p");
		
		statsElement.classList.add("stats");
		
		stats.appendChild(statsElement);
	}
	
	let p = stats.querySelectorAll("p.stats");
			
		p[0].innerHTML = "Bitirdiğin süre: " + minutes + " Dakika ve " + seconds + " Saniye";
		p[1].innerHTML = "Yapılan hamleler: " + moves;
		p[2].innerHTML = "Puanın: " + starCount + " ";
}


function displayModal() {

const modalClose = document.getElementsByClassName("close")[0];
	
	modal.style.display= "block";

	
	// this is not the best way to add click handlers, take a look at addEventListener/removeEventListener
	modalClose.onclick = function() {
		modal.style.display = "none";
	};

	// what if some other part of the code was listening to clicks on window?
	// this would remove those when the modal opens
	// and this code keeps running even after the modal is closed! in fact it runs every time we click anything!
	window.onclick = function(event) {
		console.log("does this need to run now?");
		if (event.target == modal) {
			modal.style.display = "none";
		}
	};
}


function winGame() {
	// i don't like the hardcoded 16 here
	// what if you later decided to add difficulty levels and changed the game to 5x4, or 3x4
	// maybe check for something like matched.length === allCards.length
	if (matched.length === 16) {
		stopTime();
		pressedPlayBtn = false;
		AddStats();
		displayModal();
	}
}

// adding these event listeners should probably be done in an initialize() function
// you have code that only runs on page load sprinkled in between your function definitions
// which makes it difficult to understand what runs on page load
// maybe put all these and the startGame() call up above into a separate function
// call that at the bottom of your script
deck.addEventListener("click", function(evt) {
	if (evt.target.nodeName === "LI") {
		
		console.log(evt.target.nodeName + " Was clicked");
		if(pressedPlayBtn === true)
		{
			flipCard();
		}
		//if(pressedBtn === true)
		//{
		//	flipCard();
		//}
		
	
		
		
	}

	function flipCard() {
		
		evt.target.classList.add("flip");
		
		addToOpened();
	}
	 
	
	function addToOpened() {
		
		if (opened.length === 0 || opened.length === 1) {
			
			opened.push(evt.target.firstElementChild);
		}
		
		compareTwo();
	}
}); 


reset.addEventListener('click', resetEverything);


playAgain.addEventListener('click',function() {
	modal.style.display = "none";
	resetEverything();
});

playbtn.addEventListener("click",function()
{
flipAllCards();

if (timeStart === false) {
	timeStart = true; 
	timer();
}
pressedPlayBtn = true;
}
);
function flipAllCards()
{
	let list = document.querySelectorAll("LI.card");
	for (let i = 0; i < list.length; ++i) {
		list[i].classList.add('flip');
	 }
	 setTimeout(() => {
		for (let i = 0; i < list.length; ++i) {
			list[i].classList.remove('flip');
		 }
	  }, 3000);
}

/*
overall this is very good programming. i tried breaking the gameplay but i couldn't find a way to do it
so your start/stop/reset functions are very well written
you only have a few minor issues which wouldn't even be noticable the end user
my only negative feedback would be your flip animations. i think they need a bit more work to look correct
the card face shouldn't suddenly become visible at the start of the animation, and the cards also needs to flip back
*/


