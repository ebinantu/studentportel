-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 07, 2025 at 07:52 PM
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
-- Table structure for table `studentfeeexam`
--

CREATE TABLE `studentfeeexam` (
  `id` int(11) NOT NULL,
  `studentid` varchar(10) NOT NULL,
  `studentRoll` int(11) NOT NULL,
  `department` varchar(30) DEFAULT NULL,
  `category` varchar(30) DEFAULT NULL,
  `semester` int(11) DEFAULT NULL,
  `examid` varchar(20) DEFAULT NULL,
  `examname` varchar(30) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `lastdate` date DEFAULT NULL,
  `status` enum('pending','paid') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `studentfeeexam`
--
ALTER TABLE `studentfeeexam`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `studentRoll` (`studentRoll`),
  ADD KEY `studentid` (`studentid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `studentfeeexam`
--
ALTER TABLE `studentfeeexam`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `studentfeeexam`
--
ALTER TABLE `studentfeeexam`
  ADD CONSTRAINT `studentfeeexam_ibfk_1` FOREIGN KEY (`studentid`) REFERENCES `student` (`admissionNo`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
