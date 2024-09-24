window.addEventListener("load", async function (root_event) {
	let defData = await (await fetch(DEFAULT_DATA_PATH)).json();
	let defPreferences = await (await fetch(DEFAULT_PREFERENCES_PATH)).json();

	DEFAULT_DATA = defData;
	DEFAULT_PREFERENCES = defPreferences;

	// Get Elements
	back = document.getElementById("back");

	displayPage = document.getElementById("page-display");
	display = document.getElementById("display");
	increceBtn = document.getElementById("btn-increce");
	decreceBtn = document.getElementById("btn-decrece");

	peferencesBtn = document.getElementById("btn-preferences");
	backBtn = document.getElementById("btn-back");

	countInput = document.getElementById("input-count");
	addInput = document.getElementById("input-add");
	maxInput = document.getElementById("input-max");
	autosaveInput = document.getElementById("input-autosave-interval");
	longClickIntervalInput = document.getElementById("input-longclick-interval");
	longClickStartInput = document.getElementById("input-longclick-start");
	longClickEndInput = document.getElementById("input-longclick-end");
	modeInput = document.getElementById("select-mode");


	// Customise Elements
	// Display Page
	displayPage.addEventListener("click", function (event) {
		if (!noClickEvent) {
			data["count"]++;
			syncDisplay();
		}

		noClickEvent = false;
	});

	displayPage.addEventListener("pointerdown", function (event) {
		longClickStart(preferences["longclick"]["end"] / preferences["longclick"]["interval"], void 0, function () {
			preferences["appearance"]["display-mode"] = data["max"] > 0 ? (preferences["appearance"]["display-mode"] + 1) % 4 : 0;
			modeInput.value = preferences["appearance"]["display-mode"];
			syncDisplay();
		});
	});

	displayPage.addEventListener("mouseup", function (event) {
		if (longClickInterval) {
			event.stopPropagation();
			longClickEnd();
		}
	});

	peferencesBtn.addEventListener("click", function (event) {
		back.classList.remove("page0");
		back.classList.add("page1");

		event.stopPropagation();
	});

	peferencesBtn.addEventListener("mousedown", function (event) {
		event.stopPropagation();
	});

	increceBtn.addEventListener("pointerdown", function (event) {
		longClickStart(null, function () {
			data["count"]++;
			syncDisplay();
		});
	});

	increceBtn.addEventListener("mouseup", function (event) {
		longClickEnd();
	});

	increceBtn.addEventListener("click", function (event) {
		event.stopPropagation();
	});

	increceBtn.addEventListener("pointerout", function (event) {
		longClickEnd();
	});


	decreceBtn.addEventListener("pointerdown", function (event) {
		longClickStart(null, function () {
			if (data["count"] > 0) {
				data["count"]--;
				syncDisplay();
			}
		});
	});

	decreceBtn.addEventListener("mouseup", function (event) {
		longClickEnd();
	});

	decreceBtn.addEventListener("click", function (event) {
		event.stopPropagation();
	});

	decreceBtn.addEventListener("pointerout", function (event) {
		longClickEnd();
	});


	// Preferences Page
	backBtn.addEventListener("click", function (event) {
		back.classList.remove("page1");
		back.classList.add("page0");
	});

	countInput.addEventListener("change", function (event) {
		let value = Math.max(0, data["max"] == -1 ? parseInt(event.target.value) : Math.min(parseInt(event.target.value), data["max"]));

		event.target.value = value;
		data["count"] = value;
		syncDisplay();
		saveData();
	});

	addInput.addEventListener("keypress", function(event){
		if(event.key == "Enter"){
			data["count"] += parseInt(event.target.value);
			event.target.value = 0;
			syncDisplay();
			saveData();
		}
	});

	maxInput.addEventListener("change", function (event) {
		let value = Math.max(-1, parseInt(event.target.value));
		data["max"] = value;

		if (data["max"] * (1 + data["max"]) == 0) preferences["appearance"]["display-mode"] = 0;

		syncDisplay();
		saveData();
	});

	autosaveInput.addEventListener("change", function (event) {
		preferences["autosave"]["interval"] = parseInt(event.target.value);
		startAutoSave();
		savePreferences();
	});

	longClickIntervalInput.addEventListener("change", function (event) {
		preferences["longclick"]["interval"] = parseInt(event.target.value);
		savePreferences();
	});

	longClickStartInput.addEventListener("change", function (event) {
		preferences["longclick"]["start"] = parseInt(event.target.value);
		savePreferences();
	});

	longClickEndInput.addEventListener("change", function (event) {
		preferences["longclick"]["end"] = parseInt(event.target.value);
		savePreferences();
	});

	modeInput.addEventListener("change", function (event) {
		event.target.value = data["max"] > 0 ? event.target.value : 0;
		preferences["appearance"]["display-mode"] = parseInt(event.target.value);
		syncDisplay();
		savePreferences();
	});

	// Global
	let imgBtns = document.getElementsByClassName("img-btn");
	for (imgBtn of imgBtns) imgBtn.addEventListener("contextmenu", event => event.preventDefault());

	// Initialise
	initialise();
});