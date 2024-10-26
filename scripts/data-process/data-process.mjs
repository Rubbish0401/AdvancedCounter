import { Counter } from "./Counter.mjs";
import { Preferences } from "./Preferences.mjs";

//

const KEY_COUNT_OLD = "HOiRVjjXkCHKJgNRJVyfQHoN";
const KEY_PREFERENCES_OLD = "KjwZOQj3cxWXhGE7OyuYAZMh";

const KEY_COUNT = "cdxhWruzXpnfIQUqEXUlg3H2";
const KEY_PREFERENCES = "U9VSF1sBaQLbTmBGEkVUFVlr";

//

export var data = Object.create(null);
data.counter = new Counter();
data.preferences = new Preferences();

data.counter.addEventListener("max-change", obj => saveCount(obj.target));
data.counter.addEventListener("count-change", obj => saveCount(obj.target));

data.preferences.addEventListener("appearance-change", obj => savePreferences(obj.target));
data.preferences.addEventListener("longclick-change", obj => savePreferences(obj.target));

//
function saveCount(obj) {
	localStorage.setItem(KEY_COUNT, JSON.stringify(obj instanceof Counter ? obj.toObject() : obj));
}

function loadCount() {
	let oldData = localStorage.getItem(KEY_COUNT_OLD);
	let savedData = localStorage.getItem(KEY_COUNT);
	let obj = { max: -1, count: 0 };

	if (oldData) {
		let oldObj = JSON.parse(oldData);
		if(oldObj.hasOwnProperty("max")) obj.max = oldObj.max;
		if(oldObj.hasOwnProperty("count")) obj.count = oldObj.count;

		localStorage.removeItem(KEY_COUNT_OLD);
	} else if (savedData) {
		let dataObj = JSON.parse(savedData);
		if(dataObj.hasOwnProperty("max")) obj.max = dataObj.max;
		if(dataObj.hasOwnProperty("count")) obj.count = dataObj.count;
	}

	return obj;
}

function savePreferences(obj) {
	localStorage.setItem(KEY_PREFERENCES, JSON.stringify(obj instanceof Preferences ? obj.toObject() : obj));
}

function loadPreferences() {
	let oldData = localStorage.getItem(KEY_PREFERENCES_OLD);
	let savedData = localStorage.getItem(KEY_PREFERENCES);
	let obj = {
		appearance: {
			background: "#FFFFFF",
			bgvisible: true,
			colour: "#5F6368",
		},

		longclick: {
			start: 500,
			end: 1000
		}
	};

	if (oldData) {
		let oldObj = JSON.parse(oldData);
		switch (true) {
			case oldObj.hasOwnProperty("appearance"):
				break;

			case oldObj.hasOwnProperty("longclick"):
				if (oldObj.longclick.hasOwnProperty("start")) obj.longclick.start = oldObj.longclick.start;
				if (oldObj.longclick.hasOwnProperty("end")) obj.longclick.end = oldObj.longclick.end;
				break;
		}

		localStorage.removeItem(KEY_PREFERENCES_OLD);
	} else if (savedData) {
		let dataObj = JSON.parse(savedData);
		switch(true){
			case dataObj.hasOwnProperty("appearance"):
				if(dataObj.appearance.hasOwnProperty("background")) obj.appearance.background = dataObj.appearance.background;
				if(dataObj.appearance.hasOwnProperty("bgvisible")) obj.appearance.bgvisible = dataObj.appearance.bgvisible;
				if(dataObj.appearance.hasOwnProperty("colour")) obj.appearance.colour = dataObj.appearance.colour;
				break;
			
			case dataObj.hasOwnProperty("longclick"):
				if (dataObj.longclick.hasOwnProperty("start")) obj.longclick.start = dataObj.longclick.start;
				if (dataObj.longclick.hasOwnProperty("end")) obj.longclick.end = dataObj.longclick.end;
				break;
		}
	}

	return obj;
}
//

window.addEventListener("storage", event => sync());
window.addEventListener("load", event => sync());

function sync() {
	data.counter.importObject(loadCount());
	data.preferences.importObject(loadPreferences());
}