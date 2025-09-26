/**
 * Copyright 2025 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
import { APP_DATA } from "../../jsm/common/app_data.js";
import { followLink, LinkStates } from "../../jsm/common/web_tools.js";
export var SYSTEM_TOOLS = {
    canExitApp: function () {
        return !window.matchMedia("(display-mode: browser)").matches && window.history.length === 1;
    },
    exitApp: function () {
        try {
            window.close();
        }
        catch (error) {
            if (APP_DATA.debug) {
                console.error("Window-Close-Error:", error);
            }
        }
    },
    forceModeSwitchHandling: function () {
        if (window.matchMedia("(display-mode: browser)").matches) {
            return false;
        }
        return "historyReplace";
    },
    keepAlive: function (acquire) {
        if (acquire) {
            try {
                navigator.wakeLock.request("screen");
            }
            catch (error) {
                if (APP_DATA.debug) {
                    console.error("Wake-Lock-Error:", error);
                }
            }
        }
    },
    navigateBack: function () {
        if (document.referrer.startsWith(document.baseURI) && document.referrer !== document.baseURI && window.history.length > 1) {
            window.history.back();
        }
        else {
            try {
                window.close();
            }
            catch (error) {
                if (APP_DATA.debug) {
                    console.error("Window-Close-Error:", error);
                }
            }
            followLink("./", "_self", LinkStates.InternalHtml);
        }
    }
};
