class Tamagotchi {
	constructor(name,type) {
		this.name = name;
		this.hunger = 1;
		this.sleepiness = 1;
		this.boredom = 1;
		this.age = 1;
		this.type = type;
		//this.acting stores whether the tamagotchi is eating, sleeping or playing. If true, other actions
		//can't be performed
		this.acting = false;					
		this.int = setInterval(oneDay,20000); //set the tamagotchi's timer
		this.timer = 0;			//timer to increment
	}
	feed() {
		//code to check if the tamagotchi is already acting
		if (this.acting) {
			return;
		}
		this.delayAction(2100);

		//decrease hunger
		if (this.hunger !== 1) {
			this.hunger--;
		}
		//decrease hunger in the DOM
		iterateStat($('#hunger'),true);

		//flash the eating image on a one second delay
		$('#action-img').attr('src','img/actions/eat.gif');
		flashActionImg();
	}
	turn() {
		//turn is short for turn off lights. It had to be called turn for the doAction function to work
		//this works like the feed method but it decreases sleepiness
		if (this.acting) {
			return;
		}
		this.delayAction(2100);

		if (this.sleepiness !== 1) {
			this.sleepiness--;
		}
		iterateStat($('#sleep'),true);

		$('#action-img').attr('src','img/actions/sleep.gif');
		$('#action-img').toggleClass('hidden');
		setTimeout(() => {
			$('#action-img').toggleClass('hidden')
		},2000);
	}
	play() {
		//this works like the feed method but it decreases boredom
		if (this.acting) {
			return;
		}
		this.delayAction(2100);

		if (this.boredom !== 1) {
			this.boredom--;
		}
		iterateStat($('#boredom'),true);

		$('#action-img').attr('src','img/actions/play.gif');
		flashActionImg();
	}
	increaseAge() {
		//this will increase the age for the tamagotchi and update the DOM

		//increase age
		this.age++;

		//update the DOM
		iterateStat($('#age'));

		//If age is 15, kill the tamagotchi
		if (this.age === 15) {
			alert("Your tamagotchi has lived to the ripe old age of 15.");
			this.die(true);
		}
	}
	delayAction(delay) {
		//say that the tamagotchi is acting so that other action won't happen
		this.acting = true;

		//set a delay before it can act again. This is 2 to 4 seconds depending on the action
		setTimeout(() => {
				this.acting = false;
			},delay
		);
	}
	aDayInTheLife() {
		//this is triggered by the interval timer. Every 20 seconds, the hunger, sleepiness, and boredom go up
		this.hunger+=2;
		this.boredom++;
		this.sleepiness++;

		//this will update the stats in the DOM
		let stats = $('.stat');

		for (let i = 0; i < stats.length; i++) {
			if(stats.eq(i).attr('id') === 'hunger') {
				iterateStat(stats.eq(i),false,2);
			}
			else {
				iterateStat(stats.eq(i));
			}
		}
		
		//if hunger, boredom, or sleepiness gets too high, the tamagotchi dies
		if (this.hunger >= 10 || this.boredom >= 10 || this.sleepiness >= 10) {
			this.die();
		}

		this.timer++;

		//update the stats
		if (this.timer%3 === 0) {
			this.increaseAge();
		}
	}
	die(oldAge) {
		//stop the tamagotchi's timer
		clearInterval(this.int);

		//remove the tamagotchi from the saved tamagotchi's
		let index = tamagotchis.indexOf(tamagotchi);
		tamagotchis.splice(index,1);
		$('.action').addClass('hidden');
		alert("Your tamagotchi has died!");

		//change the container border
		//green for reaching old age and red for death by other cause
		if(oldAge) {
			$('#container').css('border','5px solid green');
		}
		else {
			$('#container').css('border','5px solid red');
		}

		saveTamagotchi();
	}
}

//create a new tamagotchi
function createTamagotchi(e) {
	//get the tamagotchi's name from the user
	let name = prompt("What should your Tamagotchi's name be?");

	if(!name) {
		return;
	}		

	//check to see if the tamagotchi name matches one already in use
	for (tam of tamagotchis) {
		if (tam.name === name) {
			alert("That name is already taken.");
			createTamagotchi(e);
		}
	}

	//the type is in the path for the tamagotchi image they clicked
	//I slice the type out of the image path here
	let type = $(e.currentTarget).attr('src');
	type = type.slice(4,type.length - 4);

	//create the new tamagotchi and save it to the tamagotchis array
	tamagotchi = new Tamagotchi(name, type);
	tamagotchis.push(tamagotchi);
	localStorage.setItem('tamagotchis', JSON.stringify(tamagotchis));

	//hide the loading screen
	$('p').addClass('hidden');

	let container = $('#select');
	container.attr('id', 'container');

	//show the tamagotchi in it's container
	displayTamagotchi(type, container);

	//show the action buttons and add their click events
	$('.action').removeClass('hidden');
	$('.action').click(doAction);
}

//load a tamagotchi
function loadTamagotchi() {
	//ask for the name of the tamagotchi to load
	let name = prompt("What's the name of your tamagotchi?");

	//save the current tamagotchi before we load another one
	clearInterval(tamagotchi.int);
	saveTamagotchi();

	//grab the container and make sure it has the container id
	let container = $('#container');
	if (container.length === 0) {
		container = $('#select');
		container.attr('id','container');
	}
	$('.action').removeClass('hidden');

	//loop through the saved tamagotchis
	for (tam of tamagotchis) {

		//check to see if the tamagotchi name matches
		if (tam.name === name) {
			tamagotchi = tam;
			
			//display the tamagotchi
			displayTamagotchi(tamagotchi.type,container);

			$('.action').off('click');
			$('.action').click(doAction);

			//setup the stat properties in the DOM so that they match what's saved in the tamagotchi
			let stats = $('.stat');
			let text = [];
			let prop = "";
			for (let i = 0; i < stats.length; i++) {
				text = stats.eq(i).text().split(" ");
				prop = text[0].slice(0,(text[0].length-1)).toLowerCase();
				stats.eq(i).text(text[0]+" "+tamagotchi[prop]);
			}

			//setup up the age in the DOM with the saved age
			$('#age').text("Age: "+tamagotchi.age);

			//start the tamagotchi's timer back up
			tamagotchi.int = setInterval(oneDay,20000);


			return;
		}
	}

	alert("We couldn't find that tamagotchi.");
}

//save the tamagotchi to local storage
function saveTamagotchi() {

	//----------------------------------------------------------------//
	// This code is unnecessary since the object gets updated elsewhere

	// let index = tamagotchis.indexOf(tamagotchi);
	// tamagotchis[index] = tamagotchi;
	//----------------------------------------------------------------//

	localStorage.setItem('tamagotchis',JSON.stringify(tamagotchis));
}

//create a new tamagotchi
function newTamagotchi() {

	//save the existing tamagotchi and stop it's timer
	clearInterval(tamagotchi.int);
	saveTamagotchi();

	//empty the tamagotchi container out
	let container = $('#container');
	container.css('border','none');
	container.empty();
	container.attr('id','select');

	//Rebuild the loading screen//

	//loop through the available tamagotchi types and add each of their images to the container
	for (let i = 0; i < availableT.length; i++) {
		let url = "img/"+availableT[i]+".png";
		appendTamImg(url,container);
	}

	//show the "Click a tamagotchi text"
	$('p').removeClass('hidden');

	//hide the stats and action buttons for the previous tamagotchi
	$('#stats').css('display','none');
	$('.action').addClass('hidden');

	//set hunger, sleepiness, and boredom to 1 in the DOM
	let stats = $('.stat');
	let text = [];
	for (let i = 0; i < stats.length; i++) {
		text = stats.eq(i).text().split(" ");
		stats.eq(i).text(text[0]+" "+1);
	}

	//set the age of the new tamagotchi to 1 in the DOM
	$('#age').text("Age: 1");
}

//show the tamagotchi in its container

function displayTamagotchi(type,container) {

	//empty the container incase something is in there
	container.empty();
	//give the container the circular border
	container.css('border','1px solid black');

	//add an empty, hidden action image for eating, sleeping, and playing
	container.append($('<img id="action-img" class="hidden" src="">'));

	//create the image of the tamagotchi
	//the type corresponds to the name of the image (i.e. tiger)
	let img = $('<img>');
	img.attr('src','img/'+type+'.png');
	img.attr('id','tamagotchi')
	img.appendTo(container);

	//show the stats (hunger, sleepiness, boredom, age)
	$('#stats').css('display','flex');
}

//This function decides which action method to call on the tamagotchi
//It grabs the first word of the button that was clicked and uses it as the tamagotchi method to call
function doAction(e) {
	let button = $(e.currentTarget);
	let action = button.text().toLowerCase().split(" ")[0];
	eval("tamagotchi."+action+"();");
}

//This function runs on a 20 second interval
//It will increase hunger, sleepiness, boredom, and age
function oneDay() { 
	
	//iterate the timer
	tamagotchi.timer++;

	//update the stats
	tamagotchi.aDayInTheLife();
	if (tamagotchi.timer%3 === 0) {
		tamagotchi.increaseAge();
	}
}

//this will increase or decrease hunger, sleepiness, or boredom in the DOM
//elem is the div holding the text (i.e. "Hunger: 1")
//decrease will decrease the stat if it's true. Otherwise, the stat will increase
//amount determines the amount to increase or decrease
function iterateStat(elem,decrease,amount=1) {

	//split the text (example result: ['Hunger: ',1])
	let text = elem.text().split(" ");

	//get the number for the stat
	let num = text[1];
	num = parseInt(num);

	//if decrease, decrease it. Otherwise, increase it
	if (decrease) {
		num -= amount;
		if (num < 1) {
			num = 1;
		}
	}
	else {
		num += amount;
	}

	//put the element text back together and send it to the DOM
	elem.text(text[0]+" "+num);
}

//This will show and hide the action image on a 0.5 second interval for 2 seconds total
//(for feeding, sleeping, and playing)
function flashActionImg() {
	let timer = 0;
	$('#action-img').toggleClass('hidden');
	let interval = setInterval(() => {
		$('#action-img').toggleClass('hidden');
		if (timer === 3) {
			clearInterval(interval);
		}
		timer++
	},500);
}

//append a tamagotchi image to the tamagotchi container
//this is used when we reload the loading screen (a.k.a tamagotchi selection screen)
function appendTamImg(url,target) {
	let img = $('<img>');
	img.attr('src',url);
	img.click(createTamagotchi);
	img.appendTo(target);
}

//set an array of all of the types of tamagotchis you can pick
const availableT = ['Bear','Gopher','Panda','Tiger',
'Cat','Hippo','Penguin','Turtle','Zebra','Pig','Lion',
'Dog','Elephant','Monkey','Rabbit','Frog','Mouse','Sheep',
'Giraffe','Ox','Snake'];

//set up the tamagotchi array and an object with the tamagotchis that are being played
let tamagotchis = [];
let tamagotchi = {};

//load the array of tamagotchis from last session (stored in local storage)
const loadT = localStorage.getItem('tamagotchis');

if (loadT) {
 	tamagotchis = JSON.parse(loadT);
}

//Add a click event to the load button that runs loadTamagotchi
$('#load').click(loadTamagotchi);

//Add a click event to the save button that runs saveTamagotchi
$('#save').click(saveTamagotchi);

//Add a click event to the tamagotchi images on the load screen that runs createTamagotchi
$('#select img').click(createTamagotchi);

//Add a click event to the new button that runs newTamagotchi
$('#new').click(newTamagotchi);

