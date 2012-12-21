-- phpMyAdmin SQL Dump
-- version 3.3.9.2
-- http://www.phpmyadmin.net
--
-- Serveur: localhost
-- Généré le : Jeu 13 Décembre 2012 à 20:36
-- Version du serveur: 5.5.9
-- Version de PHP: 5.3.6

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- Base de données: `parisinsolite`
--

-- --------------------------------------------------------

--
-- Structure de la table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Contenu de la table `category`
--

INSERT INTO `category` VALUES(1, 'Restaurant');
INSERT INTO `category` VALUES(2, 'Musée');
INSERT INTO `category` VALUES(3, 'Promenade');

-- --------------------------------------------------------

--
-- Structure de la table `categorytolocal`
--

CREATE TABLE `categorytolocal` (
  `idcategory` int(11) NOT NULL,
  `idlocal` int(11) NOT NULL,
  UNIQUE KEY `lien` (`idcategory`,`idlocal`),
  KEY `idcategory` (`idcategory`),
  KEY `idlocal` (`idlocal`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `categorytolocal`
--

INSERT INTO `categorytolocal` VALUES(2, 2);
INSERT INTO `categorytolocal` VALUES(3, 1);

-- --------------------------------------------------------

--
-- Structure de la table `era`
--

CREATE TABLE `era` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Contenu de la table `era`
--

INSERT INTO `era` VALUES(1, 'Moyen-Âge');
INSERT INTO `era` VALUES(2, 'Renaissance');
INSERT INTO `era` VALUES(3, 'Années 2000');

-- --------------------------------------------------------

--
-- Structure de la table `eratolocal`
--

CREATE TABLE `eratolocal` (
  `idera` int(11) NOT NULL,
  `idlocal` int(11) NOT NULL,
  UNIQUE KEY `lien` (`idera`,`idlocal`),
  KEY `idera` (`idera`),
  KEY `idlocal` (`idlocal`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `eratolocal`
--

INSERT INTO `eratolocal` VALUES(1, 2);
INSERT INTO `eratolocal` VALUES(2, 2);
INSERT INTO `eratolocal` VALUES(3, 1);

-- --------------------------------------------------------

--
-- Structure de la table `local`
--

CREATE TABLE `local` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET latin1 NOT NULL,
  `image` varchar(100) CHARACTER SET latin1 NOT NULL,
  `description` text CHARACTER SET latin1 NOT NULL,
  `saviezvous` text NOT NULL,
  `hours` text CHARACTER SET latin1 NOT NULL,
  `telephone` int(11) NOT NULL,
  `address` text CHARACTER SET latin1 NOT NULL,
  `website` varchar(100) CHARACTER SET latin1 NOT NULL,
  `ticketprices` text CHARACTER SET latin1 NOT NULL,
  `longitude` double NOT NULL,
  `latitude` double NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Contenu de la table `local`
--

INSERT INTO `local` VALUES(1, 'Ballon Air de Paris', '', 'Survolez Paris à bord du plus grand ballon du monde. A 150 mètres d''altitude, découvrez la capitale comme vous ne l''avez jamais vue !', 'André Citroen est le fondateur de la celebre marque automobile francaise Citroen', '7 jours/7, de 9h à 17h15.', 144262000, 'Parc André Citroën 75015 Paris', 'http://www.ballondeparis.com/fr/', 'Adultes : 12€ le week-end et jours fériés/10 € les autres jours\r\n12/17 ans : 10 € le week-end et jours fériés/9 € les autres jours\r\n3/11 ans : 6 € le week-end et jours fériés/5 € les autres jours\r\nMoins de 3 ans : Gratuit', 2.275111, 48.840623);
INSERT INTO `local` VALUES(2, 'Le Manoir de Paris', '', 'Explorez la grotte du fantôme de l''opéra.\r\nLaissez-vous tenter par la tourte du boulanger sanglant.\r\nÉchappez au couteau du tueur à gages des Médicis...\r\nDécouvrez les légendes sombres de Paris !', '', 'Vendredi : 18h-22h\r\nSamedi et Dimanche : 15h-19h', 0, '18, rue de Paradis - 75010 Paris 10ème', 'http://lemanoirdeparis.fr/accueil/', 'Entrée : 20€ \r\nTarif réduit (-18 ans, étudiants, chômeurs) : 18€\r\nTarif enfant (10-15 ans) : 15€', 48.8748, 2.35371);

-- --------------------------------------------------------

--
-- Structure de la table `theme`
--

CREATE TABLE `theme` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Contenu de la table `theme`
--

INSERT INTO `theme` VALUES(1, 'Guerre');
INSERT INTO `theme` VALUES(2, 'Royauté');
INSERT INTO `theme` VALUES(3, 'Horreur');
INSERT INTO `theme` VALUES(4, 'Inclassable');

-- --------------------------------------------------------

--
-- Structure de la table `themetolocal`
--

CREATE TABLE `themetolocal` (
  `idtheme` int(11) NOT NULL,
  `idlocal` int(11) NOT NULL,
  UNIQUE KEY `lien` (`idtheme`,`idlocal`),
  KEY `idtheme` (`idtheme`),
  KEY `idlocal` (`idlocal`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `themetolocal`
--

INSERT INTO `themetolocal` VALUES(3, 2);
INSERT INTO `themetolocal` VALUES(4, 1);

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` varchar(8) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Contenu de la table `user`
--

INSERT INTO `user` VALUES(1, 'user@test.com', 'password');

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `categorytolocal`
--
ALTER TABLE `categorytolocal`
  ADD CONSTRAINT `categorytolocal_ibfk_5` FOREIGN KEY (`idcategory`) REFERENCES `category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `categorytolocal_ibfk_6` FOREIGN KEY (`idlocal`) REFERENCES `local` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `eratolocal`
--
ALTER TABLE `eratolocal`
  ADD CONSTRAINT `eratolocal_ibfk_1` FOREIGN KEY (`idera`) REFERENCES `era` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `eratolocal_ibfk_2` FOREIGN KEY (`idlocal`) REFERENCES `local` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `themetolocal`
--
ALTER TABLE `themetolocal`
  ADD CONSTRAINT `themetolocal_ibfk_5` FOREIGN KEY (`idtheme`) REFERENCES `theme` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `themetolocal_ibfk_6` FOREIGN KEY (`idlocal`) REFERENCES `local` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
