-- MySQL dump 10.13  Distrib 8.0.29, for Linux (x86_64)
--
-- Host: localhost    Database: twitter_clone
-- ------------------------------------------------------
-- Server version	8.0.32

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
-- Table structure for table `tweets`
--

DROP TABLE IF EXISTS `tweets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tweets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `tweet_text` varchar(255) DEFAULT NULL,
  `media` varchar(255) DEFAULT NULL,
  `username` varchar(45) DEFAULT NULL,
  `profile_pic` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `likes` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `tweets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tweets`
--

LOCK TABLES `tweets` WRITE;
/*!40000 ALTER TABLE `tweets` DISABLE KEYS */;
INSERT INTO `tweets` VALUES (1,24,'Hey How are you','http://127.0.0.1:3000/uploads/1679032741646.png','pooja',NULL,'2023-03-17 05:59:01',NULL,0),(2,24,'hello all how are you','http://127.0.0.1:3000/uploads/1679033003811.png','pooja',NULL,'2023-03-17 06:03:23',NULL,0),(3,24,'pooja','http://127.0.0.1:3000/uploads/1679033443993.png','pooja',NULL,'2023-03-17 06:10:43',NULL,0),(4,24,'helloo alll','http://127.0.0.1:3000/uploads/1679033820245.png','pooja','http://127.0.0.1:3000/profiles/default_profile.png','2023-03-17 06:17:00',NULL,0),(5,24,'helloo ahi','http://127.0.0.1:3000/uploads/1679034976196.png','pooja','http://127.0.0.1:3000/profiles/1679033867050.png','2023-03-17 06:36:16',NULL,0),(6,24,'','http://127.0.0.1:3000/uploads/1679035196994.png','pooja','http://127.0.0.1:3000/profiles/1679033867050.png','2023-03-17 06:39:56',NULL,0),(7,25,'hey i am vijay','http://127.0.0.1:3000/uploads/1679035233335.png','vijay','http://127.0.0.1:3000/profiles/default_profile.png','2023-03-17 06:40:33',NULL,1),(8,24,'hey i am pooja','http://127.0.0.1:3000/uploads/1679035346125.png','pooja','http://127.0.0.1:3000/profiles/1679033867050.png','2023-03-17 06:42:26',NULL,0),(9,25,'hey i am vijay','http://127.0.0.1:3000/uploads/1679035387515.png','vijay','http://127.0.0.1:3000/profiles/default_profile.png','2023-03-17 06:43:07',NULL,0),(10,24,'mantha how are you','http://127.0.0.1:3000/uploads/1679037065732.png','pooja','http://127.0.0.1:3000/profiles/1679033867050.png','2023-03-17 07:11:05',NULL,0),(11,24,'heyyy ',NULL,'pooja','http://127.0.0.1:3000/profiles/1679033867050.png','2023-03-17 08:22:51',NULL,0),(12,24,'hey how are you',NULL,'pooja','http://127.0.0.1:3000/profiles/1679033867050.png','2023-03-17 08:23:13',NULL,1),(13,24,'hey jaini','http://127.0.0.1:3000/uploads/1679041569132.png','pooja','http://127.0.0.1:3000/profiles/1679033867050.png','2023-03-17 08:26:09',NULL,0),(14,24,'good morning ',NULL,'pooja','http://127.0.0.1:3000/profiles/1679033867050.png','2023-03-17 08:26:27',NULL,1),(15,24,'how are you!',NULL,'pooja','http://127.0.0.1:3000/profiles/1679033867050.png','2023-03-17 09:06:45',NULL,2),(16,24,'hey omm',NULL,'pooja','http://127.0.0.1:3000/profiles/1679033867050.png','2023-03-17 09:22:08',NULL,8);
/*!40000 ALTER TABLE `tweets` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-03-18 12:59:39
