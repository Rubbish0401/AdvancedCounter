window.addEventListener("load", function (root_event) {
	// Get Elements
	back = document.getElementById("back");

	displayPage = document.getElementById("page-display");
	display = document.getElementById("display");
	increceBtn = document.getElementById("btn-increce");
	decreceBtn = document.getElementById("btn-decrece");

	peferencesBtn = document.getElementById("btn-preferences");
	backBtn = document.getElementById("btn-back");

	countInput = document.getElementById("input-count");
	maxInput = document.getElementById("input-max");
	autosaveInput = document.getElementById("input-autosave-interval");
	longClickInput = document.getElementById("input-longclick-interval");
	modeInput = document.getElementById("select-mode");


	// Customise Elements
	// Display Page
	displayPage.addEventListener("click", function (event) {
		if (!noClickEvent) {
			count++;
			syncDisplay();
		}

		noClickEvent = false;
	});

	displayPage.addEventListener("pointerdown", function (event) {
		longClickStart(LONG_CLICK_THERESHOULD.END / LONG_CLICK_INTERVAL, void 0, function () {
			displayMode = countMax > 0 ? (displayMode + 1) % 4 : 0;
			modeInput.value = displayMode;
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
			count++;
			countInput.value = Math.min(count, countMax);
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
			if (count > 0) {
				count--;
				countInput.value = Math.max(count, 0);
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
		let value = Math.max(0, Math.min(parseInt(event.target.value), countMax));

		event.target.value = value;
		count = value;
		syncDisplay();
		saveData();
	});

	maxInput.addEventListener("change", function (event) {
		let value = Math.max(-1, parseInt(event.target.value));

		countMax = value;
		if(countMax >= 0){
			count = Math.min(countMax, count);
			countInput.value = count;
		}
		
		if(countMax * (1 + countMax) == 0) displayMode = 0;

		syncDisplay();
		saveData();
	});

	autosaveInput.addEventListener("change", function (event) {
		AUTO_SAVE_INTERVAL = event.target.value;
		startAutoSave();
		savePreferences();
	});

	longClickInput.addEventListener("change", function (event) {
		LONG_CLICK_INTERVAL = event.target.value;
		savePreferences();
	});

	modeInput.addEventListener("change", function (event) {
		event.target.value = countMax > 0 ? event.target.value : 0;
		displayMode = parseInt(event.target.value);
		syncDisplay();
		savePreferences();
	});

	// Global
	let imgBtns = document.getElementsByClassName("img-btn");
	for (imgBtn of imgBtns) imgBtn.addEventListener("contextmenu", event => event.preventDefault());

	// Initialise
	initialise();
});