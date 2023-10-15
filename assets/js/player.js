import { windowHeight, windowWidth, playerHeight, playerWidth} from './data.js';

let map = document.getElementById("map");
let game = document.getElementById("game");

let life = 2;
let damage = 2;
let speedY = 5; // Vitesse de déplacement
let speedX = (speedY * windowWidth) / playerWidth;

export function createPlayer() {
    const player = document.createElement("div");
    player.dataset.life = life;
    player.dataset.invincible = false;
    player.dataset.initialLife = life;
    player.dataset.damage = damage;
    player.dataset.speedX = speedX;
    player.dataset.speedY = speedY;
    player.dataset.isGamePaused = false;
    player.id = "player";

    const hp = document.createElement("div");
    hp.id = "hp"

    hp.style.width = 20 * player.dataset.life + "px";

    for(let i = 0; i < player.dataset.life; i++){
        
        const imageHeart = document.createElement("img");
        imageHeart.src = "./assets/images/full_heart.png";
        imageHeart.className = "heart";
        imageHeart.id = "heart" + i;
        hp.appendChild(imageHeart);
    }
    
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

    const initialX = (windowWidth - playerWidth) / 2;
    const initialY = (windowHeight - playerHeight) / 2;

    player.style.left = initialX + "px";
    player.style.top = initialY + "px";
    return player;
} 
