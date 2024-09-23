// Constants
const KEY = {
	DATA: "HOiRVjjXkCHKJgNRJVyfQHoN",
	PREFERENCES: "KjwZOQj3cxWXhGE7OyuYAZMh",
};

const LONG_CLICK_THERESHOULD = {
	START: 500,
	END: 1000,
};

var LONG_CLICK_INTERVAL = 10;
var AUTO_SAVE_INTERVAL = 100;

// Elements
var back;

var displayPage;
var display;
var increceBtn;
var decreceBtn;

var settingsBtn;
var backBtn;

var countInput;
var maxInput;
var autosaveInput;
var longClickInput;
var modeInput;

// Other Variables
var displayMode = 0;
var count = 0;
var countMax;

// Temporary-use Variables
var longClickCount = 0;
var longClickInterval;
var noClickEvent = false;

var autoSaveCount = 0;
var autoSaveInterval;

// Functions
function fillChars(text = "", length = 0, char = "0", direction = 0) {
	text = text.toString();

	let filler = "";
	for (let i = 0; i < Math.max(0, length - text.length); i++) filler += char;

	return (direction == 0 ? filler : "") + text + (direction == 1 ? filler : "");
}

function saveData(){
	let data = {
		count: count,
		max: countMax,
	};

	localStorage.setItem(KEY.DATA, JSON.stringify(data));
}

function loadData(){
	let data = JSON.parse(localStorage.getItem(KEY.DATA));
	if(data){
		count = data.count;
		countMax = data.max;

		countInput.value = count;
		maxInput.value = countMax;

		return true;
	}

	return false;
}

function initialiseData(){
	count = 0;
	countMax = -1;

	saveData();
	syncDisplay();
}

function savePreferences(){
	let preferences = {
		autosaveinterval: AUTO_SAVE_INTERVAL,
		longclickinterval: LONG_CLICK_INTERVAL,
		displaymode: displayMode
	};

	localStorage.setItem(KEY.PREFERENCES, JSON.stringify(preferences));
}

function loadPreferences(){
	let preferences = JSON.parse(localStorage.getItem(KEY.PREFERENCES));
	if(preferences){
		AUTO_SAVE_INTERVAL = preferences.autosaveinterval;
		LONG_CLICK_INTERVAL = preferences.longclickinterval;
		displayMode = preferences.displaymode;

		autosaveInput.value = AUTO_SAVE_INTERVAL;
		longClickInput.value = LONG_CLICK_INTERVAL;
		modeInput.value = displayMode;

		return true;
	}

	return false;
}

function initialisePreferences(){
	AUTO_SAVE_INTERVAL = 10;
	LONG_CLICK_INTERVAL = 100;
	displayMode = 0;

	autosaveInput.value = AUTO_SAVE_INTERVAL;
	longClickInput.value = LONG_CLICK_INTERVAL;
	modeInput.value = displayMode;

	savePreferences();
}

// 
function initialise(){
	if(!loadData()) initialiseData();
	if(!loadPreferences()) initialisePreferences();

	syncDisplay();
	startAutoSave();
}

function syncDisplay(){
	if(countMax != -1) count = Math.max(0, Math.min(count, countMax));
	
	display.classList.remove(`displaymode-${(displayMode + 1) % 4}`);
	display.classList.remove(`displaymode-${(displayMode + 2) % 4}`);
	display.classList.remove(`displaymode-${(displayMode + 3) % 4}`);
	display.classList.add(`displaymode-${displayMode}`);

	let rate = count / countMax;
	let percentage = Math.floor(rate * 10 ** 4) / 10 ** 2;

	display.innerText = [
		count,
		`${count} / ${countMax}`,
		rate * (1 - rate) == 0 ? rate : fillChars(String(Math.floor(rate * 10 ** 8) / 10 ** 8), 10, "0", 1),
		`${[fillChars(String(percentage).split(".")[0], 2, "0", 0), fillChars(String(percentage).split(".")[1], 2, "0", 1)].join(".")}%`,
	][displayMode];
	countInput.value = count;
	maxInput.value = countMax;
}

function startAutoSave(){
	if(autoSaveInterval){
		clearInterval(autoSaveInterval);
		autoSaveInterval = null;
	}

	autoSaveInterval = setInterval(function(){
		saveData();
		savePreferences();
	}, AUTO_SAVE_INTERVAL);
}

// Other Functions
function longClickStart(limit, func, endFunc){
	longClickCount = 0;
	if(!longClickInterval) longClickInterval = setInterval(function(){
		longClickCounting(limit, func, endFunc);
	}, LONG_CLICK_INTERVAL);
}

function longClickCounting(limit, func, endFunc){
	longClickCount++;
	if(func) func();

	if(longClickCount >= LONG_CLICK_THERESHOULD.START / LONG_CLICK_INTERVAL) noClickEvent = true;

	if(limit != null && longClickCount >= limit){
		if(endFunc) endFunc();
		longClickEnd();
	}
}

function longClickEnd(){
	longClickCount = 0;
	clearInterval(longClickInterval);
	longClickInterval = null;
}