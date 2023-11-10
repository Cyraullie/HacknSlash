// game.js

import { apiURL, windowHeight, windowWidth } from './data.js';
import { createPlayer, } from './player.js';
import { createMonster } from './monster.js';
import { checkCollisionWithMonsters, startShooting } from './projectile.js';
import { displayGameOver, displayUpgrade, createUpgradeDialog, createGameOverDialog, createEchapDialog, createOptionsDialog, displayEscape, activeButton, createStartDialog, createSuccessDialog, displaySkill, createSkillDialog } from './menu.js';
import { Howl } from 'howler';
import axios from 'axios';

const packageJson = require('../../package.json');

let bossSound
let backgroundSound;

//TODO install phaser ????? (pas vraiment utile pour le moment) (pour utiliser la manette)
//TODO trouver une manière d'utiliser la manette sur le navigateur

//TODO ajouter la gestion d'autre type de son
//TODO ajouter des sons

//TODO difficulty :
//TODO hardcore mode au bout d'un nombre de vague réussi ?
//TODO booster le boss au hormone
//TODO upgrade speed of monster (too much ? a faire tester)

//TODO trouver un thème pour les image tout ça :) (Mythologie nordique)
//TODO player = viking ?
//TODO bosses = les monstres principaux du ragnarok ?
//TODO monstres de base = jothun et autre ?
//TODO ducoup limite du nombre de boss et vague?

//TODO ajout de succés (no move challenge (si tu bouge une fois le défi n'est plus réalisabel))
//TODO succès : [ne pas prendre de dégat, Joueur Novice (atteindre la vague 10), ]
//TODO novice, intermediaire, expert, spécialiste ? (pour chaque succes)
//TODO faire les succès pour chaque difficulté ?

//TODO ajouter du percage (stats de percage de base a 1 avec un pourcentage de change monte a 2) (quand ça touche un monstre enleve 1 de percage au projectile et continue ça route)?

//TODO systeme de monnaie ?
//TODO upgrade de pourcentage de loot de monnaie
//TODO à la place de l'upgrade un magasin après chaque boss ou de manière aleatoire ? ou un magasin qui pop de manière aleatoire ?
//TODO ajout d'item pour améliorer le perso ?

//TODO Systeme de compétence ?
//TODO plusieurs tir en un clique ?


//TODO 1 compétences active sur la touche espace par défault
//TODO la compétence est débloquer au niveau 1

//TODO mettre un nombre de tir possible ? qui recharge après un action ?

//TODO faire en sorte que la carte soit plus grande donc plus de mob ?
//TODO donc c'est pas le joueur qui bouge sur la petite map mais la camera qui suis le perso
//TODO faire la map en cadriller pour voir si le déplacement de la cam fonctionne

//TODO mettre des paterne pour des boss (plusieurs phases ? avec phase d'invinciblité ?)
//TODO mettre des paterne pour des monstres ?

//TODO voir pour pouvoir faire une maj depuis l'app (utiliser le serveur docker pour ça ?)

//TODO voir pour améliorer la cadence de tire :) pour benji
//TODO plutot que regen full -> regen 1pv ?

//TODO mettre une vrai image pour les monstres et le joueur
//TODO bille multi color :)
//TODO pouvoir changer les touches pour la souris 
//TODO Pouvoir changer la touche de tir 

//TODO faire des mobs qui tire des projetiles ?

//BUG le change de touche pour le clique gauche refait proc l'event
//BUG ralentissement vers la vagues 450 environs et toujours plus xD

let nbBoss = 1; //nombre de boss fait
let numMonstersAtStart = 3;
var numVague = 1; //1
var numVagueNoMove = 0;
var numVagueNoHit = 0;

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

let isNotSkilled = true;
let handleClick = false;
var isEnded = false;
var isUpdated = false;
let isPaused = false;
let xMouse;
let yMouse;
let bossTime = false;

export function initializeGameData() {
    
    // Vérifie si c'est la première installation
    if (localStorage.getItem('version') != packageJson.version) {
        // Supprime toutes les données du localStorage
        let theme; 
        let volume;
        if(localStorage.getItem("theme") != null){
            theme = localStorage.getItem("theme")
        }else{
            theme = "light"
        }
        
        if(localStorage.getItem("volume") != null){
            volume = localStorage.getItem("volume")
        }else{
            volume = 0.5;
        }

        localStorage.clear();

        localStorage.setItem("theme", theme);
        localStorage.setItem("volume", volume);

        // Marque que l'installation a eu lieu
        localStorage.setItem('version', packageJson.version);
    }

  
    game.dataset.lifeMod  = 1;
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

    if(localStorage.getItem("keyDash") != null){
        game.dataset.keyDash = localStorage.getItem("keyDash")
    }else{
        game.dataset.keyDash = " "
    }

    if(localStorage.getItem("keySkill") != null){
        game.dataset.keySkill = localStorage.getItem("keySkill")
    }else{
        game.dataset.keySkill = "q"
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

    createSkillDialog();

    createUpgradeDialog();

    createEchapDialog();

    createOptionsDialog();

    createSuccessDialog();

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

    let skillKeyDiv = document.createElement("div");
    skillKeyDiv.id = "skillKeyDiv"
    skillKeyDiv.style.left = 30 + "px"
    skillKeyDiv.style.top = 47 + "px"
    skillKeyDiv.style.padding = "10px"
    skillKeyDiv.style.backgroundColor = "grey"
    skillKeyDiv.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    skillKeyDiv.style.borderRadius = "5px"
    skillKeyDiv.style.textAlign = "center";
    skillKeyDiv.style.width = "30px"
    skillKeyDiv.style.height = "30px"
    skillKeyDiv.style.position = "absolute"
    map.appendChild(skillKeyDiv);

    let skillKeyText = document.createElement("p");
    skillKeyText.id = "skillKeyText";
    skillKeyText.style.fontWeight = "bold"
    skillKeyText.textContent = game.dataset.keySkill.toUpperCase();
    skillKeyDiv.appendChild(skillKeyText);

    if(localStorage.getItem("difficulty") == null){
        localStorage.setItem("difficulty", 0);
    } else {
        let difficultyButton = document.getElementById("difficultyButton")
        switch (parseInt(localStorage.getItem("difficulty"))) {
            case 0:
                difficultyButton.textContent = "Difficulté : facile"
                player.dataset.initialLife = 4;
                player.dataset.life = 4;
                player.dataset.damage  = 3
                damageText.textContent = player.dataset.damage + "x"
                game.dataset.lifeMod  = 1;
                game.dataset.damageMod  = 1;
                checkHP();
                break;
                
            case 1:
                difficultyButton.textContent = "Difficulté : normal"
                player.dataset.initialLife = 3;
                player.dataset.life = 3;
                player.dataset.damage  = 2
                damageText.textContent = player.dataset.damage + "x"
                game.dataset.lifeMod  = 1.5;
                game.dataset.damageMod  = 2;
                checkHP();
                break;
                
            case 2:
                difficultyButton.textContent = "Difficulté : difficile"
                player.dataset.initialLife = 2;
                player.dataset.life = 2;
                player.dataset.damage  = 1
                damageText.textContent = player.dataset.damage + "x"
                game.dataset.lifeMod  = 2;
                game.dataset.damageMod  = 3;
                checkHP();
                break;
        }
    }


    checkTheme()

}

export function initializeGame() {
  
    game.addEventListener("mousedown", handleMouseClickDown);

    game.addEventListener("mouseup", handleMouseClickUp);

    game.addEventListener("mousemove", handleMouseClickMove);

    document.addEventListener("keydown", handleKeyDown);
    
    document.addEventListener("keyup", handleKeyUp);

    /*game.addEventListener('mouseleave', () => {
        if(game.dataset.isGamePaused){
            isPaused = true; // Inversez l'état de la pause
            player.dataset.movingUp = false;
            player.dataset.movingRight = false;
            player.dataset.movingLeft = false;
            player.dataset.movingDown = false;
            displayEscape(isPaused);
        }
      });
*/
      displaySkill();
      
      isUpdated = true;
      //TODO display skill
      //TODO upgrade skill dans display upgrade ? ou a chaque niveau ?

    // Boucle de jeu principale
    requestAnimationFrame(gameLoop);
    
}

function handleMouseClickDown(event){
    //if(event.button == game.dataset.keyFire){
        handleClick = true;
   // }
}

function handleMouseClickUp(){
    handleClick = false;
}

function handleMouseClickMove(event){
    xMouse = event.clientX
    yMouse = event.clientY
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
        case game.dataset.keyDash:
            player.dataset.isDash = true;
            break;
        case game.dataset.keySkill:
            useSkill(player);
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
    let skillKeyDiv = document.getElementById("skillKeyDiv")
    let lvlText = document.getElementById("lvlText");
    let damageText = document.getElementById("damageText");
    let tabContent = Array.from(document.getElementsByClassName("tab-content"))
    let tabControl = Array.from(document.getElementsByClassName("tab-button"))
    let successDivs = Array.from(document.getElementsByClassName("successDiv"))
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
        lvlText.style.color = "white"
        achivement.style.color = "white"
        skillKeyDiv.style.color = "white"
        skillKeyDiv.style.backgroundColor = "#666666"

        Array.from(dialogs).forEach(dialog => {
            dialog.style.backgroundColor = "#666666"
            dialog.style.color = "#ffffff"
        })

        /*successDivs.forEach(successDiv => {
            successDiv.style.backgroundColor = "#666666"
            successDiv.style.color = "#ffffff"
        })*/

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
        lvlText.style.color = "black"
        achivement.style.color = "black"
        skillKeyDiv.style.color = "black"
        skillKeyDiv.style.backgroundColor = "#666666"

        Array.from(dialogs).forEach(dialog => {
            dialog.style.backgroundColor = "#ffffff"
            dialog.style.color = "black"
        })

        /*successDivs.forEach(successDiv => {
            successDiv.style.backgroundColor = "#ffffff"
            successDiv.style.color = "black"
        })*/

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

export function handleMouseClick() {
    if (!player.hasAttribute('data-firing')) {
        player.setAttribute('data-firing', 'true');
        startShooting(xMouse, yMouse, player);
        
        setTimeout(function() {
          player.removeAttribute('data-firing');
        }, parseInt(player.dataset.fireRate));
    }
}

function setSkill (player){
    switch (parseInt(player.dataset.skill)) {
        case 0 :
            console.log("tir multiple")
            break;
        case 1 :
            console.log("danse de l'épée")
            break;
        case 2 :
            console.log("danse du bouclier")
            break;
    }
}

function useSkill (player){
    switch (parseInt(player.dataset.skill)) {
        case 0 :
            let skillKeyText = document.getElementById("skillKeyText")
            if (!player.hasAttribute('data-skilled')) {
                player.setAttribute('data-skilled', 'true');

                // Définir le temps initial à 15 secondes
                let remainingTime = 15;
                // Afficher le compte à rebours initial

                skillKeyText.textContent = remainingTime;
                // Définir l'intervalle pour décrémenter le temps
                const countdownInterval = setInterval(() => {
                    if(!JSON.parse(game.dataset.isGamePaused)) {
                        remainingTime--;
                        skillKeyText.textContent = remainingTime;

                        // Afficher le nouveau temps restant

                        // Vérifier si le temps est écoulé
                        if (remainingTime <= 0) {
                            clearInterval(countdownInterval); // Arrêter l'intervalle
                            skillKeyText.textContent = game.dataset.keySkill;
                            player.removeAttribute('data-skilled');
                        }
                    }
                }, 1000);


                for(let i = 0; i <= parseInt(player.dataset.skillLevel); i++){
                    let yRand = (Math.floor(Math.random() * (100))) + 10;
                    let xRand = (Math.floor(Math.random() * (100))) + 10;

                    setTimeout(() => {
                        startShooting(xMouse + xRand, yMouse + yRand, player)
                    }, i * 100);
                }
                
                
            }
            break;
        case 1 :
            console.log("danse de l'épée")
            break;
        case 2 :
            console.log("danse du bouclier")
            break;
    }
}

export function checkHP() {

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

export function checkLVL() {

    let textePV = document.getElementById('lvlText');

    textePV.textContent = `LVL ${player.dataset.level}`;

    if(!isUpdated){
        displayUpgrade();
        isUpdated = true;
    }

}
//TODO quand on fait le boss et qu'on passe de niveau le jeu refait faire le boss
//TODO garder que le high score ?
//TODO changer le system de niveau xD (jusqu'au niveau 10 50 par 50 et aprsè 100 par 100 ?)
function checkMonsterAlive() {
    let monsters = document.querySelectorAll(".monster")
    
    if(!JSON.parse(game.dataset.isGamePaused)) {
        if (monsters.length === 0) {

            if(numVague % 10 === 0){ 
                spawnBoss();
            }
            
            if((numVague - 1) % 5 === 0 && (numVague - 1) != 0){
                
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
        if(numVague % 10 !== 0){
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
        createMonster(lifeMonster, 2, 1, 5, nbBoss, false);
    }
    
}
//TODO optimisation ?
function checkSuccess() {
    let achivement = document.getElementById("achivement");
    let noMove = Math.floor(numVagueNoMove / 50)
    let noHit = Math.floor(numVagueNoHit / 50) + 4
    
    if(noMove < 5 && noMove != 0){
        let params = new URLSearchParams({ route: "success", player_id: localStorage.getItem("player_id"), success_id: noMove});
        let urlAvecParametres = `${apiURL}?${params}`;
        axios.get(urlAvecParametres)
        .then(response => {
            let successes_id = [];
            let i = 0;

            response.data.forEach((success) => {
                successes_id[i] = success.id;
                i++;
            })

            if(!successes_id.includes(noHit)){
                let params = new URLSearchParams({ route: "achivement", player_id: localStorage.getItem("player_id"), success_id: noMove });
                let urlAvecParametres = `${apiURL}?${params}`;
    
                axios.get(urlAvecParametres)
                .then(response => {
                    achivement.textContent = "Tourelle Diff " + noMove
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
    } else if(noHit < 9 && noHit > 4 && noHit != 0){
        let params = new URLSearchParams({ route: "success", player_id: localStorage.getItem("player_id"), success_id: noMove});
        let urlAvecParametres = `${apiURL}?${params}`;
        axios.get(urlAvecParametres)
        .then(response => {
            let successes_id = [];
            let i = 0;

            response.data.forEach((success) => {
                successes_id[i] = success.id;
                i++;
            })

            if(!successes_id.includes(noHit)){
                let params = new URLSearchParams({ route: "achivement", player_id: localStorage.getItem("player_id"), success_id: noHit });
                let urlAvecParametres = `${apiURL}?${params}`;
    
                axios.get(urlAvecParametres)
                .then(response => {
                    achivement.textContent = "Invincible " + (noHit - 4)
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
    createMonster(numVague, 4, 1, 10, 1, true);  
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
    if(isNotSkilled  && document.getElementById("skill").style.display == "none"){
        setSkill(player);
        isNotSkilled = false;
    }

    if(document.getElementById("upgrade").style.display == "none" && document.getElementById("skill").style.display == "none"){
        isUpdated = false;
    }

    if(isEnded || isPaused || isUpdated){

        game.dataset.isGamePaused = true;
    } else {
        game.dataset.isGamePaused = false;
        let damageText = document.getElementById("damageText")
        damageText.textContent = player.dataset.damage + "x";
    }
    
    // Mettre à jour la logique du jeu (mouvement, collisions, etc.)
    // Gestionnaire d'événement pour déclencher le tir (par exemple, un clic de souris)
    if(handleClick){
        handleMouseClick()
    }
    checkHP();
    checkMonsterAlive();

    //handlePlayerMovement();
   // handleMouseClick();
    checkCollisionWithMonsters(player);

    let monsters = document.querySelectorAll(".monster")
    // Appeler la boucle de jeu à la prochaine frame
    if(!JSON.parse(game.dataset.isGamePaused)) {

        if(document.getElementById("upgrade").style.display == "none"){
            let vagues = document.getElementById("vagues");
            vagues.textContent = "Vagues " + (numVague);              
        }

        if(JSON.parse(player.dataset.movingUp) || JSON.parse(player.dataset.movingRight) || JSON.parse(player.dataset.movingLeft) || JSON.parse(player.dataset.movingDown)){
            numVagueNoMove = 0;
        }

        if(player.dataset.life < player.dataset.initialLife){
            numVagueNoHit = 0;
        }
    }

    if (monsters.length === 0) {
        numVague++;
        numVagueNoMove++;
        numVagueNoHit++;
        checkSuccess()
        let projectiles = document.querySelectorAll(".projectile")

        projectiles.forEach(projectile => {
            projectile.remove();
        })            
    }
    requestAnimationFrame(gameLoop); 
}

