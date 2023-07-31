// ==UserScript==
// @name         Find Free Spots
// @namespace    http://tampermonkey.net/
// @version      1.0
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
        function delay(ms) {
            return new Promise(res => setTimeout(res, ms));
        }

        console.log("finding...");
        await delay(1200);
    
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

            // Checking if two months from now and need to go back
            let dateString = document.getElementsByClassName("centre bold")[0].innerText
            if(isMoreThanTwoMonthsFromToday(dateString))
                await VratiSeUnazad();
            else
                await NextWeek();
        } 
        
        async function VratiSeUnazad()
        {
            await delay(1000);
            const backWeekLink = document.getElementById("searchForWeeklySlotsPreviousWeek");
            if (backWeekLink) 
            {
                backWeekLink.click();
                await VratiSeUnazad();
            }
            else await FindAvailableSpots();
            
        }

        async function NextWeek()
        {
            await delay(1200);
            const nextWeekLink = document.getElementById("searchForWeeklySlotsNextAvailable");
            if (nextWeekLink) nextWeekLink.click();
            await delay(1200);
            await FindAvailableSpots();
        }

        function isMoreThanTwoMonthsFromToday(dateRangeString) {
            let firstDate = dateRangeString.split("–")[0].trim();

            // Remove the ordinal suffixes (e.g., "th", "rd", "nd", "st") from the day.
            let day = firstDate.split(" ")[0].replace(/\D/g, "");

            // Extract the month and year.
            let monthName = firstDate.split(" ")[1];
            let year = firstDate.split(" ")[2];

            // Create a date object for today's date.
            let today = new Date();

            // Create a date object for the first date from the given range.
            let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            let monthIndex = monthNames.indexOf(monthName);
            let date = new Date(year, monthIndex, day);

            // Calculate the difference in months.
            let monthDifference = (date.getFullYear() - today.getFullYear()) * 12 + date.getMonth() - today.getMonth();

            // Return true if the month difference is more than 2, false otherwise.
            return monthDifference > 2 || (monthDifference === 2 && today.getDate() < date.getDate());
        }
        
    }
})();