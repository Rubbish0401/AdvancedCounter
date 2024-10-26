import { data } from "../data-process/data-process.mjs";
import { Preferences } from "../data-process/Preferences.mjs";

counter = data.counter;
preferences = data.preferences;

counter.addEventListener("import", obj => {
	let _counter = obj.target;

	maxInput.value = _counter.getMax();
	countInput.value = _counter.getCount();
});

preferences.addEventListener("import", obj => {
	let _preferences = obj.target;

	backgroundInput.value = _preferences.getAppearance().background;
	bgvisibleInput.checked = _preferences.getAppearance().bgvisible;
	colourInput.value = _preferences.getAppearance().colour;

	longclickStartInput.value = _preferences.getLongclick().start;
	longclickEndInput.value = _preferences.getLongclick().end;
});

//
document.addEventListener("DOMContentLoaded", root_event => {

	// Get Elements
	maxInput = document.getElementById("input-max");
	countInput = document.getElementById("input-count");
	addInput = document.getElementById("input-add");

	backgroundInput = document.getElementById("input-background");
	bgvisibleInput = document.getElementById("input-bgvisible");
	colourInput = document.getElementById("input-colour");

	longclickStartInput = document.getElementById("input-longclick-start");
	longclickEndInput = document.getElementById("input-longclick-end");

	resetPrefBtn = document.getElementById("btn-reset-pref");

	// Custom

	// EventListener
	maxInput.addEventListener("change", event => counter.setMax(Number(event.target.value)));
	countInput.addEventListener("change", event => counter.setCount(Number(event.target.value)));
	addInput.addEventListener("change", event => {
		counter.addCount(Number(event.target.value));
		event.target.value = null;
	});

	backgroundInput.addEventListener("change", event => preferences.setAppearance({ background: String(event.target.value) }));
	backgroundInput.addEventListener("input", event => preferences.setAppearance({ background: String(event.target.value) }));
	bgvisibleInput.addEventListener("change", event => preferences.setAppearance({ bgvisible: event.target.checked }));
	colourInput.addEventListener("change", event => preferences.setAppearance({ colour: String(event.target.value) }));
	colourInput.addEventListener("input", event => preferences.setAppearance({ colour: String(event.target.value) }));

	longclickStartInput.addEventListener("change", event => preferences.setLongclick({ start: Number(event.target.value) }));
	longclickEndInput.addEventListener("change", event => preferences.setLongclick({ end: Number(event.target.value) }));

	for (let elem of [maxInput, countInput, longclickStartInput, longclickEndInput]) elem.addEventListener("keydown", event => {
		let keys = ["ArrowUp", "ArrowDown"];
		if (keys.includes(event.key)) {
			event.target.value = Number(event.target.value) + (-1) ** keys.indexOf(event.key);
			event.target.dispatchEvent(new InputEvent("change"));
		}
	});

	resetPrefBtn.addEventListener("click", event => {
		let newPref = new Preferences();
		
		preferences.setAppearance(newPref.getAppearance());
		preferences.setLongclick(newPref.getLongclick());
	});

	//
});