const tamagotchis = [];
// let tamagotchi = {};


class Tamagotchi {
	constructor(name,type) {
		this.name = name;
		this.hunger = 1;
		this.sleepiness = 1;
		this.boredom = 1;
		this.age = 0;
		this.type = type;
	}
	feed() {
		if (this.hunger !== 1) {
			this.hunger--;
		}

		alert("You fed "+this.name+"! Hunger: "+this.hunger);
	}
	turn() {
		if (this.sleepiness !== 1) {
			this.sleepiness--;
		}
		alert(this.name+" is sleeping. Sleepiness: "+this.sleepiness);
	}
	play() {
		if (this.boredom !== 1) {
			this.boredom--;
		}
		alert("You played with "+this.name+". Boredom: "+this.boredom);
	}
	increaseAge() {
		this.age++;
	}
	aDayInTheLife() {
		this.hunger++;
		this.boredom++;
		this.sleepiness++;
	}
}

let tamagotchi = new Tamagotchi("Ben","Bear");

$('#load').click(loadTamagotchi);

$('#save').click(saveTamagotchi);

$('img').click(createTamagotchi);

function createTamagotchi(e) {
	let name = prompt("What should your Tamagotchi's name be?");
	let type = $(e.currentTarget).attr('src');
	type = type.slice(4,type.length - 4);

	tamagotchi = new Tamagotchi(name,type);
	tamagotchis.push(tamagotchi);
	console.log(tamagotchi);

	$('p').remove();

	let container = $('#select');
	container.empty();
	container.attr('id','container');

	let img = $('<img>');
	img.attr('src','img/'+type+'.jpg');
	img.attr('id','tamagotchi')
	img.appendTo(container);

	let body = $('body');
	$('.action').css('display','block');

	setInterval(tamagotchi.increaseAge,4000);
}

function loadTamagotchi() {
	let name = prompt("What's the name of your tamagotchi?");
	saveTamagotchi();
	for (tam of tamagotchis) {
		if (tam.name === name) {
			tamagotchi = tam;
			return;
		}
	}
	alert("We couldn't find that tamagotchi.");
}

function saveTamagotchi() {
	let index = tamagotchis.indexOf(tamagotchi);
	tamagotchis[index] = tamagotchi;
}

$('.action').click(doAction);

function doAction(e) {
	let button = $(e.currentTarget);
	let action = button.text().toLowerCase().split(" ")[0];
	eval("tamagotchi."+action+"();");
}

function age() {
	tamagotchi.increaseAge();
}

function oneDay() {
	tamagotchi.aDayInTheLife();
}

setInterval(age,5000);

setInterval(oneDay,1000);







