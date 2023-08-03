// ==UserScript==
// @name         Reserve Free Spots
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Reserve the spots on the UK gov website when found
// @author       You
// @match        https://driver-services.dvsa.gov.uk/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// ==/UserScript==
 
(async function() {
    'use strict';

    const table = document.getElementById("browseslots");
    if(!table)
    {
      const delay = ms => new Promise(res => setTimeout(res, ms));
      await delay(2500);
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
    
        const reserveButtons = document.querySelectorAll('a[id^="reserve_"]');
        if (reserveButtons && reserveButtons.length != 0) {
            // Found the button, click it
            reserveButtons[0].click();
            if (reserveButtons.length === 1) 
            {
              showNotification("The button is clicked!");
            }
        } else {
            // Button not found, find the <a> element with class "laquo largetext bold" and click it
            const returnToSearchResultsLink = document.querySelector("a.laquo.largetext.bold");
            if (returnToSearchResultsLink) {
                // Alert that the button is clicked
                returnToSearchResultsLink.click();
            } else {
                console.log("Button and return link not found.");
            }
        }
    }

})();