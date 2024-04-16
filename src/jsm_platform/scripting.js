"use strict";
import { followLink, LINK_STATE_INTERNAL_HTML } from "./common/follow_links.js";
import { APP_DATA } from "../jsm/common/app_data.js";
import { showServerNote } from "../jsm/common/web_tools.js";
import { getString } from "../jsm/common/string_tools.js";
import { setSettingsHTML } from "../jsm/common/settings.js";
import { notify, NOTIFICATION_PRIO_DEFAULT } from "../jsm/common/notify.js";
import { getMode } from "../jsm/scripting.js";
document.addEventListener("moroway-app-ready", function () {
    if (getMode() == "normal") {
        showServerNote();
    }
    setSettingsHTML(document.querySelector("#settings-inner"), false);
});
document.addEventListener("moroway-app-ready-notification", function (event) {
    var eventCustom = event;
    var minHeight = 0;
    if (eventCustom.detail && eventCustom.detail.notifyMinHeight) {
        minHeight = eventCustom.detail.notifyMinHeight;
    }
    notify("#canvas-notifier", getString("appScreenHasLoaded", "."), NOTIFICATION_PRIO_DEFAULT, 4000, function () {
        followLink("help", "_blank", LINK_STATE_INTERNAL_HTML);
    }, getString("generalTitleHelpScreen", "", "upper"), minHeight);
});
document.addEventListener("moroway-app-update-notification", function (event) {
    var eventCustom = event;
    var minHeight = 0;
    if (eventCustom.detail && eventCustom.detail.notifyMinHeight) {
        minHeight = eventCustom.detail.notifyMinHeight;
    }
    notify("#canvas-notifier", getString("generalNewVersion", "!", "upper"), NOTIFICATION_PRIO_DEFAULT, 7000, function () {
        followLink("whatsnew/#newest", "_blank", LINK_STATE_INTERNAL_HTML);
    }, getString("appScreenFurtherInformation", "", "upper"), minHeight);
});
document.addEventListener("moroway-app-keep-screen-alive", function (event) {
    var mode = getMode();
    if (mode == "online" || mode == "demo") {
        var eventCustom = event;
        if (eventCustom.detail) {
            if (eventCustom.detail.acquire) {
                try {
                    navigator.wakeLock.request("screen");
                }
                catch (error) {
                    if (APP_DATA.debug) {
                        console.log("Wake-Lock-Error:", error);
                    }
                }
            }
        }
    }
});
