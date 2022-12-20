###	kalendar
http://sharepoint/projekti/24h/_layouts/15/start.aspx#/Lists/NI%202%20HFC/calendar.aspx

document.querySelector('#WebPartWPQ2 > div.ms-acal-rootdiv').childNodes.forEach(function(i){e=i.querySelector("div.ms-acal-ctrlitem > a"); if(e) e.click()});
var sareni = document.querySelectorAll("#WebPartWPQ2 > div.ms-acal-rootdiv div.ms-acal-item[class*=ms-acal-color]")
sareni.forEach((saren) => {
  setTimeout(() => {
    window.open(saren.getElementsByTagName('a')[0].href, '_self');
  }, 30000);
});




####	idi u asw
http://sharepoint/projekti/24h/Lists/HFC%20ZAKAZIVANJE/Item/displayifs.aspx

window.open('https://10.0.5.7:8445/officius-jsf-prod/pages/helpDeskTask_view.jsf?id='+document.querySelector("input[originalid=V1_I1_T2]").value.split('.').join("")+'&serpoint_ajdi='+location.search.split('ID=')[1], '_self');

###	idi u asw
https://10.0.5.7:8445/officius-jsf-prod/pages/helpDeskTask_view.jsf*

switch (document.querySelector("#helpDeskTaskViewForm\\:j_id_51\\:helpDeskTaskStatus").innerText) {
    case 'Prebaceno u biling':
    case 'Instalacija realizovana':
    case 'Evidentirano u biling':
        window.open('http://sharepoint/projekti/24h/Lists/HFC%20ZAKAZIVANJE/Item/editifs.aspx?ID='+location.search.split('serpoint_ajdi=')[1], '_self');
}

###	edit SP


document.querySelector("textarea[originalid=V1_I1_T52]").value='Povezan';
document.querySelector("select[originalid=V1_I1_D44]").innerHTML='<option value="REALIZOVAN">REALIZOVAN</option>';
document.querySelector("select[originalid=V1_I1_D44]").dispatchEvent(new Event('change'));
document.querySelector("#Ribbon\\.Tabs\\.InfoPathListTab\\.Commit\\.Controls\\.btnSubmit-Large > span.ms-cui-ctl-largeIconContainer > span > img").click();
