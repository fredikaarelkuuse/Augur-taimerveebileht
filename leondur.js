/* 
Loenduri baaskood pärineb W3Schools õpetusest.
Pealkiri: "How to create a Countdown Timer"
Allikas: https://www.w3schools.com/howto/howto_js_countdown.asp
*/

async function kaivitaloendur() {

  // Mis aasta praegu on
  let see_aasta = new Date().getFullYear();

  let taielik_kuupaev = null;
  let lahim_pyha = null;
  let nimi = null;
  let suur_esitaht = null;
  
  // Mis kuupäev praegu on
  let praegu = new Date();

  // Loen failist andmed
  let promise = await fetch("pyhad-iso.md");
  let tekst = await promise.text();

  let read = tekst
    // Teeb teksti ridadeks lahti
    .split("\n")

  for (let rida of read) {

    // Teeb rea pooleks ja eraldab nime ja kuupäeva
    let [kuupaev, pyha] = rida.split("|")
    // Lisab kuupäevale ka aasta, et see oleks täielik
    taielik_kuupaev = see_aasta + "-" + kuupaev.trim();
    lahim_pyha = new Date(taielik_kuupaev).getTime();
    console.log(taielik_kuupaev, pyha);
    
    // Kui lähim püha ei ole minevikus, lõhutakse tsükkel
    if (lahim_pyha > praegu) {
      // https://www.freecodecamp.org/news/javascript-capitalize-first-letter-of-word/
      nimi = pyha
      suur_esitaht = nimi.charAt(0).toUpperCase() + nimi.slice(1)
      break
    }
  }
  document.getElementById("pyhanimi").innerHTML = suur_esitaht
  // Update the count down every 1 second
  let x = setInterval(function() {
    
    // Värskendab pidevalt aega
    praegu = new Date()
    // Find the distance between now and the count down date
    let vahe = lahim_pyha - praegu;
    // If the count down is over, write some text 
    if (vahe < 0) {
      clearInterval(x);
      kaivitaloendur();
    }
      
    // Time calculations for days, hours, minutes and seconds
    let days = Math.floor(vahe / (1000 * 60 * 60 * 24));
    let hours = Math.floor((vahe % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((vahe % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((vahe % (1000 * 60)) / 1000);
      
    // Output the result in an element with id="taimer"
    document.getElementById("taimer").innerHTML = days + "p " + hours + "t "
    + minutes + "m " + seconds + "s";
  }, 37); //Taimeri väärtust tuleb muuta
}
kaivitaloendur();