GAME TEST

début du projet :
npm i


lancer le projet :
npx webpack serve

Vous pouvez ensuite aller sur :
localhost:8380
pour avoir la version de test


PARTIE POUR LE BACKEND PAS NECESSAIRE :
aller dans le dossier "./assets/php"
et lancer la commande :
php -S localhost:8280 


Pour lancer la version de production il suffit de faire :
npx webpack --config webpack.config.js
puis 
docker compose up --build -d

Pour générer l'application :
npm run build
