// game.js

import { windowHeight, windowWidth } from './data.js';
import { createPlayer, } from './player.js';
import { createMonster } from './monster.js';
import { checkCollisionWithMonsters, startShooting } from './projectile.js';
import { displayGameOver, displayUpgrade, createUpgradeDialog, createGameOverDialog, createEchapDialog, createOptionsDialog, displayEscape, activeButton, createStartDialog } from './menu.js';
import { Howl } from 'howler';

let bossSound
let backgroundSound;

//TODO bille multi color :)
//TODO booster le boss au hormone
//TODO upgrade damage/hp/speed of monster
//TODO add different type of audio so a onglet for that ?
//TODO ajouter la gestion d'autre type de son
//TODO ajouter des sons
//TODO add difficulty
//TODO install phaser ?????
//TODO Faire en sorte de pouvoir changer de touche a l'infini
//TODO ajout de succés (no move challenge (si tu bouge une fois le défi n'est plus réalisabel))
//TODO ajouter un bouton pour voir ses succès qui seront stocké dans la base de donnée
//TODO creer des succés (db ?)
//TODO empecher de rentrer des scores a la mains tel que les deux glands
//TODO inscriptions complète ? login + password ?

let nbBoss = 1; //nombre de boss fait
let numMonstersAtStart = 3;
var numVague = 0;
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
let isUpdated = false;
let isPaused = false;

let bossTime = false;

export function initializeGameData() {    
    game.dataset.isGamePaused = false;
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
    damageDiv.style.left = windowWidth - 42 + "px"
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
            displayEscape(isPaused);
        }
      });

    // Boucle de jeu principale
    requestAnimationFrame(gameLoop);
}

function handleMouseClickDown(){
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
    let damageText = document.getElementById("damageText");
    let tabContent = Array.from(document.getElementsByClassName("tab-content"))
    let tabControl = Array.from(document.getElementsByClassName("tab-button"))

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
    for(let i = 0; i < player.dataset.initialLife; i++){
        let heart = document.getElementById("heart" + i);
        if(i + 1 <= player.dataset.life){
            heart.src = "./assets/images/full_heart.png";
        } else {
            heart.src = "./assets/images/empty_heart.png";
        }
    }

    if(player.dataset.life <= 0){
        isEnded = true;
        endGame()
    }
}

function checkMonsterAlive() {
    let monsters = document.querySelectorAll(".monster")
    
    if(!JSON.parse(game.dataset.isGamePaused)) {
        if (monsters.length === 0) {
            if(document.getElementById("upgrade").style.display == "none"){
                let vagues = document.getElementById("vagues");
                vagues.textContent = "Vagues " + (numVague+1);              
            }

            if(!isUpdated){
                numVague++;
            }

            if(numVague % 10 === 0){ 
                if(!isUpdated){
                    backgroundSound.stop();
                    
                    bossSound.play();
                    spawnBoss();
                }
            }

            if((numVague - 1) % 5 === 0 && (numVague - 1) != 0){
                if(!isUpdated){
                    displayUpgrade();
                    isUpdated = true;
                }
                if(bossTime){
                    bossSound.fade(parseInt(game.dataset.volume), 0, 2000);
                    setTimeout(function () {
                        bossSound.stop()
                        backgroundSound.play();
                    }, 2000);
                    bossTime = false;
                }
            }
            
            if(document.getElementById("upgrade").style.display == "none" && numVague % 10 !== 0){
                isUpdated = false;
                spawnMonsters();                
            }

            
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

function spawnBoss() {
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
    sessionStorage.setItem("vagues", numVague-1)
    displayGameOver("votre score est de ", " vague(s)");
}

function gameLoop() {
    if(document.getElementById("upgrade").style.display == "none" && numVague % 10 !== 0){
        isUpdated = false;
        game.dataset.isGamePaused = false;
    }

    if(isEnded || isPaused || isUpdated){
        game.dataset.isGamePaused = true;
    } else {
        game.dataset.isGamePaused = false;
        let damageText = document.getElementById("damageText")
        damageText.textContent = player.dataset.damage + "x";
    }

    //console.log(game.dataset.isGamePaused)
    
    // Mettre à jour la logique du jeu (mouvement, collisions, etc.)
    // Gestionnaire d'événement pour déclencher le tir (par exemple, un clic de souris)
   
    checkHP();
    checkMonsterAlive();

    //handlePlayerMovement();
   // handleMouseClick();
    checkCollisionWithMonsters();

    // Appeler la boucle de jeu à la prochaine frame
    
    

    requestAnimationFrame(gameLoop); 
}

