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
            let windowNovi = window.open(url); // za svaku biznis stranu otvori window

            await delay(5000);

            let pageSource = windowNovi.document.getElementsByTagName("html")[0].innerHTML;


            if(pageSource.contains('page_creation_date":{"text":'))
                datum = getPageCreationDate(pageSource);
            else
            {
                let indexAbout = pageSource.indexOf('"section_type":"ABOUT"'); // izvlaci about link za novi window
                let stringTemp = pageSource.substring(indexAbout + 22, indexAbout + 150);
                stringTemp = stringTemp.slice(stringTemp.indexOf('"url":"') + 7, stringTemp.length - 1);
                stringTemp = stringTemp.slice(0, stringTemp.indexOf('","'));
                stringTemp += "_profile_transparency"; // da bi uslo odmah za datum

                await delay(1000);
                windowNovi.close();
                await delay(1000);
                let windowNoviji = window.open(stringTemp);
                await delay(5000);

                let pageSource2 = windowNoviji.document.getElementsByTagName("html")[0].innerHTML;
                console.log(pageSource2);
                
                await delay(1000);
                windowNoviji.close();

                datum = getPageCreationDate2(pageSource2);
            }
            //console.log("Datum: " + datum);
            broj_telefona = getPhoneNumber(pageSource);
            //console.log("Broj Telefona: " + broj_telefona);
            adresa = getCountryName(pageSource);
            //console.log("Ime zemlje:" + adresa);

            if(datum == -1 || broj_telefona == -1 || adresa == -1){ // da li su ispravni
                //console.log("Nije dobar jer je datum: " + datum + ", broj telefona: " + broj_telefona + ", adresa: " + adresa);
            }
            else
            {
                let imeBiznisa = getBuisnessName(pageSource);
                //console.log("Ime zemlje Biznisa:" + imeBiznisa);
                let website = getBuisnessWebsite(pageSource);
                //console.log("Website biznisa: " + website);
                console.log("DOBRA FIRMA: " + imeBiznisa + " " + " ");

                sviRezultati += imeBiznisa + "," + broj_telefona + "," + '"' + adresa + '"' + "," + website + "," + url + "," + '"' + datum + '"' + "\n"; 
                //console.log("SVI REZULTATI:" + sviRezultati);
            }
            await delay(1000);
            windowNovi.close();
            
        }

        saveData(sviRezultati, "foundData.csv");


        function getPageCreationDate(pageSource)
        {
            let leviDeoIndex = pageSource.indexOf('page_creation_date":{"text":');
            let stringDatuma = pageSource.substring(leviDeoIndex + 28, leviDeoIndex + 68);
            //console.log(stringDatuma);
            if(stringDatuma.contains("2022"))
                return stringDatuma.slice(stringDatuma.indexOf(' - ') + 3, stringDatuma.indexOf('"},'));
            else
                return -1;
        }
        function getPageCreationDate2(pageSource)
        {
            let leviDeoIndex = pageSource.indexOf('"},"field_type":"creation_date"');
            let stringDatuma = pageSource.substring(leviDeoIndex - 17, leviDeoIndex);
            console.log("DATUM 2: " + stringDatuma);
            if(stringDatuma.contains("2021") || stringDatuma.contains("2020") || stringDatuma.contains("2019") || stringDatuma.contains("2018") || stringDatuma.contains("2007") ||
            stringDatuma.contains("2017") || stringDatuma.contains("2016") || stringDatuma.contains("2015") || stringDatuma.contains("2014") || stringDatuma.contains("2009") ||
            stringDatuma.contains("2013") || stringDatuma.contains("2012") || stringDatuma.contains("2011") || stringDatuma.contains("2010") || stringDatuma.contains("2008"))
                return -1;
            else
                return stringDatuma.slice(stringDatuma.indexOf('":"') + 3, stringDatuma.length - 1);
        }
        function getPhoneNumber(pageSource)
        {
            let leviDeoIndex = pageSource.indexOf('"formatted_phone_number":"');
            let stringBrojaTelefona = pageSource.substring(leviDeoIndex + 26, leviDeoIndex + 46);
            if(stringBrojaTelefona.contains("null") || stringBrojaTelefona[4] != '4')
            {
                let leviDeoIndex = pageSource.indexOf('dir="auto">+61 4');
                stringBrojaTelefona = pageSource.substring(leviDeoIndex + 11, leviDeoIndex + 46);
                if(leviDeoIndex == -1 || stringBrojaTelefona.contains("null"))
                    return -1;
                
                return stringBrojaTelefona.slice(0, stringBrojaTelefona.indexOf('</'))
            }
            else
                return stringBrojaTelefona.slice(1, stringBrojaTelefona.indexOf('","'));
        }
        function getCountryName(pageSource)
        {
            let leviDeoIndex = pageSource.indexOf('"full_address":');
            let stringImenaZemlje = pageSource.substring(leviDeoIndex + 14, leviDeoIndex + 164);
            if(!stringImenaZemlje.contains("Australia"))
            {
                //<div class="xzsf02u x6prxxf xvq8zen x126k92a x12nagc"><span class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen xo1l8bm xzsf02u" dir="auto">
                let leviDeoIndex = pageSource.indexOf('x1a2a7pz x1heor9g xt0b8zv" role="button" tabindex="0"><span class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen xo1l8bm xzsf02u" dir="auto">');
                stringImenaZemlje = pageSource.substring(leviDeoIndex + 232, leviDeoIndex + 300);
                if(leviDeoIndex == -1 || !stringImenaZemlje.contains("Australia"))
                    return -1;
                return stringImenaZemlje.slice(0, stringImenaZemlje.indexOf('</'))
            }
            else
                return stringImenaZemlje.slice(2, stringImenaZemlje.indexOf("Australia") + 9);
        }
        function getBuisnessName(pageSource)
        {
            let leviDeoIndex = pageSource.indexOf('"meta":{"title":"');
            let imeBiznisa = pageSource.substring(leviDeoIndex + 17, leviDeoIndex + 70);
            // console.log("Ime biznisa neobradjeno:" + imeBiznisa);
            return imeBiznisa.slice(0, imeBiznisa.indexOf('","'));
        }
        function getBuisnessWebsite(pageSource)
        {
            let buisnessWebsite = "";
            let leviDeoIndex = pageSource.indexOf('u00252F\\u00252F');
            leviDeoIndex = pageSource.indexOf('"website":');
            if(leviDeoIndex == -1) // ako postoji
                return -1;
            
            // ako ne postoji 
            leviDeoIndex = pageSource.indexOf('"website":"');
            buisnessWebsite = pageSource.substring(leviDeoIndex + 10, leviDeoIndex + 70);
            return buisnessWebsite.slice(0, buisnessWebsite.indexOf('","'));
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