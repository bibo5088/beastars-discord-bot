"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash = exports.mimetypeToExtension = exports.tmpFilename = exports.isAdministrator = exports.maxArray = exports.chunkArray = exports.arrayEqual = exports.includeStartsWith = exports.asyncForEach = exports.findMemberByUsername = exports.regexCount = exports.getEverythingAfterMatch = exports.escapeRegExp = void 0;
const os = require("os");
const path = require("path");
const crypto = require("crypto");
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}
exports.escapeRegExp = escapeRegExp;
function getEverythingAfterMatch(pattern, str, times = 1) {
    let count = 0;
    while (pattern.exec(str) !== null) {
        if (++count === times) {
            return str.slice(pattern.lastIndex);
        }
    }
    //No match
    return "";
}
exports.getEverythingAfterMatch = getEverythingAfterMatch;
function regexCount(re, str) {
    return ((str || "").match(re) || []).length;
}
exports.regexCount = regexCount;
function findMemberByUsername(guild, name) {
    let lowerCaseName = name.toLowerCase();
    //Remove the @ if there is one
    if (lowerCaseName.startsWith("@")) {
        lowerCaseName = lowerCaseName.substring(1);
    }
    /*Priotities
    7 : Exact username#discrimator
    6 : Exact nickname
    5 : Starts with nickname
    4 : Substring nickname
    3 : Exact username
    2 : Starts with username
    1 : Substring nickname
     */
    const results = [];
    for (const member of guild.members.cache.array()) {
        if (name == `${member.user.username}#${member.user.discriminator}`) {
            return [member];
        }
        //Find by nickname
        if (member.nickname != undefined) {
            const nickname = member.nickname.toLowerCase();
            if (lowerCaseName === nickname) {
                results.push(member);
                continue;
            }
            if (nickname.startsWith(lowerCaseName)) {
                results.push(member);
                continue;
            }
            if (nickname.includes(lowerCaseName)) {
                results.push(member);
                continue;
            }
        }
        const username = member.user.username.toLowerCase();
        //Find by username
        if (username.startsWith(lowerCaseName)) {
            if (lowerCaseName === username) {
                results.push(member);
                continue;
            }
            if (username.startsWith(lowerCaseName)) {
                results.push(member);
                continue;
            }
            if (username.includes(lowerCaseName)) {
                results.push(member);
                continue;
            }
        }
    }
    return results;
}
exports.findMemberByUsername = findMemberByUsername;
async function asyncForEach(array, callback) {
    const promises = [];
    for (const a of array) {
        promises.push(callback.call(a, a));
    }
    await Promise.all(promises);
}
exports.asyncForEach = asyncForEach;
function includeStartsWith(array, search) {
    for (const str of array) {
        if (search.startsWith(str)) {
            return true;
        }
    }
    return false;
}
exports.includeStartsWith = includeStartsWith;
function arrayEqual(a, b) {
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}
exports.arrayEqual = arrayEqual;
function chunkArray(arr, len) {
    const chunks = [];
    let i = 0;
    const n = arr.length;
    while (i < n) {
        chunks.push(arr.slice(i, i += len));
    }
    return chunks;
}
exports.chunkArray = chunkArray;
function maxArray(arr, func) {
    let maxVal = func(arr[0]);
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        const val = func(arr[0]);
        //New maximum
        if (val > maxVal) {
            maxVal = val;
            max = arr[0];
        }
    }
    return max;
}
exports.maxArray = maxArray;
function isAdministrator(member) {
    return member.hasPermission("BAN_MEMBERS");
}
exports.isAdministrator = isAdministrator;
function tmpFilename(name) {
    return path.join(os.tmpdir(), `${Date.now()}-${name}`);
}
exports.tmpFilename = tmpFilename;
function mimetypeToExtension(mimetype) {
    const ext = mimetype.split("/")[1];
    if (ext === "svg+xml") {
        return ".svg";
    }
    return `.${ext}`;
}
exports.mimetypeToExtension = mimetypeToExtension;
function hash(data, hashingAlgorithm = "sha256") {
    const hash = crypto.createHash(hashingAlgorithm);
    hash.update(data);
    return hash.digest("hex");
}
exports.hash = hash;
//# sourceMappingURL=helpers.js.map