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
        let sviRezultati;
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
            let windowNovi = window.open(lista[i].getElementsByTagName("a")[1].href); // za svaku biznis stranu otvori window
            let datum, broj_telefona, adresa;
            windowNovi.addEventListener("load", function()// louduj stranicu
            {
                let pageSource = windowNovi.pageSource;
                datum = getPageCreationDate(pageSource);
                broj_telefona = getPhoneNumber(pageSource);
                adresa = getCountryName(pageSource);
                windowNovi.close();
            })
            setTimeout(5000); // saceka da ga uradi

            if(datum == -1 || broj_telefona == -1 || adresa == -1) // da li su ispravni
                continue;
            
            // kod da dobije jos vise podataka
            sviRezultati += "Page creation date: " + datum + ", Phone number: " + broj_telefona + ", Address: " + adresa + "\n"; 
            
        }
        function getPageCreationDate(pageSource)
        {
            let leviDeoIndex = pageSource.indexOf('page_creation_date":{"text":');
            let stringDatuma = pageSource.substring(leviDeoIndex, leviDeoIndex + 40);
            console.log(stringDatuma);
            if(stringDatuma.split(",")[1].contains("2022"))
                return stringDatuma;
            else
                return -1;
        }
        function getPhoneNumber(pageSource)
        {
            let leviDeoIndex = pageSource.indexOf('"formatted_phone_number":"');
            let stringBrojaTelefona = pageSource.substring(leviDeoIndex, leviDeoIndex + 20);
            console.log(stringBrojaTelefona);
            if(stringBrojaTelefona.split(",")[0].contains("null"))
                return -1;
            else
                return stringBrojaTelefona.replace(/,+$/, '');
        }
        function getCountryName(pageSource)
        {
            let leviDeoIndex = pageSource.indexOf('"full_address":');
            let stringImenaZemlje = pageSource.substring(leviDeoIndex, leviDeoIndex + 20);
            console.log(stringImenaZemlje);
            if(!stringImenaZemlje.contains("Australia"))
                return -1;
            else
                return stringBrojaTelefona.split('"}')[0];
        }
    }); 
        
})();
