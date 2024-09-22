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

		return true;
	}

	return false;
}

function initialiseData(){
	count = 0;
	countMax = 6000;

	saveData();
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

		return true;
	}

	return false;
}

function initialisePreferences(){
	AUTO_SAVE_INTERVAL = 10;
	LONG_CLICK_INTERVAL = 10;
	displayMode = 0;

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
	if(countMax != -1 && count > countMax) count = countMax;
	
	display.classList.remove(`displaymode-${(displayMode + 1) % 3}`);
	display.classList.remove(`displaymode-${(displayMode + 2) % 3}`);
	display.classList.add(`displaymode-${displayMode}`);

	display.innerText = [
		count,
		`${count} / ${countMax}`,
		fillChars(String(Math.floor(count / countMax * 10 ** 8) / 10 ** 8), 10, "0", 1),
	][displayMode];
}

function startAutoSave(){
	if(!autoSaveInterval){
		autoSaveInterval = setInterval(function(){
			saveData();
			savePreferences();
		}, AUTO_SAVE_INTERVAL);
	
		return true;
	}

	return false;
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