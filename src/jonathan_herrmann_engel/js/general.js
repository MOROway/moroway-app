//NOTIFICATIONS
function notify(a, b, c, d, e, f){
   var notificationContainer = document.querySelector('#canvas-notifier');     
   var obj = {message: a, timeout: c};
   if(d!= null && e!= null){
   	obj.actionHandler = d;
    obj.actionText = e;
   }
   if(b || (f >= notificationContainer.offsetHeight && settings.showNotifications)){
    		notificationContainer.MaterialSnackbar.showSnackbar(obj);
   } else {
    		console.log(a);
   }
}

//HANDLE OBJECTS
function copyJSObject(obj) {
	return JSON.parse(JSON.stringify(obj));
}

//HANDLE LINKS
function getServerRedirectLink(key) {
	const SERVER_REDIRECT_LINK = "https://herrmann-engel.de/projekte/moroway/moroway-app/server/redirect_to/index.php";
	return SERVER_REDIRECT_LINK + "?key=" + key + "&platform=" + APP_DATA.platform + "&lang=" + CURRENT_LANG;
}
function getServerHTMLLink(key, showCloseButton) {
	const SERVER_HTML_LINK = "https://herrmann-engel.de/projekte/moroway/moroway-app/server/html_content/index.php";
	if(showCloseButton === undefined){
		showCloseButton="";
	}
	return SERVER_HTML_LINK + "?key=" + key + "&platform=" + APP_DATA.platform + "&lang=" + CURRENT_LANG + "&closeButton=" + showCloseButton;
}
function handleServerJSONValues(key, func) {
	const SERVER_JSON_LINK = "https://herrmann-engel.de/projekte/moroway/moroway-app/server/json_content/index.php";
	fetch(SERVER_JSON_LINK + "?key=" + key + "&platform=" + APP_DATA.platform + "&lang=" + CURRENT_LANG).then(function(response) {
		return response.json();
	})
	.catch(error => console.log('Fetch-Imprint-Error:', error))
	.then(function(response) {
		if(typeof response == "object" && typeof response.error == "undefined") {
			func(response);
		} else {
			console.log(typeof response != "undefined" && typeof response.error != "undefined" ? "ERROR: " + response.error : "ERROR: Can't handle request!");
		}
	});
}

//HANDLE STRINGS
function getString(prop, punctuationMark, caseType, lang) {
	if (typeof lang == "undefined") {
		lang = CURRENT_LANG;
	}
	var str;
	if(Array.isArray(prop)) {
		if(prop.length == 2 && typeof prop[0] == "string" && typeof prop[1] == "number") {
			if(typeof STRINGS[lang] != "undefined" && typeof STRINGS[lang][prop[0]] != "undefined") {
				str = STRINGS[lang][prop[0]][prop[1]];
			} else if (typeof STRINGS[DEFAULT_LANG] != "undefined" && typeof STRINGS[DEFAULT_LANG][prop[0]] != "undefined") {
				str = STRINGS[DEFAULT_LANG][prop[0]][prop[1]];
			} else {
				return "undefined";
			}
		} else {
				return "undefined";			
		}
	} else {
		str = typeof STRINGS[lang] == "undefined" || typeof STRINGS[lang][prop] == "undefined" ? typeof STRINGS[DEFAULT_LANG] == "undefined" ||  typeof STRINGS[DEFAULT_LANG][prop] == "undefined" ? "undefined" : STRINGS[DEFAULT_LANG][prop] : STRINGS[lang][prop];
	}
	str += typeof punctuationMark == "string" ? punctuationMark : "";
	return typeof caseType == "string" && caseType == "upper" ? str.toUpperCase() : typeof caseType == "string" && caseType == "lower" ? str.toLowerCase() : str;
}


function formatJSString (str) {
	if(typeof str !== "string") {
		return str;
	}
	for (var i = 0; i < arguments.length-1; i++) {
		if(str.indexOf("{{"+i+"}}") !== -1 && (typeof arguments[i+1] == "number" || typeof arguments[i+1] == "string")){
			var replace = new RegExp("\{\{["+i+"]\}\}","g");
			str = str.replace(replace,arguments[i+1]);
		}
	}
	var replace = new RegExp("\{\{[0-9]+\}\}","g");
	str = str.replace(replace,"");
	return str;
}

function formatHTMLString (str) {
	if(typeof str !== "string") {
		return str;
	}
	return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function setHTMLStrings() {
	var elems = document.querySelectorAll("*[data-stringid-content]");
	for (var i = 0; i < elems.length; i++) {
		var args =[];
		args[0] = typeof elems[i].dataset.stringidContentArrayno == "string" ? getString([elems[i].dataset.stringidContent, parseInt(elems[i].dataset.stringidContentArrayno, 10)],elems[i].dataset.stringidContentPunctuation,elems[i].dataset.stringidContentCase) : getString(elems[i].dataset.stringidContent,elems[i].dataset.stringidContentPunctuation,elems[i].dataset.stringidContentCase);
		var argsNo = 1;
		do {
			var elCArg = elems[i].dataset["stringidContentArgisstringref"+argsNo] == "1" ? getString(elems[i].dataset["stringidContentArg"+argsNo]) : elems[i].dataset["stringidContentArg"+argsNo];
			if(typeof elCArg == "string") {
				args[argsNo] = elCArg;
				argsNo++;
			} else {
				argsNo = 1;
			}
		} while (argsNo > 1);
		elems[i].textContent = formatJSString( ...args );
	}
	elems = document.querySelectorAll("*[data-stringid-title]");
	for (var i = 0; i < elems.length; i++) {
		var args =[];
		args[0] = typeof elems[i].dataset.stringidTitleArrayno == "string" ? getString([elems[i].dataset.stringidTitle, parseInt(elems[i].dataset.stringidTitleArrayno, 10)],elems[i].dataset.stringidTitlePunctuation,elems[i].dataset.stringidTitleCase) : getString(elems[i].dataset.stringidTitle,elems[i].dataset.stringidTitlePunctuation,elems[i].dataset.stringidTitleCase);
		var argsNo = 1;
		do {
			var elCArg = elems[i].dataset["stringidTitleArgisstringref"+argsNo] == "1" ? getString(elems[i].dataset["tringidTitleArg"+argsNo]) : elems[i].dataset["tringidTitleArg"+argsNo];
			if(typeof elCArg == "string") {
				args[argsNo] = elCArg;
				argsNo++;
			} else {
				argsNo = 1;
			}
		} while (argsNo > 1);
		elems[i].title = formatJSString( ...args );
	}
	elems = document.querySelectorAll("*[data-stringid-alt]");
	for (var i = 0; i < elems.length; i++) {
		var args =[];
		args[0] = typeof elems[i].dataset.stringidAltArrayno == "string" ? getString([elems[i].dataset.stringidAlt, parseInt(elems[i].dataset.stringidAltArrayno, 10)],elems[i].dataset.stringidAltPunctuation,elems[i].dataset.stringidAltCase) : getString(elems[i].dataset.stringidAlt,elems[i].dataset.stringidAltPunctuation,elems[i].dataset.stringidAltCase);
		var argsNo = 1;
		do {
			var elCArg = elems[i].dataset["stringidAltArgisstringref"+argsNo] == "1" ? getString(elems[i].dataset["stringidAltArg"+argsNo]) : elems[i].dataset["stringidAltArg"+argsNo];
			if(typeof elCArg == "string") {
				args[argsNo] = elCArg;
				argsNo++;
			} else {
				argsNo = 1;
			}
		} while (argsNo > 1);
		elems[i].alt = formatJSString( ...args );
	}
}

function setCurrentLang(lang){
 	if(typeof(window.localStorage) != "undefined") {
		window.localStorage.setItem("morowayAppLang", lang);
	}
}
//LOCAL APP DATA COPY
function getLocalAppDataCopy (){
	
	var localAppDataCopy = {};
	
	if(typeof(window.localStorage) != "undefined") {
    
		try{
			localAppDataCopy = JSON.parse(window.localStorage.getItem("morowayAppData") || "{}");
		} catch(e) {
			localAppDataCopy = {};
		}
      
	}

	return Object.keys(localAppDataCopy).length === 0 ? null : localAppDataCopy;
	
}

function setLocalAppDataCopy(){
 	if(typeof(window.localStorage) != "undefined") {
		window.localStorage.setItem("morowayAppData", JSON.stringify(APP_DATA));
	}
}

//SETTINGS  
function getSettings (){
	
	var settings = {};
	
	if(typeof(window.localStorage) != "undefined") {
    
		try{
			settings = JSON.parse(window.localStorage.getItem("morowayApp") || "{}");
		} catch(e) {
			settings = {};
		}
      
	}
	
  	if (typeof settings.showNotifications != "boolean") 
      settings.showNotifications = true;
  
  	if (typeof settings.classicUI != "boolean") 
      settings.classicUI = true;
  
	if (typeof settings.alwaysShowSelectedTrain != "boolean") 
      settings.alwaysShowSelectedTrain = true;
  
	if (typeof settings.showSwitches != "boolean") 
      settings.showSwitches = true;
  
	if (typeof settings.cursorascircle != "boolean") 
      settings.cursorascircle = true;
  
    if (typeof settings.burnTheTaxOffice != "boolean") 
      settings.burnTheTaxOffice = false;
  
	return settings;
	
}

function setSettings(){
 	
	window.localStorage.setItem("morowayApp", JSON.stringify(settings));

}

//WINDOW
function measureViewspace(a) {

    var b = [{hasTouch: ("ontouchstart" in document.documentElement)?true: false},{isSmallDevice: (window.innerWidth <= 750 || (window.innerWidth <= 1080 && window.innerHeight > window.innerWidth))?true:false }];
    return a == -1? b:a<b.length ? b[a]: false;

} 

//GLOBAL CONSTANTS
const LINK_STATE_NORMAL = 0;
const LINK_STATE_INTERNAL_HTML = 1;
const LINK_STATE_INTERNAL_LICENSE_FILE = 2

const STRINGS = {en:{langName: "English", generalTitle: "MOROway App", generalBack: "Back", generalTitleSettingsScreen: "Options", generalTitleHelpScreen: "Legal / Help", generalTitleErrorScreen: "Known Issues", generalTitleWhatsNewScreen: "Changelog", appScreenNoCanvas: "Please update your browser", appScreenFurtherInformation: "More information", appScreenHasLoaded:"App ready", appScreenHasUpdated:"New version", appScreenIsFail: "FAIL - WE GONNA FIX IT ASAP", appScreenTrainSelected: "{{0}} {{1}}selected", appScreenTrainSelectedAuto: "auto", appScreenSwitchTurns: "Switch turned", appScreenObjectStops: "{{0}} stops", appScreenObjectStarts: "{{0}} starts", appScreenObjectChangesDirection: "{{0}}: Direction change", appScreenObjectHasCrashed: "Crash between {{0}} and {{1}}", appScreenAMillionFrames: "{{0}} millionen frames shown", appScreenKonami: "You hit the Konami Code", appScreenKonamiIconRow: "🚂🚂🚂", appScreenKonamiAnimals: ["🐢", "🦔"], appScreenTrainNames: ["Steam engine", "TGV Duplex", "Railbus"], appScreenTrainIcons:  ["🚂","🚅","🚋"], appScreenTrainCarIcon: "🚃", appScreenCarNames: ["Red car", "White car", "Yellow car"], appScreenCarIcons: ["🏎️", "🚗", "🚕"], appScreenCarStepsBack: "{{0}} moves back", appScreenCarAutoModeChange: "Auto-Mode  {{0}}", appScreenCarAutoModeInit: "activated", appScreenCarAutoModePause: "paused", settingsScreenOptNotificationsTitle: "Notifications", settingsScreenOptNotificationsDesc: "Displays on-screen notifications", settingsScreenOptNotificationsInfo: "Some notifications are shown even if deactivated. Does not work on smallest screens.",settingsScreenOptClassicUITitle: "Classic UI", settingsScreenOptClassicUIDesc: "Displays control elements like transformer.", settingsScreenOptSelectedTrainTitle: "Selected train", settingsScreenOptSelectedTrainDesc: "Displays name of the selected train.", settingsScreenOptSelectedTrainInfo: "Requires Classic UI.", settingsScreenOptSwitchesTitle: "Activate Switches", settingsScreenOptSwitchesDesc: "Lets you turn some switches.", settingsScreenOptCursorTitle: "Displays cursor as color.", settingsScreenOptCursorDesc: "Replaces the cursor with a colored circle.", settingsScreenOptCursorInfo: "Does not work on touch screens.", settingsScreenOptTaxOfficeTitle: "Animate burning tax office", settingsScreenOptTaxOfficeDesc: "Shows some animations on the burning tax office.", settingsScreenApply: "New configuration saved", settingsScreenLangSelectInfo: "Language selection (requires reload)", settingsScreenLangSelectChange: "Preferences saved - reopen app to apply", helpScreenGeneral: "General",  helpScreenGeneralWelcome: "Welcome {{0}}",  helpScreenGeneralWelcomeIcon: "🏡",  helpScreenGeneralWelcomeVersion: "Current version: {{0}}.{{1}}.{{2}} ({{3}}-{{4}}-{{5}})",  helpScreenGeneralWelcomePs: ["Hello, you use MOROway App. Enjoy!"], helpScreenGeneralWelcomeButtonWhatsNew:  "Changelog",  helpScreenGeneralTrains: "Trains {{0}}", helpScreenGeneralTrainsIcon: "🚂", helpScreenGeneralTrainsPs : ["You may operate three trains; a steam engine, a high speed train and a railbus. Start / stop a train by touching / clicking it. Touch and hold or double-click a train to change it's direction.", "To navigate by Classic UI, select a train by touching / clicking the button on the lower-left side. Start / stop the selected train by operating the transformer. On larger devices you are also able to control the trains's speed with the transformer, small devices use a medium speed. To change a train's direction use the arrow symbol in the lower right corner of the transformer; this is not possible on small devices.", "If activated in the options you may turn some switches. Touch / click and hold the background to located the switches. Touch / click a switch to turn it. A red switch symbol indicates that the switch is not turned, a green one that it is turned. The train takes the red or green colored way."], helpScreenGeneralCars: "Cars {{0}}", helpScreenGeneralCarsIcon: "🚗", helpScreenGeneralCarsPs: ["By touching / clicking of the three cars left to the main station, it starts. By touching and holding or double-clicking one of them they enter auto mode, which means they navigate automatically.", "If you haven't enabled auto mode and operate more than one car, you risk a head-on collision. If this happens touch and hold or double-click one of the involved cars to move it back."], helpScreenGraphical: "Graphical help", helpScreenGraphicalDescription: "Graphical explanation {{0}}",  helpScreenGraphicalDescriptionIcon: "🎈", helpScreenGraphicalDescriptionPs: ["1: Animated trains.", "2: Animated cars.", "3: Animated burning tax office.", "4: Train selection.", "5: Selected train.", "6: Transformer.", "7: Change train direction.", "8: Switches."], helpScreenGraphicalDescriptionPic:  "Descriptive image",  helpScreenLegal: "Legal",  helpScreenLegalLibraries: "Libraries {{0}}", helpScreenLegalLibrariesIcon: "🏗️", helpScreenLegalStrCopyright: "Copyright",helpScreenLegalStrLicense: "License", helpScreenLegalLibrariesMDL: "Material Design Lite", helpScreenLegalLibrariesMDLPs: ["This app uses the design framework \"Material Design Lite\" by Google Inc."], helpScreenLegalLibrariesPace: "Pace.js", helpScreenLegalLibrariesPacePs: ["This app uses the loading animation \"Pace.js\" by HubSpot Inc."],helpScreenLegalFonts: "Fonts {{0}}", helpScreenLegalFontsIcon: "🌐", helpScreenLegalFontsRoboto: "Roboto", helpScreenLegalFontsRobotoPs: ["This app uses \"Roboto\" font by Google Inc."], helpScreenLegalFontsMaterialIcons: "Material Icon Font", helpScreenLegalFontsMaterialIconsPs: ["This app uses \"Material Icon\" font by Google Inc."], helpScreenLegalOwn: "MOROway App {{0}}", helpScreenLegalOwnIcon: "✌️", helpScreenLegalOwnCode: "General", helpScreenLegalOwnCodePs: ["Everything we created is licensed under the Apache License Version 2.0."], helpScreenLegalOwnPics: "Assets", helpScreenLegalOwnPicsPs: ["Our assets are also licensed under the Creative Commons Attribution 4.0 International-License."], helpScreenContact: "Contact",  helpScreenContactFeedback: "Feedback {{0}}", helpScreenContactFeedbackIcon: "📫", helpScreenContactFeedbackPs: ["Get in touch using the contact infos displayed below!"], helpScreenContactFeedbackBugs: "Report a bug", helpScreenContactImprintTitle: "Contact info", helpScreenContactBackupLink: "Open contact info", helpScreenContactBackupLinkNotification: "Contact info opened", helpScreenContactFeedbackSend: "Send feedback", helpScreenContactFeedbackSendNotification: "Feedback page opened", helpScreenDownload: "Download",  helpScreenDownloadApps: "Apps {{0}}", helpScreenDownloadAppsIcon: "💾", helpScreenDownloadAppsAndroid: "Android", helpScreenDownloadAppsAndroidPs: ["You can download this app via Google Play Store."], helpScreenDownloadAppsAndroidButton: "Play Store", helpScreenDownloadAppsWindows: "Windows", helpScreenDownloadAppsWindowsPs: ["You can download this app to your Laptop / PC via Microsoft Store."], helpScreenDownloadAppsWindowsButton: "Microsoft Store", helpScreenDownloadViewSource: "Get Code {{0}}",helpScreenDownloadViewSourceIcon: "🔍️", helpScreenDownloadViewSourcePs: ["Get Source Code from GitHub."], helpScreenDownloadViewSourceCodePic: "Sample code", helpScreenDownloadViewSourceButtonSource: "GitHub", whatsNewScreenVersionNumber: "Version {{0}}", whatsNewScreenVersionNumberMinor: "New in version {{0}}.{{1}}", whatsNewScreenVersionIsNew: "New", whatsNewScreenByVersionMa1Mi0: ["2011", "First release featuring steam locomotive."], whatsNewScreenByVersionMa2Mi0: ["2011", "{{0}}TGV Duplex.", "{{0}}First car."], whatsNewScreenByVersionMa3Mi0: ["2011", "{{0}}Second car.", "Car controls added.", "Improved paths."], whatsNewScreenByVersionMa3Mi1: ["2011", "Info section added."], whatsNewScreenByVersionMa3Mi2: ["2011", "Short intro added.", "Train controls added."], whatsNewScreenByVersionMa4Mi0: ["2015", "{{0}}Update from Action-Script 2 to Action-Script 3.", "{{0}}Added cars to steam engine.", "{{0}}Third train (railbus).", "{{0}}Start/stop train by clicking them.", "Improved background.", "Improved car paths.", "New intro.", "Improved controls and info text", "Bugfixes."], whatsNewScreenByVersionMa5Mi0: ["2018", "{{0}}Better background.", "{{0}}Custom train speed.", "{{0}}Change train direction.", "{{0}}Notifications.", "{{0}}Option menu added.", "{{0}}Better intro.", "{{0}}Animated burning tax office.", "Improved objects.", "Improved object paths.", "Improved controls.", "Optimized GUI.", "Improved help section.", "HTML/JS/CSS replaces Flash Action Script.", "Offline-Support as Progressive-Web-App.", "Use of Open-Source-Components.", "Own code is licensed differently."], whatsNewScreenByVersionMa5Mi1: ["2018", "{{0}}Turn switches.", "Improved train paths.", "Bugfixes."], whatsNewScreenByVersionMa5Mi2: ["2018", "{{0}}Trains: Acceleration delay.","{{0}}Cars: auto mode added.","{{0}}Cars: Option to move back a bit.", "Improved controls."], whatsNewScreenByVersionMa5Mi3: ["2018", "{{0}}Third car (yellow car).", "{{0}} English Version", "Better switch symbols", "Bugfixes."], whatsNewScreenByVersionMa5Mi4: ["2018", "Own code is licensed differently. (Apache License Version 2 replaces Two-Clause-BSD)"], errorScreenErrorMissing: "Missing Elements", errorScreenErrorMissingPics: "Images", errorScreenErrorMissingPicsP1: "If the image is accidentally removed from the server you have to wait for us to fix this problem.", errorScreenErrorMissingPicsP2: "If you have problems with your internet connection or firewall you have to fix it.", platformWebSettingsIframeApplyAndClose: "Apply and close", platformWindowsLinkError: "Error! Couldn't open link.", platformWindowsAppScreenFeedback: "Feedback", platformWindowsAppScreenChangelog: "Changelog"}, de:{langName: "Deutsch", generalTitle: "MOROway App", generalBack: "Zurück", generalTitleSettingsScreen: "Einstellungen", generalTitleHelpScreen: "Hilfe & Informationen", generalTitleErrorScreen: "Bekannte Fehler", generalTitleWhatsNewScreen: "Versionsgeschichte", appScreenNoCanvas: "Ihr Browser wird nicht unterstützt. UPDATE HILFT!", appScreenFurtherInformation: "Mehr Informationen", appScreenHasLoaded:"Anwendung geladen", appScreenHasUpdated:"Neue Version", appScreenIsFail: "FEHLER - Wir kümmern uns ASAP", appScreenTrainSelected: "{{0}} {{1}}ausgewählt", appScreenTrainSelectedAuto: "automatisch", appScreenSwitchTurns: "Weiche gestellt", appScreenObjectStops: "{{0}} hält an", appScreenObjectStarts: "{{0}} fährt los", appScreenObjectChangesDirection: "{{0}}: Richtung gewechselt", appScreenObjectHasCrashed: "Crash zwischen {{0}} und {{1}}", appScreenAMillionFrames: "{{0}} Millionen Frames gezeigt", appScreenKonami: "Super - Sie haben den Konamicode geknackt", appScreenTrainNames: ["Dampflok", "TGV Duplex", "Schi-Stra-Bus"], appScreenCarNames: ["Rotes Auto", "Weißes Auto", "Gelbes Auto"], appScreenCarStepsBack: "{{0}} setzt zurück", appScreenCarAutoModeChange: "Automatische Autosteuerung  {{0}}", appScreenCarAutoModeInit: "gestartet", appScreenCarAutoModePause: "gestoppt", settingsScreenOptNotificationsTitle: "Benachrichtigungen", settingsScreenOptNotificationsDesc: "Zeigt Texteinblendungen bei verschiedenen Aktionen an.", settingsScreenOptNotificationsInfo: "Funktioniert nicht auf kleinen Bildschirmen. Einige Benachrichtigungen werden trotz Deaktivierung dieser Option angezeigt.",settingsScreenOptClassicUITitle: "Klassische Steuerelemente", settingsScreenOptClassicUIDesc: "Zeigt die klassischen Steuerelemente wie Trafo und Zugauswahlbutton.", settingsScreenOptSelectedTrainTitle: "Ausgewählter Zug", settingsScreenOptSelectedTrainDesc: "Zeigt den Namen des ausgewählten Zuges immer an.", settingsScreenOptSelectedTrainInfo: "Erfodert aktivierte \"Klassische Steuerelemente\".", settingsScreenOptSwitchesTitle: "Weichen aktivieren", settingsScreenOptSwitchesDesc: "Ermöglicht das Stellen einiger Weichen.", settingsScreenOptCursorTitle: "Cursor als Farbe darstellen", settingsScreenOptCursorDesc: "Zeigt statt dem Maussymbol einen Farbkreis.", settingsScreenOptCursorInfo: "Funktioniert nicht auf Touchscreens.", settingsScreenOptTaxOfficeTitle: "Brennendes Finanzamt animieren", settingsScreenOptTaxOfficeDesc: "Zeigt Animationen zum brennenden Finanzamt.", settingsScreenApply: "Einstellungen aktualisiert", settingsScreenLangSelectInfo: "Sprache wählen (erfordert Neuladen)", settingsScreenLangSelectChange: "Sprachwahl gespeichert - Erneut laden, um anzuwenden", helpScreenGeneral: "Allgemeines",  helpScreenGeneralWelcome: "Welcome {{0}}",  helpScreenGeneralWelcomeVersion: "Sie verwenden aktuell die am {{5}}. {{4}}. {{3}} erstellte Version {{0}}.{{1}}", helpScreenGeneralWelcomePs: ["Hallo! Sie benutzen die MOROway App. Der Hintergrund stellt eine Luftaufnahme der Modellbahn MOROway aus dem Jahre 2011 dar. Viel Fahrspaß!"], helpScreenGeneralWelcomeButtonWhatsNew:  "Neuigkeiten", helpScreenGeneralTrains: "Eisenbahnen {{0}}", helpScreenGeneralTrainsPs : ["Zur Zeit lassen sich drei Züge steuern; eine Dampflok, ein TGV Duplex und ein Schienen-Straßen-Bus. Das Starten bzw. Stoppen eines Zuges erfolgt durch Touch bzw. Klick auf den gewünschten Zug oder mit Hilfe der ausblendbaren klassischen Steuerelemente. Um einen Zug zu wenden, halten Sie den Zug an und touchen und halten bzw. doppelklicken Sie ihn.", "Um mittels der klassischen Steuerelemente zu fahren, wählen Sie zunächst einen Zug aus, indem Sie den Schalter unten links im Appbildschirm betätigen, bis der Name des gewünschten Zuges eingeblendet wird. Durch Anklicken des Transformators unten rechts im Appbildschirm wird der jeweils ausgewählte Zug gestartet und gestoppt. Wenn Sie einen größeren Bildschirm (Computer, Tablet u.ä.) verwenden, so können Sie die Geschwindigkeit des Zuges beeinflussen, indem Sie den Regler des Transformators an die gewünschte Position ziehen, ihn an unterschiedlichen Stellen anklicken oder über ihm am Mausrad drehen. Auf kleineren Bildschirmen (Smartphone u.ä.) wird unabhängig hiervon eine mittlere Geschwindigkeit eingestellt. Um auf größeren Bildschirmen die Richtung des jeweils ausgewählten Zuges am Transformator zu ändern, halten Sie den Zug an und klicken dann das Symbol mit den gespiegelten Pfeilen unten rechts im Transformator an. Auf kleineren Bildschirmen kann die Richtung hier nicht verändert werden.", "Auch können Sie einige Weichen stellen. Hierfür ist die entsprechende Option in den Einstellungen zu aktivieren. Das Stellen einer Weiche erfolgt durch Klick auf das farbige Symbol der jeweiligen Weiche. Die Position der Symbole kann durch langen Klick bzw. Touch auf den Hintergrund der Anlage ermittelt werden. Ein rotes Weichensymbol bedeutet, dass die Weiche nicht gestellt worden ist, ein grünes das Gegenteil. Der Zug befährt immer den eingefärbten Weg."], helpScreenGeneralCars: "Autos {{0}}", helpScreenGeneralCarsPs: ["Sie können die drei links neben dem Bahnhof geparkten Autos (gelbes Cabrio, rotes Cabrio, weißer VW-Bus) jeweils per Klick auf das Fahrzeug zum Fahren bringen. Um alle Autos automatisch fahren zu lassen, aktivieren Sie durch Touchen und halten bzw. Doppelklicken eines Autos den automatischen Modus.", "Sofern sie den automatischen Modus nicht aktiviert haben lassen sich die Autos getrennt per Klick starten und stoppen. Starten Sie mehrere Autos, riskieren Sie einen Frontalzusammenstoß. Um die betroffenen Autos hiernach erneut starten zu können, setzten Sie ein Auto durch Touchen und halten bzw. Doppelklicken des Autos zurück."], helpScreenGraphical: "Grafische Hilfe", helpScreenGraphicalDescription: "Grafische Erläuterung {{0}}",  helpScreenGraphicalDescriptionPs: ["1: Animierte Züge.", "2: Animierte Autos.", "3: Animiertes brennendes Finanzamt.", "4: Zugauswahl.", "5: Ausgewählter Zug.", "6: Transformator.", "7: Zugrichtungswechsel.", "8: Weichen."],helpScreenGraphicalDescriptionPic:  "Beschreibendes Bild", helpScreenLegal: "Lizenzen",  helpScreenLegalLibraries: "Eingebaute Libraries {{0}}",  helpScreenLegalStrCopyright: "Copyright",helpScreenLegalStrLicense: "Lizenz", helpScreenLegalLibrariesMDL: "Material Design Lite", helpScreenLegalLibrariesMDLPs: ["Wir verwenden das Designframework \"Material Design Lite\" der Google Inc."],helpScreenLegalLibrariesPace: "Pace.js", helpScreenLegalLibrariesPacePs: ["Wir verwenden die Ladeanimation \"Pace.js\" der HubSpot Inc."],helpScreenLegalFonts: "Verwendete Schriften {{0}}", helpScreenLegalFontsRoboto: "Roboto", helpScreenLegalFontsRobotoPs: ["Wir verwenden an einigen Stellen die Schriftart \"Roboto\" der Google Inc."], helpScreenLegalFontsMaterialIcons: "Material Icon Font", helpScreenLegalFontsMaterialIconsPs: ["Wir verwenden an einigen Stellen die \"Material Icons\" der Google Inc."],helpScreenLegalOwn: "MOROway App {{0}}", helpScreenLegalOwnCode: "Allgemein", helpScreenLegalOwnCodePs: ["Sie dürfen unsere Inhalte unter der Apache License Version 2.0 verwenden."], helpScreenLegalOwnPics: "Grafiken", helpScreenLegalOwnPicsPs: ["Sie dürfen unsere Grafiken auch unter der Creative Commons Attribution 4.0 International-Lizenz verwenden."], helpScreenContact: "Noch Fragen?",  helpScreenContactFeedback: "Feedback {{0}}",  helpScreenContactFeedbackPs: ["Sie kennen uns unbekannte Bugs? Sie haben Vorschläge, Feedback, Lob, Kritik, Fragen oder ein anderes Anliegen, dass Sie kommunizieren möchten? Hier sind die Kontaktdaten!"], helpScreenContactFeedbackBugs: "Bugreport", helpScreenContactImprintTitle: "Impressum", helpScreenContactBackupLink: "Zu den Kontaktdaten", helpScreenContactBackupLinkNotification: "Kontaktdaten geöffnet", helpScreenContactFeedbackSend: "Feedback senden", helpScreenContactFeedbackSendNotification: "Feedback-Seite geöffnet", helpScreenDownload: "Downloads",  helpScreenDownloadApps: "Apps {{0}}", helpScreenDownloadAppsAndroid: "Android", helpScreenDownloadAppsAndroidPs: ["Laden Sie sich die App auf Ihr Android Gerät über den Google Play Store."], helpScreenDownloadAppsAndroidButton: "Play Store", helpScreenDownloadAppsWindows: "Windows", helpScreenDownloadAppsWindowsPs: ["Laden Sie sich die App auf Ihren Windows 10 Laptop bzw. PC über den Microsoft Store."], helpScreenDownloadAppsWindowsButton: "Microsoft Store", helpScreenDownloadViewSource: "Source Code {{0}}", helpScreenDownloadViewSourcePs: ["Den Source Code dieser App finden Sie auf GitHub."],  helpScreenDownloadViewSourceCodePic: "Beispiel-Code", helpScreenDownloadViewSourceButtonSource: "GitHub", whatsNewScreenVersionNumber: "Version {{0}}", whatsNewScreenVersionNumberMinor: "Neu in Version {{0}}.{{1}}", whatsNewScreenVersionIsNew: "Neu", whatsNewScreenByVersionMa1Mi0: ["2011", "Die animierte Dampflok stellt den Beginn der MOROway App dar."], whatsNewScreenByVersionMa2Mi0: ["2011", "Ein neuer Zug, der TGV, wurde hinzugefügt.", "Erstes animiertes Auto."], whatsNewScreenByVersionMa3Mi0: ["2011", "Verbesserter TGV-Pfad in umgekehrter Richtung.","Verbesserter Pfad für das erste Auto.","Zweites Auto wurde hinzugefügt.","Beide Autos sind nun steuerbar."], whatsNewScreenByVersionMa3Mi1: ["2011", "Erste Version eines Infotextes."], whatsNewScreenByVersionMa3Mi2: ["2011", "Ein Intro mit dem MOROway Logo wurde eingebaut.", "Beide Züge sind individuell steuerbar.", "Steuerung des Infotext wurde ergänzt."], whatsNewScreenByVersionMa4Mi0: ["2015", "{{0}}Update von Action-Script 2 auf Action-Script 3.", "{{0}}Einfügen von Wagen für die Dampflok.", "{{0}}Zweiter Zug im Innenkreis (Schi-Stra-Bus).", "{{0}}Steuerung durch Klick auf Zug ist nun möglich.", "Überarbeiteter Hintergrund.", "Überarbeitete Kreisführung für die Autos.", "Veränderter Vorspann.", "Veränderte Bedienelemente und neuer Hilfetext.", "Fehlerkorrekturen."], whatsNewScreenByVersionMa5Mi0: ["2018", "{{0}}Neuer Hintergrund (u.a. verbesserter Bildausschnitt).", "{{0}}Variable Zuggeschwindigkeit.", "{{0}}Richtungswechsel für alle Züge möglich.", "{{0}}Kurzzeitig eingeblendete Benachrichtigungen informieren über Events.", "{{0}}Basiseinstellungen.", "{{0}}Neuer Vorspann.", "{{0}}Animation des brennenden Finanzamtes.", "Optimierte Objekte (Züge, Autos, Trafo,...).", "Optimierte Objektpfade (\"Zugstrecken\", \"Autostrecken\").", "Optimierte Objektsteuerung (Züge und Autos).", "Optimierte User-Interface.", "Optimierte Hilfeseiten.", "Nativer HTML-, JavaScript- und CSS-Code (statt Flash-Action-Script).", "Offline-Support als Progressive-Web-App.", "Einbau diverser Open-Source-Komponenten.", "Neue Lizenzierung des eigenen Codes."], whatsNewScreenByVersionMa5Mi1: ["2018", "{{0}}Einige Weichen können gestellt werden.", "Optimierte Zugstrecken.", "Fehlerkorrekturen."], whatsNewScreenByVersionMa5Mi2: ["2018", "{{0}}Die Züge starten und halten zeitvergözert.","{{0}}Autos können automatisch fahren.","{{0}}Kurzes Zurücksetzen der Autos möglich.", "Optimierte  Objektsteuerung (Züge und Autos)."], whatsNewScreenByVersionMa5Mi3: ["2018", "{{0}}Drittes, gelbes Auto.", "{{0}}Englische Version.", "Verbesserte Weichensymbole", "Fehlerkorrekturen."], whatsNewScreenByVersionMa5Mi4: ["2018", "Neue Lizenzierung des eigenen Codes. (Apache License Version 2 statt Two-Clause-BSD)"], errorScreenErrorMissing: "Fehlende Elemente", errorScreenErrorMissingPics: "Bilder", errorScreenErrorMissingPicsP1: "Erste Möglichkeit: Wir haben ein Bild falsch verlinkt oder fehlerhaft vom Server entfernt. Dies kann von Ihnen nicht behoben werden; Sie müssen sich gedulden, bis wir die Anwendung repariert haben.", errorScreenErrorMissingPicsP2: "Zweite Möglichkeit: Ihr Browser konnte eine richtig verlinkte Mediendatei nicht abrufen, da Sie kein Internet haben oder die Bilddatei blockiert wurde. In diesem Fall prüfen Sie bitte Ihre Verbindung / Firewall.", platformWebSettingsIframeApplyAndClose: "Anwenden und schließen", platformWindowsLinkError: "Fehler - Link konnte nicht geöffnet werden.", platformWindowsAppScreenFeedback: "Feedback", platformWindowsAppScreenChangelog: "Neuigkeiten"}};
Object.freeze(STRINGS);
const DEFAULT_LANG = "en";
const CURRENT_LANG = (typeof(window.localStorage) != "undefined" && typeof window.localStorage.getItem("morowayAppLang") == "string") ? (window.localStorage.getItem("morowayAppLang")) : ((typeof window.navigator.language != "undefined" && STRINGS.hasOwnProperty(window.navigator.language.substr(0,2))) ? window.navigator.language.substr(0,2) : DEFAULT_LANG);