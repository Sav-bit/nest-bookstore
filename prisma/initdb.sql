-- CREATE DATABASE IF NOT EXISTS bookstore;
-- USE bookstore;

-- MySQL dump 10.13  Distrib 8.0.33, for Linux (x86_64)
--
-- Host: localhost    Database: bookstore
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Author`
--

DROP TABLE IF EXISTS `Author`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Author` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bio` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Author`
--

LOCK TABLES `Author` WRITE;
/*!40000 ALTER TABLE `Author` DISABLE KEYS */;
INSERT INTO `Author` VALUES (1,'David Foster Wallace','Some guy with a bandana'),(2,'Albert Camus','Coolest writer ever, not just because he\'s my favorite tho!'),(3,'Jane Austen',NULL),(4,'Ernest Hemingway','Really, he was a tough guy!'),(6,'Voltaire',NULL),(15,'Ray Bradbury','Did you know that Ray is the short for Raymond?'),(16,'J. R. R. Tolkien',NULL),(17,'Italo Calvino','Shoot, I just realized i haven\'t put any italian writer in the system!');
/*!40000 ALTER TABLE `Author` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Book`
--

DROP TABLE IF EXISTS `Book`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Book` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stockCount` int NOT NULL DEFAULT '0',
  `authorId` int NOT NULL,
  `publishedYear` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Book_authorId_fkey` (`authorId`),
  CONSTRAINT `Book_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `Author` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Book`
--

LOCK TABLES `Book` WRITE;
/*!40000 ALTER TABLE `Book` DISABLE KEYS */;
INSERT INTO `Book` VALUES (1,'Infinite jest','An incredibly looooong book',4,1,1996),(2,'The broom of the system','First novel of DFW, how cool!',2,1,NULL),(4,'The Plague','How did Camus predict so well our behavior during covid?',4,2,1947),(5,'Pride and prejudice','Damn mr Darcy, chill!',6,3,1813),(6,'Candid',NULL,6,6,2023),(7,'Myth of Sysyphus',NULL,2,2,NULL),(8,'The Hobbit','Am I being pretentious if I say that the book is better? I mean, why did they put Legolas in the movie?',5,16,1937),(14,'Fahrenheit 451','Gosh it\'s really hard to spell the word fahrenheit, I had to search it on Google!',2,15,1953),(15,'A Moveable Feast','Let\'s hope that the author with id 4 is Hemingway!',6,4,1964),(18,'The Silmarillion',NULL,1,16,1977);
/*!40000 ALTER TABLE `Book` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('1c8d692c-f7c2-480d-98a3-d1418726aee5','98b69dcb2c28e5bbe109172effa02ec55af2108a902ed613da53fb879b46fcd5','2023-07-22 08:07:34.272','20230722080734_change_type_published_year',NULL,NULL,'2023-07-22 08:07:34.213',1),('2b09c612-a494-4690-8e70-3adc81a12af8','b525057e66d55a1db185fb8ed1b6dc1deafe159d73594693d973202fa28be617','2023-07-17 13:27:38.594','20230717132738_init',NULL,NULL,'2023-07-17 13:27:38.410',1),('5a190a32-41e2-48eb-8304-02f2ffb76325','6ff026890c6cde93f8703879cdfe4cd9cae485166585592d4ee601fe0150e3c8','2023-07-17 14:06:32.347','20230717140632_change_on_cascade',NULL,NULL,'2023-07-17 14:06:32.242',1),('5d8e1e58-ef8d-4e1a-86d8-4a8a53721b44','301a7f071be88cbd2090e951cca712f6d0e3965836cd196e3a18fc62e03616f0','2023-07-17 14:05:44.282','20230717140544_init',NULL,NULL,'2023-07-17 14:05:44.143',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-08-06 16:25:40
