"use strict";
//HANDLE OBJECTS
export function copyJSObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}
export function deepFreeze(obj) {
    if (typeof obj == "object") {
        Object.keys(obj).forEach(function (key) {
            if (typeof obj[key] == "object") {
                deepFreeze(obj[key]);
            }
        });
        Object.freeze(obj);
    }
}
