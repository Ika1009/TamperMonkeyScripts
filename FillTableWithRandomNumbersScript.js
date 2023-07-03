// ==UserScript==
// @name         Table Filler
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Takes the website and fills the last column for every row with random numbers
// @author       Doncha1009
// @match        *://*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Get references to the elements
    const tableBody = document.getElementById('theTableBody');
    const moreRowsBtn = document.getElementById('moreRowsBtn');

    console.log("Started");
    const minNumber = 0.02;
    const maxNumber = 0.1;
    let lastRowIndex = 0;

    // Loop through each row in the table body and fill it with a random number
    function fillTableRows() {
        if(lastRowIndex == tableBody.children.length) return;
        for (let i = lastRowIndex; i < tableBody.children.length; i++) {
            const row = tableBody.children[i];
            const lastCell = row.lastElementChild;
            const randomNumber = getRandomNumber(minNumber, maxNumber);
            // Set the random number as the content of the last cell
            lastCell.textContent = randomNumber;
        }
        lastRowIndex = tableBody.children.length;
        console.log("filled");
    }

    fillTableRows();

    // Attach an event listener to the "+ more rows" button
    moreRowsBtn.addEventListener('click', function() {
        fillTableRows();
    });

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


})();
