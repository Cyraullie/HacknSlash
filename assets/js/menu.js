import { filepath, apiURL, windowHeight } from './data.js';
import axios from 'axios';

var customDialog;
const game = document.getElementById("game");

export function displayGameOver(text1, text2, score) {
    let dialog = document.getElementById("gameOver");
    let scoreText = document.getElementById("score");
    scoreText.textContent = text1 + score + text2;
    scoreText.dataset.score = score;

    dialog.style.display = "block";
}

export function displayUpgrade(vagues) {
    let dialog = document.getElementById("upgrade");
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
    let input = document.createElement("input");
    input.type = "text"
    input.placeholder = "3 initiales"
    input.maxLength = 3
    input.name = "playerName"
    input.id = "playerName"

    
    customDialog.appendChild(div2)
    
    div2.appendChild(input)
    
/*
    const params = new URLSearchParams({ filePath: filepath });
    const urlAvecParametres = `${apiURL}?${params}`;
*/
    let div3 = document.createElement("div")
    customDialog.appendChild(div3)
/*
    const ul = document.createElement("ul");

    axios.get(urlAvecParametres)
    .then(response => {
        // Traitement de la réponse icidw
        let score = 1;
        response.data.data.forEach(item => {
            // item contient chaque objet de response.data
            if(item){
                const li = document.createElement("li");
                li.textContent = score + "# " +item; // Définissez le texte de l'élément <li> sur l'élément de données
                ul.appendChild(li);
                // Faites ce que vous devez faire avec chaque élément ici
                score++;
            }
            
        });
    })
    .catch(error => {
        console.error('Erreur :', error);
    });

    div3.appendChild(ul)
    */
    let div4 = document.createElement("div")
    div4.id = "buttonDiv";
    customDialog.appendChild(div4)


    let button1 = document.createElement("button")
    button1.id = "logButton"
    button1.textContent = "save & play"
    div4.appendChild(button1)

    let button2 = document.createElement("button")
    button2.id = "restartButton"
    button2.textContent = "Rejouer"
    div4.appendChild(button2)

    game.appendChild(customDialog);

    customDialog.style.display = "none";
}

export function createUpgradeDialog (){
    customDialog = document.getElementById("upgrade");
    let div1 = document.createElement("div")
    let titleElement = document.createElement("h1");
    let textElement = document.createElement("p");

    titleElement.textContent = "Upgrade";
    textElement.textContent = "Veuillez choisir votre améloration";

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
    buttonLife.className = "upgradeButton"
    buttonLife.textContent = "+1 vie"
    buttonLife.setAttribute("data-selected", "false");
    buttonLife.appendChild(imgLife)
    div4.appendChild(buttonLife)  

    let buttonDamage = document.createElement("button")
    var imgDamage = document.createElement("img");
    imgDamage.src = "./assets/images/sword.png";
    buttonDamage.id = "damageButton"
    buttonDamage.className = "upgradeButton"
    buttonDamage.textContent = "+1 dégat"
    buttonDamage.setAttribute("data-selected", "false");
    buttonDamage.appendChild(imgDamage)
    div4.appendChild(buttonDamage)

    let buttonRegen = document.createElement("button")
    var imgRegen = document.createElement("img");
    imgRegen.src = "./assets/images/full_heart.png";
    buttonRegen.id = "regenButton"
    buttonRegen.className = "upgradeButton"
    buttonRegen.textContent = "full regen"
    buttonRegen.setAttribute("data-selected", "false");
    buttonRegen.appendChild(imgRegen)
    div4.appendChild(buttonRegen)

    let buttons = [buttonLife, buttonDamage, buttonRegen];

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

    let options = document.createElement("button")
    options.id = "optionButton"
    options.textContent = "Options"
    div4.appendChild(options)

    let controle = document.createElement("button")
    controle.id = "controleButton"
    controle.textContent = "Contrôle"
    div4.appendChild(controle)

    let audioContainer = document.createElement("div")
    audioContainer.id = "audioContainer"
    div4.appendChild(audioContainer)
    
    let audioLabel = document.createElement("label")
    audioLabel.for = "audioButton"
    audioLabel.textContent = "Volume :"
    audioContainer.appendChild(audioLabel)

    let audio = document.createElement("input")
    audio.type = "range"
    audio.min = 0
    audio.max = 100
    audio.step = 1
    audio.value = 50
    audio.id = "audioButton"
    audio.textContent = "Audio"
    audioContainer.appendChild(audio)
    
    let difficulty = document.createElement("button")
    difficulty.id = "difficultyButton"
    difficulty.textContent = "Difficulté"
    div4.appendChild(difficulty)

    let theme = document.createElement("button")
    theme.id = "themeButton"
    theme.textContent = "Thème : " + game.dataset.theme;
    div4.appendChild(theme)

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
    resumeText.textContent = "Quitter le menu"
    resumeText.style.position = "absolute";
    resumeText.style.left = "150px";
    resumeText.style.top = (windowHeight - 40) + "px";
    resumeDiv.appendChild(resumeText)

    customDialog.style.display = "none";
}

export function createOptionsDialog (){
    customDialog = document.getElementById("options");
    let div1 = document.createElement("div")
    div1.id = "tabDiv"
    customDialog.appendChild(div1)


    let tabs = document.createElement("ul");
    tabs.classList.add = "tabs";

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
    tabControl.textContent = "Contrôle"

    tabs.appendChild(tabGeneral)
    tabs.appendChild(tabAudio)
    tabs.appendChild(tabControl)

    let divGeneral = document.createElement("div")
    divGeneral.textContent = "divGeneral"
    divGeneral.id = "general"
    divGeneral.classList.add("tab-content")
    divGeneral.classList.add("active")

    let divAudio = document.createElement("div")
    divAudio.textContent = "divAudio"
    divAudio.id = "audio"
    divAudio.classList.add("tab-content")

    let divControl = document.createElement("div")
    divControl.textContent = "Contrôles"
    divControl.id = "control"
    divControl.classList.add("tab-content")
    
    div1.appendChild(divGeneral)
    div1.appendChild(divAudio)
    div1.appendChild(divControl)


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
        upButton.disabled = false;
        upButton.addEventListener("keydown", function (event) {
            game.dataset.keyUp = event.key.toLowerCase();
            upButton.textContent = game.dataset.keyUp;
            upButton.disabled = true;
        })
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
        leftButton.disabled = false;
        leftButton.addEventListener("keydown", function (event) {
            game.dataset.keyLeft = event.key.toLowerCase();
            leftButton.textContent = game.dataset.keyLeft;
            leftButton.disabled = true;
        })
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
        downButton.disabled = false;
        downButton.addEventListener("keydown", function (event) {
            game.dataset.keyDown = event.key.toLowerCase();
            downButton.textContent = game.dataset.keyDown;
            downButton.disabled = true;
        })
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
        rightButton.disabled = false;
        rightButton.addEventListener("keydown", function (event) {
            game.dataset.keyRight = event.key.toLowerCase();
            rightButton.textContent = game.dataset.keyRight;
            rightButton.disabled = true;
        })
    })

    let tabArray = [tabAudio, tabControl, tabGeneral];

    tabArray.forEach((tab) => {
        tab.addEventListener("click", () => {
            tab.classList.add("active");

            let tabContent = document.getElementById(tab.dataset.tab)
            tabContent.classList.add("active");

            tabArray.forEach((otherTab) => {
                if (otherTab !== tab) {
                    let otherTabContent = document.getElementById(otherTab.dataset.tab)
                    otherTab.classList.remove("active");
                    otherTabContent.classList.remove("active");
                }
            });
        });
    });

    customDialog.style.width = "630px"
    customDialog.style.height = "430px"

    game.appendChild(customDialog);
    customDialog.style.display = "none";
}

/*
export function createStartDialog (){
    customDialog = document.getElementById("start");
    let div1 = document.createElement("div")
    let titleElement = document.createElement("h1");

    titleElement.textContent = "Menu";

    customDialog.appendChild(div1)
    div1.appendChild(titleElement)
    

    let div4 = document.createElement("div")
    div4.id = "menuDiv";
    customDialog.appendChild(div4)

    let controle = document.createElement("button")
    controle.id = "controleButton"
    controle.textContent = "Contrôle"
    div4.appendChild(controle)

    let audioContainer = document.createElement("div")
    audioContainer.id = "audioContainer"
    div4.appendChild(audioContainer)
    
    let audioLabel = document.createElement("label")
    audioLabel.for = "audioButton"
    audioLabel.textContent = "Volume :"
    audioContainer.appendChild(audioLabel)

    let audio = document.createElement("input")
    audio.type = "range"
    audio.min = 0
    audio.max = 100
    audio.step = 1
    audio.value = 50
    audio.id = "audioButton"
    audio.textContent = "Audio"
    audioContainer.appendChild(audio)
    
    let difficulty = document.createElement("button")
    difficulty.id = "difficultyButton"
    difficulty.textContent = "Difficulté"
    div4.appendChild(difficulty)

    let theme = document.createElement("button")
    theme.id = "themeButton"
    theme.textContent = "Thème : " + game.dataset.theme;
    div4.appendChild(theme)

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
    resume.style.top = (windowHeight - 50) + "px";
    //resume.style.width = "126px";
    resumeDiv.appendChild(resume)

    let resumeText = document.createElement("p")
    resumeText.textContent = "Quitter le menu"
    resumeText.style.position = "absolute";
    resumeText.style.left = "150px";
    resumeText.style.top = (windowHeight - 40) + "px";
    resumeDiv.appendChild(resumeText)

    customDialog.style.display = "none";
}
*/

//TODO un menu option
//un menu de démarrage

export function activeButton(){
    let logButton = document.getElementById("logButton")
    let restartButton = document.getElementById("restartButton")
    let validButton = document.getElementById("validButton")
    let themeButton = document.getElementById("themeButton")
    let optionButton = document.getElementById("optionButton")

    if(logButton !== null){
        logButton.addEventListener("click", () => {           
            const playerName = document.getElementById("playerName");
            let scoreText = document.getElementById("score");
            // Créez un objet FormData vide
            const formData = new FormData();

            // Ajoutez vos valeurs au FormData
            formData.append('filePath', filepath);
            formData.append('name', playerName.value.toUpperCase());
            formData.append('score', scoreText.dataset.score);

            // URL du script PHP sur votre serveur
            const urlAvecParametres = `${apiURL}`;
            
            axios.post(urlAvecParametres, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data', // Définissez le type de contenu comme "multipart/form-data"
                },
                timeout: 10000, // 10 secondes
              })
            .then(response => {
              // Traitement de la réponse ici
            })
            .catch(error => {
                location.reload();
            });

           

        });
    }

    if(restartButton !== null){
        restartButton.addEventListener("click", () => {
            location.reload();
        });
    }

    if(validButton !== null){
        validButton.addEventListener("click", () => {
            let lifeButton = document.getElementById("lifeButton")
            let damageButton = document.getElementById("damageButton")
            let regenButton = document.getElementById("regenButton")

            if (lifeButton.getAttribute("data-selected") === "true") {
                let player = document.getElementById("player")
 
                player.dataset.initialLife = parseInt(player.dataset.initialLife) + 1;
                player.dataset.life = parseInt(player.dataset.life) + 1;


                let hp = document.getElementById("hp");
                hp.style.width = 20 * player.dataset.initialLife + "px";

                let imageHeart = document.createElement("img");
                imageHeart.src = "./assets/images/full_heart.png";
                imageHeart.className = "heart";
                imageHeart.id = "heart" + parseInt(player.dataset.initialLife - 1);
                hp.appendChild(imageHeart);


                lifeButton.setAttribute("data-selected", "false");
                lifeButton.classList.remove("selected");
                document.getElementById("upgrade").style.display = "none";
            }
        
            if (damageButton.getAttribute("data-selected") === "true") {
                let player = document.getElementById("player")

                player.dataset.damage = parseInt(player.dataset.damage) + 1;
                
                damageButton.setAttribute("data-selected", "false");
                damageButton.classList.remove("selected");
                document.getElementById("upgrade").style.display = "none";
            }
        
            if (regenButton.getAttribute("data-selected") === "true") {
                let player = document.getElementById("player")

                player.dataset.life = player.dataset.initialLife
                
                regenButton.setAttribute("data-selected", "false");
                regenButton.classList.remove("selected");
                document.getElementById("upgrade").style.display = "none";
            }
            
        });
    }

    /*if(resumeButton !== null){
        resumeButton.addEventListener("click", () => {
            let player = document.getElementById("player");
            let dialog = document.getElementById("escape");

            player.dataset.isGamePaused = false
            dialog.style.display = "none";
            
        });
    }*/
    
    
    if(optionButton !== null){
        optionButton.addEventListener("click", () => {
            let customDialog = document.getElementById("options");
            customDialog.style.display = "block";
        });
    }

    if(themeButton !== null){
        themeButton.addEventListener("click", () => {
            let map = document.getElementById("map")
            let vagues = document.getElementById("vagues")
            let buttons = document.querySelectorAll('button'); 
            let dialogs = document.getElementsByClassName("dialog")
            //let audioButton = document.getElementsByClassName("audioButton")
            
            //let map = document.getElementById("map")
            if(game.dataset.theme == "light"){
                map.style.backgroundColor = "black"
                vagues.style.color = "white"
                game.dataset.theme = "dark";

                Array.from(dialogs).forEach(dialog => {
                    dialog.style.backgroundColor = "#666666"
                    dialog.style.color = "#ffffff"
                })

                buttons.forEach(button => {
                    button.style.backgroundColor = "#444444"
                    button.style.color = "#ffffff"
                })


            } else if(game.dataset.theme == "dark") {
                map.style.backgroundColor = "white"
                vagues.style.color = "black"
                game.dataset.theme = "light";

                Array.from(dialogs).forEach(dialog => {
                    dialog.style.backgroundColor = "#ffffff"
                    dialog.style.color = "black"
                })

                buttons.forEach(button => {
                    button.style.backgroundColor = "white"
                    button.style.color = "black"
                })
            }
            themeButton.textContent = "Thème : " + game.dataset.theme;
            document.getElementById("imagePlayer").src = "./assets/images/player_" + game.dataset.theme + ".png";
        });

    }


}
