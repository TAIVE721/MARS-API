-- Active: 1706827938266@@127.0.0.1@3306@elementsmars

DROP DATABASE IF EXISTS elementsmars

CREATE DATABASE elementsmars

USE DATABASE moviesdb

DROP TABLE IF EXISTS Categorys

CREATE TABLE Categorys (
    id INT AUTO_INCREMENT PRIMARY KEY, Priority INT NOT NULL CHECK (
        Priority >= 1
        AND Priority <= 5
    ), CategoryName VARCHAR(255) NOT NULL
)

DROP TABLE IF EXISTS ElementsToMars

CREATE TABLE ElementsToMars (
    id BINARY(16) PRIMARY KEY DEFAULT(UUID_TO_BIN(UUID())), Category INT NOT NULL REFERENCES Categorys (id), name VARCHAR(255) NOT NULL, weight INTEGER NOT NULL, description VARCHAR(255)
)

INSERT INTO
    Categorys (Priority, CategoryName)
VALUES (1, 'Propulsion'),
    (2, 'Power'),
    (3, 'Electronics')

INSERT INTO
    elementstomars (
        Category, name, weight, description
    )
VALUES (
        1, 'Nuclear propulsion engine', 1000, 'A powerful engine to get to Mars'
    ),
    (
        2, 'Trisofuel', 500, 'To power the ship'
    ),
    (
        3, 'Inertial Measurement Unit (IMU)', 200, 'To control the ship'
    )

SELECT BIN_TO_UUID(ElementsToMars.id) AS ElementID, categorys.id, categorys.Priority, categorys.CategoryName, ElementsToMars.name, ElementsToMars.weight, ElementsToMars.description
FROM ElementsToMars
    JOIN categorys ON ElementsToMars.Category = Categorys.id

INSERT INTO
    elementstomars (
        Category, name, weight, description
    )
VALUES (
        (
            SELECT id
            FROM categorys
            WHERE
                id = 2
        ), "Hidrogen", 1000, 'To power the ship'
    ),