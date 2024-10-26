export class Counter{

	#max = -1;
	#count = 0;

	#listener = {
		"global": [],
		"import": [],
		"max-change": [],
		"count-change": [],
	};

	constructor(obj){
		if(obj instanceof Counter) obj = obj.toObject();
		this.importObject(obj);
	}

	//
	toObject(){
		return {
			max: this.#max,
			count: this.#count
		}
	}

	importObject(obj){
		let before = {
			max: this.getMax(),
			count: this.getCount()
		};

		if(obj){
			if(obj.hasOwnProperty("max") && !isNaN(obj.max)) this.#max = parseInt(obj.max);
			if(obj.hasOwnProperty("count") && !isNaN(obj.count)) this.#count = parseInt(obj.count);

			let max = this.getMax(), count = this.getCount();
			if(count < 0) this.#count = 0;
			else if(max >= 0 && max < count) this.#count = max;

			let after = {
				max: this.getMax(),
				count: this.getCount()
			};

			for(let action of this.#listener["import"]) action({ target: this, before: before, after: after });
			for(let action of this.#listener["global"]) action({ target: this });
		}
	}

	//
	getMax(){ return this.#max; }
	getCount(){ return this.#count; }

	setMax(max){
		let before = this.getMax();
		this.importObject({ max: max });
		
		let after = this.getMax();
		for(let action of this.#listener["max-change"]) action({ target: this, before: before, after: after });
		for(let action of this.#listener["global"]) action({ target: this });
	}
	setCount(count){
		let before = this.getCount();
		this.importObject({ count: count });

		let after = this.getCount();
		for(let action of this.#listener["count-change"]) action({ target: this, before: before, after: after });
		for(let action of this.#listener["global"]) action({ target: this });
	}
	addCount(count){ if(["number", "bigint"].includes(typeof count)) this.setCount(this.getCount() + count); }

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