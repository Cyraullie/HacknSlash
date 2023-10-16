import { windowHeight, windowWidth, playerHeight, playerWidth} from './data.js';

let map = document.getElementById("map");
let game = document.getElementById("game");

let life = 4;
let damage = 2;
let speedY = 5; // Vitesse de déplacement
let speedX = 5;

export function createPlayer() {
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

    const player = document.createElement("div");
    player.dataset.life = life;
    player.dataset.invincible = false;
    player.dataset.initialLife = life;
    player.dataset.damage = damage;
    player.dataset.speedX = speedX;
    player.dataset.speedY = speedY;
    player.dataset.isGamePaused = false;
    player.id = "player";

    player.dataset.movingUp = false
    player.dataset.movingDown = false
    player.dataset.movingLeft = false
    player.dataset.movingRight = false

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

    const initialX = (windowWidth) / 2;
    const initialY = (windowHeight) / 2;

    player.style.left = initialX + "px";
    player.style.top = initialY + "px";
    

    
function handlePlayerMovement() {
    //if(!isUpdated){
        /*if(!JSON.parse(player.dataset.isGamePaused)) {
            //if(isEnded == 0){
                const playerRect = player.getBoundingClientRect();
                //const mapRect = map.getBoundingClientRect()


            let test = windowWidth / windowHeight
            let speedX = player.dataset.speedY * test
            console.log(speedX)
    //TODO ajouter la limite de la map :)
    //TODO faire une seul variable pour la vitesse 
                var targetX = playerRect.left; // Position cible en X
                var targetY = playerRect.top; // Position cible en Y

                const deltaX = windowWidth * (!JSON.parse(player.dataset.movingLeft) - !JSON.parse(player.dataset.movingRight));
                const deltaY = windowHeight * (!JSON.parse(player.dataset.movingUp) - !JSON.parse(player.dataset.movingDown));
                
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                console.log(distance)
                let moveX = ((deltaX / distance) * speedX);
                let moveY = (deltaY / distance) * player.dataset.speedY;

                targetX += moveX;
                targetY += moveY;
    
                player.style.left = targetX + "px";
                player.style.top = targetY + "px";

            //}
        }*/
    //}
    //const mapRect = map.getBoundingClientRect()


    let test = windowWidth / windowHeight
    let speedX =  (speedY * windowWidth) / windowHeight;
    console.log(speedX)
    let interval = 30;

    let moveInterval = setInterval(function() {
        //if (!JSON.parse(player.dataset.isGamePaused)) {
            const playerRect = player.getBoundingClientRect();
          const deltaX = windowWidth * (!JSON.parse(player.dataset.movingLeft) - !JSON.parse(player.dataset.movingRight));
          const deltaY = windowHeight * (!JSON.parse(player.dataset.movingUp) - !JSON.parse(player.dataset.movingDown));
  
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          let moveX = (deltaX / distance) * speedX;
          let moveY = (deltaY / distance) * player.dataset.speedY;
            
          /*console.log(moveX)as
          console.log(moveY)*/
          var targetX = playerRect.left + moveX;
          var targetY = playerRect.top + moveY;
         /* console.log(targetX)
          console.log(targetY)*/
          player.style.left = targetX + "px";
          player.style.top = targetY + "px";
        //} else {
         //clearInterval(moveInterval);
        //}
      }, interval);
    }
    


    handlePlayerMovement();

    return player;
} 





