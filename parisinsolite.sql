-- phpMyAdmin SQL Dump
-- version 3.4.8
-- http://www.phpmyadmin.net
--
-- Host: mysql2
-- Generation Time: Jan 29, 2013 at 06:31 PM
-- Server version: 5.1.49
-- PHP Version: 5.3.6-11

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `apiparisinsolite_api`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE IF NOT EXISTS `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `name`) VALUES
(1, 'Restaurant'),
(2, 'Musée'),
(3, 'Promenade');

-- --------------------------------------------------------

--
-- Table structure for table `era`
--

CREATE TABLE IF NOT EXISTS `era` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `era`
--

INSERT INTO `era` (`id`, `name`) VALUES
(1, 'Moyen-Âge'),
(2, 'Renaissance'),
(3, 'Années 2000'),
(4, 'XX<sup>ème</sup> siècle');

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE IF NOT EXISTS `favorites` (
  `user` int(11) NOT NULL,
  `place` int(11) NOT NULL,
  PRIMARY KEY (`user`,`place`),
  KEY `user` (`user`),
  KEY `place` (`place`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `favorites`
--

INSERT INTO `favorites` (`user`, `place`) VALUES
(1, 1),
(1, 2),
(1, 4);

-- --------------------------------------------------------

--
-- Table structure for table `local`
--

CREATE TABLE IF NOT EXISTS `local` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `image` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `saviezvous` text NOT NULL,
  `hours` text NOT NULL,
  `telephone` varchar(14) NOT NULL,
  `address` text NOT NULL,
  `website` varchar(100) NOT NULL,
  `ticketprices` text NOT NULL,
  `longitude` double NOT NULL,
  `latitude` double NOT NULL,
  `category` int(10) NOT NULL,
  `era` int(10) NOT NULL,
  `theme` int(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idcategory` (`category`),
  KEY `idtheme` (`theme`),
  KEY `idera` (`era`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `local`
--

INSERT INTO `local` (`id`, `name`, `image`, `description`, `saviezvous`, `hours`, `telephone`, `address`, `website`, `ticketprices`, `longitude`, `latitude`, `category`, `era`, `theme`) VALUES
(1, 'Ballon Air de Paris', 'img/ballon-paris.jpg', 'Survolez Paris à bord du plus grand ballon du monde. A 150 mètres d''altitude, découvrez la capitale comme vous ne l''avez jamais vue !', 'André Citroen est le fondateur de la celebre marque automobile francaise Citroen', '7 jours/7, de 9h à 17h15.', '01 44 26 20 00', 'Parc André Citroën 75015 Paris', 'http://www.ballondeparis.com/fr/', 'Adultes : 12€ le week-end et jours fériés/10 € les autres jours\r\n12/17 ans : 10 € le week-end et jours fériés/9 € les autres jours\r\n3/11 ans : 6 € le week-end et jours fériés/5 € les autres jours\r\nMoins de 3 ans : Gratuit', 2.275111, 48.840623, 3, 1, 1),
(2, 'Le Manoir de Paris', 'img/manoir-paris.jpg', 'Explorez la grotte du fantôme de l''opéra.\r\nLaissez-vous tenter par la tourte du boulanger sanglant.\r\nÉchappez au couteau du tueur à gages des Médicis...\r\nDécouvrez les légendes sombres de Paris !', '', 'Vendredi : 18h-22h\r\nSamedi et Dimanche : 15h-19h', '0', '18, rue de Paradis - 75010 Paris 10ème', 'http://lemanoirdeparis.fr/accueil/', 'Entrée : 20€ \r\nTarif réduit (-18 ans, étudiants, chômeurs) : 18€\r\nTarif enfant (10-15 ans) : 15€', 2.35371, 48.8748, 2, 3, 3),
(3, 'La Lucha Libre', 'img/lucha-libre.jpg', 'L''unique resto-bar au monde équipé d''un ring de catch ! Avec le show des pros, le catch en mousse et les battle Djs.', '', 'Lun, Dim: Fermé\r\nMar - Sam: 17:00 - 2:00 ', '01 43 29 59 86', '10 rue de la montagne Sainte-Geneviève, à coté du M° Mauber mutualité, 75005 Paris ', 'www.laluchalibre.fr', '', 2.348638, 48.849037, 1, 3, 4),
(4, 'Dans le noir ?', 'img/dans-le-noir.jpg', 'Diner dans l''obscurité absolue guidé et servi par des non-voyants est une expérience unique qui change notre regard sur le monde en renversant les points de vue!', '', '', '01 42 77 98 04', '51, rue Quincampoix 75004 PARIS', 'http://paris.danslenoir.com', '', 2.350545, 48.861948, 1, 3, 4),
(5, 'Le Petit Resto dans la Prairie', 'img/resto-prairie.jpg', 'Une ferme en plein milieu de Paris vous propose un bon repas mijoté avec des produits du terroir, le tout dans une ambiance champêtre et conviviale.', 'Installez-vous dans le poulailler pour l''apéro, dans un box équestre pour le déjeuner, ou profitez de la vue sur la prairie pour le dîner... L''objectif est de vous mettre dans l''ambiance "Petite Maison de la Prairie", la célèbre série américaine.', 'Ouvert du Mardi au Samedi de 11h30 à 14h30 et de 19h à 23h. Brunch les Samedi et Dimanche de 12h à 16h. Fermé le Lundi.', '01 76 42 00 35', '9 bis Cour des Petites Ecuries - 75010 Paris 10ème', 'http://lepetitrestodanslaprairie.fr/', '', 48.872809, 2.3524752, 1, 4, 6),
(6, 'Les Deux Plateaux', 'img/deux-plateaux.jpg', 'Escaladez librement les colonnes en marbre de cette oeuvre d''art, qui ressemble à un échiquier géant...', 'Communément appelée "colonnes de Buren", cette œuvre d''art de Daniel Buren a été réalisée en 1986 dans la cour d''honneur du Palais-Royal. La légende dit que, si vous parvenez à atteindre la plus haute colonne avec une pièce de monnaie, votre voeu le plus cher se réalisera !', 'Tous les jours :\r\n<ul>\r\n<li>1er octobre - 31 mars : 7H30 - 20H30</li>\r\n<li>1er avril - 31 mai : 7H00 - 22H15</li>\r\n<li>1er juin - 31 août : 7H00 - 23H00</li>\r\n<li>1er septembre - 30 septembre : 7H00 - 21H30</li>\r\n</ul>\r\n<i>Horaires sous réserve et fonction de la saison. Évacuation du Domaine à compter d’une demi-heure avant l’heure de fermeture indiquée.</i>', '', '4 rue de Valois - Cour d’honneur du Palais Royal - 75001 Paris', 'http://palais-royal.monuments-nationaux.fr/', 'Gratuit', 48.8636008, 2.3370525, 2, 4, 5);

-- --------------------------------------------------------

--
-- Table structure for table `opinions`
--

CREATE TABLE IF NOT EXISTS `opinions` (
  `id_user` int(11) NOT NULL,
  `id_place` int(11) NOT NULL,
  `comment` varchar(255) CHARACTER SET utf8 NOT NULL,
  `grade` int(11) NOT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`id_user`,`id_place`),
  KEY `id_place` (`id_place`),
  KEY `id_user` (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `opinions`
--

INSERT INTO `opinions` (`id_user`, `id_place`, `comment`, `grade`, `date`) VALUES
(1, 2, 'A visiter d''urgence !', 2, '2013-01-09'),
(1, 4, 'Test', 3, '2013-01-29'),
(2, 1, '', 4, '2013-01-10'),
(2, 4, 'Très bon concept mais la nourriture pourrait être améliorée =)', 3, '2013-01-29'),
(3, 1, 'Super !', 2, '2013-01-28');

-- --------------------------------------------------------

--
-- Table structure for table `parcours`
--

CREATE TABLE IF NOT EXISTS `parcours` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(100) NOT NULL,
  `duration` time NOT NULL,
  `user` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user` (`user`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `parcours`
--

INSERT INTO `parcours` (`id`, `name`, `description`, `duration`, `user`) VALUES
(1, 'Mon parcours', 'Lorum Ipsum blablabla Lorum Ipsum blablabla Lorum Ipsum blablabla Lorum Ipsum blablabla Lorum Ipsum ', '01:30:00', 1),
(2, 'Mon Parcours 2', 'Parcours 2 Description ', '00:57:12', 1);

-- --------------------------------------------------------

--
-- Table structure for table `parcoursplaces`
--

CREATE TABLE IF NOT EXISTS `parcoursplaces` (
  `parcours` int(10) unsigned NOT NULL,
  `place` int(11) NOT NULL,
  `position` int(11) NOT NULL,
  PRIMARY KEY (`parcours`,`place`),
  KEY `place` (`place`),
  KEY `parcours` (`parcours`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `parcoursplaces`
--

INSERT INTO `parcoursplaces` (`parcours`, `place`, `position`) VALUES
(1, 1, 3),
(1, 2, 4),
(1, 3, 2),
(1, 4, 1),
(2, 1, 1),
(2, 3, 2);

-- --------------------------------------------------------

--
-- Table structure for table `theme`
--

CREATE TABLE IF NOT EXISTS `theme` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `theme`
--

INSERT INTO `theme` (`id`, `name`) VALUES
(1, 'Guerre'),
(2, 'Royauté'),
(3, 'Horreur'),
(4, 'Inclassable'),
(5, 'Art'),
(6, 'Télévision/Cinema');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` varchar(8) NOT NULL,
  `pseudo` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `pseudo`) VALUES
(1, 'user@test.com', 'password', 'User1'),
(2, 'user2@test.com', 'password', 'User2'),
(3, 'user3@test.com', 'password', 'User3');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`place`) REFERENCES `local` (`id`);

--
-- Constraints for table `local`
--
ALTER TABLE `local`
  ADD CONSTRAINT `local_ibfk_1` FOREIGN KEY (`category`) REFERENCES `category` (`id`),
  ADD CONSTRAINT `local_ibfk_2` FOREIGN KEY (`era`) REFERENCES `era` (`id`),
  ADD CONSTRAINT `local_ibfk_3` FOREIGN KEY (`theme`) REFERENCES `theme` (`id`);

--
-- Constraints for table `opinions`
--
ALTER TABLE `opinions`
  ADD CONSTRAINT `opinions_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `opinions_ibfk_2` FOREIGN KEY (`id_place`) REFERENCES `local` (`id`);

--
-- Constraints for table `parcours`
--
ALTER TABLE `parcours`
  ADD CONSTRAINT `parcours_ibfk_1` FOREIGN KEY (`user`) REFERENCES `user` (`id`);

--
-- Constraints for table `parcoursplaces`
--
ALTER TABLE `parcoursplaces`
  ADD CONSTRAINT `parcoursplaces_ibfk_1` FOREIGN KEY (`parcours`) REFERENCES `parcours` (`id`),
  ADD CONSTRAINT `parcoursplaces_ibfk_2` FOREIGN KEY (`place`) REFERENCES `local` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
