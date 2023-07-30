// ==UserScript==
// @name         Reserve Free Spots
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Reserve the spots on the UK gov website when found
// @author       You
// @match        https://driver-services.dvsa.gov.uk/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    const table = document.getElementById("browseslots");
    if(table) return

    // Check if the browser supports notifications
  if ('Notification' in window) {
    // Request permission for notifications (if not already granted)
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }
    function showNotification() {
        // Show a Windows notification
        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification("Button Clicked!", {
            body: "Places reserved!",
            });
        }
    }

    console.log("reserving...");

    const reserveButton = document.querySelectorAll('a[id^="reserve_"]')[0];
    if (reserveButton) {
        // Found the button, click it
        reserveButton.click();
    } else {
         // Alert that the button is clicked
         showNotification("The button is clicked!");
         // Button not found, find the <a> element with class "laquo largetext bold" and click it
         const returnToSearchResultsLink = document.querySelector("a.laquo.largetext.bold");
         if (returnToSearchResultsLink) {
             returnToSearchResultsLink.click();
         } else {
             console.log("Button and return link not found.");
         }
    }

})();