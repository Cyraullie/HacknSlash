-- init.sql
/*
CREATE USER 'gamer'@'%' IDENTIFIED BY 'gamer';
GRANT ALL PRIVILEGES ON *.* TO 'gamet'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;


SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `requests` (
  `request_id` int(10) NOT NULL,
  `rt_r_request_type_id` int(10) DEFAULT NULL,
  `r_rl_location_id` int(10) DEFAULT NULL,
  `request_libelle` varchar(100) NOT NULL,
  `request_desc` varchar(100) NOT NULL,
  `request_date_creation` datetime NOT NULL,
  `request_date_realisation_souhaitee` date DEFAULT NULL,
  `request_horaire_debut` datetime DEFAULT NULL,
  `request_horaire_fin` datetime DEFAULT NULL,
  `request_salle` varchar(100) NOT NULL,
  `request_file_description` varchar(255) NOT NULL,
  `request_bloque` tinyint(1) NOT NULL,
  `request_presence` tinyint(1) NOT NULL,
  `request_planned_date` datetime DEFAULT NULL,
  `r_u_user_id_created` int(10) DEFAULT NULL,
  `request_rapport_temps` time NOT NULL,
  `r_u_user_id_intervenant` int(11) NOT NULL,   -- permet d'assigner une demande à un intervenant
  `r_c_category_id_rapport` int(11) NOT NULL,
  `request_rapport_cout` float NOT NULL,
  `request_rapport_materiel` varchar(255) NOT NULL,
  `request_rapport_remarque` text NOT NULL,
  `request_rapport_creation_date` datetime NULL,
  `request_isactivate` tinyint(4) NOT NULL,
  `r_st_status_id` varchar(20) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `requests`
--

INSERT INTO `requests` (`request_id`, `rt_r_request_type_id`, `r_rl_location_id`, `request_libelle`, `request_desc`, 
`request_date_creation`, `request_date_realisation_souhaitee`, `request_horaire_debut`, `request_horaire_fin`, `request_salle`, 
`request_file_description`, `request_bloque`, `request_presence`, `r_u_user_id_created`, `request_rapport_temps`, `r_u_user_id_intervenant`, 
`r_c_category_id_rapport`, `request_rapport_cout`, `request_rapport_materiel`, `request_rapport_remarque`,`request_isactivate`,
`r_st_status_id`) VALUES
(1, 3, 2, 'changer luminaire', 'ampoule led 45w', '2022-06-12 14:20:00', '2022-12-12', '2022-12-12 14:20:00', '2022-12-12 15:20:00', '', '', 0, 1, 1, '00:00:00', 2, 0, 0, '', '', 1, 'TO_TREAT'),
(2, 2, 3, 'ecran cassé', 'ecran hp Compak cassé', '2021-10-11 14:20:00', '2021-10-18', '2021-10-18 14:20:00', '2021-10-18 15:20:00', '', '', 0, 1, 2, '00:00:00', 2, 0, 0, '', '', 1, 'TO_TREAT'),
(3, 1, 1, 'chaise cassée', 'remplacer chaise', '2021-10-11 14:20:00', '2021-10-18', '2021-10-18 14:20:00', '2021-10-18 15:20:00', '', '', 0, 1, 5, '00:00:00', 2, 0, 0, '', '', 1, 'DRAFT'),
(4, 1, 1, 'neon déféctueux', 'à remplacer', '2021-10-11 14:20:00', '2021-10-18', '2021-10-18 14:20:00', '2021-10-18 15:20:00', '', '', 0, 1, 5, '00:00:00', 4, 0, 0, '', '', 1, 'DRAFT'),
(5, 2, 1, 'pc à formater', 'pc à formater', '2021-10-11 14:20:00', '2021-10-18', '2021-10-18 14:20:00', '2021-10-18 15:20:00', '', '', 0, 1, 2, '00:00:00', 4, 0, 0, '', '', 1, 'DRAFT'),
(6, 2, 5, 'wc bouché', 'à réparer', '2021-10-11 14:20:00', '2021-10-18', '2021-10-18 14:20:00', '2021-10-18 15:20:00', '', '', 0, 1, 6, '00:00:00', 2, 0, 0, '', '', 1, 'TO_VALIDATE'),
(7, 2, 1, 'robinets fuites', 'à réparer', '2021-10-11 14:20:00', '2021-10-18', '2021-10-18 14:20:00', '2021-10-18 15:20:00', '', '', 0, 1, 6, '00:00:00', 5, 0, 0, '', '', 1, 'DONE_TO_EVALUATE'),
(8, 2, 2, 'lavabo cassé', 'à réparer', '2021-10-11 14:20:00', '2021-10-18', '2021-10-18 14:20:00', '2021-10-18 15:20:00', '', '', 0, 1, 6, '00:00:00', 5, 0, 0, '', '', 1, 'REFUSED'),
(9, 2, 1, 'ampoule', 'à remplacer', '2021-10-11 14:20:00', '2021-10-18', '2021-10-18 14:20:00', '2021-10-18 15:20:00', '', '', 0, 1, 6, '00:00:00', 4, 0, 0, '', '', 1, 'DONE'),
(10, 2,5, 'bureau desk', 'à changer', '2021-10-11 14:20:00', '2021-10-18', '2021-10-18 14:20:00', '2021-10-18 15:20:00', '', '', 0, 1, 6, '00:00:00', 3, 0, 0, '', '', 1, 'HOLD'),
(11, 2,6, 'portable hp', 'maj', '2021-10-11 14:20:00', '2021-10-18', '2021-10-18 14:20:00', '2021-10-18 15:20:00', '', '', 0, 1, 6, '00:00:00', 3, 0, 0, '', '', 1, 'ASSIGNED'),
(12, 2,6, 'led', 'à changer', '2021-10-11 14:20:00', '2021-10-18', '2021-10-18 14:20:00', '2021-10-18 15:20:00', '', '', 0, 1, 6, '00:00:00', 3, 0, 0, '', '', 1, 'PLANNED');

--
-- Index pour la table `requests`
--
ALTER TABLE `requests`
  ADD PRIMARY KEY (`request_id`),
  ADD FOREIGN KEY (`r_u_user_id_created`) REFERENCES users (`user_id`),
  ADD KEY `rt_r_request_type_id` (`rt_r_request_type_id`),
  ADD FOREIGN KEY (`r_rl_location_id`) REFERENCES request_locations(`request_location_id`),
 ADD FOREIGN KEY (`r_st_status_id`) REFERENCES request_status(`request_status_id`), -- request_status_id pas pk
  MODIFY `request_id` int(10) AUTO_INCREMENT, AUTO_INCREMENT=3;

-- -*/