import { windowHeight, windowWidth, monsterHeight, monsterWidth } from './data.js';

var monsterLife;

const map = document.getElementById("map");
var game = document.getElementById("game");

export function createMonster(life, monsterSpeed, damage, nbBoss = 1, isBoss = false) {
    if(life == 0){
        monsterLife = 1 * nbBoss;
    }else{
        monsterLife = life * nbBoss;
    }
    
    // Créez un élément div pour représenter le monstre
    const monster = document.createElement("div");
    monster.className = "monster"; // Appliquez des styles CSS pour le monstre
    monster.style.height = monsterHeight + "px";
    monster.style.width = monsterWidth + "px";
    monster.dataset.life = monsterLife * parseFloat(game.dataset.lifeMod);
    monster.dataset.damage = damage * parseInt(game.dataset.damageMod);
    monster.textContent = monsterLife * parseFloat(game.dataset.lifeMod);

    if(isBoss){
        monster.dataset.speed = monsterSpeed + (parseFloat(game.dataset.lifeMod) / 2);
    } else {
        monster.dataset.speed = monsterSpeed * parseFloat(game.dataset.lifeMod);
    }

    monster.style.color = "white";
    map.appendChild(monster);


    // Générez une position aléatoire sur le côté de la carte
    const side = Math.floor(Math.random() * 4); // 0: haut, 1: droite, 2: bas, 3: gauche
    let monsterX, monsterY;
    
    switch (side) {
        case 0: // Haut
            monsterX = Math.random() * (windowWidth - 50);
            monsterY = 30;
            break;
        case 1: // Droite
            monsterX = windowWidth - 50 - 10;
            monsterY = Math.random() * (windowHeight - 50);
            break;
        case 2: // Bas
            monsterX = Math.random() * (windowWidth - 50);
            monsterY = windowHeight - 50 - 10;
            break;
        case 3: // Gauche
            monsterX = 10;
            monsterY = Math.random() * (windowHeight - 50);
            break;
    }

    
    // Appliquez la position initiale du monstre
    monster.style.left = monsterX + "px";
    monster.style.top = monsterY + "px";

    map.appendChild(monster);

    function moveMonster() {
        var player = document.getElementById("player")
        const playerRect = player.getBoundingClientRect();
        const monsterRect = monster.getBoundingClientRect();

        
        if(!JSON.parse(game.dataset.isGamePaused)) {
            const deltaX = playerRect.left - monsterRect.left;
            const deltaY = playerRect.top - monsterRect.top;

            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            const moveX = (deltaX / distance) * monster.dataset.speed;
            const moveY = (deltaY / distance) * monster.dataset.speed;

            // Mettez à jour la position du monstre
            monsterX += moveX;
            monsterY += moveY;

            monster.style.left = monsterX + "px";
            monster.style.top = monsterY + "px";
        }
            requestAnimationFrame(moveMonster);
        

        // Vérifiez si le monstre a atteint le joueur
        if (
            playerRect.left < monsterRect.right &&
            playerRect.top < monsterRect.bottom &&
            playerRect.right > monsterRect.left &&
            playerRect.bottom > monsterRect.top 
        ) {
            if(!JSON.parse(game.dataset.isGamePaused)){
                if(!JSON.parse(player.dataset.invincible)){
                    // Le monstre a atteint le joueur, vous pouvez ajouter votre logique de jeu ici (par exemple, réduire la santé du joueur)
                    if(player.dataset.life - monster.dataset.damage >= 0){
                        player.dataset.life = player.dataset.life - monster.dataset.damage
                    } else {
                        player.dataset.life = 0;
                    }
                    let  imagePlayer = document.getElementById("imagePlayer");
                    
                    imagePlayer.src = "./assets/images/player_hurt.png";
                    player.dataset.invincible = true;
        
                    player.dataset.speed = parseInt(player.dataset.speed) * 2
                    setTimeout(() => {
                        imagePlayer.src = "./assets/images/player_" + game.dataset.theme + ".png";
                        player.dataset.invincible = false;
                        player.dataset.speed = parseInt(player.dataset.initialSpeed)
                    }, 1000);
                }
            }
           
            //monster.remove(); // Supprimez le monstre
        }
    }

    // Démarrez le mouvement du monstre
    requestAnimationFrame(moveMonster);
}
