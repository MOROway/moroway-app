"use strict"

var settings = {};

window.onload = function(){
	
	if(typeof(Storage) !== "undefined") {
		
		settings = getSettings ();
		
		for(var i = 0; i < Object.keys(settings).length; i++) {
			var a = Object.values(settings)[i];
			var b = Object.keys(settings)[i];
			if(document.querySelector("#"+b) !== null){
				var leftButton = document.querySelector("#"+b).querySelector(".leftButton");
				var textButton = document.querySelector("#"+b).querySelector(".textButton");
				leftButton.id = b+"leftButton";
				textButton.id = b+"textButton";
				if(a){
					leftButton.style.backgroundColor = "black";
					leftButton.style.transform = "rotate(360deg)";
				}
			}
		}
		
		Object.keys(STRINGS).forEach(function(val) {
			var elem = document.createElement("button");
			elem.className = "langvalue";
			elem.textContent = getString("langName", "", "", val);
			if(val == CURRENT_LANG){
				elem.id="clang";
			} else {
				elem.onclick = function(){setCurrentLang(val); notify(getString("settingsScreenLangSelectChange", "!", "upper", val), true, 5000);};
			}
			document.querySelector("#langoption").appendChild(elem);
		});
		document.querySelector("#backOption").addEventListener("click", function(){try {window.close();}catch(err) {}; followLink("./","_self", LINK_STATE_INTERNAL_HTML);}, false);
		document.querySelector("#helpOption").addEventListener("click", function(){followLink("help","_self", LINK_STATE_INTERNAL_HTML);}, false);
	
	} else {
	
		document.querySelector("body").innerHtml = "Keine Unterstützung für Ihren Browser möglich. Sorry!";
	
	}
	
}

function settingsChange(event, suffix) {
		var id = event.target.id.substr(0,event.target.id.length-suffix.length); 
		settings[id] = !settings[id];
		setSettings();
		toggleInnerHTML(settings[id], id);
		notify(getString("settingsScreenApply", "."), false, 900, null, null, window.innerHeight);
}

function toggleInnerHTML(a,b){
	 var leftButton = document.querySelector("#"+b).querySelector(".leftButton");
	 if(a){
		leftButton.style.backgroundColor = "black";
		leftButton.style.transition = "2s";
		leftButton.style.transform = "rotate(360deg)";
	 } else {
	    leftButton.style.backgroundColor = "";
		leftButton.style.transition = "2s";
		leftButton.style.transform = "rotate(0deg)";		
	 }
}
