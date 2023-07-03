// ==UserScript==
// @name         Automatically fill numbers
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://127.0.0.1:5500/Timecards%20Firmtracker.html
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

// takes the website and fills the last column for every row with random numbers
// when button to add more rows is clicked it adds more rows
(function() {
    'use strict';

    // Get references to the elements
    // Get references to the elements
    const tableBody = document.getElementById('theTableBody');
    const moreRowsBtn = document.getElementById('moreRowsBtn');

    // Function to generate a random number between min and max (inclusive)
    function getRandomNumber(min, max) {
        const randomDecimal = Math.random();
        const scaledRandom = randomDecimal * (max - min);
        const randomNumber = scaledRandom + min;

        // Round the random number to two decimal places
        const roundedNumber = randomNumber.toFixed(2);

        // Return the rounded random number
        return parseFloat(roundedNumber);
    }

    console.log("starting");

    const minNumber = 0.02;
    const maxNumber = 0.1;
    let lastRowIndex = tableBody.children.length;

    // Loop through each row in the table body and fill it with a random number
    for (let i = 0; i < tableBody.children.length; i++) {
        const row = tableBody.children[i];
        const lastCell = row.lastElementChild;

        // Generate a random number between min and max
        const randomNumber = getRandomNumber(minNumber, maxNumber);

        // Set the random number as the content of the last cell
        lastCell.textContent = randomNumber;
    }

    // Attach an event listener to the "+ more rows" button
    moreRowsBtn.addEventListener('click', function() {
        // Create the new rows and fill them with random numbers
        for (let i = lastRowIndex; i < tableBody.children.length; i++) {
            const row = tableBody.children[i];
            const lastCell = row.lastElementChild;

            // Generate a random number between min and max
            const randomNumber = getRandomNumber(minNumber, maxNumber);

            // Set the random number as the content of the last cell
            lastCell.textContent = randomNumber;
        }

        // Update the lastRowIndex to the new length of tableBody.children
        lastRowIndex = tableBody.children.length;
    });
})();