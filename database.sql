/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.11-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: concert_booking
-- ------------------------------------------------------
-- Server version	10.11.11-MariaDB-0+deb12u1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `concert_info`
--

DROP TABLE IF EXISTS `concert_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `concert_info` (
  `concert_id` int(11) NOT NULL AUTO_INCREMENT,
  `concert_name` varchar(100) DEFAULT NULL,
  `concert_artist` varchar(50) DEFAULT NULL,
  `concert_venue` varchar(100) DEFAULT NULL,
  `concert_timeshow` datetime DEFAULT NULL,
  PRIMARY KEY (`concert_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `concert_info`
--

LOCK TABLES `concert_info` WRITE;
/*!40000 ALTER TABLE `concert_info` DISABLE KEYS */;
INSERT INTO `concert_info` VALUES
(1,'Prayuth New Single','Prayuth Chan O\'Cha','Moon shadowing the world','2025-01-01 15:00:00'),
(2,'Prawit Crybady','Prawit Wongsuwan','Thai Army','2025-02-02 10:00:00'),
(3,'Tew And His Back','Tew','Pachcharath','2025-02-23 02:34:00');
/*!40000 ALTER TABLE `concert_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `concert_seat`
--

DROP TABLE IF EXISTS `concert_seat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `concert_seat` (
  `concert_id` int(11) NOT NULL,
  `seat_type_id` int(11) NOT NULL,
  `seat_start` int(11) DEFAULT NULL,
  `seat_end` int(11) DEFAULT NULL,
  `seat_available` int(11) DEFAULT NULL,
  PRIMARY KEY (`concert_id`,`seat_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `concert_seat`
--

LOCK TABLES `concert_seat` WRITE;
/*!40000 ALTER TABLE `concert_seat` DISABLE KEYS */;
INSERT INTO `concert_seat` VALUES
(2,1,1,20,19),
(2,2,21,40,20),
(2,3,41,100,57),
(3,4,1,100,95),
(3,5,101,200,100);
/*!40000 ALTER TABLE `concert_seat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `customer_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `id` char(13) DEFAULT NULL,
  `passport` char(9) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`customer_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES
(1,'Folk Song','2000-01-01','folk@gmail.com','1000000000000',NULL,'$2b$10$pCU94IYsoh5Q/KX6/h20x.oUmEFuLnTlx3eoWYGISDRf10Q/1XsRi'),
(2,'Seksun Chareonkitmongkon','2004-11-24','seksun@gmail.com',NULL,'AD3938483','$2b$10$cW6tmIjxdHNKF/Rvj1Y7tuDmazp.orxMUGSQM.bwf/OqwOTX4Xpry');
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `customer_id` int(11) NOT NULL,
  `concert_id` int(11) NOT NULL,
  `seat_no` int(11) NOT NULL,
  `datetime` datetime DEFAULT NULL,
  PRIMARY KEY (`customer_id`,`concert_id`,`seat_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES
(1,2,1,'2025-04-09 18:21:00'),
(1,2,50,'1111-11-11 04:28:56'),
(1,3,6,'2025-05-10 04:50:00'),
(1,3,51,'1111-11-11 04:28:56'),
(1,3,100,'2025-04-09 18:21:00'),
(2,2,51,'1111-11-11 04:28:56'),
(2,2,100,'2025-04-09 18:22:00'),
(2,3,1,'2025-05-01 16:04:00'),
(2,3,50,'1111-11-11 04:28:56');
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reserved_seat`
--

DROP TABLE IF EXISTS `reserved_seat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `reserved_seat` (
  `concert_id` int(11) NOT NULL,
  `seat_no` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`concert_id`,`seat_no`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `reserved_seat_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reserved_seat`
--

LOCK TABLES `reserved_seat` WRITE;
/*!40000 ALTER TABLE `reserved_seat` DISABLE KEYS */;
INSERT INTO `reserved_seat` VALUES
(2,1,1),
(2,50,1),
(3,6,1),
(3,51,1),
(3,100,1),
(2,51,2),
(2,100,2),
(3,1,2),
(3,50,2);
/*!40000 ALTER TABLE `reserved_seat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seat_type`
--

DROP TABLE IF EXISTS `seat_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `seat_type` (
  `seat_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(50) DEFAULT NULL,
  `price` decimal(8,3) DEFAULT NULL,
  PRIMARY KEY (`seat_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seat_type`
--

LOCK TABLES `seat_type` WRITE;
/*!40000 ALTER TABLE `seat_type` DISABLE KEYS */;
INSERT INTO `seat_type` VALUES
(1,'Front',5000.000),
(2,'Middle',2500.000),
(3,'Stand',1250.000),
(4,'Sleep',100.000),
(5,'Sit Down Please',2.390);
/*!40000 ALTER TABLE `seat_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket`
--

DROP TABLE IF EXISTS `ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket` (
  `ticket_id` int(11) NOT NULL AUTO_INCREMENT,
  `concert_name` varchar(100) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `venue` varchar(100) DEFAULT NULL,
  `seat` varchar(10) DEFAULT NULL,
  `timeshow` datetime DEFAULT NULL,
  `purchase_datetime` datetime DEFAULT NULL,
  PRIMARY KEY (`ticket_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket`
--

LOCK TABLES `ticket` WRITE;
/*!40000 ALTER TABLE `ticket` DISABLE KEYS */;
INSERT INTO `ticket` VALUES
(1,'Tew And His Back','Folk Song','Pachcharath','1','2025-02-22 19:34:00','2025-04-10 01:17:08'),
(2,'Prawit Crybady','Folk Song','Thai Army','1','2025-02-02 03:00:00','2025-04-10 01:21:22'),
(3,'Tew And His Back','Folk Song','Pachcharath','100','2025-02-22 19:34:00','2025-04-10 01:21:55'),
(4,'Prawit Crybady','Seksun Chareonkitmongkon','Thai Army','100','2025-02-02 03:00:00','2025-04-10 01:22:35'),
(5,'Tew And His Back','Folk Song','Pachcharath','100','2025-02-22 19:34:00','2025-04-10 01:43:13'),
(6,'Prawit Crybady','Folk Song','Thai Army','50','2025-02-02 03:00:00','2025-04-10 01:48:50'),
(7,'Tew And His Back','Folk Song','Pachcharath','51','2025-02-22 19:34:00','2025-04-10 01:49:10'),
(8,'Prawit Crybady','Seksun Chareonkitmongkon','Thai Army','51','2025-02-02 03:00:00','2025-04-10 01:49:42'),
(9,'Tew And His Back','Seksun Chareonkitmongkon','Pachcharath','50','2025-02-22 19:34:00','2025-04-10 01:49:55'),
(10,'Tew And His Back','Folk Song','Pachcharath','6','2025-02-22 19:34:00','2025-04-10 11:52:09');
/*!40000 ALTER TABLE `ticket` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-10 12:40:06
