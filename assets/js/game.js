// game.js

import { windowHeight, windowWidth } from './data.js';
import { createPlayer, } from './player.js';
import { createMonster } from './monster.js';
import { checkCollisionWithMonsters, startShooting } from './projectile.js';
import { displayGameOver, displayUpgrade, createUpgradeDialog, createGameOverDialog, createEchapDialog, createOptionsDialog, displayEscape, activeButton } from './menu.js';
import { Howl } from 'howler';

let bossSound
let backgroundSound;


//TODO faire une connection pour garder un pseudo et des touches enregistrer ?
//TODO bille multi color :)
//TODO ajout d'un boss tout les 10 vagues ?
//TODO upgrade damage/hp/speed of monster
//TODO add different type of audio so a onglet for that ?
//TODO add difficulty
//TODO finish dark theme
//TODO install phaser ?
//TODO Utiliser mysql pour le score (plus simple ?)
//TODO ajouter le changement de touche dans le menu

let nbBoss = 1; //nombre de boss fait
let numMonstersAtStart = 3;
var numVague = 1;
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

var isEnded = 0;
let isUpdated = false;
let bossTime = false;

let keysPressed = {};

let movingUp = false;
let movingLeft = false;
let movingDown = false;
let movingRight = false;


export function initializeGame() {
    // Initialisation du jeu
    game.dataset.theme = "light"
    game.dataset.volume = 0.5;
    game.dataset.keyUp = "w";
    game.dataset.keyDown = "s";
    game.dataset.keyRight = "d";
    game.dataset.keyLeft = "a";
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

    player = createPlayer();


    createGameOverDialog();

    createUpgradeDialog();

    createEchapDialog();

    createOptionsDialog();

    activeButton();
    const audioButton = document.getElementById("audioButton")

    audioButton.addEventListener("input", () => {
        bossSound.volume(audioButton.value / 100);
        backgroundSound.volume(audioButton.value / 100);
        game.dataset.volume = audioButton.value / 100;
    })

    document.addEventListener("keydown", handleKeyDown);
    
    document.addEventListener("keyup", handleKeyUp);

    game.addEventListener("mousedown", handleMouseClick);

    // Boucle de jeu principale
    requestAnimationFrame(gameLoop);
}

function handleKeyDown(event) {
    
    //keysPressed[event.key.toLowerCase()] = true;
    switch (event.key.toLowerCase()) {
        case game.dataset.keyUp:
            movingUp = true;
            break;
        case game.dataset.keyLeft:
            movingLeft = true;
            break;
        case game.dataset.keyDown:
            movingDown = true;
            break;
        case game.dataset.keyRight:
            movingRight = true;
            break;
        case "escape":
            togglePauseGame();
            break;
    }
}

function handleKeyUp(event) {
    //keysPressed[event.key.toLowerCase()] = false;
    
    switch (event.key.toLowerCase()) {
        case game.dataset.keyUp:
            movingUp = false;
            break;
        case game.dataset.keyLeft:
            movingLeft = false;
            break;
        case game.dataset.keyDown:
            movingDown = false;
            break;
        case game.dataset.keyRight:
            movingRight = false;
            break;
    }
}

function togglePauseGame() {
    player.dataset.isGamePaused = !JSON.parse(player.dataset.isGamePaused); // Inversez l'état de la pause
    displayEscape(JSON.parse(player.dataset.isGamePaused));
}

function handleMouseClick(event) {
    startShooting(event.clientX, event.clientY, player);
}

function handlePlayerMovement() {
    if(!JSON.parse(player.dataset.isGamePaused)) {
        if(isEnded == 0){
            const playerRect = player.getBoundingClientRect();

            let playerHeight = playerRect.height;
            let playerWidth = playerRect.width;

            var targetX = playerRect.left; // Position cible en X
            var targetY = playerRect.top; // Position cible en Y
//TODO tout les touches
           // let dirX = (keysPressed["a"]) - (keysPressed["d"])
            //let dirY = (keysPressed["w"]) - (keysPressed["s"])



//TODO limite fuck dup (remettre tout les if répare le tout ?)
            //TODO nerf diago pythagore :) diago plus rapide que ligne droite
            /*if(targetY > 30 && targetY < windowHeight - playerHeight-10) {
                 //targetY -= dirY * parseInt(player.dataset.speedY); 
                 targetY -= dirY * parseInt(player.dataset.speedY);
                }

            if(targetX > 10 && targetX < windowWidth - playerWidth-10) { 
                //targetX -= parseInt(player.dataset.speedX); 
                targetX -= dirX * parseInt(player.dataset.speedX)
            }
*/



            if(movingUp && targetY > 30) { targetY -= parseInt(player.dataset.speedY); }
            if(movingDown && targetY < windowHeight - playerHeight-10) { targetY += parseInt(player.dataset.speedY);  }
            if(movingLeft && targetX > 10) { targetX -= parseInt(player.dataset.speedX);  }
            if(movingRight && targetX < windowWidth - playerWidth-10) { targetX += parseInt(player.dataset.speedX); }

            player.style.top = targetY + "px";
            player.style.left = targetX + "px";
        }
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
        isEnded++;
        endGame()
    }
}

function checkMonsterAlive() {
    let monsters = document.querySelectorAll(".monster")
    if(isEnded == 0){
        if (monsters.length === 0) {
            if(document.getElementById("upgrade").style.display == "none"){
                let vagues = document.getElementById("vagues");
                vagues.textContent = "Vagues " + (numVague);              
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
                    displayUpgrade(numVague);
                    isUpdated = true;
                }
                if(bossTime){
                    bossSound.fade(game.dataset.volume, 0, 2000);
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

            if(!isUpdated){
                numVague++;
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
    document.removeEventListener("keyup", handleKeyUp);

    const monsters = document.querySelectorAll(".monster");

    monsters.forEach((monster) => {
        monster.remove();
    });

    displayGameOver("votre score est de ", " vague(s)", numVague);
}

function gameLoop() {
    game.addEventListener('mouseleave', () => {
        player.dataset.isGamePaused = true; // Inversez l'état de la pause
        displayEscape(JSON.parse(player.dataset.isGamePaused));
      });
      
    if(!JSON.parse(player.dataset.isGamePaused)) {
        if(isEnded == 0){
            // Mettre à jour la logique du jeu (mouvement, collisions, etc.)
            // Gestionnaire d'événement pour déclencher le tir (par exemple, un clic de souris)
        
            checkHP();
            checkMonsterAlive()
        
            handlePlayerMovement();
            checkCollisionWithMonsters();
        
            // Appeler la boucle de jeu à la prochaine frame
        }
    }

    
    
    requestAnimationFrame(gameLoop);
    
}

