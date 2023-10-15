<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Le script a été appelé avec une requête HTTP GET

    $route = $_GET["route"];
    
    switch ($route) {
        case "player" :
            $mysqli = mysqli_connect("localhost:3306", "gamer", "gamer", "game");

            if (!$mysqli) {
                die("Erreur de connexion : " . mysqli_connect_error());
            }

            $pseudo = $_GET["pseudo"];
            $result = mysqli_query($mysqli, "SELECT id, pseudo FROM `players` WHERE pseudo = '".$pseudo."'");
        
            $response[0] = "test";
            if ($result) {
                $i = 0;
                while ($row = mysqli_fetch_assoc($result)) {
                    $response[$i] = $row;
                    $i++;
                }

                mysqli_free_result($result);
            }
            mysqli_close($mysqli);

            header('Content-Type: application/json');
            echo json_encode($response);
            break;

        case "scoreboard" :
            $mysqli = mysqli_connect("localhost:3306", "gamer", "gamer", "game");

            if (!$mysqli) {
                die("Erreur de connexion : " . mysqli_connect_error());
            }
        
            $result = mysqli_query($mysqli, "SELECT pseudo, score FROM `scores` INNER JOIN players ON scores.players_id = players.id ORDER BY score DESC LIMIT 5");
        
            $response[0] = "";
            if ($result) {
                $i = 0;
                while ($row = mysqli_fetch_assoc($result)) {
                    $response[$i] = $row;
                    $i++;
                }
        
                mysqli_free_result($result);
            }
            mysqli_close($mysqli);

            header('Content-Type: application/json');
            echo json_encode($response);
            break;

        case "login" :
            $mysqli = mysqli_connect("localhost:3306", "gamer", "gamer", "game");

            if (!$mysqli) {
                die("Erreur de connexion : " . mysqli_connect_error());
            }

            $pseudo = $_GET["pseudo"];

            $stmt = $mysqli->prepare("INSERT INTO `players` (`id`, `pseudo`) VALUES (NULL, ?)");
            $response[0] = "test";
            if ($stmt) {
                $stmt->bind_param("s", $pseudo);
            
                if ($stmt->execute()) {

                    $id = $mysqli->insert_id;
                    $response[0] = $id;
                    $response[1] = $pseudo;

                    echo "Enregistrement inséré avec succès.";
                } else {
                    echo "Erreur lors de l'exécution de la requête : " . $stmt->error;
                }
            
                $stmt->close();
            } else {
                echo "Erreur de préparation de la requête : " . $mysqli->error;
            }

            mysqli_close($mysqli);
            
            header('Content-Type: application/json');
            echo json_encode($response);
            break;
        
        case "score" :
            $mysqli = mysqli_connect("localhost:3306", "gamer", "gamer", "game");

            if (!$mysqli) {
                die("Erreur de connexion : " . mysqli_connect_error());
            }

            $score = $_GET["score"];
            $player_id = $_GET["player_id"];

            $stmt = $mysqli->prepare("INSERT INTO `scores` (`id`, `score`, `players_id`) VALUES (NULL, ?, ?)");

            if ($stmt) {
                // Lier la variable $pseudo à la requête
                $stmt->bind_param("s", $score, $player_id);
            
                // Exécuter la requête
                if ($stmt->execute()) {
                    echo "Enregistrement inséré avec succès.";
                } else {
                    echo "Erreur lors de l'exécution de la requête : " . $stmt->error;
                }
            
                // Fermer la requête préparée
                $stmt->close();
            } else {
                echo "Erreur de préparation de la requête : " . $mysqli->error;
            }

            mysqli_close($mysqli);
            break;
    };
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {


}

?>

