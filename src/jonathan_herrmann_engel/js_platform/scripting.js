////Required code (needs to be set on each platform)

////Optional code (app works without it)
function placeOptions(state){
	
	  function openIframe(id) {
			document.querySelector("iframe#" + id).style.display = "block";	
	  }
	  function closeIframe(id) {
			document.querySelector("iframe#" + id).contentWindow.location.reload(true);
			document.querySelector("iframe#" + id).style.display = "none";
	  }
		
	  var menu = {container: document.querySelector("#canvas-options"),containerMargin:client.width/50,items: {team:document.querySelector("#canvas-team"),single:document.querySelector("#canvas-single"),help:document.querySelector("#canvas-help"), settings:document.querySelector("#canvas-settings"), controlCenter: document.querySelector("#canvas-control-center")}};
	if(state == "hide") {
	  menu.container.style.opacity = "0";
	} else if (state == "show") {
	  menu.container.style.opacity = "1";
	} else {
		  if(state == "load") {
			menu.items.help.addEventListener("click", function(){followLink("help", "_blank", LINK_STATE_INTERNAL_HTML);}, false);
			menu.items.team.addEventListener("click", function(){followLink("?mode=multiplay", "_self", LINK_STATE_INTERNAL_HTML);}, false);
			menu.items.single.addEventListener("click", function(){followLink("?", "_self", LINK_STATE_INTERNAL_HTML);}, false);
			menu.items.settings.addEventListener("click", function(){
				  var id = "settingsimport";
				  if(window.innerWidth > 500 + parseInt(window.getComputedStyle(document.querySelector("#" + id)).getPropertyValue("width"), 10)){
					menu.container.style.display = "none";
					openIframe(id);
					var elems = document.querySelector("iframe#" + id).contentWindow.document.querySelectorAll(".internal-link");
					for(var i = 0; i < elems.length; i++) {
						elems[i].style.display = "none";
					}
					document.querySelector("iframe#" + id).contentWindow.followLink = function(input1,input2, input3){
							window.open(input1, "_blank");
					}
					var applySettingsNode = document.querySelector("iframe#" + id).contentWindow.document.createElement("BUTTON");
					applySettingsNode.innerHTML = getString("platformWebSettingsIframeApplyAndClose","","upper"); applySettingsNode.id = "applySettingsInIframe";
					applySettingsNode.className = " mdl-button mdl-js-button 	mdl-js-ripple-effect";
					if(menu.items.help.style.display == "none"){
						var openHelpNode = document.querySelector("iframe#" + id).contentWindow.document.createElement("BUTTON");
						openHelpNode.innerHTML = getString("generalTitleHelpScreen","","upper"); openHelpNode.id = "openHelpNodeInSettingsIframe"; 
						openHelpNode.className = " mdl-button mdl-js-button 	mdl-js-ripple-effect";
						openHelpNode.style = "margin-top: 4%;";
						document.querySelector("iframe#" + id).contentWindow.document.querySelector("main").appendChild(openHelpNode);
						document.querySelector("iframe#" + id).contentWindow.document.querySelector("#openHelpNodeInSettingsIframe").addEventListener("click", function(){followLink("./help","_blank",LINK_STATE_INTERNAL_HTML);});
						var brNode = document.querySelector("iframe#" + id).contentWindow.document.createElement("BR");
						document.querySelector("iframe#" + id).contentWindow.document.querySelector("main").appendChild(brNode);
					} else {
						applySettingsNode.style = "margin-top: 4%;";
					}
					document.querySelector("iframe#" + id).contentWindow.document.querySelector("main").appendChild(applySettingsNode);
					document.querySelector("iframe#" + id).contentWindow.document.querySelector("#applySettingsInIframe").addEventListener("click", function(){settings = getSettings(); closeIframe(id); menu.container.style.display = ""; });
					document.querySelector("iframe#" + id).contentWindow.followLink = function(input1,input2, input3){
							window.open(input1, "_blank");
					}
				  } else if (onlineGame.enabled) {
					followLink("settings", "_blank", LINK_STATE_INTERNAL_HTML);
				  } else {
					followLink("settings", "_self", LINK_STATE_INTERNAL_HTML);
				  }
				}, false);
			menu.items.controlCenter.addEventListener("click", function(){hardware.mouse.rightClick = !hardware.mouse.rightClick;}, false);
		  }
		  for (var item in menu.items) {
		  	menu.items[item].style.display = "inline";
		  	menu.items[item].style.color = "rgb(210, 120, 27)";
		  	menu.items[item].style.background = "transparent";
		  }
		  menu.items.team.style.display = onlineGame.enabled ? "none" : "inline";	  
		  menu.items.single.style.display = onlineGame.enabled ? "inline" : "none";
		  if(menu.container.offsetHeight < client.y && 2*background.y > background.height) {
			  menu.containerMargin = (client.y-menu.container.offsetHeight)/2;
			  menu.container.style.top = "";
			  menu.container.style.right = client.width/2-menu.container.offsetWidth/2 + "px";
			  menu.container.style.bottom =  menu.containerMargin +  "px";
		  } else if (menu.container.offsetHeight < client.y) {
			  menu.containerMargin = (client.y- menu.container.offsetHeight)/2;
			  menu.container.style.top = "";
			  menu.container.style.right =  menu.containerMargin + "px";
			  menu.container.style.bottom =  menu.containerMargin +  "px";
		  } else if (menu.container.offsetWidth + menu.containerMargin * 2 < client.x) {
			  menu.container.style.bottom = "";
			  menu.container.style.right = client.x/2-menu.container.offsetWidth/2 + "px";
			  menu.container.style.top = client.height/2-menu.container.offsetHeight/2 +  "px";
		  } else {
			  for (var item in menu.items) {
				menu.items[item].style.color = "";
				menu.items[item].style.background = "";
			  }
			  menu.items.help.style.display = menu.items.controlCenter.style.display = "none";
			  menu.container.style.bottom = "";
			  menu.container.style.right = client.x + menu.containerMargin + "px";
			  menu.container.style.top = client.y + menu.containerMargin + "px";
		  
		  }
		  menu.container.style.opacity = "1";
	}
}

function appReadyNotification() {
		notify(getString("appScreenHasLoaded", "."), false, 4000, function(){followLink("help", "_blank", LINK_STATE_INTERNAL_HTML);}, getString("generalTitleHelpScreen","","upper"), client.y);
}

function appUpdateNotification() {
		notify(getString("appScreenHasUpdated", "!", "upper"), false, 7000, function(){followLink("whatsnew/#newest", "_blank", LINK_STATE_INTERNAL_HTML);}, "Mehr Informationen", client.y);
}