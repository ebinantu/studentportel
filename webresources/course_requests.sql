-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 07, 2025 at 10:41 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `studentprotal`
--

-- --------------------------------------------------------

--
-- Table structure for table `course_requests`
--

CREATE TABLE `course_requests` (
  `id` int(11) NOT NULL,
  `admissionNo` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `department` varchar(100) NOT NULL,
  `course` varchar(100) NOT NULL,
  `year` int(11) NOT NULL,
  `message` text DEFAULT NULL,
  `signature_path` varchar(255) DEFAULT NULL,
  `doc1_path` varchar(255) DEFAULT NULL,
  `doc2_path` varchar(255) DEFAULT NULL,
  `request_date` date DEFAULT curdate(),
  `stage` enum('Requested','Verified','Approved') DEFAULT 'Requested',
  `status` enum('Pending','Rejected','Approved') DEFAULT 'Pending',
  `rejection_message` text DEFAULT NULL,
  `certificatepath` varchar(255) NOT NULL DEFAULT 'document'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course_requests`
--

INSERT INTO `course_requests` (`id`, `admissionNo`, `name`, `department`, `course`, `year`, `message`, `signature_path`, `doc1_path`, `doc2_path`, `request_date`, `stage`, `status`, `rejection_message`, `certificatepath`) VALUES
(34660, 'H2861', 'EBIN', 'Information Technology', 'nldnsd2', 3, 'ddededed', 'documents/WhatsAppImage2025-04-30at230517_04410a06.jpg', 'documents/WhatsAppImage2025-04-30at230517_04410a06.jpg', '', '2025-10-07', 'Requested', 'Pending', NULL, 'document');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `course_requests`
--
ALTER TABLE `course_requests`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
