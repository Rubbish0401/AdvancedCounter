export class Preferences{
	
	#appearance = {
		background: "#FFFFFF",
		bgvisible: false,
		colour: "#5F6368",
	};

	#longclick = {
		start: 500,
		end: 1000
	};

	#listener = {
		"global": [],
		"import": [],
		"appearance-change": [],
		"longclick-change": []
	};

	constructor(obj){
		if(obj instanceof Preferences) obj = obj.toObject();
		this.importObject(obj);
	}

	//
	toObject(){
		return {
			appearance: this.getAppearance(),
			longclick: this.getLongclick()
		};
	}

	importObject(obj){
		let before = this.toObject();
		if(obj){
			switch(true){
				case obj.appearance && typeof obj.appearance == "object":
					if(obj.appearance.hasOwnProperty("background")) this.#appearance.background = String(obj.appearance.background);
					if(obj.appearance.hasOwnProperty("bgvisible")) this.#appearance.bgvisible = Boolean(obj.appearance.bgvisible);
					if(obj.appearance.hasOwnProperty("colour")) this.#appearance.colour = String(obj.appearance.colour);
					break;

				case obj.longclick && typeof obj.longclick == "object":
					if(obj.longclick.hasOwnProperty("start") && !isNaN(obj.longclick.start)) this.#longclick.start = parseInt(obj.longclick.start);
					if(obj.longclick.hasOwnProperty("end") && !isNaN(obj.longclick.end )) this.#longclick.end = parseInt(obj.longclick.end);
					break;
			}

			let after = this.toObject();
			for(let action of this.#listener["import"]) action({ target: this, before: before, after: after });
			for(let action of this.#listener["global"]) action({ target: this });
		}
	}

	//
	getAppearance(){ return { background: this.#appearance.background, bgvisible: this.#appearance.bgvisible, colour: this.#appearance.colour,}; }
	getLongclick(){ return { start: this.#longclick.start, end: this.#longclick.end }; }

	setAppearance(obj){
		let before = this.getAppearance();
		this.importObject({ appearance: obj });

		let after = this.getAppearance();
		for(let action of this.#listener["appearance-change"]) action({ target: this, before: before, after: after });
		for(let action of this.#listener["global"]) action({ target: this });
	}

	setLongclick(obj){
		let before = this.getLongclick();
		this.importObject({ longclick: obj });

		let after = this.getLongclick();
		for(let action of this.#listener["longclick-change"]) action({ target: this, before: before, after: after });
		for(let action of this.#listener["global"]) action({ target: this });
	}

	//
	addEventListener(key, ...actions){
		if(Object.keys(this.#listener).includes(key)){
			actions.filter(value => typeof value === "function");
			this.#listener[key].push(...actions);
		}
	}

	removeEventListener(key, ...actions){
		if(Object.keys(this.#listener).includes(key)) {
				for(let action of actions) if(Object.keys(this.#listener[key]).includes(action)){
					let index = this.#listener[key].indexOf(action);
					this.#listener[key].splice(index, 1);
				}
		}
	}

	clearEventListener(key){
		if(Object.keys(this.#listener).includes(key))
			this.#listener[key] = [];
	}
}