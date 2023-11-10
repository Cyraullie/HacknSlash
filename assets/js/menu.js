import { apiURL, windowHeight } from './data.js';
import axios from 'axios';
import { checkHP, checkTheme, initializeGame, togglePauseGame } from './game.js';

var customDialog;
const game = document.getElementById("game");

export function displayGameOver(text1, text2) {
    let dialog = document.getElementById("gameOver");
    let scoreText = document.getElementById("score");
    
    scoreText.textContent = text1 + sessionStorage.getItem("vagues") + text2;

    dialog.style.display = "block";
}
//TODO bouton signaler un bug
//TODO ajout de l'amélioration de skill
export function displayUpgrade() {
    let dialog = document.getElementById("upgrade");
    let fireRateButton = document.getElementById("fireRateButton")
    let regenButton = document.getElementById("regenButton")
    let damageButton = document.getElementById("damageButton")
    let lifeButton = document.getElementById("lifeButton")
    let moveSpeedButton = document.getElementById("moveSpeedButton")
    let upgradesToDisplay = 3; // Nombre d'améliorations à afficher
    let upgradesShown = 0; // Nombre d'améliorations actuellement affichées
    let buttonsToDisplay = [];
    let buttonsToDisplayToHidden = [lifeButton, damageButton, regenButton, fireRateButton, moveSpeedButton];

    for(let i = 0; i < buttonsToDisplayToHidden.length; i++){
        buttonsToDisplayToHidden[i].hidden = true;
    }

    if (parseInt(player.dataset.fireRate) > 100) {
        buttonsToDisplay = [lifeButton, damageButton, regenButton, fireRateButton, moveSpeedButton];
    } else {
        buttonsToDisplay = [lifeButton, damageButton, regenButton, moveSpeedButton];
    }

    while (upgradesShown < upgradesToDisplay) {
        let randomUpgrade = Math.floor(Math.random() * buttonsToDisplay.length);
        
        if (buttonsToDisplay[randomUpgrade].hidden) {
            // Cette amélioration n'est pas déjà affichée, on l'affiche
            buttonsToDisplay[randomUpgrade].hidden = false;
            if(!buttonsToDisplay[randomUpgrade].hidden){
                upgradesShown++;
            }
        }
    }

    dialog.style.display = "block";
}


export function displaySkill() {
    let dialog = document.getElementById("skill");

    let multipleFireButton = document.getElementById("multipleFireButton")
    let shieldDanceButton = document.getElementById("shieldDanceButton")
    let swordDanceButton = document.getElementById("swordDanceButton")
//TODO trouver 3-4 autre compétence
//TODO Un truc qui te tourne autour et qui inflige des degats
//TODO skill qui tire tout au tour du joueur
//TODO Un truc qui te tourne autour et protege ?
//TODO Un boost de vitesse qui te permet de traverser les ennemies pdt 2 3 secondes ?

//TODO trouver des images pour chaque compétences
    
    
    let damageButton = document.getElementById("damageButton")
    let moveSpeedButton = document.getElementById("moveSpeedButton")

    let buttonsToDisplay = [multipleFireButton, swordDanceButton, shieldDanceButton];

    for(let i = 0; i < buttonsToDisplay.length; i++){
        buttonsToDisplay[i].hidden = false;
    }

    dialog.style.display = "block";
}

export function displayEscape(isGamePaused) {
    let dialog = document.getElementById("escape");
    let resumeDiv = document.getElementById("resumeDiv");
    let customDialog = document.getElementById("options");

    if (isGamePaused) {
        dialog.style.display = "block";
        resumeDiv.style.display = "block";
    } else {
        let upButton = document.getElementById("upButton");
        let downButton = document.getElementById("downButton");
        let leftButton = document.getElementById("leftButton");
        let rightButton = document.getElementById("rightButton");
    
        dialog.style.display = "none";
        resumeDiv.style.display = "none";
        customDialog.style.display = "none";
        upButton.disabled = false;
        downButton.disabled = false;
        leftButton.disabled = false;
        rightButton.disabled = false;
    }
}

export function createGameOverDialog (){
    customDialog = document.getElementById("gameOver");
    let div1 = document.createElement("div")
    let titleElement = document.createElement("h1");
    let textElement = document.createElement("p");
    textElement.id = "score"
    titleElement.textContent = "Game Over";

    customDialog.appendChild(div1)

    div1.appendChild(titleElement)
    div1.appendChild(textElement)

    let div2 = document.createElement("div")
    div2.id = "divScoreboard"

    customDialog.appendChild(div2)
 
    let params = new URLSearchParams({ route: "scoreboard" });
    let urlAvecParametres = `${apiURL}?${params}`;

    axios.get(urlAvecParametres)
    .then(response => {
        if(Array.isArray(response.data)){
            if(response.data != ""){

                let scoreboard = document.createElement("div")
                scoreboard.classList.add("scoreboard")
                scoreboard.style.marginTop = "10px"
                scoreboard.style.marginBottom = "10px"
                div2.appendChild(scoreboard)

                let title = document.createElement("h2");
                title.textContent = "scoreboard"
                scoreboard.appendChild(title)

                response.data.forEach(item => {
                    if(item){
                        let text = document.createElement("p");
                        text.textContent = item.pseudo + ": " + item.score ;
                        scoreboard.appendChild(text);
                    }
                });
            }
        }
    })
    .catch(error => {
        console.error('Erreur :', error);
    });

    let div4 = document.createElement("div")
    div4.id = "buttonDiv";
    customDialog.appendChild(div4)


    let button1 = document.createElement("button")
    button1.id = "logButton"
    button1.textContent = "Enregister"
    div4.appendChild(button1)

    let button2 = document.createElement("button")
    button2.id = "restartButton"
    button2.textContent = "Retour au menu"
    div4.appendChild(button2)

    game.appendChild(customDialog);

    customDialog.style.display = "none";
}

export function createUpgradeDialog (){
    customDialog = document.getElementById("upgrade");
    let div1 = document.createElement("div")
    let imgElement = document.createElement("img");
    let titleElement = document.createElement("h1");
    let textElement = document.createElement("p");

    imgElement.id = "imageUpgrade"
    imgElement.src = "./assets/images/mage.png";
    
    imgElement.style.width = "200px";

    imgElement.style.position = "absolute";
    imgElement.style.top = "-170px";
    imgElement.style.left = "37%";

    titleElement.textContent = "Upgrade";
    textElement.textContent = "Veuillez choisir votre améloration";

    customDialog.appendChild(imgElement)
    customDialog.appendChild(div1)

    div1.appendChild(titleElement)
    div1.appendChild(textElement)
    
    let div4 = document.createElement("div")
    div4.id = "upgradeDiv";
    customDialog.appendChild(div4)

    let buttonLife = document.createElement("button")
    var imgLife = document.createElement("img");
    imgLife.src = "./assets/images/full_heart.png";
    buttonLife.id = "lifeButton"
    buttonLife.classList.add("upgradeButton")
    buttonLife.textContent = "+1 vie"
    buttonLife.setAttribute("data-selected", "false");
    buttonLife.appendChild(imgLife)
    div4.appendChild(buttonLife)  

    let buttonDamage = document.createElement("button")
    var imgDamage = document.createElement("img");
    imgDamage.src = "./assets/images/sword.png";
    buttonDamage.id = "damageButton"
    buttonDamage.classList.add("upgradeButton")
    buttonDamage.textContent = "+1 dégat"
    buttonDamage.setAttribute("data-selected", "false");
    buttonDamage.appendChild(imgDamage)
    div4.appendChild(buttonDamage)

    let buttonRegen = document.createElement("button")
    var imgRegen = document.createElement("img");
    imgRegen.src = "./assets/images/full_heart.png";
    buttonRegen.id = "regenButton"
    buttonRegen.classList.add("upgradeButton")
    buttonRegen.textContent = "full regen"
    buttonRegen.setAttribute("data-selected", "false");
    buttonRegen.appendChild(imgRegen)
    div4.appendChild(buttonRegen)

    let buttonFireRate = document.createElement("button")
    var imgFireRate = document.createElement("img");
    imgFireRate.src = "./assets/images/fire_rate.png";
    buttonFireRate.id = "fireRateButton"
    buttonFireRate.classList.add("upgradeButton")
    buttonFireRate.textContent = "amélio cadence"
    buttonFireRate.setAttribute("data-selected", "false");
    buttonFireRate.appendChild(imgFireRate)
    div4.appendChild(buttonFireRate)

    let buttonMoveSpeed = document.createElement("button")
    var imgMoveSpeed = document.createElement("img");
    imgMoveSpeed.src = "./assets/images/move_speed.png";
    buttonMoveSpeed.id = "moveSpeedButton"
    buttonMoveSpeed.classList.add("upgradeButton")
    buttonMoveSpeed.textContent = "amélio ms"
    buttonMoveSpeed.setAttribute("data-selected", "false");
    buttonMoveSpeed.appendChild(imgMoveSpeed)
    div4.appendChild(buttonMoveSpeed)

    let buttons = [buttonLife, buttonDamage, buttonRegen, buttonFireRate, buttonMoveSpeed];

   /* for(let i = 0; i < buttons.length; i++){
        buttons[i].hidden = true;
    }*/

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            buttons.forEach((otherButton) => {
                if (otherButton !== button) {
                    otherButton.setAttribute("data-selected", "false");
                    otherButton.classList.remove("selected");
                }
            });

            let isSelected = button.getAttribute("data-selected");
            if (isSelected === "false") {
                button.setAttribute("data-selected", "true");
                button.classList.add("selected");
            } else {
                button.setAttribute("data-selected", "false");
                button.classList.remove("selected");
            }
        });
    });


    customDialog.style.width = "630px"
    
    let div5 = document.createElement("div")
    div5.id = "buttonDiv";
    div5.style.justifyContent = "center";
    customDialog.appendChild(div5)


    let button1 = document.createElement("button")
    button1.id = "validButton"
    button1.textContent = "Valider"
    div5.appendChild(button1)

    game.appendChild(customDialog);

    customDialog.style.display = "none";
}

export function createSkillDialog (){
    customDialog = document.getElementById("skill");
    let div1 = document.createElement("div")
    let imgElement = document.createElement("img");
    let titleElement = document.createElement("h1");
    let textElement = document.createElement("p");

    imgElement.id = "imageUpgrade"
    imgElement.src = "./assets/images/mage.png";
    imgElement.style.width = "200px";
    imgElement.style.position = "absolute";
    imgElement.style.top = "-170px";
    imgElement.style.left = "37%";

    titleElement.textContent = "Compétences";
    textElement.textContent = "Veuillez choisir votre compétence";

    customDialog.appendChild(imgElement)
    customDialog.appendChild(div1)

    div1.appendChild(titleElement)
    div1.appendChild(textElement)
    
    let div4 = document.createElement("div")
    div4.id = "upgradeDiv";
    customDialog.appendChild(div4)

    let buttonMultipleFire = document.createElement("button")
    //var imgLife = document.createElement("img");
    //imgLife.src = "./assets/images/full_heart.png";
    buttonMultipleFire.id = "multipleFireButton"
    buttonMultipleFire.classList.add("skillButton")
    buttonMultipleFire.textContent = "tir multiple"
    buttonMultipleFire.setAttribute("data-selected", "false");
    //buttonLife.appendChild(imgLife)
    div4.appendChild(buttonMultipleFire)  

    let buttonSwordDance = document.createElement("button")
   // var imgDamage = document.createElement("img");
   // imgDamage.src = "./assets/images/sword.png";
   buttonSwordDance.id = "swordDanceButton"
   buttonSwordDance.classList.add("skillButton")
   buttonSwordDance.textContent = "danse des épées"
   buttonSwordDance.disabled = true
   buttonSwordDance.setAttribute("data-selected", "false");
   // buttonDamage.appendChild(imgDamage)
    div4.appendChild(buttonSwordDance)

    let buttonShieldDance = document.createElement("button")
   // var imgRegen = document.createElement("img");
   // imgRegen.src = "./assets/images/full_heart.png";
   buttonShieldDance.id = "shieldDanceButton"
   buttonShieldDance.classList.add("skillButton")
   buttonShieldDance.textContent = "danse des boucliers"
   buttonShieldDance.disabled = true
   buttonShieldDance.setAttribute("data-selected", "false");
  //  buttonRegen.appendChild(imgRegen)
    div4.appendChild(buttonShieldDance)

    let buttons = [buttonMultipleFire, buttonShieldDance, buttonSwordDance];

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            buttons.forEach((otherButton) => {
                if (otherButton !== button) {
                    otherButton.setAttribute("data-selected", "false");
                    otherButton.classList.remove("selected");
                }
            });

            let isSelected = button.getAttribute("data-selected");
            if (isSelected === "false") {
                button.setAttribute("data-selected", "true");
                button.classList.add("selected");
            } else {
                button.setAttribute("data-selected", "false");
                button.classList.remove("selected");
            }
        });
    });


   // customDialog.style.width = "1050px"
   customDialog.style.width = "630px" 

    let div5 = document.createElement("div")
    div5.id = "buttonDiv";
    div5.style.justifyContent = "center";
    customDialog.appendChild(div5)


    let button1 = document.createElement("button")
    button1.id = "validSkillButton"
    button1.textContent = "Valider"
    div5.appendChild(button1)

    game.appendChild(customDialog);

    customDialog.style.display = "none";
}

export function createEchapDialog (){
    customDialog = document.getElementById("escape");
    let div1 = document.createElement("div")
    let titleElement = document.createElement("h1");

    titleElement.textContent = "Menu";

    customDialog.appendChild(div1)
    div1.appendChild(titleElement)
    

    let div4 = document.createElement("div")
    div4.id = "menuDiv";
    customDialog.appendChild(div4)

    let resumeButton = document.createElement("button")
    resumeButton.id = "resumeRealButton"
    resumeButton.textContent = "Continuer"
    div4.appendChild(resumeButton)

    let options = document.createElement("button")
    options.id = "optionButton"
    options.textContent = "Options"
    div4.appendChild(options)

    
    let success = document.createElement("button")
    success.id = "successButton"
    success.textContent = "Succès"
    div4.appendChild(success)

    customDialog.style.width = "250px"

    game.appendChild(customDialog);

    let resumeDiv = document.createElement("div")
    resumeDiv.id = "resumeDiv"
    resumeDiv.style.display = "none";
    game.appendChild(resumeDiv)

    let resume = document.createElement("p")
    resume.id = "resumeButton"
    resume.textContent = "Esc"
    resume.style.position = "absolute";
    resume.style.left = "10px";
    resume.style.pointerEvents = "none";
    resume.style.top = (windowHeight - 50) + "px";
    //resume.style.width = "126px";
    resumeDiv.appendChild(resume)

    let resumeText = document.createElement("p")
    resumeText.id = "resumeText"
    resumeText.textContent = "Quitter le menu"
    resumeText.style.position = "absolute";
    resumeText.style.left = "150px";
    resumeText.style.top = (windowHeight - 40) + "px";
    resumeDiv.appendChild(resumeText)

    customDialog.style.display = "none";
}

export function createSuccessDialog (){
    customDialog = document.getElementById("success");
    let div1 = document.createElement("div")
    let titleElement = document.createElement("h1");

    titleElement.textContent = "Succès";
    let cross = document.createElement("img");
    cross.id = "crossSuccess"
    cross.src = "./assets/images/cross.png";

    customDialog.appendChild(div1)
    div1.appendChild(titleElement)
    div1.appendChild(cross)
    

    let div4 = document.createElement("div")
    div4.id = "successDiv";
    div4.style.height = "400px"
    div4.style.width = "500px"
    div4.style.overflow = "auto";
    div4.style.margin = "auto"

    customDialog.appendChild(div4)

    customDialog.style.width = "630px"

    game.appendChild(customDialog);

    customDialog.style.display = "none";
}

export function createOptionsDialog (){
    customDialog = document.getElementById("options");
    let div1 = document.createElement("div")
    div1.id = "tabDiv"
    customDialog.appendChild(div1)

    let tabs = document.createElement("ul");
    tabs.classList.add("tabs");

    div1.appendChild(tabs)
    
    let tabGeneral = document.createElement("li");
    tabGeneral.classList.add("tab-button")
    tabGeneral.classList.add("active")
    tabGeneral.dataset.tab = "general"
    tabGeneral.textContent = "Général"

    let tabAudio = document.createElement("li");
    tabAudio.classList.add("tab-button")
    tabAudio.dataset.tab = "audio"
    tabAudio.textContent = "Audio"

    let tabControl = document.createElement("li");
    tabControl.classList.add("tab-button")
    tabControl.dataset.tab = "control"
    tabControl.textContent = "Contrôles"

    let cross = document.createElement("img");
    cross.id = "cross"
    cross.src = "./assets/images/cross.png";

    tabs.appendChild(tabGeneral)
    tabs.appendChild(tabAudio)
    tabs.appendChild(tabControl)
    tabs.appendChild(cross)

    let divGeneral = document.createElement("div")
    divGeneral.textContent = "Général"
    divGeneral.id = "general"
    divGeneral.classList.add("tab-content")
    divGeneral.classList.add("active")

    let divAudio = document.createElement("div")
    divAudio.textContent = "Audio"
    divAudio.id = "audio"
    divAudio.classList.add("tab-content")

    let divControl = document.createElement("div")
    divControl.textContent = "Contrôles"
    divControl.id = "control"
    divControl.classList.add("tab-content")
    
    div1.appendChild(divGeneral)
    div1.appendChild(divAudio)
    div1.appendChild(divControl)

// general area
    let generalContainer = document.createElement("div");
    generalContainer.id = "generalContainer"
    divGeneral.appendChild(generalContainer)

    let theme = document.createElement("button")
    theme.id = "themeButton"
    theme.textContent = "Thème : " + game.dataset.theme;
    generalContainer.appendChild(theme)
    
// end general area

//audio area
    let audioContainer = document.createElement("div")
    audioContainer.id = "audioContainer"
    divAudio.appendChild(audioContainer)

    let audioLabel = document.createElement("label")
    audioLabel.for = "audioButton"
    audioLabel.textContent = "Volume général :"
    audioContainer.appendChild(audioLabel)

    let divAudioBar = document.createElement("div")
    divAudioBar.classList.add("divAudioBar")
    audioContainer.appendChild(divAudioBar)

    let audio = document.createElement("input")
    audio.type = "range"
    audio.min = 0
    audio.max = 100
    audio.step = 1
    audio.value = parseFloat(game.dataset.volume) * 100
    audio.id = "audioButton"
    audio.textContent = "Audio"
    divAudioBar.appendChild(audio)

    let audioPercent = document.createElement("p")
    audioPercent.id = "audioPercentGeneral"
    let percent = parseFloat(game.dataset.volume) * 100
    audioPercent.textContent = percent + "%"
    divAudioBar.appendChild(audioPercent)

//end audio area

// controle area
    let upDiv = document.createElement("div")
    upDiv.classList.add("keyDiv");
    divControl.appendChild(upDiv)
    
    let upLabel = document.createElement("label")
    upLabel.textContent = "haut";
    upLabel.for = "upButton"

    let upButton = document.createElement("button")
    upButton.textContent = game.dataset.keyUp;
    upButton.id = "upButton"

    upDiv.appendChild(upLabel)
    upDiv.appendChild(upButton)

    upButton.addEventListener("click", () => {
        upButton.textContent = "Appuyez sur la touche"

        const keydownHandler = (event) => {
            keyChanger(event, upButton, keydownHandler);
        };
    
        upButton.addEventListener("keydown", keydownHandler);
    })

    let leftDiv = document.createElement("div")
    leftDiv.classList.add("keyDiv");
    divControl.appendChild(leftDiv)
    
    let leftLabel = document.createElement("label")
    leftLabel.textContent = "gauche";
    leftLabel.for = "leftButton"

    let leftButton = document.createElement("button")
    leftButton.textContent = game.dataset.keyLeft;
    leftButton.id = "leftButton"

    leftDiv.appendChild(leftLabel)
    leftDiv.appendChild(leftButton)

    leftButton.addEventListener("click", () => {
        leftButton.textContent = "Appuyez sur la touche"

        const keydownHandler = (event) => {
            keyChanger(event, leftButton, keydownHandler);
        };
    
        leftButton.addEventListener("keydown", keydownHandler);
    })

    let downDiv = document.createElement("div")
    downDiv.classList.add("keyDiv");
    divControl.appendChild(downDiv)
    
    let downLabel = document.createElement("label")
    downLabel.textContent = "bas";
    downLabel.for = "downButton"

    let downButton = document.createElement("button")
    downButton.textContent = game.dataset.keyDown;
    downButton.id = "downButton"

    downDiv.appendChild(downLabel)
    downDiv.appendChild(downButton)

    downButton.addEventListener("click", () => {
        downButton.textContent = "Appuyez sur la touche"

        const keydownHandler = (event) => {
            keyChanger(event, downButton, keydownHandler);
        };
    
        downButton.addEventListener("keydown", keydownHandler);
    })

    let rightDiv = document.createElement("div")
    rightDiv.classList.add("keyDiv");
    divControl.appendChild(rightDiv)
    
    let rightLabel = document.createElement("label")
    rightLabel.textContent = "droite";
    rightLabel.for = "rightButton"

    let rightButton = document.createElement("button")
    rightButton.textContent = game.dataset.keyRight;
    rightButton.id = "rightButton"

    rightDiv.appendChild(rightLabel)
    rightDiv.appendChild(rightButton)

    rightButton.addEventListener("click", () => {
        rightButton.textContent = "Appuyez sur la touche"

        const keydownHandler = (event) => {
            keyChanger(event, rightButton, keydownHandler);
        };
    
        rightButton.addEventListener("keydown", keydownHandler);
    })

    let dashDiv = document.createElement("div")
    dashDiv.classList.add("keyDiv");
    divControl.appendChild(dashDiv)
    
    let dashLabel = document.createElement("label")
    dashLabel.textContent = "esquive";
    dashLabel.for = "dashButton"

    let dashButton = document.createElement("button")
    if(game.dataset.keyDash == " "){
        dashButton.textContent = "espace";
    }else {
        dashButton.textContent = game.dataset.keyDash;
    }
    dashButton.id = "dashButton"

    dashDiv.appendChild(dashLabel)
    dashDiv.appendChild(dashButton)

    dashButton.addEventListener("click", () => {
        dashButton.textContent = "Appuyez sur la touche"

        const keydownHandler = (event) => {
            keyChanger(event, dashButton, keydownHandler);
        };
    
        dashButton.addEventListener("keydown", keydownHandler);
    })

    /*let fireDiv = document.createElement("div")
    fireDiv.classList.add("keyDiv");
    divControl.appendChild(fireDiv)
    
    let fireLabel = document.createElement("label")
    fireLabel.textContent = "tir";
    fireLabel.for = "fireButton"

    let fireButton = document.createElement("button")
    fireButton.textContent = "mouse" + game.dataset.keyFire;
    fireButton.id = "fireButton"

    fireDiv.appendChild(fireLabel)
    fireDiv.appendChild(fireButton)

    fireButton.addEventListener("click", () => {
        fireButton.textContent = "Appuyez sur la touche"

        const keydownHandler = (event) => {
            keyChanger(event, fireButton, keydownHandler);
        };
    
        fireButton.addEventListener("keydown", keydownHandler);
      //fireButton.addEventListener("mousedown", keydownHandler);
    })*/

    let skillDiv = document.createElement("div")
    skillDiv.classList.add("keyDiv");
    divControl.appendChild(skillDiv)
    
    let skillLabel = document.createElement("label")
    skillLabel.textContent = "compétence";
    skillLabel.for = "skillButton"

    let skillButton = document.createElement("button")
    skillButton.textContent = game.dataset.keySkill;
    skillButton.id = "skillButton"

    skillDiv.appendChild(skillLabel)
    skillDiv.appendChild(skillButton)

    skillButton.addEventListener("click", () => {
        skillButton.textContent = "Appuyez sur la touche"

        const keydownHandler = (event) => {
            keyChanger(event, skillButton, keydownHandler);
        };
    
        skillButton.addEventListener("keydown", keydownHandler);
        //skillButton.addEventListener("mousedown", keydownHandler);
    })



    function keyChanger(event, button, keydownHandler) {
        let key;

        let dataset = game.dataset;
        let keySet = Object.keys(game.dataset).filter((cle) => cle.includes("key"));
        console.log(keySet)
    
        let valeursAvecKey = keySet.map(key => dataset[key]);
    
        if(event.key != null){
           key = event.key.toLowerCase();
        } /*else if (event.button != null) {
            key = event.button;
        }*/

        switch (button.id) {
            case "upButton" :
                if(!(valeursAvecKey.includes(key)) || game.dataset.keyUp == key) {
                    game.dataset.keyUp = key;
                    localStorage.setItem("keyUp", key)
                    upButton.textContent = game.dataset.keyUp;
                    if(game.dataset.keyUp == " "){
                        upButton.textContent = "espace";
                    }
                    upButton.removeEventListener("keydown", keydownHandler)
                } else {
                    upButton.classList.add("shake-animation");
                    upButton.style.color = "red";

                    // Attendez 0.5 seconde et supprimez l'animation
                    setTimeout(() => {
                        upButton.classList.remove("shake-animation");
                        upButton.style.color = downButton.style.color;
                    }, 500);
                }
                break;

            case "rightButton" :
                if(!(valeursAvecKey.includes(key)) || game.dataset.keyRight == key) {
                    game.dataset.keyRight = key;
                    localStorage.setItem("keyRight", key)
                    rightButton.textContent = game.dataset.keyRight;
                    if(game.dataset.keyRight == " "){
                        rightButton.textContent = "espace";
                    }
                    rightButton.removeEventListener("keydown", keydownHandler)
                } else {
                    rightButton.classList.add("shake-animation");
                    rightButton.style.color = "red";

                    // Attendez 0.5 seconde et supprimez l'animation
                    setTimeout(() => {
                        rightButton.classList.remove("shake-animation");
                        rightButton.style.color = upButton.style.color;
                    }, 500);
                }
                break;

            case "leftButton" :
                if(!(valeursAvecKey.includes(key)) || game.dataset.keyLeft == key) {
                    game.dataset.keyLeft = key;
                    localStorage.setItem("keyLeft", key)
                    leftButton.textContent = game.dataset.keyLeft;
                    if(game.dataset.keyLeft == " "){
                        leftButton.textContent = "espace";
                    }
                    leftButton.removeEventListener("keydown", keydownHandler)
                } else {
                    leftButton.classList.add("shake-animation");
                    leftButton.style.color = "red";

                    // Attendez 0.5 seconde et supprimez l'animation
                    setTimeout(() => {
                        leftButton.classList.remove("shake-animation");
                        leftButton.style.color = upButton.style.color;
                    }, 500);
                }
                break;

            case "downButton" :
                if(!(valeursAvecKey.includes(key)) || game.dataset.keyDown == key) {
                    game.dataset.keyDown = key;
                    localStorage.setItem("keyDown", key)
                    downButton.textContent = game.dataset.keyDown;
                    if(game.dataset.keyDown == " "){
                        downButton.textContent = "espace";
                    }
                    downButton.removeEventListener("keydown", keydownHandler)
                } else {
                    downButton.classList.add("shake-animation");
                    downButton.style.color = "red";

                    // Attendez 0.5 seconde et supprimez l'animation
                    setTimeout(() => {
                        downButton.classList.remove("shake-animation");
                        downButton.style.color = upButton.style.color;
                    }, 500);
                }
                break;

            case "dashButton" :
                if(!(valeursAvecKey.includes(key)) || game.dataset.keyDash == key) {
                    game.dataset.keyDash = key;
                    localStorage.setItem("keyDash", key)

                    if(game.dataset.keyDash == " "){
                        dashButton.textContent = "espace";
                    } else {
                        dashButton.textContent = game.dataset.keyDash;
                    }
                    dashButton.removeEventListener("keydown", keydownHandler)
                } else {
                    dashButton.classList.add("shake-animation");
                    dashButton.style.color = "red";

                    // Attendez 0.5 seconde et supprimez l'animation
                    setTimeout(() => {
                        dashButton.classList.remove("shake-animation");
                        dashButton.style.color = upButton.style.color;
                    }, 500);
                }
                break;

            case "fireButton" :
                if (event.isTrusted){
                    if(!(valeursAvecKey.includes(key)) || game.dataset.keyFire == key) {
                        game.dataset.keyFire = key;
                        localStorage.setItem("keyFire", key)
                        
                        if(game.dataset.keyFire == " "){
                            fireButton.textContent = "espace";
                        } else if(Number.isInteger(key)){
                            fireButton.textContent = "mouse" + game.dataset.keyFire;
                        } else {
                            fireButton.textContent = game.dataset.keyFire;
                        }
                         
                        fireButton.removeEventListener("keydown", keydownHandler)
                        fireButton.removeEventListener("mousedown", keydownHandler)
                    } else {
                        fireButton.classList.add("shake-animation");
                        fireButton.style.color = "red";

                        // Attendez 0.5 seconde et supprimez l'animation
                        setTimeout(() => {
                            fireButton.classList.remove("shake-animation");
                            fireButton.style.color = upButton.style.color;
                        }, 500);
                    }
                }
                break;

            case "skillButton" :
                if(!(valeursAvecKey.includes(key)) || game.dataset.keySkill == key) {
                    game.dataset.keySkill = key;
                    localStorage.setItem("keySkill", key)
                    skillButton.textContent = game.dataset.keySkill;
                    if(game.dataset.keySkill == " "){
                        skillButton.textContent = "espace";
                    }
                    skillButton.removeEventListener("keydown", keydownHandler)
                } else {
                    skillButton.classList.add("shake-animation");
                    skillButton.style.color = "red";

                    // Attendez 0.5 seconde et supprimez l'animation
                    setTimeout(() => {
                        skillButton.classList.remove("shake-animation");
                        skillButton.style.color = downButton.style.color;
                    }, 500);
                }
                break;
        }
        
    }
//end controle area

    let tabArray = [tabAudio, tabControl, tabGeneral];

    tabArray.forEach((tab) => {
        tab.addEventListener("click", () => {
            if(game.dataset.theme == "light"){
                if(!tabs.classList.contains("dark_active")){
                    tabs.classList.remove("dark_active")
                    tab.classList.add("active");
                    let tabContent = document.getElementById(tab.dataset.tab)
                    tabContent.classList.add("active");
                }
            } else if(game.dataset.theme == "dark"){
                if(!tabs.classList.contains("active")){
                    tabs.classList.remove("active")
                    tab.classList.add("dark_active");
                    let tabContent = document.getElementById(tab.dataset.tab)
                    tabContent.classList.add("dark_active");
                }
            }

            tabArray.forEach((otherTab) => {
                if (otherTab !== tab) {
                    let otherTabContent = document.getElementById(otherTab.dataset.tab)
                    if(game.dataset.theme == "light"){
                        otherTab.classList.remove("active");
                        otherTabContent.classList.remove("active");
                        otherTab.classList.remove("dark_active");
                        otherTabContent.classList.remove("dark_active");
                    } else if(game.dataset.theme == "dark"){
                        otherTab.classList.remove("dark_active");
                        otherTabContent.classList.remove("dark_active");
                        otherTab.classList.remove("active");
                        otherTabContent.classList.remove("active");
                    }
                }
            });
        });
    });

    customDialog.style.width = "630px"
    customDialog.style.height = "430px"

    game.appendChild(customDialog);
    customDialog.style.display = "none";
}

export function createStartDialog (){
    customDialog = document.getElementById("start");
    let div1 = document.createElement("div")
    let titleElement = document.createElement("h1");
    titleElement.textContent = "The Game";

    div1.appendChild(titleElement)
    customDialog.appendChild(div1)
    let welcome = document.createElement("h3");
    welcome.id = "welcome"
    
    div1.appendChild(welcome)

    if(localStorage.getItem("player_name") != null){
        welcome.textContent = "Bienvenue " + localStorage.getItem("player_name");
    }
   
    
    let div4 = document.createElement("div")
    div4.id = "menuDiv";
    customDialog.appendChild(div4)

    let play = document.createElement("button")
    play.id = "playButton"
    play.textContent = "Jouer"
    if(localStorage.getItem("player_id") == null){
        play.disabled = true
    }
    div4.appendChild(play)

    let difficulty = document.createElement("button")
    difficulty.id = "difficultyButton"
    difficulty.textContent = "Difficulté : "

    switch (localStorage.getItem("difficulty")){
        case "0":
            difficulty.textContent = difficulty.textContent + "facile"
            break;
        case "1":
            difficulty.textContent = difficulty.textContent + "normal"
            break;
        case "2":
            difficulty.textContent = difficulty.textContent + "difficile"
            break;
    }

    div4.appendChild(difficulty)

    let options = document.createElement("button")
    options.id = "optionStartButton"
    options.textContent = "Options"
    div4.appendChild(options)

    let success = document.createElement("button")
    success.id = "successStartButton"
    success.textContent = "Succès"
    div4.appendChild(success)

    let loginDiv = document.createElement("div")
    loginDiv.id = "loginDiv";
    loginDiv.style.marginTop = "10px";
    loginDiv.style.display = "none"
    div4.appendChild(loginDiv)


    let loginStatus = document.createElement("p")
    loginStatus.id = "loginStatus"
    loginStatus.style.color = "red";

    loginDiv.appendChild(loginStatus)

    let loginInput = document.createElement("input")
    loginInput.id = "loginInput"
    loginInput.type = "text"
    loginInput.style.width = "190px"
    loginInput.style.marginTop = "20px"
    loginInput.placeholder = "Pseudo"

    loginDiv.appendChild(loginInput)

    let passwordInput = document.createElement("input")
    passwordInput.id = "passwordInput"
    passwordInput.type = "password"
    passwordInput.style.width = "190px"
    passwordInput.style.marginTop = "10px"
    passwordInput.placeholder = "Mot de passe"

    loginDiv.appendChild(passwordInput)

    let loginButton = document.createElement("button")
    loginButton.id = "loginButton"
    loginButton.textContent = "Se connecter"
    loginDiv.appendChild(loginButton)

    let registerButton = document.createElement("button")
    registerButton.id = "registerButton"
    registerButton.textContent = "S'inscrire"
    loginDiv.appendChild(registerButton)

    let logoutDiv = document.createElement("div")
    logoutDiv.id = "logoutDiv";
    logoutDiv.style.marginTop = "10px";
    logoutDiv.style.display = "none"
    div4.appendChild(logoutDiv)

    let logoutButton = document.createElement("button")
    logoutButton.id = "logoutButton"
    logoutButton.textContent = "Se déconnecter"
    logoutDiv.appendChild(logoutButton)

    if(localStorage.getItem("player_id") == null){
        loginDiv.style.display = "block"
    } else {
        logoutDiv.style.display = "block"
    }

    let params = new URLSearchParams({ route: "scoreboard" });
    let urlAvecParametres = `${apiURL}?${params}`;

    axios.get(urlAvecParametres)
    .then(response => {
        if(Array.isArray(response.data)){
            if(response.data != ""){
                let scoreboard = document.createElement("div")
                scoreboard.classList.add("scoreboard")
                scoreboard.style.marginTop = "20px"
                div4.appendChild(scoreboard)

                let title = document.createElement("h2");
                title.textContent = "scoreboard"
                scoreboard.appendChild(title)

                response.data.forEach(item => {
                    if(item){
                        let text = document.createElement("p");
                        text.textContent = item.pseudo + ": " + item.score ;
                        scoreboard.appendChild(text);
                    }
                });
            }
        }
    })
    .catch(error => {
        console.error('Erreur :', error);
    });
      
    customDialog.style.width = "250px"

    game.appendChild(customDialog);
    
    customDialog.style.display = "block";
}

export function activeButton(){
    let loginStatus = document.getElementById("loginStatus");
    let logButton = document.getElementById("logButton")
    let restartButton = document.getElementById("restartButton")
    let validButton = document.getElementById("validButton")
    let validSkillButton = document.getElementById("validSkillButton")
    let themeButton = document.getElementById("themeButton")
    let optionButton = document.getElementById("optionButton")
    let playButton = document.getElementById("playButton")
    let optionStartButton = document.getElementById("optionStartButton")
    let crossButton = document.getElementById("cross")
    let crossSuccessButton = document.getElementById("crossSuccess")
    let loginButton = document.getElementById("loginButton")
    let registerButton = document.getElementById("registerButton")
    let resumeRealButton = document.getElementById("resumeRealButton")
    let successStartButton = document.getElementById("successStartButton")
    let successButton = document.getElementById("successButton")
    let logoutButton = document.getElementById("logoutButton")
    let difficultyButton = document.getElementById("difficultyButton")

    if(difficultyButton !== null){
        difficultyButton.addEventListener("click", () => {
            let damageText = document.getElementById("damageText")
            if(localStorage.getItem("difficulty") < 2){
                localStorage.setItem("difficulty", parseInt(localStorage.getItem("difficulty")) + 1)
            }else {
                localStorage.setItem("difficulty", 0);
            }
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
        })
    }

    if(logoutButton !== null){
        logoutButton.addEventListener("click", () => {         
            localStorage.removeItem("player_name")      
            localStorage.removeItem("player_id")

            let loginDiv = document.getElementById("loginDiv")
            let logoutDiv = document.getElementById("logoutDiv")
            let welcome = document.getElementById("welcome")

            if(localStorage.getItem("player_id") == null){
                loginDiv.style.display = "block"
                logoutDiv.style.display = "none"
                welcome.style.display = "none"
            } else {
                logoutDiv.style.display = "block"
                loginDiv.style.display = "none"
                welcome.style.display = "block"
            }
        });
    }

    if(logButton !== null){
        logButton.addEventListener("click", () => {  
            logButton.disabled = true
            logButton.style.pointerEvents  = "none"
            let params = new URLSearchParams({ route: "score", player_id: localStorage.getItem("player_id"), score: sessionStorage.getItem("vagues")});
            let urlAvecParametres = `${apiURL}?${params}`;
            
            axios.get(urlAvecParametres)
            .then(response => {
                if(response.data != ""){
                    sessionStorage.removeItem("vagues")
                    let params = new URLSearchParams({ route: "scoreboard" });
                    let urlAvecParametres = `${apiURL}?${params}`;
                    axios.get(urlAvecParametres)
                    .then(response => {
                        if(Array.isArray(response.data)){
                            if(response.data != ""){
                                const scoreboard = document.querySelector('#divScoreboard div')
                                if(scoreboard != null){
                                    scoreboard.remove();
                                }

                                let div2 = document.getElementById("divScoreboard")
                                let newScoreboard = document.createElement("div")
                                newScoreboard.classList.add("scoreboard")
                                newScoreboard.style.marginTop = "10px"
                                newScoreboard.style.marginBottom = "10px"
                                div2.appendChild(newScoreboard)
                
                                let title = document.createElement("h2");
                                title.textContent = "scoreboard"
                                newScoreboard.appendChild(title)
                
                                response.data.forEach(item => {
                                    if(item){
                                        let text = document.createElement("p");
                                        text.textContent = item.pseudo + ": " + item.score ;
                                        newScoreboard.appendChild(text);
                                    }
                                });
                            }
                        }
                    })
                    .catch(error => {
                        console.error('Erreur :', error);
                    });
                }
            })
            .catch(error => {
                console.error('Erreur :', error);
            });
        });
    }

    if(restartButton !== null){
        restartButton.addEventListener("click", () => {
            location.reload();
        });
    }

    if(resumeRealButton !== null){
        resumeRealButton.addEventListener("click", () => {
            togglePauseGame();
        });
    }

    if(validButton !== null){
        validButton.addEventListener("click", () => {
            let lifeButton = document.getElementById("lifeButton")
            let damageButton = document.getElementById("damageButton")
            let regenButton = document.getElementById("regenButton")
            let fireRateButton = document.getElementById("fireRateButton")
            let moveSpeedButton = document.getElementById("moveSpeedButton")
            
            if (lifeButton.getAttribute("data-selected") === "true") {
                let player = document.getElementById("player")
 
                player.dataset.initialLife = parseInt(player.dataset.initialLife) + 1;
                player.dataset.life = parseInt(player.dataset.life) + 1;

                lifeButton.setAttribute("data-selected", "false");
                lifeButton.classList.remove("selected");
                game.dataset.isGamePaused = false;
                document.getElementById("upgrade").style.display = "none";
            }
        
            if (damageButton.getAttribute("data-selected") === "true") {
                let player = document.getElementById("player")

                player.dataset.damage = parseInt(player.dataset.damage) + 1;
                
                damageButton.setAttribute("data-selected", "false");
                damageButton.classList.remove("selected");
                game.dataset.isGamePaused = false;
                document.getElementById("upgrade").style.display = "none";
            }
        
            if (regenButton.getAttribute("data-selected") === "true") {
                let player = document.getElementById("player")

                player.dataset.life = player.dataset.initialLife
                
                regenButton.setAttribute("data-selected", "false");
                regenButton.classList.remove("selected");
                game.dataset.isGamePaused = false;
                document.getElementById("upgrade").style.display = "none";
            }

            if (moveSpeedButton.getAttribute("data-selected") === "true") {
                let player = document.getElementById("player")

                player.dataset.speed = parseInt(player.dataset.speed) + 0.5;
                player.dataset.initialSpeed = parseInt(player.dataset.initialSpeed) + 0.5;
                
                moveSpeedButton.setAttribute("data-selected", "false");
                moveSpeedButton.classList.remove("selected");
                game.dataset.isGamePaused = false;
                document.getElementById("upgrade").style.display = "none";
            }

            if (fireRateButton.getAttribute("data-selected") === "true") {
                let player = document.getElementById("player")

                player.dataset.fireRate = parseInt(player.dataset.fireRate) - 50;
                
                fireRateButton.setAttribute("data-selected", "false");
                fireRateButton.classList.remove("selected");
                game.dataset.isGamePaused = false;
                document.getElementById("upgrade").style.display = "none";
            }
            
        });
    }

    if(validSkillButton !== null){
        validSkillButton.addEventListener("click", () => {
            let multipleFireButton = document.getElementById("multipleFireButton")
            let swordDanceButton = document.getElementById("swordDanceButton")
            let shieldDanceButton = document.getElementById("shieldDanceButton")
            
            if (multipleFireButton.getAttribute("data-selected") === "true") {
                let player = document.getElementById("player")
 
                player.dataset.skill = 0;

                multipleFireButton.setAttribute("data-selected", "false");
                multipleFireButton.classList.remove("selected");
                game.dataset.isGamePaused = false;
                document.getElementById("skill").style.display = "none";
            }
        
            if (swordDanceButton.getAttribute("data-selected") === "true") {
                let player = document.getElementById("player")

                player.dataset.skill = 1;
                
                swordDanceButton.setAttribute("data-selected", "false");
                swordDanceButton.classList.remove("selected");
                game.dataset.isGamePaused = false;
                document.getElementById("skill").style.display = "none";
            }
        
            if (shieldDanceButton.getAttribute("data-selected") === "true") {
                let player = document.getElementById("player")

                player.dataset.skill = 2;
                
                shieldDanceButton.setAttribute("data-selected", "false");
                shieldDanceButton.classList.remove("selected");
                game.dataset.isGamePaused = false;
                document.getElementById("skill").style.display = "none";
            }
        });
    }
    
    if(optionButton !== null){
        optionButton.addEventListener("click", () => {
            let customDialog = document.getElementById("options");
            customDialog.style.display = "block";
        });
    }

    if(optionStartButton !== null){
        optionStartButton.addEventListener("click", () => {
            let customDialog = document.getElementById("options");
            customDialog.style.display = "block";
        });
    }

    if(playButton !== null){
        playButton.addEventListener("click", () => {
            let dialog = document.getElementById("start")
            difficultyButton.disabled = true;
            difficultyButton.style.pointerEvents  = "none"
            dialog.style.display = "none"
            initializeGame();
        });
    }

    if(themeButton !== null){
        themeButton.addEventListener("click", () => {           
            if(game.dataset.theme == "light"){
                game.dataset.theme = "dark";
                localStorage.setItem("theme", "dark")

            } else if(game.dataset.theme == "dark") {
                game.dataset.theme = "light";
                localStorage.setItem("theme", "light")
            }

            checkTheme();
        });

    }

    if(crossButton !== null){
        crossButton.addEventListener("click", () => {
            let dialog = document.getElementById("options")
            dialog.style.display = "none"
        });
    }

    if(crossSuccessButton !== null){
        crossSuccessButton.addEventListener("click", () => {
            let dialog = document.getElementById("success")
            
            let divSuccess = document.getElementById("successDiv")
            divSuccess.remove()

            let successDiv = document.createElement("div")
            successDiv.id = "successDiv"
            
            successDiv.style.height = "400px"
            successDiv.style.width = "500px"
            successDiv.style.overflow = "auto";
            successDiv.style.margin = "auto"
            dialog.appendChild(successDiv)

            dialog.style.display = "none"
        });
    }

    if(loginButton !== null){
        loginButton.addEventListener("click", () => {

            let pseudo = document.getElementById("loginInput");
            let pwd = document.getElementById("passwordInput");
            
            if(pseudo.value == "" || pwd.value == ""){
                pseudo.style.border  = "red 1px solid"
                pwd.style.border  = "red 1px solid"
                loginStatus.textContent = "Identifiant ou mot de passe vide"

                setTimeout(() => {
                    pseudo.style.border  = ""
                    pwd.style.border  = ""
                    loginStatus.textContent = ""
                }, 5000);
            }else {
                //localStorage.setItem("pseudo", pseudo.value)

                let params = new URLSearchParams({ route: "login", pseudo: pseudo.value, password: pwd.value});
                let urlAvecParametres = `${apiURL}?${params}`;
                axios.get(urlAvecParametres)
                .then(response => {
                    
                    if(response.data == "Identifiant ou mot de passe incorrect"){
                        loginStatus.textContent = "Identifiant ou mot de passe incorrect"
                        pseudo.style.border  = "red 1px solid"
                        pwd.style.border  = "red 1px solid"
                        setTimeout(() => {
                            pseudo.style.border  = ""
                            pwd.style.border  = ""
                            loginStatus.textContent = ""
                        }, 5000);
                    } else if(response.data == "Le compte n'existe pas encore"){
                        loginStatus.textContent = "Cet identifiant n'existe pas"
                        pseudo.style.border  = "red 1px solid"
                        pwd.style.border  = "red 1px solid"
                        setTimeout(() => {
                            pseudo.style.border  = ""
                            pwd.style.border  = ""
                            loginStatus.textContent = ""
                        }, 5000);
                    } else {
                        localStorage.setItem("player_id", response.data[0]["id"])
                        localStorage.setItem("player_name", pseudo.value)
                        let play = document.getElementById("playButton")
                        pwd.value = ""
                        play.disabled = false

                        let welcome = document.getElementById("welcome")
                        if(localStorage.getItem("player_name") != null){
                            welcome.textContent = "Bienvenue " + localStorage.getItem("player_name");
                        }

                        let loginDiv = document.getElementById("loginDiv")
                        let logoutDiv = document.getElementById("logoutDiv")

                        if(localStorage.getItem("player_id") == null){
                            loginDiv.style.display = "block"
                            logoutDiv.style.display = "none"
                            welcome.style.display = "none"
                        } else {
                            logoutDiv.style.display = "block"
                            loginDiv.style.display = "none"
                            welcome.style.display = "block"
                        }
                    }
                })
                .catch(error => {
                    console.error('Erreur :', error);
                });

            }
        });
    }

    if(registerButton !== null){
        registerButton.addEventListener("click", () => {

            
            let pseudo = document.getElementById("loginInput");
            let pwd = document.getElementById("passwordInput");
            
            if(pseudo.value == "" || pwd.value == ""){
                pseudo.style.border  = "red 1px solid"
                pwd.style.border  = "red 1px solid"
                loginStatus.textContent = "Identifiant ou mot de passe vide"
                setTimeout(() => {
                    pseudo.style.border  = ""
                    pwd.style.border  = ""
                    loginStatus.textContent = ""
                }, 5000);
            }else {

                let params = new URLSearchParams({ route: "register", pseudo: pseudo.value, password: pwd.value });
                let urlAvecParametres = `${apiURL}?${params}`;

                axios.get(urlAvecParametres)
                .then(response => {
                    localStorage.setItem("player_name", pseudo.value)
                    localStorage.setItem("player_id", response.data[0])
                    let play = document.getElementById("playButton")
                    pwd.value = ""
                    play.disabled = false

                    let welcome = document.getElementById("welcome")
                    if(localStorage.getItem("player_name") != null){
                        welcome.textContent = "Bienvenue " + localStorage.getItem("player_name");
                    }

                    let loginDiv = document.getElementById("loginDiv")
                    let logoutDiv = document.getElementById("logoutDiv")

                    if(localStorage.getItem("player_id") == null){
                        loginDiv.style.display = "block"
                        logoutDiv.style.display = "none"
                        welcome.style.display = "none"
                    } else {
                        logoutDiv.style.display = "block"
                        loginDiv.style.display = "none"
                        welcome.style.display = "block"
                    }
                })
                .catch(error => {
                    console.log("cet identifiant est déjà utilisé")
                    pseudo.style.border  = "red 1px solid"
                    pwd.style.border  = "red 1px solid"
                    loginStatus.textContent = "L'identifiant est déjà utilisé"
                    setTimeout(() => {
                        pseudo.style.border  = ""
                        pwd.style.border  = ""
                        loginStatus.textContent = ""
                    }, 5000);
                });
            }
        })
    }

    if(successButton !== null){
        successButton.addEventListener("click", () => {
            let customDialog = document.getElementById("success");
            updateSuccess()
            customDialog.style.display = "block";
        });
    }

    if(successStartButton !== null){
        successStartButton.addEventListener("click", () => {
            let customDialog = document.getElementById("success");
            updateSuccess()
            customDialog.style.display = "block";
        });
    }

}

function updateSuccess () {

    let divSuccess = document.getElementById("successDiv")

    let paramsPlayer = new URLSearchParams({ route: "count_player"});
    let urlAvecParametresPlayer = `${apiURL}?${paramsPlayer}`;
    axios.get(urlAvecParametresPlayer)
    .then(response => {
        let nbPlayer = response.data[0]["nb_players"];

        let params = new URLSearchParams({ route: "all_success" });
        let urlAvecParametres = `${apiURL}?${params}`;
        axios.get(urlAvecParametres)
        .then(response => {
            if(Array.isArray(response.data)){
                let allSuccess = response.data;
                if(allSuccess != ""){
                    let params = new URLSearchParams({ route: "success", player_id: localStorage.getItem("player_id")});
                    let urlAvecParametres = `${apiURL}?${params}`;
                    axios.get(urlAvecParametres)
                    .then(response => {
                        allSuccess.forEach(success => {
                            let successDiv = document.createElement("div")
                            successDiv.id = "success"+success["id"];
                            successDiv.classList.add("successDiv");
                            
                            divSuccess.appendChild(successDiv)

                            if(localStorage.getItem("theme") == "light" || localStorage.getItem("theme") == null){
                                successDiv.style.backgroundColor = "#f0f0f0"
                            } else if(localStorage.getItem("theme") == "dark"){
                                successDiv.style.backgroundColor = "#333"
                            }

                            let successImg = document.createElement("img")
                            successImg.id = "successImg"+success["id"];
                            successImg.classList.add("successImg")
                            successImg.src = "./assets/images/" + success["img_path"];

                            let successTextDiv = document.createElement("div")
                            successTextDiv.classList.add("successText")

                            let successTitle = document.createElement("p")
                            successTitle.id = "successTitle"+success["id"];
                            successTitle.textContent = success["name"]
                            successTitle.style.fontSize = "1.5em"
                            successTitle.style.fontWeight = "bold"
                            successTitle.style.textAlign = "left"

                            

                           
                            if(response.data != ""){
                                response.data.forEach(successAchieved => {
                                    if(successAchieved["id"] == success["id"]){
                                        successImg.classList.add("successAchieved")
                                    }
                                    else{
                                        successImg.classList.add("successNotAchieved")
                                    }
                                })
                            } else {
                                successImg.classList.add("successNotAchieved")
                            }
                            
                            let successDescription = document.createElement("p")
                            successDescription.id = "successDescription"+success["id"];
                            successDescription.textContent = success["description"]
                            
                            let paramsPercent = new URLSearchParams({ route: "count_playerBySuccess", success_id: success["id"]});
                            let urlAvecParametresPercent = `${apiURL}?${paramsPercent}`;
                            axios.get(urlAvecParametresPercent)
                            .then(response => {
                                let playerBySuccess = response.data[0]["nb_players_by_success"]
                                let percent = playerBySuccess / nbPlayer * 100
                                let successPercent = document.createElement("p")
                                successPercent.id = "successPercent"+success["id"];
                                successPercent.textContent = percent.toFixed(2) + "% des joueurs on obtenu ce succès"
                                successTextDiv.appendChild(successPercent)
                            })
                            .catch(error => {
                                console.error('Erreur :', error);
                            });

                            successDiv.appendChild(successImg)
                            successDiv.appendChild(successTextDiv)
                            successTextDiv.appendChild(successTitle)
                            successTextDiv.appendChild(successDescription)
                        
                        })                    
                    })
                    .catch(error => {
                        console.error('Erreur :', error);
                    });
                }
            }
        })
    })
    .catch(error => {
        console.error('Erreur :', error);
    });
}