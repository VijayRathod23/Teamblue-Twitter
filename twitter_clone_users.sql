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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `activation_token` varchar(255) DEFAULT NULL,
  `activated` tinyint DEFAULT '0',
  `profile_pic` varchar(255) DEFAULT 'http://127.0.0.1:3000/profiles/default_profile.png',
  `dob` varchar(45) DEFAULT NULL,
  `bio` varchar(160) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (15,'khushi','khushi@123','$2a$10$zr.LPYfP8mUJgDPVy1VgeuMFsKoDfnK8rvPsBCllkdXAg7wByE7i2','hnvs2mbsmur',1,'http://127.0.0.1:3000/profiles/default_profile.png',NULL,NULL,NULL,'2023-03-15 12:26:15',NULL),(16,'jennie','jennie123@gmail.com','$2a$10$3Zswj9l9eiCB72vstDdJh.jGnDS327r5GJP1yFZo9yXN6decvevMq','gkmxbbp9o2',1,'http://127.0.0.1:3000/profiles/default_profile.png',NULL,NULL,NULL,'2023-03-15 12:38:59',NULL),(17,'khushi','khushi123@gmail.com','$2a$10$3UdUJ8jFDasEXvYyXMF21O0tj5.14mHAswg6rb7san0n6j93/88ru','0f3pz89hkdpv',1,'http://127.0.0.1:3000/profiles/default_profile.png',NULL,NULL,NULL,'2023-03-15 12:53:45',NULL),(18,'vijay2','vijay123@gmail.com','$2b$10$zgUKHsqUfPTUnFaa.D7p2e6E1ZT3R1BL3UCrasgWkWbF8H6sGA93K','tax0zipf4x',1,'http://127.0.0.1:3000/profiles/default_profile.png',NULL,NULL,NULL,'2023-03-16 03:59:44',NULL),(19,'om','om.modi@gmail.com','$2b$10$6n37RX6mliil76PBrdLY4.TXaXtEPsky0aBDaPSw2c7kGZlBn0lWq','a36xbg4zqu7',1,'http://127.0.0.1:3000/profiles/default_profile.png',NULL,NULL,NULL,'2023-03-16 07:00:46',NULL),(20,'Milan Chudasama','milan@gmail.com','$2b$10$Fl0F1bG1mP./AuUBO.CRd.MUho7y/Rq0IwLSv6qdq57ZByibRSkw2','t2eimizz5s',1,'http://127.0.0.1:3000/profiles/default_profile.png',NULL,NULL,NULL,'2023-03-16 09:51:01',NULL),(21,'pooja','jaini@gmail.com','$2b$10$5pSYXcPUjhdmfL9TdUWe2uQdjd01.7.KIFI5XZlnXAf5SOptpO.ZS','fqdy4nt5dee',1,'http://127.0.0.1:3000/profiles/1678971287415.png','4555-05-03','khushi','ahmedabad','2023-03-16 09:56:03',NULL),(22,'kinjal','kinjal@gmail.com','$2b$10$kDkHKTyl6pfU8vVw0y18lujI7mLaaAh55qjTycsDFxNjUe0p6FOUW','grismzl9qxg',1,'http://127.0.0.1:3000/profiles/default_profile.png',NULL,NULL,NULL,'2023-03-17 05:30:04',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-03-17 17:32:43
