// ==UserScript==
// @name         Find Free Spots
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Find all of the available space on the UK gov website when found
// @author       You
// @match        https://driver-services.dvsa.gov.uk/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // Checkinf if it is the right page, with the table
    const table = document.getElementById("browseslots");
    if(!table) return
    

    const searchResultsDiv = document.getElementById("searchResults");

    // checking if the date is 
    if (searchResultsDiv) {
    const firstChild = searchResultsDiv.firstElementChild;
    if (firstChild && firstChild.tagName === "H3") {
        const textContent = firstChild.textContent;
        if (textContent.includes("2200")) {
        // The text content contains "2200", so stop the program
        return;
        }
    }
    }
      


    const rows = table.querySelector("tbody").querySelectorAll("tr");

    FindAvailableSpots();

    const nextWeekLink = document.getElementById("searchForWeeklySlotsNextWeek");
    if (nextWeekLink) nextWeekLink.click();


    function FindAvailableSpots()
    {

        rows.forEach((row) => {
            const tds = row.querySelectorAll("td");
            for (let i = 1; i < tds.length - 1; i++) {
                const anchor = tds[i].querySelector("a");
                const text = anchor.textContent.trim();
                if (!text.includes("0")) {
                    anchor.click();
                }
            }
        });
    }
    
})();