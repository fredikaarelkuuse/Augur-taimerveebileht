/* 
Loenduri baaskood pärineb W3Schools õpetusest.
Pealkiri: "How to create a Countdown Timer"
Allikas: https://www.w3schools.com/howto/howto_js_countdown.asp
*/
import { getEstonianMovingHolidays } from './liikuvadkuupaevad.js';

async function kaivitaloendur() {

  // Mis aasta praegu on
  
  let see_aasta = new Date().getFullYear();

  let taielik_kuupaev = null;
  let lahim_pyha = null;
  let nimi = null;
  let suur_esitaht = null;
  let toimub_täna = "Täna ei toimu ühtegi püha";

  // Kutsume välja teise funktsiooni koodi selle aasta andmetega
  let liikuvad = getEstonianMovingHolidays(see_aasta);
  
  // Mis kuupäev praegu on
  let praegu = new Date();

  // Loen failist andmed
  let promise = await fetch("pyhad-ISO.md");
  let tekst = await promise.text();

  let read = tekst
    // Teeb teksti ridadeks lahti
    .split("\n")

  // Käib iga rea läbi, kus on uus püha ja kuupäev
  for (let rida of read) {
    // Teeb rea pooleks ja eraldab nime ja kuupäeva
    let [kuupaev, pyha] = rida.split("|")
    // Lisab kuupäevale ka aasta, et see oleks täielik
    taielik_kuupaev = see_aasta + "-" + kuupaev.trim();
    lahim_pyha = new Date(taielik_kuupaev).getTime();
    // Võimaldab selle hiljem välja kutsuda
    console.log(taielik_kuupaev, pyha);
    
    // Kui püha algusest on möödas vähem kui 24h (86400000ms), siis on see täna
    if ((lahim_pyha - praegu) > -86400000 && (lahim_pyha - praegu) <= 0) {
      toimub_täna = pyha
      document.getElementById("toimuvpyha").innerHTML = `Täna on ${toimub_täna}`
    }
    // Kui lähim püha ei ole minevikus, lõhutakse tsükkel
    if (lahim_pyha > praegu) {
      // https://www.freecodecamp.org/news/javascript-capitalize-first-letter-of-word/
      nimi = pyha
      suur_esitaht = nimi.charAt(0).toUpperCase() + nimi.slice(1)
      break
    }
    
  }

  // Vaatame tsüklis kõik liikuvad pühad läbi
  // Kui liikuv püha jääb tänase kuupäeva ja seni läheneva püha vahele, siis lähenev püha vahetub
  for (let pyha of liikuvad) {
    let liikuva_aeg = new Date(`${pyha.date}T00:00:00`).getTime();
    if (liikuva_aeg > praegu.getTime() && liikuva_aeg < lahim_pyha) {
      lahim_pyha = liikuva_aeg;
      suur_esitaht = pyha.name;
    }
  }
  
  document.getElementById("pyhanimi").innerHTML = suur_esitaht
  // Värskendab kella iga natukese aja tagant
  let x = setInterval(function() {
    
    // Värskendab pidevalt aega
    praegu = new Date()
    // Vaatab palju aega selle pühani on
    let vahe = lahim_pyha - praegu;
    // Kui püha on käes jooksutab põhi funktsiooni uuesti
    if (vahe < 0) {
      clearInterval(x);
      kaivitaloendur();
    }
      
    // Arvutused päevad, tundide, minutite ja sekundite jaoks
    let days = Math.floor(vahe / (1000 * 60 * 60 * 24));
    let hours = Math.floor((vahe % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((vahe % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((vahe % (1000 * 60)) / 1000);
      
    // Väljastab elemendid
    document.getElementById("paev").innerHTML = days
    document.getElementById("tund").innerHTML = hours
    document.getElementById("minut").innerHTML = minutes
    document.getElementById("sekund").innerHTML = seconds

  }, 37); //Taimeri väärtust tuleb vb muuta
}
kaivitaloendur();