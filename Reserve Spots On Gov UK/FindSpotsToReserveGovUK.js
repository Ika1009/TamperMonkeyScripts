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

(async function() {
    'use strict';

    // Checkinf if it is the right page, with the table
    const table = document.getElementById("browseslots");
    if(table)
    {
        const delay = ms => new Promise(res => setTimeout(res, ms));

        console.log("finding...");
        await delay(2000);
    
        await FindAvailableSpots();
        async function FindAvailableSpots()
        {
            const table = document.getElementById("browseslots");
            let rows = table.querySelector("tbody").querySelectorAll("tr");

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
            await NextWeek();
        } 
        
        async function NextWeek()
        {
            await delay(2000);
            const nextWeekLink = document.getElementById("searchForWeeklySlotsNextWeek");
            if (nextWeekLink) nextWeekLink.click();
            await delay(2000);
            await FindAvailableSpots();
        }

    }
})();