//data.js
// taille de la map
export var windowWidth = window.innerWidth;
export var windowHeight = window.innerHeight;

// information du joueur
export var playerWidth = 20;
export var playerHeight = 50;

//info monstre
export const monsterHeight = 50;
export const monsterWidth = 50;

//gestion de fichier
var urlActuelle = window.location.href.slice(0, -5);
if(urlActuelle != "http://localhost:" || urlActuelle != "http://178.211.245.23:")
{
    urlActuelle = "http://178.211.245.23:"
}
console.log(urlActuelle)
//
export const filepath = "./../../score.txt";
export const apiURL = urlActuelle + "8280/api.php";

//music
export const musicPath = "./assets/sounds/main.mp3"