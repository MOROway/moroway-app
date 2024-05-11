/**
 * Copyright 2024 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: Apache-2.0
 */
"use strict";
import { followLink, LINK_STATE_NORMAL } from "./common/follow_links.js";
import { getServerRedirectLink } from "../jsm/common/web_tools.js";
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#download-androidlink").addEventListener("click", function () {
        followLink(getServerRedirectLink("download_android"), "_blank", LINK_STATE_NORMAL);
    });
    document.querySelector("#download-fdroidlink").addEventListener("click", function () {
        followLink(getServerRedirectLink("download_fdroid"), "_blank", LINK_STATE_NORMAL);
    });
    document.querySelector("#download-windowslink").addEventListener("click", function () {
        followLink(getServerRedirectLink("download_windows"), "_blank", LINK_STATE_NORMAL);
    });
    document.querySelector("#download-snaplink").addEventListener("click", function () {
        followLink(getServerRedirectLink("download_snap"), "_blank", LINK_STATE_NORMAL);
    });
});
