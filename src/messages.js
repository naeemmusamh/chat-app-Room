"use strict";

//require the package moment
const moment = require("moment");

//to set time for the message when it send
function formatMessage(userName, text) {
    return {
        userName,
        text,
        time: moment().format("h:mm a"),
    };
}

module.exports = formatMessage;