CREATE DATABASE  IF NOT EXISTS `tiny_breaths` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `tiny_breaths`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: tiny_breaths
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `doctors`
--

DROP TABLE IF EXISTS `doctors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doctor_id` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `license_no` varchar(50) NOT NULL,
  `department` varchar(100) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `doctor_id` (`doctor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctors`
--

LOCK TABLES `doctors` WRITE;
/*!40000 ALTER TABLE `doctors` DISABLE KEYS */;
INSERT INTO `doctors` VALUES (1,'D12345','Stephen Strange','SORC-0616','Pediatrics','sorcerersupreme','2025-03-21 20:49:55','drstrange@gmail.com');
/*!40000 ALTER TABLE `doctors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maintable`
--

DROP TABLE IF EXISTS `maintable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maintable` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `stored_count_60s` smallint DEFAULT NULL,
  `prediction` text,
  `patient_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_maintable_patient` (`patient_id`),
  CONSTRAINT `fk_maintable_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1033 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintable`
--

LOCK TABLES `maintable` WRITE;
/*!40000 ALTER TABLE `maintable` DISABLE KEYS */;
INSERT INTO `maintable` VALUES (1006,'2025-03-24 11:42:40',10,'Bradypnea',1),(1007,'2025-03-24 11:43:40',22,'Bradypnea',1),(1008,'2025-03-24 11:42:40',10,'Bradypnea',1),(1009,'2025-03-24 11:43:40',22,'Bradypnea',1),(1010,'2025-03-24 11:43:40',22,'Bradypnea',1),(1011,'2025-03-24 11:44:45',7,'Bradypnea',1),(1012,'2025-03-25 01:18:31',11,'Bradypnea',1),(1013,'2025-03-24 11:50:30',9,'Bradypnea',1),(1014,'2025-03-25 01:22:33',34,'Normal',1),(1015,'2025-03-25 01:23:33',13,'Bradypnea',1),(1016,'2025-03-25 01:23:33',13,'Bradypnea',1),(1017,'2025-03-25 01:24:33',30,'Normal',1),(1018,'2025-03-25 01:25:33',27,'Bradypnea',1),(1019,'2025-03-25 01:26:33',45,'Normal',1),(1020,'2025-03-25 01:26:33',45,'Normal',1),(1021,'2025-03-25 01:27:33',10,'Bradypnea',1),(1022,'2025-03-25 01:28:33',6,'Bradypnea',1),(1023,'2025-03-30 06:44:24',28,'Bradypnea',1),(1024,'2025-03-30 06:48:49',18,'Bradypnea',1),(1025,'2025-03-30 06:54:02',19,'Bradypnea',1),(1026,'2025-03-30 06:56:02',56,'Normal',1),(1027,'2025-03-30 10:59:49',34,'Normal',1),(1028,'2025-03-30 13:13:48',35,'Normal',1),(1029,'2025-03-30 14:07:25',35,'Normal',1),(1030,'2025-03-30 14:08:25',1,'Bradypnea',1),(1031,'2025-03-30 14:09:25',24,'Bradypnea',1),(1032,'2025-03-30 14:10:25',8,'Bradypnea',1);
/*!40000 ALTER TABLE `maintable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patients`
--

DROP TABLE IF EXISTS `patients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `sex` enum('Male','Female') NOT NULL,
  `dob` datetime NOT NULL,
  `gestational_age` int NOT NULL,
  `gestational_unit` enum('days','weeks','months') NOT NULL,
  `category` enum('Well-Baby','NICU') NOT NULL,
  `birth_weight` float NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(20) DEFAULT 'admitted',
  `discharged_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patients`
--

LOCK TABLES `patients` WRITE;
/*!40000 ALTER TABLE `patients` DISABLE KEYS */;
INSERT INTO `patients` VALUES (1,'John Doe','Male','2023-01-01 10:00:00',38,'weeks','Well-Baby',3.2,'2025-03-21 13:47:01','admitted',NULL),(2,'Jinnie','Male','2024-09-09 20:30:00',3,'days','Well-Baby',4.75,'2025-03-21 13:56:21','admitted',NULL),(3,'Kahit Ano','Male','2025-03-25 18:07:00',90,'days','NICU',10,'2025-03-25 10:08:29','discharged','2025-03-30 18:02:59'),(4,'Test','Male','2025-03-27 01:01:00',4,'weeks','NICU',100,'2025-03-30 07:14:47','admitted',NULL),(5,'Name','Male','2025-03-24 11:01:00',4,'months','NICU',124,'2025-03-30 10:15:36','discharged','2025-03-30 18:16:55');
/*!40000 ALTER TABLE `patients` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-31  8:34:43
