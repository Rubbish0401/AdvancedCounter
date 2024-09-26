// Constants
const KEY = {
	DATA: "HOiRVjjXkCHKJgNRJVyfQHoN",
	PREFERENCES: "KjwZOQj3cxWXhGE7OyuYAZMh",
};

const DEFAULT_DATA_PATH = "https://rubbish0401.github.io/AdvancedCounter/data/default-data.json";
const DEFAULT_PREFERENCES_PATH = "https://rubbish0401.github.io/AdvancedCounter/data/default-preferences.json";

// Data and Preferences
var DEFAULT_PREFERENCES;
var DEFAULT_DATA;

var data;
var preferences;

// Elements
var back;

var displayPage;
var display;
var increceBtn;
var decreceBtn;

var settingsBtn;
var backBtn;

var countInput;
var addInput;
var maxInput;
var autosaveInput;
var longClickIntervalInput;
var longClickStartInput;
var longClickEndInput;
var modeInput;

// Other Variables

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

function isDataFormatNewest(item){
	if(item == null) return false;
	return new Date(item["date"]) >= new Date(DEFAULT_DATA["date"]);
}

function saveData(){
	if(data["count"] == null || isNaN(data["count"])) data["count"] = DEFAULT_DATA["count"];
	if(data["max"] == null || isNaN(data["max"])) data["max"] = DEFAULT_DATA["max"];
	data["date"] = (new Date()).toString();
	localStorage.setItem(KEY.DATA, JSON.stringify(data));
}

function loadData(){
	let item = JSON.parse(localStorage.getItem(KEY.DATA));
	if(item != null){
		if(item["count"] == null || isNaN(item["count"])) item["count"] = DEFAULT_DATA["count"];
		if(item["max"] == null || isNaN(item["max"])) item["max"] = DEFAULT_DATA["max"];
	}else{
		item = DEFAULT_DATA;
	}

	data = item;
}

function isPreferencesFormatNewest(item){
	if(item == null) return false;
	return new Date(item["date"]) >= new Date(DEFAULT_PREFERENCES["date"])
}

function savePreferences(){
	if(!isPreferencesFormatNewest(preferences)) preferences = DEFAULT_PREFERENCES;
	preferences["date"] = (new Date()).toString();

	localStorage.setItem(KEY.PREFERENCES, JSON.stringify(preferences));
}

function loadPreferences(){
	let item = JSON.parse(localStorage.getItem(KEY.PREFERENCES));
	preferences = isPreferencesFormatNewest(item) ? item : DEFAULT_PREFERENCES;
}

function isTouchable(){
	return typeof window.ontouchstart == "object";
}

// 
function initialise(){
	loadData();
	loadPreferences();

	addInput.value = 0;

	autosaveInput.value = preferences["autosave"]["interval"] || DEFAULT_PREFERENCES["autosave"]["interval"];

	longClickIntervalInput.value = preferences["longclick"]["interval"] || DEFAULT_PREFERENCES["longclick"]["interval"];
	longClickStartInput.value = preferences["longclick"]["start"] || DEFAULT_PREFERENCES["longclick"]["start"];
	longClickEndInput.value = preferences["longclick"]["end"] || DEFAULT_PREFERENCES["longclick"]["end"];

	longClickStartInput.max = longClickEndInput.value;
	longClickEndInput.min = longClickStartInput.value;
	
	modeInput.value = preferences["appearance"]["display-mode"] || DEFAULT_PREFERENCES["appearance"]["display-mode"];

	syncDisplay();
	startAutoSave();
}

function syncDisplay(){
	if(data["max"] != -1) data["count"] = Math.max(0, Math.min(data["count"], data["max"]));
	
	display.classList.remove(`displaymode-${(preferences["appearance"]["display-mode"] + 1) % 4}`);
	display.classList.remove(`displaymode-${(preferences["appearance"]["display-mode"] + 2) % 4}`);
	display.classList.remove(`displaymode-${(preferences["appearance"]["display-mode"] + 3) % 4}`);
	display.classList.add(`displaymode-${preferences["appearance"]["display-mode"]}`);

	let rate = data["count"] / data["max"];
	let percentage = Math.floor(rate * 10 ** 4) / 10 ** 2;

	display.innerText = [
		data["count"],
		`${data["count"]} / ${data["max"]}`,
		rate * (1 - rate) == 0 ? rate : fillChars(String(Math.floor(rate * 10 ** 8) / 10 ** 8), 10, "0", 1),
		`${[fillChars(String(percentage).split(".")[0], 2, "0", 0), fillChars(String(percentage).split(".")[1], 2, "0", 1)].join(".")}%`,
	][preferences["appearance"]["display-mode"]];
	countInput.value = data["count"] || DEFAULT_DATA["count"];
	maxInput.value = data["max"] != null ? data["max"] : DEFAULT_DATA["max"];
}

function startAutoSave(){
	if(autoSaveInterval){
		clearInterval(autoSaveInterval);
		autoSaveInterval = null;
	}

	autoSaveInterval = setInterval(function(){
		saveData();
		savePreferences();
	}, preferences["autosave"]["interval"]);
}

// Other Functions
function longClickStart(limit, func, endFunc){
	longClickCount = 0;
	if(!longClickInterval) longClickInterval = setInterval(function(){
		longClickCounting(limit, func, endFunc);
	}, preferences["longclick"]["interval"]);
}

function longClickCounting(limit, func, endFunc){
	longClickCount++;

	if(longClickCount >= preferences["longclick"]["start"] / preferences["longclick"]["interval"]){
		if(func) func();
		noClickEvent = true;
	}

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