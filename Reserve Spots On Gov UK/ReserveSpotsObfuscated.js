// ==UserScript==
// @name         Reserve Free Spots
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Reserve the spots on the UK gov website when found
// @author       You
// @match        https://driver-services.dvsa.gov.uk/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// ==/UserScript==
 
(async function() {
    'use strict';
  
    // change this
    const timeForReservingInSeconds = 1; // <-----
    // ^^^^^^^^^^^^^^^^^^^^^^^^
  
    function _0xcb68(_0x29dd94,_0x36c274){const _0x3b3bed=_0x3b3b();return _0xcb68=function(_0xcb68b7,_0x3616f7){_0xcb68b7=_0xcb68b7-0x70;let _0x16d90d=_0x3b3bed[_0xcb68b7];return _0x16d90d;},_0xcb68(_0x29dd94,_0x36c274);}const _0x52cf89=_0xcb68;(function(_0x2a03ec,_0x160ef){const _0x574166=_0xcb68,_0x2178ee=_0x2a03ec();while(!![]){try{const _0x4b2c60=-parseInt(_0x574166(0x8e))/0x1*(parseInt(_0x574166(0x71))/0x2)+-parseInt(_0x574166(0x7b))/0x3+parseInt(_0x574166(0x85))/0x4+-parseInt(_0x574166(0x73))/0x5*(-parseInt(_0x574166(0x79))/0x6)+parseInt(_0x574166(0x86))/0x7+parseInt(_0x574166(0x80))/0x8+parseInt(_0x574166(0x8b))/0x9*(parseInt(_0x574166(0x83))/0xa);if(_0x4b2c60===_0x160ef)break;else _0x2178ee['push'](_0x2178ee['shift']());}catch(_0x2ab6f1){_0x2178ee['push'](_0x2178ee['shift']());}}}(_0x3b3b,0x86b0c));if(localStorage[_0x52cf89(0x87)](_0x52cf89(0x75))!=='allowed'){console[_0x52cf89(0x78)](_0x52cf89(0x77));return;}function _0x3b3b(){const _0x16c3a4=['a.laquo.largetext.bold','backButtonCloseDialog','querySelector','browseslots','6497120XDFWHy','granted','a[id^=\x22reserve_\x22]','40XaEEWy','The\x20button\x20is\x20clicked!','1042524LtaKMM','3952417gJRTej','getItem','Notification','reserving...','requestPermission','144225BeOCFZ','getElementById','Button\x20and\x20return\x20link\x20not\x20found.','17YJLxkM','Button\x20clicked!','Button\x20Clicked!','7958HSGVuc','querySelectorAll','5875eExBVf','length','auth','permission','Not\x20validated.\x20Contact\x20the\x20owner\x20of\x20the\x20script...','log','66vhNUGs','click','3285276ZoCdtm'];_0x3b3b=function(){return _0x16c3a4;};return _0x3b3b();}const timeForReservingInMiliSeconds=timeForReservingInSeconds*0x3e8,table=document[_0x52cf89(0x8c)](_0x52cf89(0x7f));if(!table){const delay=_0x528b78=>new Promise(_0xb3fa0d=>setTimeout(_0xb3fa0d,_0x528b78));await delay(timeForReservingInMiliSeconds/0xa*0x8);_0x52cf89(0x88)in window&&(Notification['permission']!==_0x52cf89(0x81)&&Notification[_0x52cf89(0x8a)]());function showNotification(){const _0x58df46=_0x52cf89;if(_0x58df46(0x88)in window&&Notification[_0x58df46(0x76)]===_0x58df46(0x81)){const _0x18df71=new Notification(_0x58df46(0x70),{'body':'Places\x20reserved!'});}}function CloseWarningPopup(){const _0x1659c8=_0x52cf89,_0x3e913b=document['getElementById'](_0x1659c8(0x7d));_0x3e913b&&(_0x3e913b[_0x1659c8(0x7a)](),console[_0x1659c8(0x78)](_0x1659c8(0x8f)));}await delay(timeForReservingInMiliSeconds/0xa),CloseWarningPopup(),await delay(timeForReservingInMiliSeconds/0xa),console[_0x52cf89(0x78)](_0x52cf89(0x89));const reserveButtons=document[_0x52cf89(0x72)](_0x52cf89(0x82));if(reserveButtons&&reserveButtons[_0x52cf89(0x74)]!=0x0)reserveButtons[0x0]['click'](),reserveButtons[_0x52cf89(0x74)]===0x1&&showNotification(_0x52cf89(0x84));else{const returnToSearchResultsLink=document[_0x52cf89(0x7e)](_0x52cf89(0x7c));returnToSearchResultsLink?returnToSearchResultsLink[_0x52cf89(0x7a)]():console['log'](_0x52cf89(0x8d));}}

  })();