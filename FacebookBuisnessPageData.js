// ==UserScript==
// @name         Facebook Data Automation
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Extract Data that matches the criteria from Facebook groups
// @author       Doncha1009
// @match        https://www.facebook.com/groups/*/members/pages
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("load", function()
    {
        // sve liste ljudi
        let sveListe = document.getElementsByClassName("x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x1iyjqo2 x2lwn1j");
        let lista;
        //for petlja da prodje kroz sve klase da nadje samo biznis strane
        for(let i = 2; i < 5; i++)
        {
            if(sveListe[i].childElementCount == 2)
            {
                let naslovListe = sveListe[i].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].textContent;
                console.log("Za: " + i + " element je " + naslovListe);
                if(naslovListe != null && naslovListe.contains("Pages")){
                    lista = sveListe[i].children[1].children[0].children;
                    break;
                }
            }
        }
        for(let i = 0; i < lista.length; i++)
        {
            getPage(lista[i].getElementsByTagName("a")[1].href, function(){ console.log('Element: ' + lista[i])});
            
        }

        function getPage(url, callback)
        {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: callback
            })
        }
    });
        
})();