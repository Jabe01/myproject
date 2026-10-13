<?php
/*
 * Database connection (MySQL via PDO)
 *
 * Run this once in phpMyAdmin / MySQL to create the database:
 *
 *   CREATE DATABASE onshore_resort CHARACTER SET utf8mb4;
 *   USE onshore_resort;
 *   CREATE TABLE bookings (
 *     id         INT AUTO_INCREMENT PRIMARY KEY,
 *     guests     TINYINT UNSIGNED NOT NULL,
 *     stay_type  ENUM('overnight','day') NOT NULL,
 *     check_in   DATE NOT NULL,
 *     check_out  DATE NOT NULL,
 *     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 *   );
 */

$db_host = 'localhost';
$db_name = 'onshore_resort';
$db_user = 'root';
$db_pass = '';

try {
    $pdo = new PDO(
        "mysql:host=$db_host;dbname=$db_name;charset=utf8mb4",
        $db_user,
        $db_pass,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (PDOException $e) {
    $pdo = null; // index.php shows a friendly message if the DB is unavailable
}