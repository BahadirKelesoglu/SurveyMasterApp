# SurveyMasterApp
Web-based tool for creating, updating, and managing surveys with user authentication and database integration


# Survey Management Web Application

## Overview
This is a web application that allows users to register, log in, and interact with a personalized control panel.

### Features
1. **User Authentication**: Users can register, log in, and interact with a personalized dashboard.
2. **Security**: User passwords are encrypted with MD5, adding an additional layer of security against storing passwords as plain text.
3. **Database**: We use a MySQL database to store user information and other necessary data.
4. **Backend**: Built using Express.js and Node.js. Session information is managed using JWTs.

## Libraries and Dependencies
Before running the project, make sure to install the following libraries and dependencies:

- axios
- bcryptjs
- jsonwebtoken
- mysql2
- express
- React
- crypto-js
- jwtDecode
- react-router-dom
- body-parser
- cors

> **Note**: The project was submitted without the `node_modules` directory.

## Code Structure
Explanatory comments are included within the code. However, if there's any section you don't understand or need more information on, please feel free to reach out.

## Database Tables
```sql
-- Users Table
CREATE TABLE `users` (
   `id` int NOT NULL AUTO_INCREMENT,
   `name` varchar(255) NOT NULL,
   `email` varchar(255) NOT NULL,
   `password` varchar(255) NOT NULL,
   `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
   `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   PRIMARY KEY (`id`),
   UNIQUE KEY `email` (`email`)
);

-- Surveys Table
CREATE TABLE `surveys` (
   `id` int NOT NULL AUTO_INCREMENT,
   `user_id` int NOT NULL,
   `title` varchar(255) NOT NULL,
   `description` text,
   `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
   `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   PRIMARY KEY (`id`),
   KEY `user_id` (`user_id`),
   CONSTRAINT `surveys_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);

-- Questions Table
CREATE TABLE `questions` (
   `id` int NOT NULL AUTO_INCREMENT,
   `survey_id` int NOT NULL,
   `question_text` text NOT NULL,
   `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
   `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   PRIMARY KEY (`id`),
   KEY `questions_ibfk_1` (`survey_id`),
   CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`survey_id`) REFERENCES `surveys` (`id`) ON DELETE CASCADE
);

-- Responses Table
CREATE TABLE `responses` (
   `id` int NOT NULL AUTO_INCREMENT,
   `question_id` int NOT NULL,
   `user_id` int DEFAULT NULL,
   `answer_text` text NOT NULL,
   `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (`id`),
   KEY `user_id` (`user_id`),
   KEY `responses_ibfk_1` (`question_id`),
   CONSTRAINT `responses_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE,
   CONSTRAINT `responses_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);

Contact
If you encounter any issues or need additional information, please contact:

Name: Bahadır Keleşoğlu
Email: bahadirkelesoglu28@gmail.com


