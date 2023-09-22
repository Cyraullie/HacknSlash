document.addEventListener("DOMContentLoaded", function() {

    var persoHitbox = document.getElementById("perso");
    var persoImage = persoHitbox.querySelector("img");
    var map = document.getElementById("game");

    const playerHeight = 50;
    const playerWidth = 20;

    // Récupérez la taille de la fenêtre
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    var speed = 5; // Vitesse de déplacement

    let positionX = windowWidth / 2; // Position initiale de l'image en X
    let positionY = windowHeight / 2; // Position initiale de l'image en Y
    let targetX = positionX; // Position cible en X
    let targetY = positionY; // Position cible en Y

    // TODO faire en sorte que le personnage apparaisse au millieu de la salle
    persoHitbox.style.top = positionX + "px";
    persoHitbox.style.left = positionY + "px";

    persoImage.style.width = playerWidth + "px";
    persoImage.style.height = playerHeight + "px";

    map.style.width = windowWidth + "px";
    map.style.height = windowHeight + "px";



    function movePlayer() {
        const stepX = (targetX - positionX);
        const stepY = (targetY - positionY);
        positionX += stepX;
        positionY += stepY;

        persoHitbox.style.left = positionX + "px";
        persoHitbox.style.top = positionY + "px";

        if (Math.abs(targetX - positionX) > 1 || Math.abs(targetY - positionY) > 1) {
            requestAnimationFrame(movePlayer);
        }
    }    
    
    document.addEventListener("keydown", function(event) 
    {
        if(event.key === "w" && targetY > 0) { targetY = positionY - speed; }
        if(event.key === "a" && targetX > 0) { targetX = positionX - speed; }
        if(event.key === "s" && targetY < windowHeight - playerHeight) { targetY = positionY + speed; }
        if(event.key === "d" && targetX < windowWidth - playerWidth) { targetX = positionX + speed; }

        requestAnimationFrame(movePlayer);
    });
});



/*
var verification = setInterval(function(){
    var persoHitboxTop = parseInt(window.getComputedStyle(persoHitbox).getPropertyValue("top"))
    var obstaclesLeft = parseInt(window.getComputedStyle(obstacles).getPropertyValue("left"))
    if(obstaclesLeft<20 && obstaclesLeft>0 && persoHitboxTop>=130){
        obstacles.style.animation = "none";
        //alert("Looser")
    }
},1)*/