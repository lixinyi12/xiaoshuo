-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: novel_db
-- ------------------------------------------------------
-- Server version	8.0.44

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
-- Table structure for table `application`
--

DROP TABLE IF EXISTS `application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `application` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键，自增',
  `user_id` int NOT NULL COMMENT '申请用户ID，外键关联 user 表',
  `real_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '真实姓名',
  `phone` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '手机号',
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '邮箱',
  `status` enum('待审核','通过','拒绝') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '待审核' COMMENT '状态：待审核/通过/拒绝',
  `reject_reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '拒绝原因（status=2时填写）',
  `apply_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '申请时间',
  `review_time` datetime DEFAULT NULL COMMENT '审核时间',
  `reviewer_id` int DEFAULT NULL COMMENT '审核管理员ID，外键 user 表',
  `id_card` varchar(18) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '身份证号',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `reviewer_id` (`reviewer_id`),
  CONSTRAINT `application_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `application_ibfk_2` FOREIGN KEY (`reviewer_id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='申请审核表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application`
--

LOCK TABLES `application` WRITE;
/*!40000 ALTER TABLE `application` DISABLE KEYS */;
INSERT INTO `application` VALUES (1,1,'qq','3452345','234124','通过',NULL,'2026-03-11 15:43:05','2026-03-12 09:36:23',1,'12342134');
/*!40000 ALTER TABLE `application` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `authors`
--

DROP TABLE IF EXISTS `authors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authors` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` int NOT NULL COMMENT '关联的用户ID',
  `real_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '真实姓名',
  `id_card` varchar(18) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '身份证号',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `pen_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '笔名（可选）',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`),
  UNIQUE KEY `uk_id_card` (`id_card`),
  CONSTRAINT `authors_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authors`
--

LOCK TABLES `authors` WRITE;
/*!40000 ALTER TABLE `authors` DISABLE KEYS */;
/*!40000 ALTER TABLE `authors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` text,
  `parent_id` int DEFAULT NULL,
  `sort_order` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'玄幻','玄幻大类',NULL,1,'2026-01-01 00:00:00'),(2,'仙侠','仙侠大类',NULL,2,'2026-01-01 00:00:00'),(3,'都市','都市大类',NULL,3,'2026-01-01 00:00:00'),(4,'历史','历史大类',NULL,4,'2026-01-01 00:00:00'),(5,'科幻','科幻大类',NULL,5,'2026-01-01 00:00:00'),(6,'东方玄幻','东方玄幻分支',1,1,'2026-01-01 00:00:00'),(7,'西方玄幻','西方玄幻分支',1,2,'2026-01-01 00:00:00'),(8,'异界大陆','异界大陆',1,3,'2026-01-01 00:00:00'),(9,'修真文明','修真文明',2,1,'2026-01-01 00:00:00'),(10,'神话修真','神话修真',2,2,'2026-01-01 00:00:00'),(11,'现代修真','现代修真',2,3,'2026-01-01 00:00:00'),(12,'都市生活','都市生活',3,1,'2026-01-01 00:00:00'),(13,'职场商战','职场商战',3,2,'2026-01-01 00:00:00'),(14,'校园青春','校园青春',3,3,'2026-01-01 00:00:00'),(15,'架空历史','架空历史',4,1,'2026-01-01 00:00:00'),(16,'古代穿越','古代穿越',4,2,'2026-01-01 00:00:00'),(17,'历史传记','历史传记',4,3,'2026-01-01 00:00:00'),(18,'星际未来','星际未来',5,1,'2026-01-01 00:00:00'),(19,'时空穿梭','时空穿梭',5,2,'2026-01-01 00:00:00'),(20,'机甲战争','机甲战争',5,3,'2026-01-01 00:00:00');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chapters`
--

DROP TABLE IF EXISTS `chapters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chapters` (
  `id` int NOT NULL,
  `novel_id` int DEFAULT NULL,
  `chapter_number` int DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `content` text,
  `word_count` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chapters`
--

LOCK TABLES `chapters` WRITE;
/*!40000 ALTER TABLE `chapters` DISABLE KEYS */;
INSERT INTO `chapters` VALUES (1,1,1,'第一章 觉醒','内容：主角觉醒了...',3500,'2026-01-01 10:00:00','2026-01-01 10:00:00'),(2,2,1,'第一章 入门','内容：主角开始修仙...',4200,'2026-01-02 11:00:00','2026-01-02 11:00:00'),(3,3,1,'第一章 入职','内容：主角入职新公司...',2800,'2026-01-03 12:00:00','2026-01-03 12:00:00'),(4,4,1,'第一章 穿越','内容：主角穿越到大唐...',5000,'2026-01-04 13:00:00','2026-01-04 13:00:00'),(5,5,1,'第一章 启航','内容：主角登上星舰...',3100,'2026-01-05 14:00:00','2026-01-05 14:00:00'),(6,6,1,'第一章 练武','内容：主角开始练武...',3800,'2026-01-06 15:00:00','2026-01-06 15:00:00'),(7,7,1,'第一章 神医','内容：主角获得医术传承...',2900,'2026-01-07 16:00:00','2026-01-07 16:00:00'),(8,8,1,'第一章 开学','内容：主角开学了...',2200,'2026-01-08 17:00:00','2026-01-08 17:00:00'),(9,9,1,'第一章 入朝','内容：主角入朝为官...',4700,'2026-01-09 18:00:00','2026-01-09 18:00:00'),(10,10,1,'第一章 入侵','内容：黑客入侵系统...',3300,'2026-01-10 19:00:00','2026-01-10 19:00:00'),(11,11,1,'第一章 陨落','内容：主角斗气丧失...',3600,'2026-01-11 20:00:00','2026-01-11 20:00:00'),(12,12,1,'第一章 山村','内容：主角在山村生活...',4000,'2026-01-12 21:00:00','2026-01-12 21:00:00'),(13,13,1,'第一章 赘婿','内容：主角成为赘婿...',4500,'2026-01-13 22:00:00','2026-01-13 22:00:00'),(14,14,1,'第一章 世子','内容：主角是北凉世子...',4800,'2026-01-14 23:00:00','2026-01-14 23:00:00'),(15,15,1,'第一章 科学边界','内容：纳米材料...',5200,'2026-01-15 08:00:00','2026-01-15 08:00:00'),(16,16,1,'第一章 笔记','内容：主角得到笔记...',3400,'2026-01-16 09:00:00','2026-01-16 09:00:00'),(17,17,1,'第一章 精绝古城','内容：胡八一的故事...',3900,'2026-01-17 10:00:00','2026-01-17 10:00:00'),(18,18,1,'第一章 穿越','内容：范闲穿越...',4100,'2026-01-18 11:00:00','2026-01-18 11:00:00'),(19,19,1,'第一章 退役','内容：叶修退役...',3000,'2026-01-19 12:00:00','2026-01-19 12:00:00'),(20,20,1,'第一章 值夜者','内容：克莱恩值夜...',4600,'2026-01-20 13:00:00','2026-01-20 13:00:00');
/*!40000 ALTER TABLE `chapters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment_likes`
--

DROP TABLE IF EXISTS `comment_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment_likes` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `comment_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment_likes`
--

LOCK TABLES `comment_likes` WRITE;
/*!40000 ALTER TABLE `comment_likes` DISABLE KEYS */;
INSERT INTO `comment_likes` VALUES (1,1,1,'2026-02-01 12:05:00'),(2,2,1,'2026-02-01 12:06:00'),(3,3,2,'2026-02-01 13:10:00'),(4,4,2,'2026-02-01 13:11:00'),(5,5,3,'2026-02-02 14:05:00'),(6,6,3,'2026-02-02 14:06:00'),(7,7,4,'2026-02-03 15:05:00'),(8,8,4,'2026-02-03 15:06:00'),(9,9,5,'2026-02-04 16:05:00'),(10,10,5,'2026-02-04 16:06:00'),(11,11,6,'2026-02-05 17:05:00'),(12,12,6,'2026-02-05 17:06:00'),(13,13,7,'2026-02-06 18:05:00'),(14,14,7,'2026-02-06 18:06:00'),(15,15,8,'2026-02-07 19:05:00'),(16,16,8,'2026-02-07 19:06:00'),(17,17,9,'2026-02-08 20:05:00'),(18,18,9,'2026-02-08 20:06:00'),(19,19,10,'2026-02-09 21:05:00'),(20,20,10,'2026-02-09 21:06:00');
/*!40000 ALTER TABLE `comment_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `novel_id` int DEFAULT NULL,
  `content` text,
  `created_at` datetime DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,3,1,'这本书太好看了！','2026-02-01 12:00:00',NULL),(2,5,1,'期待更新','2026-02-01 13:00:00',NULL),(3,2,2,'修仙文经典','2026-02-02 14:00:00',NULL),(4,7,3,'都市生活真实','2026-02-03 15:00:00',NULL),(5,1,4,'历史考究','2026-02-04 16:00:00',NULL),(6,8,5,'科幻设定新颖','2026-02-05 17:00:00',NULL),(7,10,6,'武打场面精彩','2026-02-06 18:00:00',NULL),(8,4,7,'医学知识专业','2026-02-07 19:00:00',NULL),(9,6,8,'青春回忆','2026-02-08 20:00:00',NULL),(10,9,9,'权谋深刻','2026-02-09 21:00:00',NULL),(11,11,1,'回复：确实好看','2026-02-01 12:30:00',1),(12,12,1,'回复：同求更新','2026-02-01 13:15:00',2),(13,13,2,'回复：经典+1','2026-02-02 14:20:00',3),(14,14,3,'回复：深有同感','2026-02-03 15:10:00',4),(15,15,4,'回复：作者厉害','2026-02-04 16:05:00',5),(16,16,5,'回复：科幻迷必看','2026-02-05 17:30:00',6),(17,17,6,'回复：动作描写一流','2026-02-06 18:20:00',7),(18,18,7,'回复：涨知识了','2026-02-07 19:45:00',8),(19,19,8,'回复：怀念校园','2026-02-08 20:10:00',9),(20,20,9,'回复：分析透彻','2026-02-09 21:30:00',10);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `novel_tags`
--

DROP TABLE IF EXISTS `novel_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `novel_tags` (
  `novel_id` int NOT NULL,
  `tag_id` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`novel_id`,`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `novel_tags`
--

LOCK TABLES `novel_tags` WRITE;
/*!40000 ALTER TABLE `novel_tags` DISABLE KEYS */;
INSERT INTO `novel_tags` VALUES (1,1,'2026-02-20 10:00:00'),(1,4,'2026-02-20 11:00:00'),(1,14,'2026-02-20 10:02:00'),(2,4,'2026-02-20 11:02:00'),(2,8,'2026-02-20 10:04:00'),(2,14,'2026-02-20 10:06:00'),(3,4,'2026-02-20 11:04:00'),(3,9,'2026-02-20 10:08:00'),(3,14,'2026-02-20 11:40:00'),(4,4,'2026-02-20 11:06:00'),(4,7,'2026-02-20 10:10:00'),(4,15,'2026-02-20 11:42:00'),(4,17,'2026-02-20 10:12:00'),(5,4,'2026-02-20 11:08:00'),(5,6,'2026-02-20 10:14:00'),(5,14,'2026-02-20 11:44:00'),(6,1,'2026-02-20 10:16:00'),(6,4,'2026-02-20 11:10:00'),(6,11,'2026-02-20 10:18:00'),(6,14,'2026-02-20 11:46:00'),(7,4,'2026-02-20 11:12:00'),(7,9,'2026-02-20 10:20:00'),(7,14,'2026-02-20 11:48:00'),(7,18,'2026-02-20 10:22:00'),(8,4,'2026-02-20 11:14:00'),(8,9,'2026-02-20 10:24:00'),(8,13,'2026-02-20 10:26:00'),(8,15,'2026-02-20 11:50:00'),(9,4,'2026-02-20 11:16:00'),(9,7,'2026-02-20 10:28:00'),(9,14,'2026-02-20 11:52:00'),(9,20,'2026-02-20 10:30:00'),(10,4,'2026-02-20 11:18:00'),(10,6,'2026-02-20 10:32:00'),(10,14,'2026-02-20 11:54:00'),(11,1,'2026-02-20 10:34:00'),(11,4,'2026-02-20 11:20:00'),(11,14,'2026-02-20 10:36:00'),(12,4,'2026-02-20 11:22:00'),(12,8,'2026-02-20 10:38:00'),(12,14,'2026-02-20 10:40:00'),(13,4,'2026-02-20 11:24:00'),(13,7,'2026-02-20 10:42:00'),(13,14,'2026-02-20 11:56:00'),(13,20,'2026-02-20 10:44:00'),(14,4,'2026-02-20 11:26:00'),(14,11,'2026-02-20 10:46:00'),(14,14,'2026-02-20 11:58:00'),(15,2,'2026-02-20 11:28:00'),(15,6,'2026-02-20 10:48:00'),(15,14,'2026-02-20 12:00:00'),(16,2,'2026-02-20 11:30:00'),(16,10,'2026-02-20 10:50:00'),(16,14,'2026-02-20 12:02:00'),(17,2,'2026-02-20 11:32:00'),(17,10,'2026-02-20 10:52:00'),(17,14,'2026-02-20 12:04:00'),(18,4,'2026-02-20 11:34:00'),(18,14,'2026-02-20 12:06:00'),(18,17,'2026-02-20 10:54:00'),(19,3,'2026-02-20 10:56:00'),(19,4,'2026-02-20 11:36:00'),(19,14,'2026-02-20 12:08:00'),(20,4,'2026-02-20 11:38:00'),(20,14,'2026-02-20 12:10:00'),(20,16,'2026-02-20 10:58:00');
/*!40000 ALTER TABLE `novel_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `novels`
--

DROP TABLE IF EXISTS `novels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `novels` (
  `id` int NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `word_count` int DEFAULT NULL,
  `hot` int DEFAULT NULL,
  `description` text,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `cover` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `novels`
--

LOCK TABLES `novels` WRITE;
/*!40000 ALTER TABLE `novels` DISABLE KEYS */;
INSERT INTO `novels` VALUES (1,'苍穹之上',1,1200000,8500,'一个少年的逆天之路','2026-01-01 10:00:00','2026-02-01 10:00:00','cover1.jpg'),(2,'修仙传',2,2500000,9200,'凡人修仙的故事','2026-01-02 11:00:00','2026-02-02 11:00:00','cover2.jpg'),(3,'都市风云',3,800000,4300,'职场斗争','2026-01-03 12:00:00','2026-02-03 12:00:00','cover3.jpg'),(4,'大唐明月',4,1500000,6700,'穿越唐朝','2026-01-04 13:00:00','2026-02-04 13:00:00','cover4.jpg'),(5,'星海征程',5,2000000,7800,'星际探险','2026-01-05 14:00:00','2026-02-05 14:00:00','cover5.jpg'),(6,'武动乾坤',6,3000000,9900,'武道巅峰','2026-01-06 15:00:00','2026-02-06 15:00:00','cover6.jpg'),(7,'绝世神医',7,1800000,5600,'医道高手','2026-01-07 16:00:00','2026-02-07 16:00:00','cover7.jpg'),(8,'校园那些事',8,600000,3200,'青春校园','2026-01-08 17:00:00','2026-02-08 17:00:00','cover8.jpg'),(9,'大明王朝',9,2200000,8100,'历史权谋','2026-01-09 18:00:00','2026-02-09 18:00:00','cover9.jpg'),(10,'黑客帝国',10,1100000,4900,'数字世界','2026-01-10 19:00:00','2026-02-10 19:00:00','cover10.jpg'),(11,'斗破苍穹',11,5000000,10000,'三十年河东三十年河西','2026-01-11 20:00:00','2026-02-11 20:00:00','cover11.jpg'),(12,'凡人修仙传',12,4500000,9800,'凡人流','2026-01-12 21:00:00','2026-02-12 21:00:00','cover12.jpg'),(13,'赘婿',13,3800000,9500,'商战权谋','2026-01-13 22:00:00','2026-02-13 22:00:00','cover13.jpg'),(14,'雪中悍刀行',14,4200000,9700,'江湖庙堂','2026-01-14 23:00:00','2026-02-14 23:00:00','cover14.jpg'),(15,'三体',15,900000,8800,'科幻巨著','2026-01-15 08:00:00','2026-02-15 08:00:00','cover15.jpg'),(16,'盗墓笔记',16,2100000,9100,'悬疑探险','2026-01-16 09:00:00','2026-02-16 09:00:00','cover16.jpg'),(17,'鬼吹灯',17,2300000,9000,'盗墓系列','2026-01-17 10:00:00','2026-02-17 10:00:00','cover17.jpg'),(18,'庆余年',18,3500000,9600,'穿越权谋','2026-01-18 11:00:00','2026-02-18 11:00:00','cover18.jpg'),(19,'全职高手',19,2800000,9301,'电竞','2026-01-19 12:00:00','2026-02-19 12:00:00','cover19.jpg'),(20,'诡秘之主',20,4000000,9900,'克苏鲁','2026-01-20 13:00:00','2026-02-20 13:00:00','cover20.jpg');
/*!40000 ALTER TABLE `novels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT '权限标识，如 novel:read',
  `resource` varchar(30) DEFAULT NULL COMMENT '资源类型，如 novel, comment',
  `action` varchar(30) DEFAULT NULL COMMENT '操作，如 create, read, update, delete',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='权限表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'novel:read','novel','read','阅读小说'),(2,'novel:create','novel','create','创建小说'),(3,'novel:edit_own','novel','edit','编辑自己的小说'),(4,'novel:edit_any','novel','edit','编辑任何小说'),(5,'novel:delete_own','novel','delete','删除自己的小说'),(6,'novel:delete_any','novel','delete','删除任何小说'),(7,'comment:create','comment','create','发表评论'),(8,'comment:delete_own','comment','delete','删除自己的评论'),(9,'comment:delete_any','comment','delete','删除任何评论'),(10,'comment:delete_on_own_novel','comment','delete','删除自己小说下的评论'),(11,'comment:like','comment','like','点赞评论'),(12,'favorite:add','favorite','add','收藏小说'),(13,'user:manage','user','manage','管理用户');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permissions` (
  `role_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`role_id`,`permission_id`),
  KEY `permission_id` (`permission_id`),
  CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='角色权限关联表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
INSERT INTO `role_permissions` VALUES (1,1),(2,1),(3,1),(2,2),(3,2),(2,3),(3,3),(3,4),(2,5),(3,5),(3,6),(1,7),(2,7),(3,7),(1,8),(2,8),(3,8),(3,9),(2,10),(3,10),(1,11),(2,11),(3,11),(1,12),(2,12),(3,12),(3,13);
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL COMMENT '角色名，如 reader, author, admin',
  `description` varchar(255) DEFAULT NULL COMMENT '角色描述',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='角色表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'reader','普通读者'),(2,'author','认证作者'),(3,'admin','网站管理员');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `id` int NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES (1,'玄幻','2026-02-11 10:35:27','分类'),(2,'完结','2026-02-11 10:35:27','状态'),(3,'竞技','2026-02-11 10:35:27','分类'),(4,'连载','2026-02-11 10:35:27','状态'),(5,'言情','2026-02-11 10:35:27','分类'),(6,'科幻','2026-02-11 10:35:27','分类'),(7,'历史','2026-02-11 10:35:27','分类'),(8,'仙侠','2026-02-11 10:35:27','分类'),(9,'都市','2026-02-11 10:35:27','分类'),(10,'悬疑','2026-02-11 10:35:27','分类'),(11,'武侠','2026-02-11 10:35:27','分类'),(12,'军事','2026-02-11 10:35:27','分类'),(13,'轻小说','2026-02-11 10:35:27','分类'),(14,'男频','2026-02-11 10:35:27','频道'),(15,'女频','2026-02-11 10:35:27','频道'),(16,'奇幻','2026-02-11 10:35:27','分类'),(17,'穿越','2026-02-11 10:35:27','分类'),(18,'系统','2026-02-11 10:35:27','分类'),(19,'种田','2026-02-11 10:35:27','分类'),(20,'权谋','2026-02-11 10:35:27','分类');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `nick` varchar(100) DEFAULT NULL,
  `desc` text,
  `birthday` date DEFAULT NULL,
  `gender` tinyint DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'13800000001','user1@example.com','hashed_pwd_1','书虫小明','爱看小说的大学生','2000-01-01',1,'2026-01-01 10:00:00','2026-03-06 16:06:28'),(2,'13800000002','user2@example.com','hashed_pwd_2','梦幻星辰','科幻迷','1995-05-15',2,'2026-01-02 11:00:00','2026-01-02 11:00:00'),(3,'13800000003','user3@example.com','hashed_pwd_3','历史迷','历史爱好者','1988-08-20',1,'2026-01-03 12:00:00','2026-01-03 12:00:00'),(4,'13800000004','user4@example.com','hashed_pwd_4','修仙狂魔','沉迷修仙','1992-03-10',1,'2026-01-04 13:00:00','2026-01-04 13:00:00'),(5,'13800000005','user5@example.com','hashed_pwd_5','都市丽人','职场女性','1998-07-25',2,'2026-01-05 14:00:00','2026-01-05 14:00:00'),(6,'13800000006','user6@example.com','hashed_pwd_6','科幻大师','三体粉丝','1990-11-11',1,'2026-01-06 15:00:00','2026-01-06 15:00:00'),(7,'13800000007','user7@example.com','hashed_pwd_7','悬疑侦探','喜欢推理','1993-02-28',2,'2026-01-07 16:00:00','2026-01-07 16:00:00'),(8,'13800000008','user8@example.com','hashed_pwd_8','武侠迷','金庸迷','1985-09-09',1,'2026-01-08 17:00:00','2026-01-08 17:00:00'),(9,'13800000009','user9@example.com','hashed_pwd_9','轻小说控','二次元','2001-12-12',2,'2026-01-09 18:00:00','2026-01-09 18:00:00'),(10,'13800000010','user10@example.com','hashed_pwd_10','书荒求推','求好书','1996-04-04',1,'2026-01-10 19:00:00','2026-01-10 19:00:00'),(11,'13800000011','user11@example.com','hashed_pwd_11','熬夜看书','夜猫子','1994-06-06',1,'2026-01-11 20:00:00','2026-01-11 20:00:00'),(12,'13800000012','user12@example.com','hashed_pwd_12','读书小号','潜水党','1997-08-08',2,'2026-01-12 21:00:00','2026-01-12 21:00:00'),(13,'13800000013','user13@example.com','hashed_pwd_13','评论家','专业吐槽','1989-10-10',1,'2026-01-13 22:00:00','2026-01-13 22:00:00'),(14,'13800000014','user14@example.com','hashed_pwd_14','收藏家','只收藏不看','1991-12-12',2,'2026-01-14 23:00:00','2026-01-14 23:00:00'),(15,'13800000015','user15@example.com','hashed_pwd_15','老书虫','20年书龄','1980-01-01',1,'2026-01-15 08:00:00','2026-01-15 08:00:00'),(16,'13800000016','user16@example.com','hashed_pwd_16','新手上路','萌新','2002-02-02',2,'2026-01-16 09:00:00','2026-01-16 09:00:00'),(17,'13800000017','user17@example.com','hashed_pwd_17','休闲读者','随便看看','1999-03-03',1,'2026-01-17 10:00:00','2026-01-17 10:00:00'),(18,'13800000018','user18@example.com','hashed_pwd_18','学霸看书','理工男','1998-05-05',1,'2026-01-18 11:00:00','2026-01-18 11:00:00'),(19,'13800000019','user19@example.com','hashed_pwd_19','文艺青年','喜欢文笔好的','1996-07-07',2,'2026-01-19 12:00:00','2026-01-19 12:00:00'),(20,'13800000020','user20@example.com','hashed_pwd_20','潜水员','默默看书','1993-09-09',1,'2026-01-20 13:00:00','2026-01-20 13:00:00');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_collect`
--

DROP TABLE IF EXISTS `user_collect`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_collect` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `novel_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_collect`
--

LOCK TABLES `user_collect` WRITE;
/*!40000 ALTER TABLE `user_collect` DISABLE KEYS */;
INSERT INTO `user_collect` VALUES (1,1,19,'2026-02-20 21:26:04');
/*!40000 ALTER TABLE `user_collect` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_follow`
--

DROP TABLE IF EXISTS `user_follow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_follow` (
  `id` int NOT NULL,
  `follower_id` int DEFAULT NULL,
  `followee_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_follow`
--

LOCK TABLES `user_follow` WRITE;
/*!40000 ALTER TABLE `user_follow` DISABLE KEYS */;
INSERT INTO `user_follow` VALUES (1,1,2,'2026-02-20 11:00:00'),(2,1,3,'2026-02-20 11:02:00'),(3,1,4,'2026-02-20 11:04:00'),(4,1,5,'2026-02-20 11:06:00'),(5,2,1,'2026-02-20 11:08:00'),(6,2,3,'2026-02-20 11:10:00'),(7,2,4,'2026-02-20 11:12:00'),(8,3,1,'2026-02-20 11:14:00'),(9,3,2,'2026-02-20 11:16:00'),(10,3,5,'2026-02-20 11:18:00'),(11,4,1,'2026-02-20 11:20:00'),(12,4,2,'2026-02-20 11:22:00'),(13,4,6,'2026-02-20 11:24:00'),(14,5,1,'2026-02-20 11:26:00'),(15,5,3,'2026-02-20 11:28:00'),(16,5,7,'2026-02-20 11:30:00'),(17,6,1,'2026-02-20 11:32:00'),(18,6,2,'2026-02-20 11:34:00'),(19,6,8,'2026-02-20 11:36:00'),(20,7,1,'2026-02-20 11:38:00'),(21,7,3,'2026-02-20 11:40:00'),(22,7,9,'2026-02-20 11:42:00'),(23,8,1,'2026-02-20 11:44:00'),(24,8,4,'2026-02-20 11:46:00'),(25,8,10,'2026-02-20 11:48:00'),(26,9,1,'2026-02-20 11:50:00'),(27,9,5,'2026-02-20 11:52:00'),(28,10,1,'2026-02-20 11:54:00'),(29,10,2,'2026-02-20 11:56:00'),(30,10,3,'2026-02-20 11:58:00');
/*!40000 ALTER TABLE `user_follow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户角色关联表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (2,1),(3,1),(4,1),(5,1),(6,1),(7,1),(8,1),(9,1),(10,1),(11,1),(12,1),(13,1),(14,1),(15,1),(16,1),(17,1),(18,1),(19,1),(20,1),(1,3);
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_score`
--

DROP TABLE IF EXISTS `user_score`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_score` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `novel_id` int DEFAULT NULL,
  `score` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_score`
--

LOCK TABLES `user_score` WRITE;
/*!40000 ALTER TABLE `user_score` DISABLE KEYS */;
INSERT INTO `user_score` VALUES (1,1,19,5,'2026-02-20 21:25:59','2026-02-20 21:25:59');
/*!40000 ALTER TABLE `user_score` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-12 16:23:46
