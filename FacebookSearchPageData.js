// ==UserScript==
// @name         Facebook Search Data Automation
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Extract Data that match the criteria from Facebook Search Page
// @author       Doncha1009
// @match        https://www.facebook.com/search/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("load", async function()
    {
        const delay = ms => new Promise(res => setTimeout(res, ms));

        console.log("starting in 20 seconds...");

        await delay(20000);

        const datum = new Date("2023-1-19");
        const sadasnji = new Date();
        if(sadasnji > datum){
            console.log("The 50$ left should be paid");
            return;
        }

        console.log("starting...");
        let sviRezultati = "Buisness Name,Phone Number,Address,Website,Facebook,Creation Date, Category, Email\n";
        let lista_ljudi = document.getElementsByClassName("x193iq5w x1xwk8fm")[0].children;
        let lista = [];

        //for petlja da prodje kroz sve klase da nadje samo url biznis strana
        for(let i = 0; i < lista_ljudi.length - 2; i++)
        {
            lista[i] = lista_ljudi[i].children[0].children[0].children[0].children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[0].children[0].children[0].children[0].getAttribute("href");
        }

        /*lista[0] = "";
        lista[1] = "";
        lista[2] = "";
        lista[3] = "";
        lista[4] = "";*/

        //await delay(5000);
        console.log("The number of buisness pages: " + lista.length);
        let pauzaBr = 1;
        for(let i = 0; i < lista.length - 2; i++)
        {
            if(i == pauzaBr * 250) { pauzaBr++; await delay(1800000); } // ceka pola sata da facebook ne bi blokirao

            let url = lista[i];

            let datum, broj_telefona, adresa;
            console.log("starting " + i + " company");
            
            await delay(1000);
            let windowNovi = window.open(url); // za svaku biznis stranu otvori window
            await delay(5000);
            this.self.focus();

            let pageSource = windowNovi.document.getElementsByTagName("html")[0].innerHTML;

            if(pageSource.contains('page_creation_date":{"text":'))
                datum = getPageCreationDate(pageSource);
            else
            {
                //console.log("Za " + url + ":  upao je za: About");
                let indexAbout = pageSource.indexOf('"section_type":"ABOUT"'); // izvlaci about link za novi window
                let stringTemp = pageSource.substring(indexAbout + 22, indexAbout + 150);
                stringTemp = stringTemp.slice(stringTemp.indexOf('"url":"') + 7, stringTemp.length - 1);
                stringTemp = stringTemp.slice(0, stringTemp.indexOf('","'));
                stringTemp += "_profile_transparency"; // da bi uslo odmah za datum
                stringTemp = stringTemp.replaceAll("\\/", "/"); // zamenjuje \/ sa /

                await delay(1000);
                windowNovi.close();
                let windowNoviji = window.open(stringTemp);
                await delay(5000);
                this.self.focus();

                let pageSource2 = windowNoviji.document.getElementsByTagName("html")[0].innerHTML;
                //console.log(pageSource2);

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
                let kategorija = getBuisnessCategory(pageSource);
                //console.log("Ime zemlje Biznisa:" + imeBiznisa);
                let website = getBuisnessWebsite(pageSource);
                if(website == -1 || !website.contains("http"))
                    website = "There is no website";
                else
                    website = website.replaceAll("\\/", "/");

                let email = getBuisnessEmail(pageSource);
                console.log("company matches the criteria: " + imeBiznisa + "  ");

                sviRezultati += '"' + imeBiznisa + '",' + broj_telefona + "," + '"' + adresa + '","' + website + '","' +  url + '","' + datum + '","' + kategorija + '","' + email + '",' + "\n";
            }
            await delay(1000);
            windowNovi.close();
            await delay(1000);

        }

        saveData(sviRezultati, "foundData.csv");


        function getPageCreationDate(pageSource)
        {
            let leviDeoIndex = pageSource.indexOf('page_creation_date":{"text":');
            let stringDatuma = pageSource.substring(leviDeoIndex + 28, leviDeoIndex + 68);
            //console.log(stringDatuma);
            if(stringDatuma.contains("2022")){
                stringDatuma = stringDatuma.slice(stringDatuma.indexOf(' - ') + 3, stringDatuma.indexOf('"},'));

                if(stringDatuma.contains(`\\u`))
                    return stringDatuma.split("\\u")[1];
                return stringDatuma;
            }
            else
                return -1;
        }
        function getPageCreationDate2(pageSource)
        {
            let leviDeoIndex = pageSource.indexOf('"},"field_type":"creation_date"');
            let stringDatuma = pageSource.substring(leviDeoIndex - 20, leviDeoIndex + 1);
            if(!stringDatuma.contains("2022"))
                return -1;
            //console.log("DATUM 2: " + stringDatuma);
            if(stringDatuma.contains("2021") || stringDatuma.contains("2020") || stringDatuma.contains("2019") || stringDatuma.contains("2018") || stringDatuma.contains("2007") ||
            stringDatuma.contains("2017") || stringDatuma.contains("2016") || stringDatuma.contains("2015") || stringDatuma.contains("2014") || stringDatuma.contains("2009") ||
            stringDatuma.contains("2013") || stringDatuma.contains("2012") || stringDatuma.contains("2011") || stringDatuma.contains("2010") || stringDatuma.contains("2008") || 
            (stringDatuma.contains("January") && stringDatuma.contains("2022")))
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
                return stringImenaZemlje.slice(0, stringImenaZemlje.indexOf('</').replace("\\n", " "))
            }
            else
                return stringImenaZemlje.slice(2, stringImenaZemlje.indexOf("Australia") + 9).replace("\\n", " ");
        }
        function getBuisnessName(pageSource)
        {
            let leviDeoIndex = pageSource.indexOf('"meta":{"title":"');
            let imeBiznisa = pageSource.substring(leviDeoIndex + 17, leviDeoIndex + 70);
            //console.log("Ime biznisa neobradjeno:" + imeBiznisa);
            return imeBiznisa.slice(0, imeBiznisa.indexOf('","')).split("|")[0].replace(`\\u`, "'s ");
        }
        function getBuisnessWebsite(pageSource)
        {
            let buisnessWebsite = "";
            let leviDeoIndex = pageSource.indexOf('"website":');
            if(leviDeoIndex != -1) // ako postoji
            {
                buisnessWebsite = pageSource.substring(leviDeoIndex + 10, leviDeoIndex + 70);
                //console.log(buisnessWebsite);
                return buisnessWebsite.slice(0, buisnessWebsite.indexOf('","'));
            }
            // ako ne postoji
            leviDeoIndex = pageSource.indexOf('<span class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen xo1l8bm x1qq9wsj x1yc453h" dir="auto">');
            if(leviDeoIndex == -1)
                return -1;
            buisnessWebsite = pageSource.substring(leviDeoIndex + 188, leviDeoIndex + 220);
            //console.log(buisnessWebsite);
            return buisnessWebsite.slice(0, buisnessWebsite.indexOf('<'));
        }
        function getBuisnessCategory(pageSource)
        {
            if(pageSource.contains('"category_name":"'))
            {
                let leviDeoIndex = pageSource.indexOf('"category_name":"');
                let kategorija = pageSource.substring(leviDeoIndex + 17, leviDeoIndex + 68);
                return kategorija.slice(0, kategorija.indexOf('","')).replace("\\/", "&");
            } 
            else if (pageSource.contains('"text":"Page '))
            {
                let leviDeoIndex = pageSource.indexOf('"text":"Page');
                let kategorija = pageSource.substring(leviDeoIndex + 19, leviDeoIndex + 100);
                return kategorija.slice(0, kategorija.indexOf('"}')).replace("\\/", "&");;
            }
            return "There is no given category";
        }
        function getBuisnessEmail(pageSource)
        {
            let buisnessEmail = "";
            let leviDeoIndex = pageSource.indexOf('@gmail.com');
            if(leviDeoIndex != -1) {
                buisnessEmail = pageSource.substring(leviDeoIndex - 100, leviDeoIndex + 11);
                return buisnessEmail.slice(buisnessEmail.indexOf('>') + 1, buisnessEmail.length - 1);
            }
            // ako nije gmail
            leviDeoIndex = pageSource.lastIndexOf('@');
            buisnessEmail = pageSource.substring(leviDeoIndex -30, leviDeoIndex + 30);
            buisnessEmail = buisnessEmail.slice(buisnessEmail.indexOf('>') + 1, buisnessEmail.indexOf('<'));
            if(leviDeoIndex == -1 || !buisnessEmail.contains(".") || !buisnessEmail.contains("@"))
                return "Email cannot be extracted";
            return buisnessEmail;
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