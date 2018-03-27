class Tomagotchi {
	constructor(name,type) {
		this.name = name;
		this.hunger = 1;
		this.sleepiness = 1;
		this.boredom = 1;
		this.age = 0;
		this.type = type;
	}
	feed() {
		this.hunger--;
	}
	turnOffLights() {
		this.sleepiness--;
	}
	play() {
		this.boredom--;
	}
}