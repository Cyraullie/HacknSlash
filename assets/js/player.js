import { windowHeight, windowWidth, playerHeight, playerWidth} from './data.js';

let map = document.getElementById("map");
let game = document.getElementById("game");
let player;
let life = 4;
let damage = 3;
let speed = 5; // Vitesse de déplacement
let fireRate = 400;

export function createPlayer() {

    player = document.createElement("div");
    player.dataset.life = life;
    player.dataset.isDash = false;
    player.dataset.invincible = false;
    player.dataset.initialLife = life;
    player.dataset.damage = damage;
    player.dataset.speed = speed;
    player.dataset.initialSpeed = speed;
    player.dataset.fireRate = fireRate;
    player.id = "player";

    player.dataset.movingUp = false
    player.dataset.movingDown = false
    player.dataset.movingLeft = false
    player.dataset.movingRight = false

    const hp = document.createElement("div");
    hp.id = "hp"

    //hp.style.width = 20 * player.dataset.life + "px";
    let pvBar = document.createElement("div");
    pvBar.classList.add("pvBar")
    pvBar.id = "pvBar"

    let pvFull = document.createElement("div");
    pvFull.classList.add("pvFull")
    pvFull.id = "pvFull"

    let pvText = document.createElement("span")
    pvText.classList.add("pvText")
    pvText.id = "pvText"
    pvText.textContent = `${player.dataset.life} / ${player.dataset.initialLife} PV`;



    hp.appendChild(pvBar);
    hp.appendChild(pvText);
    pvBar.appendChild(pvFull);


    /* 
    for(let i = 0; i < player.dataset.life; i++){
        
        const imageHeart = document.createElement("img");
        imageHeart.src = "./assets/images/full_heart.png";
        imageHeart.className = "heart";
        imageHeart.id = "heart" + i;
        
    } */
    
    const imagePlayer = document.createElement("img");
    imagePlayer.id = "imagePlayer"
    imagePlayer.src = "./assets/images/player_" + game.dataset.theme + ".png";

    map.appendChild(player);
    //TODO pour jerem :)
    /*
    const jerem = document.createElement("div");
    jerem.id = "jerem"
    jerem.textContent = "Jeremy fait ton merge :)"
    jerem.style.color = "red"
    map.appendChild(jerem);*/
    
    map.appendChild(hp);
    
    // Définir la taille et la position initiale du joueur
    player.style.width = playerWidth + "px";
    player.style.height = playerHeight + "px";
    imagePlayer.style.width = playerWidth + "px";
    imagePlayer.style.height = playerHeight + "px";

    player.appendChild(imagePlayer);

    // Position initiale du joueur (au centre de la fenêtre)

    const initialX = Math.round((windowWidth) / 2);
    const initialY = Math.round((windowHeight) / 2);

    player.style.left = initialX + "px";
    player.style.top = initialY + "px";
    
function handlePlayerMovement() {
    if (!JSON.parse(game.dataset.isGamePaused)) {
        const playerRect = player.getBoundingClientRect();
        
        const deltaX = windowWidth * (!JSON.parse(player.dataset.movingLeft) - !JSON.parse(player.dataset.movingRight));
        const deltaY = windowHeight * (!JSON.parse(player.dataset.movingUp) - !JSON.parse(player.dataset.movingDown));

        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        let moveX;
        let moveY;

        if(JSON.parse(player.dataset.isDash)){
            moveX = (deltaX / distance) * (20 + parseInt(player.dataset.speed));
            moveY = (deltaY / distance) * (20 + parseInt(player.dataset.speed));
            player.dataset.invincible = true;

            setTimeout(() => {
                player.dataset.isDash = false;
                player.dataset.invincible = false;
            }, 100);
        } else {
            moveX = (deltaX / distance) * parseInt(player.dataset.speed);
            moveY = (deltaY / distance) * parseInt(player.dataset.speed);
        }

        var targetX = playerRect.left + moveX;
        var targetY = playerRect.top + moveY;

        if(
            targetY > 30 &&
            targetY < windowHeight - playerHeight - 10
        ) {
            player.style.top = targetY + "px";
        }

        if(
            targetX > 10 &&
            targetX < windowWidth - playerWidth - 10
        ) { 
            player.style.left = targetX + "px";
        }
    } 
    requestAnimationFrame(handlePlayerMovement);
}


    
    requestAnimationFrame(handlePlayerMovement);

    return player;
} 




