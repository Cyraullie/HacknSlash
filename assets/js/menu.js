import { apiURL, windowHeight } from './data.js';
import axios from 'axios';
import { checkTheme, initializeGame, togglePauseGame } from './game.js';

var customDialog;
const game = document.getElementById("game");

export function displayGameOver(text1, text2, score) {
    let dialog = document.getElementById("gameOver");
    let scoreText = document.getElementById("score");
    let logButton = document.getElementById("logButton");
    scoreText.textContent = text1 + score + text2;
    scoreText.dataset.score = score;

    logButton.disabled = false
    dialog.style.display = "block";
}

export function displayUpgrade() {
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

    let resumeButton = document.createElement("button")
    resumeButton.id = "resumeRealButton"
    resumeButton.textContent = "Continuer"
    div4.appendChild(resumeButton)

    let options = document.createElement("button")
    options.id = "optionButton"
    options.textContent = "Options"
    div4.appendChild(options)

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

    let difficulty = document.createElement("button")
    difficulty.id = "difficultyButton"
    difficulty.textContent = "Difficulté"
    generalContainer.appendChild(difficulty)

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
        upButton.disabled = false;
        upButton.addEventListener("keydown", function (event) {
            game.dataset.keyUp = event.key.toLowerCase();
            localStorage.setItem("keyUp", event.key.toLowerCase())
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
            localStorage.setItem("keyLeft", event.key.toLowerCase())
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
            localStorage.setItem("keyDown", event.key.toLowerCase())
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
            localStorage.setItem("keyRight", event.key.toLowerCase())
            rightButton.textContent = game.dataset.keyRight;
            rightButton.disabled = true;
        })
    })

//end controle area

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

export function createStartDialog (){
    customDialog = document.getElementById("start");
    let div1 = document.createElement("div")
    let titleElement = document.createElement("h1");

    titleElement.textContent = "The Game";

    customDialog.appendChild(div1)
    div1.appendChild(titleElement)
    
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

    let options = document.createElement("button")
    options.id = "optionStartButton"
    options.textContent = "Options"
    div4.appendChild(options)

    let loginDiv = document.createElement("div")
    loginDiv.id = "loginDiv";
    loginDiv.style.marginTop = "10px";
    div4.appendChild(loginDiv)

    let loginInput = document.createElement("input")
    loginInput.id = "loginInput"
    loginInput.type = "text"
    loginInput.style.width = "190px"
    loginInput.style.marginTop = "20px"
    loginInput.placeholder = "Pseudo"
    if(localStorage.getItem("pseudo") != null){
        loginInput.value = localStorage.getItem("pseudo")

        let params = new URLSearchParams({ route: "player", pseudo: localStorage.getItem("pseudo")});
        let urlAvecParametres = `${apiURL}?${params}`;
        axios.get(urlAvecParametres)
        .then(response => {
            console.log(response)
            if(response.data != ""){
                localStorage.setItem("player_id", response.data[0]["id"])
            }
        })
        .catch(error => {
            console.error('Erreur :', error);
        });
    }

    loginDiv.appendChild(loginInput)

    let loginButton = document.createElement("button")
    loginButton.id = "loginButton"
    loginButton.textContent = "S'inscrire / Se connecter"
    loginDiv.appendChild(loginButton)

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
    let logButton = document.getElementById("logButton")
    let restartButton = document.getElementById("restartButton")
    let validButton = document.getElementById("validButton")
    let themeButton = document.getElementById("themeButton")
    let optionButton = document.getElementById("optionButton")
    let playButton = document.getElementById("playButton")
    let optionStartButton = document.getElementById("optionStartButton")
    let crossButton = document.getElementById("cross")
    let loginButton = document.getElementById("loginButton")
    let resumeRealButton = document.getElementById("resumeRealButton")

    if(logButton !== null){
        logButton.addEventListener("click", () => {         
            let score = document.getElementById("score").dataset.score;

            let params = new URLSearchParams({ route: "score", player_id: localStorage.getItem("player_id"), score: score});
            let urlAvecParametres = `${apiURL}?${params}`;
            console.log(urlAvecParametres)
            axios.get(urlAvecParametres)
            .then(response => {
                if(response.data != ""){
                    let params = new URLSearchParams({ route: "scoreboard" });
                    let urlAvecParametres = `${apiURL}?${params}`;
                    logButton.disabled = true
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

            if (lifeButton.getAttribute("data-selected") === "true") {
                let player = document.getElementById("player")
 
                player.dataset.initialLife = parseInt(player.dataset.initialLife) + 1;
                player.dataset.life = parseInt(player.dataset.life) + 1;


                let hp = document.getElementById("hp");
                hp.style.width = 20 * player.dataset.initialLife + "px";

                let imageHeart = document.createElement("img");
                imageHeart.src = "./assets/images/full_heart.png";
                imageHeart.classList.add("heart");
                imageHeart.id = "heart" + parseInt(player.dataset.initialLife - 1);
                hp.appendChild(imageHeart);


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
            let upButton = document.getElementById("upButton");
            let downButton = document.getElementById("downButton");
            let leftButton = document.getElementById("leftButton");
            let rightButton = document.getElementById("rightButton");

            dialog.style.display = "none"

            upButton.disabled = false;
            downButton.disabled = false;
            leftButton.disabled = false;
            rightButton.disabled = false;
        });
    }

    if(loginButton !== null){
        loginButton.addEventListener("click", () => {
            
            let pseudo = document.getElementById("loginInput");

            if(pseudo.value == ""){
                pseudo.style.color  = "red"
                setTimeout(() => {
                    pseudo.style.color  = "gray"
                }, 2000);
            }else {
                localStorage.setItem("pseudo", pseudo.value)

                let params = new URLSearchParams({ route: "player", pseudo: pseudo.value});
                let urlAvecParametres = `${apiURL}?${params}`;
                axios.get(urlAvecParametres)
                .then(response => {
                    console.log(response)
                    if(response.data != ""){
                        localStorage.setItem("player_id", response.data[0]["id"])
                        let play = document.getElementById("playButton")
                        play.disabled = false
                        
                    }else {
                        let params = new URLSearchParams({ route: "login", pseudo: pseudo.value });
                        let urlAvecParametres = `${apiURL}?${params}`;

                        axios.get(urlAvecParametres)
                        .then(response => {
                            localStorage.setItem("player_id", response.data[0])
                            let play = document.getElementById("playButton")
                            play.disabled = false
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
        });
    }


}
