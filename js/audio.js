function pistolAudio(){
    var pistolSound = document.createElement("audio");
    pistolSound.src = "audio/Pistol3.mp3";
    pistolSound.addEventListener("ended", function () {
        document.removeChild(this);
    }, false);
    pistolSound.volume = 0.2;
    pistolSound.play();   
}

function shotgunAudio(){
    var shotgunSound = document.createElement("audio");
    shotgunSound.src = "audio/Shotgun1.wav";
    shotgunSound.addEventListener("ended", function () {
        document.removeChild(this);
    }, false);
    shotgunSound.volume = 0.2;
    shotgunSound.play();   
}

function sniperAudio(){
    var sniperSound = document.createElement("audio");
    sniperSound.src = "audio/Sniper2.mp3";
    sniperSound.addEventListener("ended", function () {
        document.removeChild(this);
    }, false);
    sniperSound.volume = 0.2;
    sniperSound.play();   
}

function bazookaAudio(){
    var bazookaSound = document.createElement("audio");
    bazookaSound.src = "audio/bazooka2.mp3";
    bazookaSound.addEventListener("ended", function () {
        document.removeChild(this);
    }, false);
    bazookaSound.volume = 0.1;
    bazookaSound.play();   
}



function menuAudio(){
    var menuSound = document.createElement("audio");
    menuSound.src = "audio/menuclick5.wav";
    menuSound.addEventListener("ended", function () {
        document.removeChild(this);
    }, false);
    menuSound.volume = 0.7;
    menuSound.play();   
}

function weaponSwitchAudio(){
    var weaponswitchSound = document.createElement("audio");
    weaponswitchSound.src = "audio/weaponswitch.mp3";
    weaponswitchSound.addEventListener("ended", function () {
        document.removeChild(this);
    }, false);
    weaponswitchSound.volume = 0.7;
    weaponswitchSound.play();   
}

function hitAudio(){
    var hitSound = document.createElement("audio");
    hitSound.src = "audio/Hit3.wav";
    hitSound.addEventListener("ended", function () {
        document.removeChild(this);
    }, false);
    hitSound.volume = 0.2;
    hitSound.play();   
}

function pickupAudio(){
    var pickupSound = document.createElement("audio");
    pickupSound.src = "audio/pickup2.wav";
    pickupSound.addEventListener("ended", function () {
        document.removeChild(this);
    }, false);
    pickupSound.volume = 0.6;
    pickupSound.play();   
}


function chargeAudio(){
    var chargeSound = document.createElement("audio");
    chargeSound.src = "audio/charge.wav";
    chargeSound.addEventListener("ended", function () {
        document.removeChild(this);
    }, false);
    chargeSound.volume = 0.6;
    chargeSound.play();   
}

function themeAudio(){
    var themeSound = document.createElement("audio");
    themeSound.src = "audio/Crusade.mp3";
    themeSound.addEventListener("ended", function () {
        this.currentTime = 0;
        this.play();
    }, false);
    themeSound.volume = 0.3;
    themeSound.play();   
}



