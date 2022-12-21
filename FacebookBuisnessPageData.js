// ==UserScript==
// @name         Facebook Data Automation
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Extract Data that matches the criteria from Facebook groups
// @author       Doncha1009
// @match        https://www.facebook.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("load", async function()
    {
        let sviRezultati = "Buisness Name,Phone Number,Address,Website,Facebook,Creation Date\n";
        // sve liste ljudi
        let sveListe = document.getElementsByClassName("x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x1iyjqo2 x2lwn1j");
        let lista;
        const delay = ms => new Promise(res => setTimeout(res, ms));
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
        await delay(5000);
        //console.log("Duzina liste je: " + lista.length);
        for(let i = 0; i < lista.length-1; i++)
        {
            let datum, broj_telefona, adresa;
            let url = lista[i].getElementsByTagName("a")[1];
            console.log("KRECE " + i + " PO REDU");
            let windowNovi = window.open(url, "_blank"); // za svaku biznis stranu otvori window

            await delay(8000);
            
            let pageSource = windowNovi.document.getElementsByTagName("html")[0].innerHTML;

            datum = getPageCreationDate(pageSource);
            //console.log("Datum: " + datum);
            broj_telefona = getPhoneNumber(pageSource);
            //console.log("Broj Telefona: " + broj_telefona);
            adresa = getCountryName(pageSource);
            //console.log("Ime zemlje:" + adresa);

            if(datum == -1 || broj_telefona == -1 || adresa == -1) // da li su ispravni
                console.log("Nije dobar jer je datum: " + datum + ", broj telefona: " + broj_telefona + ", adresa: " + adresa);
            else
            {
                console.log("DOBRA FIRMA");
                let imeBiznisa = getBuisnessName(pageSource);
                //console.log("Ime zemlje Biznisa:" + imeBiznisa);
                let website = getBuisnessWebsite(pageSource);
                //console.log("Website biznisa: " + website);
                //let sviRezultati = "Buisness Name,Phone Number,Address,Website,Facebook,Creation Date\n";

                sviRezultati += imeBiznisa + "," + broj_telefona + "," + '"' + adresa + '"' + "," + website + "," + url + "," + '"' + datum + '"' + "\n"; 
                console.log("SVI REZULTATI:" + sviRezultati);
            }
            await delay(2000);
            windowNovi.close();
            
        }

        saveData(sviRezultati, "foundData.csv");


        function getPageCreationDate(pageSource)
        {
            let leviDeoIndex = pageSource.indexOf('page_creation_date":{"text":');
            let stringDatuma = pageSource.substring(leviDeoIndex + 28, leviDeoIndex + 68);
            console.log(stringDatuma);
            if(stringDatuma.contains("2022"))
                return stringDatuma.slice(stringDatuma.indexOf(' - ') + 3, stringDatuma.indexOf('"},'));
            else
                return -1;
        }
        function getPhoneNumber(pageSource)
        {
            let leviDeoIndex = pageSource.indexOf('"formatted_phone_number":"');
            let stringBrojaTelefona = pageSource.substring(leviDeoIndex + 26, leviDeoIndex + 46);
            if(stringBrojaTelefona.contains("null") || stringBrojaTelefona[4] != '4')
                return -1;
            else
                return stringBrojaTelefona.slice(1, stringBrojaTelefona.indexOf('","'));
        }
        function getCountryName(pageSource)
        {
            let leviDeoIndex = pageSource.indexOf('"full_address":');
            let stringImenaZemlje = pageSource.substring(leviDeoIndex + 14, leviDeoIndex + 164);
            if(!stringImenaZemlje.contains("Australia"))
                return -1;
            else
                return stringImenaZemlje.slice(2, stringImenaZemlje.indexOf("Australia") + 9);
        }
        function getBuisnessName(pageSource)
        {
            let leviDeoIndex = pageSource.indexOf('"meta":{"title":"');
            let imeBiznisa = pageSource.substring(leviDeoIndex + 17, leviDeoIndex + 70);
            return imeBiznisa.slice(17, imeBiznisa.indexOf('","'));
        }
        function getBuisnessWebsite(pageSource)
        {
            let buisnessWebsite = "";
            let leviDeoIndex = pageSource.indexOf('u00252F\\u00252F');
            if(leviDeoIndex != -1){ // ako postoji
                buisnessWebsite = pageSource.substring(leviDeoIndex + 15, leviDeoIndex + 70);
            }
            return buisnessWebsite.slice(0, buisnessWebsite.indexOf('\\u00252F'));
        }
        function saveData(data, fileName) {
            console.log("Saving data to " + fileName);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            var blob = new Blob([data], {type: "octet/stream"});
            var url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        };
    }); 
        
})();