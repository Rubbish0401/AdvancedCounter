import { data } from "./data-process/data-process.mjs";

data.counter.addEventListener("import", obj => {
	let counter = obj.target;
	display.innerText = counter.getCount();
});

data.preferences.addEventListener("import", obj => {
	let preferences = obj.target;
	let appearance = preferences.getAppearance();

	displayStyles.replaceSync([
		`body{ background: ${appearance.bgvisible ? appearance.background : "transparent"} }`,
		`.display{ color: ${appearance.colour} }`
	].join(""));

	for(let btn of [preferencesBtn, increaseBtn, decreaseBtn]) btn.setAttribute("fill", appearance.colour);
});

document.addEventListener("DOMContentLoaded", root_event => {
	displayStyles = new CSSStyleSheet();
	document.adoptedStyleSheets.push(displayStyles);

	// Get Elements
	back = document.getElementById("back");
	display = document.getElementById("display");

	preferencesBtn = document.getElementById("btn-preferences");
	increaseBtn = document.getElementById("btn-up");
	decreaseBtn = document.getElementById("btn-down");

	// Custom	

	// EventListener
	document.addEventListener("keydown", event => {
		let keys = ["ArrowUp", "ArrowDown"];
		if(keys.includes(event.key)) data.counter.addCount((-1) ** keys.indexOf(event.key));
	});

	back.addEventListener("click", event => data.counter.addCount(1));
	back.addEventListener("contextmenu", event => {
		event.preventDefault();
		data.counter.addCount(-1);
	});

	preferencesBtn.addEventListener("click", event => {
		event.preventDefault();

		let newWindow = window.open("./controller.html", "controller", "popup, width=540, height=960");
		if(!newWindow || newWindow.closed){
			alert(`Popup denied. Please access to contorller.html manually.\nURL:${(new URL("./controller.html", location.href)).href}`);
		}
	});

	for(let btn of [increaseBtn, decreaseBtn]){
		btn.addEventListener("pointerdown", event => {
			if(event.buttons === 1 || event.buttons === 2){
				let index = [increaseBtn, decreaseBtn].indexOf(event.target);
				if(!longclickTimeout) longclickTimeout = setTimeout(() => {
					if(!longclickInterval) longclickInterval = setInterval(() => {
						data.counter.addCount((-1) ** (index + event.buttons + 1));
					}, 10);
					longclickTimeout = null;
				}, data.preferences.getLongclick().start);
			}
		});

		btn.addEventListener("contextmenu", event => event.preventDefault());

		btn.addEventListener("pointerup", event => {
			if(longclickTimeout){
				clearTimeout(longclickTimeout);
				longclickTimeout = null;

				if(event.isTrusted && (event.button === 0 || event.button === 2)){
					let index = [increaseBtn, decreaseBtn].indexOf(event.currentTarget);
					console.log(index, event.button);
					data.counter.addCount((-1) ** (index + event.button / 2));
				}
			}

			if(longclickInterval){
				clearInterval(longclickInterval);
				longclickInterval = null;
			}
		});

		btn.addEventListener("pointerout", event => btn.dispatchEvent(new PointerEvent("pointerup")));
	}
});