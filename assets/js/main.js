import { initializeGameData } from './game.js';

document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener("keydown", function(event) {
        if (event.key === " ") {
          event.preventDefault(); // Empêche le comportement par défaut de la touche Espace
        }
    });

    //mettre en commentaire pour le dev
    /*document.addEventListener('contextmenu', function (event) {
      event.preventDefault();
    });*/
   

    initializeGameData();
});