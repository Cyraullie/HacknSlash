// game.js

import { apiURL, windowHeight, windowWidth } from './data.js';
import { createPlayer, } from './player.js';
import { createMonster } from './monster.js';
import { checkCollisionWithMonsters, startShooting } from './projectile.js';
import { displayGameOver, displayUpgrade, createUpgradeDialog, createGameOverDialog, createEchapDialog, createOptionsDialog, displayEscape, activeButton, createStartDialog } from './menu.js';
import { Howl } from 'howler';

import axios from 'axios';
let bossSound
let backgroundSound;

//TODO mettre une vrai image pour les monstres et le joueur
//TODO bille multi color :)
//TODO booster le boss au hormone
//TODO upgrade damage/hp/speed of monster
//TODO add different type of audio so a onglet for that ?
//TODO ajouter la gestion d'autre type de son
//TODO ajouter des sons
//TODO add difficulty
//TODO install phaser ?????

//TODO ajout de succés (no move challenge (si tu bouge une fois le défi n'est plus réalisabel))
//TODO ajouter un bouton pour voir ses succès qui seront stocké dans la base de donnée
//TODO creer des succés (db ?)

//TODO bug d'attack speed
//TODO mettre des paterne pour des boss ()
//TODO pouvoir se déconnecter 

//BUG ralentissement vers la vagues 450 environs et toujours plus xD

let nbBoss = 1; //nombre de boss fait
let numMonstersAtStart = 3;
var numVague = 1;
var numVagueNoMove = 0;
let player;
var map = document.getElementById("map");
var game = document.getElementById("game");

let monsterLifeMax = 6;

map.style.width = windowWidth + "px";
map.style.height = windowHeight + "px";

game.style.minHeight = windowHeight + "px";
game.style.minWidth = windowWidth + "px";
game.style.maxHeight = windowHeight + "px";
game.style.maxWidth = windowWidth + "px";

let handleClick = false;
var isEnded = false;
var isUpdated = false;
let isPaused = false;

let bossTime = false;

export function initializeGameData() {    
    game.dataset.isGamePaused = false; 
    game.dataset.isUpdated = false;
    if(localStorage.getItem("theme") != null){
        game.dataset.theme = localStorage.getItem("theme")
    }else{
        game.dataset.theme = "light"
    }
    
    if(localStorage.getItem("volume") != null){
        game.dataset.volume = localStorage.getItem("volume")
    }else{
        game.dataset.volume = 0.5;
    }
  
    if(localStorage.getItem("keyUp") != null){
        game.dataset.keyUp = localStorage.getItem("keyUp")
    }else{
        game.dataset.keyUp = "w"
    }

    if(localStorage.getItem("keyDown") != null){
        game.dataset.keyDown = localStorage.getItem("keyDown")
    }else{
        game.dataset.keyDown = "s"
    }

    if(localStorage.getItem("keyRight") != null){
        game.dataset.keyRight = localStorage.getItem("keyRight")
    }else{
        game.dataset.keyRight = "d"
    }

    if(localStorage.getItem("keyLeft") != null){
        game.dataset.keyLeft = localStorage.getItem("keyLeft")
    }else{
        game.dataset.keyLeft = "a"
    }

    // Initialisation du jeu
    bossSound = new Howl({
        src: ['assets/sounds/boss.mp3'],
        preload: true,
        volume: game.dataset.volume,
        loop: true,
    });

    backgroundSound = new Howl({
        src: ['assets/sounds/background.mp3'],
        preload: true,
        volume: game.dataset.volume,
        loop: true,
        autoplay: true
    });

    createStartDialog();

    createGameOverDialog();

    createUpgradeDialog();

    createEchapDialog();

    createOptionsDialog();

    activeButton();

    const vagues = document.createElement("div");
    vagues.id = "vagues"
    map.appendChild(vagues);

    const audioButton = document.getElementById("audioButton")

    audioButton.addEventListener("input", () => {
        let audioPercentGeneral = document.getElementById("audioPercentGeneral")
        bossSound.volume(audioButton.value / 100);
        backgroundSound.volume(audioButton.value / 100);
        game.dataset.volume = audioButton.value / 100;
        localStorage.setItem("volume", audioButton.value / 100)
        audioPercentGeneral.textContent = audioButton.value + "%"
    })

    player = createPlayer();

    let damageDiv = document.createElement("div");
    damageDiv.id = "damage"
    damageDiv.style.left = windowWidth - 47 + "px"
    map.appendChild(damageDiv);

    let damageText = document.createElement("p")
    damageText.id = "damageText"
    damageText.textContent = player.dataset.damage + "x";
    damageText.style.marginRight = "5px"
    damageDiv.appendChild(damageText);

    let imageDamage = document.createElement("img");
    imageDamage.src = "./assets/images/sword.png";
    imageDamage.className = "heart";
    imageDamage.id = "sword";
    damageDiv.appendChild(imageDamage);

    checkTheme()


}

export function initializeGame() {


    game.addEventListener("mousedown", handleMouseClickDown);

    game.addEventListener("mouseup", handleMouseClickUp);

    game.addEventListener("mousemove", handleMouseClickMove);

    document.addEventListener("keydown", handleKeyDown);
    
    document.addEventListener("keyup", handleKeyUp);

    game.addEventListener('mouseleave', () => {
        if(game.dataset.isGamePaused){
            isPaused = true; // Inversez l'état de la pause
            player.dataset.movingUp = false;
            player.dataset.movingRight = false;
            player.dataset.movingLeft = false;
            player.dataset.movingDown = false;
            displayEscape(isPaused);
        }
      });

    // Boucle de jeu principale
    requestAnimationFrame(gameLoop);
}

function handleMouseClickDown(event){
    handleClick = true;
    if(handleClick){
        handleMouseClick(event)
    }
}

function handleMouseClickUp(){
    handleClick = false;
}

function handleMouseClickMove(event){
    if(handleClick){
        handleMouseClick(event)
    }
}

function handleKeyDown(event) {
    switch (event.key.toLowerCase()) {
        case game.dataset.keyUp:
            player.dataset.movingUp = true;
            break;
        case game.dataset.keyLeft:
            player.dataset.movingLeft = true;
            break;
        case game.dataset.keyDown:
            player.dataset.movingDown = true;
            break;
        case game.dataset.keyRight:
            player.dataset.movingRight = true;
            break;
        case "escape":
            togglePauseGame();
            break;
    }
}

function handleKeyUp(event) {
    switch (event.key.toLowerCase()) {
        case game.dataset.keyUp:
            player.dataset.movingUp = false;
            break;
        case game.dataset.keyLeft:
            player.dataset.movingLeft = false;
            break;
        case game.dataset.keyDown:
            player.dataset.movingDown = false;
            break;
        case game.dataset.keyRight:
            player.dataset.movingRight = false;
            break;
    }
}

export function checkTheme() {
    let map = document.getElementById("map")
    let vagues = document.getElementById("vagues")
    let buttons = document.querySelectorAll('button'); 
    let dialogs = document.getElementsByClassName("dialog")
    let resumeText = document.getElementById("resumeText");
    let pvText = document.getElementById("pvText");
    let damageText = document.getElementById("damageText");
    let tabContent = Array.from(document.getElementsByClassName("tab-content"))
    let tabControl = Array.from(document.getElementsByClassName("tab-button"))
    let achivement = document.getElementById("achivement");

    if(localStorage.getItem("theme") != null){
        game.dataset.theme = localStorage.getItem("theme")
    }else{
        game.dataset.theme = "light"
    }

    if(game.dataset.theme == "dark"){
        map.style.backgroundColor = "black"
        vagues.style.color = "white"
        resumeText.style.color = "white"
        damageText.style.color = "white"
        pvText.style.color = "white"
        achivement.style.color = "white"

        Array.from(dialogs).forEach(dialog => {
            dialog.style.backgroundColor = "#666666"
            dialog.style.color = "#ffffff"
        })

        buttons.forEach(button => {
            button.style.backgroundColor = "#444444"
            button.style.color = "#ffffff"
        })


        tabControl.forEach(tabs => {

            if(tabs.classList.contains("active")){
                tabs.classList.add("dark_active")
                tabs.classList.remove("active")
            }
            tabs.style.backgroundColor = "#333"
        })

        tabContent.forEach(tabs => {
            tabs.style.backgroundColor = "#333333"
        })

    } else if(game.dataset.theme == "light") {
        map.style.backgroundColor = "white"
        vagues.style.color = "black"
        resumeText.style.color = "black"
        damageText.style.color = "black"
        pvText.style.color = "black"
        achivement.style.color = "black"

        Array.from(dialogs).forEach(dialog => {
            dialog.style.backgroundColor = "#ffffff"
            dialog.style.color = "black"
        })

        buttons.forEach(button => {
            button.style.backgroundColor = "white"
            button.style.color = "black"
        })

        tabControl.forEach(tabs => {
            if(tabs.classList.contains("dark_active")){
                tabs.classList.remove("dark_active")
                tabs.classList.add("active")
            }
            tabs.style.backgroundColor = "" 
        })

        tabContent.forEach(tabs => {
            if(tabs.classList.contains("dark_active")){
                tabs.classList.remove("dark_active")
                tabs.classList.add("active")
            }
            tabs.style.backgroundColor = "" 
        })
    }
    
    themeButton.textContent = "Thème : " + game.dataset.theme;
    document.getElementById("imagePlayer").src = "./assets/images/player_" + game.dataset.theme + ".png";
}

export function togglePauseGame() {
    isPaused = !isPaused; // Inversez l'état de la pause
    player.dataset.movingUp = false;
    player.dataset.movingRight = false;
    player.dataset.movingLeft = false;
    player.dataset.movingDown = false;
    displayEscape(isPaused);
}

function handleMouseClick(event) {

    if (!player.hasAttribute('data-firing')) {
        startShooting(event.clientX, event.clientY, player);
        player.setAttribute('data-firing', 'true');
        
        setTimeout(function() {
          player.removeAttribute('data-firing');
        }, parseInt(player.dataset.fireRate));
    }
}

function checkHP() {

    let barrePVRemplis = document.getElementById('pvFull');
    let textePV = document.getElementById('pvText');
    

    let pourcentagePV = (player.dataset.life / player.dataset.initialLife) * 100;
    barrePVRemplis.style.width = pourcentagePV + '%';
    textePV.textContent = `${player.dataset.life} / ${player.dataset.initialLife} PV`;
        

    /*for(let i = 0; i < player.dataset.initialLife; i++){
        let heart = document.getElementById("heart" + i);
        if(i + 1 <= player.dataset.life){
            heart.src = "./assets/images/full_heart.png";
        } else {
            heart.src = "./assets/images/empty_heart.png";
        }
    }
*/
    if(player.dataset.life <= 0){
        isEnded = true;
        endGame()
    }
}

function checkMonsterAlive() {
    let monsters = document.querySelectorAll(".monster")
    
    if(!JSON.parse(game.dataset.isGamePaused)) {
        if (monsters.length === 0) {

            if(numVague % 10 === 0){ 
                if(!isUpdated){
                    spawnBoss();
                }
            }
            
            if((numVague - 1) % 5 === 0 && (numVague - 1) != 0){
                if(!isUpdated){
                    displayUpgrade();
                    isUpdated = true;
                }
                if(bossTime){
                    bossSound.fade(parseFloat(game.dataset.volume), 0, 2000);
                    setTimeout(function () {
                        bossSound.stop()
                        backgroundSound.play();
                    }, 2000);
                    bossTime = false;
                }
            }
        }
    }
    if (monsters.length === 0 && !isEnded) {
        if(document.getElementById("upgrade").style.display == "none" && numVague % 10 !== 0){
            isUpdated = false;  
            spawnMonsters();         
        }
    }
}

function spawnMonsters() {
    numMonstersAtStart++;
    if(numVague % 2 === 0){
        monsterLifeMax++;
    }

    for(let i = 0; i < numMonstersAtStart; i++){
        let lifeMonster = (Math.floor(Math.random() * (monsterLifeMax)));
        createMonster(lifeMonster, 2, 1, nbBoss);
    }
    
}

function checkSuccess() {
    let achivement = document.getElementById("achivement");
    let noMove = numVagueNoMove / 50
    
    if(noMove < 5){
        let params = new URLSearchParams({ route: "success", player_id: localStorage.getItem("player_id")});
        let urlAvecParametres = `${apiURL}?${params}`;
        axios.get(urlAvecParametres)
        .then(response => {
            console.log(response.data)
    
            if(response.data == ""){
                let params = new URLSearchParams({ route: "achivement", player_id: localStorage.getItem("player_id"), success_id: noMove });
                let urlAvecParametres = `${apiURL}?${params}`;
    
                axios.get(urlAvecParametres)
                .then(response => {
                    achivement.textContent = "Tourelle Diff 1"
                    achivement.style.display = "block"
                    achivement.classList.add("achivement-animation");
    
    
                    setTimeout(() => {
                        achivement.style.display = "none"
                    }, 5000);
                    console.log(response.data)
                })
                .catch(error => {
                    console.log("ertet")
                });
            }
        })
        .catch(error => {
            console.error('Erreur :', error);
        });
    }
    
            
    
}

function spawnBoss() {
    
    backgroundSound.stop();

    bossSound.volume(localStorage.getItem("volume"));
    bossSound.play();
    bossTime = true;
    monsterLifeMax = 6;
    numMonstersAtStart = 5;
    nbBoss++;
    createMonster(numVague, 4, 1);  
}

function endGame() {
    // Supprimez les gestionnaires d'événements lorsque le jeu est terminé
    game.removeEventListener("mousedown", handleMouseClick);
    document.removeEventListener("keydown", handleKeyDown);
    //document.removeEventListener("keyup", handleKeyUp);

    const monsters = document.querySelectorAll(".monster");

    monsters.forEach((monster) => {
        monster.remove();
    });
    sessionStorage.setItem("vagues", numVague - 1)
    displayGameOver("votre score est de ", " vague(s)");
}

function gameLoop() {

    if(isEnded || isPaused || isUpdated){

        game.dataset.isGamePaused = true;
    } else {
        game.dataset.isGamePaused = false;
        let damageText = document.getElementById("damageText")
        damageText.textContent = player.dataset.damage + "x";
    }
    
    // Mettre à jour la logique du jeu (mouvement, collisions, etc.)
    // Gestionnaire d'événement pour déclencher le tir (par exemple, un clic de souris)
   
    checkHP();
    checkMonsterAlive();

    //handlePlayerMovement();
   // handleMouseClick();
    checkCollisionWithMonsters();

    // Appeler la boucle de jeu à la prochaine frame
    if(!JSON.parse(game.dataset.isGamePaused)) {
        let monsters = document.querySelectorAll(".monster")

        if(document.getElementById("upgrade").style.display == "none"){
            let vagues = document.getElementById("vagues");
            vagues.textContent = "Vagues " + (numVague);              
        }

        if(JSON.parse(player.dataset.movingUp) || JSON.parse(player.dataset.movingRight) || JSON.parse(player.dataset.movingLeft) || JSON.parse(player.dataset.movingDown)){
            numVagueNoMove = 0;
        }
        
        if (monsters.length === 0 && !isUpdated) {
            numVague++;
            numVagueNoMove++;
            checkSuccess()
            console.log("nombre de vague sans bouger : " + numVagueNoMove)
            let projectiles = document.querySelectorAll(".projectile")

            projectiles.forEach(projectile => {
                projectile.remove();
            })            
        }
    }
    requestAnimationFrame(gameLoop); 
}

