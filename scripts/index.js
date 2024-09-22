window.addEventListener("load", function(root_event){
	// Get Elements
	back = document.getElementById("back");

	displayPage = document.getElementById("page-display");
	display = document.getElementById("display");
	increceBtn = document.getElementById("btn-increce");
	decreceBtn = document.getElementById("btn-decrece");

	peferencesBtn = document.getElementById("btn-preferences");
	backBtn = document.getElementById("btn-back");

	// Customise Elements
	// Display Page
	displayPage.addEventListener("click", function(event){
		if(!noClickEvent){
			count++;
			syncDisplay();
		}

		noClickEvent = false;
	});

	displayPage.addEventListener("mousedown", function(event){
		longClickStart(LONG_CLICK_THERESHOULD.END / LONG_CLICK_INTERVAL, void 0, function(){
			displayMode = countMax == -1 ? 0 : (displayMode + 1) % 3;
			syncDisplay();
		});
	});

	displayPage.addEventListener("mouseup", function(event){
		if(longClickInterval){
			event.stopPropagation();
			longClickEnd();
		}
	});

	peferencesBtn.addEventListener("click", function(event){
		back.classList.remove("page0");
		back.classList.add("page1");

		event.stopPropagation();
	});

	peferencesBtn.addEventListener("mousedown", function(event){
		event.stopPropagation();
	});

	increceBtn.addEventListener("mousedown", function(event){
		longClickStart(null, function(){
			count++;
			syncDisplay();
		});
		event.stopPropagation();
	});

	increceBtn.addEventListener("mouseup", function(event){
		longClickEnd();
	});

	increceBtn.addEventListener("pointerout", function(event){
		longClickEnd();
	});

	decreceBtn.addEventListener("mousedown", function(event){
		longClickStart(null, function(){
			if(count > 0) {
				count--;
				syncDisplay();
			}
		});
		event.stopPropagation();
	});

	decreceBtn.addEventListener("mouseup", function(event){
		longClickEnd();
	});

	decreceBtn.addEventListener("pointerout", function(event){
		longClickEnd();
	});
	

	// Preferences Page
	backBtn.addEventListener("click", function(event){
		back.classList.remove("page1");
		back.classList.add("page0");
	});

	// Global

	// Initialise
	initialise();
});