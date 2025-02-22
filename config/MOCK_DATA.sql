-- Active: 1737614754101@@127.0.0.1@3306@SSA_examination
USE SSA_examination;

CREATE TABLE `regions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `professions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `img` VARCHAR(255) NOT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `subjects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `img` VARCHAR(255) NOT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `firstName` VARCHAR(255) NOT NULL,
  `lastName` VARCHAR(255) NOT NULL,
  `phoneNumber` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `img` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'ceo', 'user') DEFAULT 'user' NOT NULL,
  `status` ENUM('active', 'inactive') DEFAULT 'inactive' NOT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `learningCenters` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `phoneNumber` VARCHAR(255) NOT NULL,
  `img` VARCHAR(255) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `regionId` INT NOT NULL,
  `branchNumber` INT DEFAULT 0,
  `createdBy` INT NOT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`regionId`) REFERENCES `regions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `branches` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `phoneNumber` VARCHAR(255) NOT NULL,
  `img` VARCHAR(255) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `regionId` INT NOT NULL,
  `learningCenterId` INT NOT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`regionId`) REFERENCES `regions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`learningCenterId`) REFERENCES `learningCenters`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE `comments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `comment` VARCHAR(255) NOT NULL,
  `star` DECIMAL(2,1) NOT NULL,
  `learningCenterId` INT NOT NULL,
  `userId` INT NOT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`learningCenterId`) REFERENCES `learningCenters`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `likes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `learningCenterId` INT NOT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`learningCenterId`) REFERENCES `learningCenters`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE `fields` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `img` VARCHAR(255) NOT NULL,
  `professionId` INT,
  `subjectId` INT,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`professionId`) REFERENCES `professions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`subjectId`) REFERENCES `subjects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);



CREATE TABLE `lcfields` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `fieldId` INT NOT NULL,
  `learningCenterId` INT NOT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`fieldId`) REFERENCES `fields`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`learningCenterId`) REFERENCES `learningCenters`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `userenrolments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `learningCenterId` INT,
  `branchId` INT,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`learningCenterId`) REFERENCES `learningCenters`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE `resourcecategories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `img` VARCHAR(255) NOT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `resources` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `img` VARCHAR(255) NOT NULL,
  `media` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `createdBy` INT NOT NULL,
  `categoryId` INT NOT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`categoryId`) REFERENCES `resourcecategories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);


INSERT INTO `regions` (`name`) VALUES
('North Region'),
('South Region'),
('East Region'),
('West Region'),
('Central Region');


INSERT INTO `professions` (`name`, `img`) VALUES
('Doctor', 'doctor.jpg'),
('Engineer', 'engineer.jpg'),
('Teacher', 'teacher.jpg'),
('Scientist', 'scientist.jpg'),
('Artist', 'artist.jpg');

INSERT INTO `subjects` (`name`, `img`) VALUES
('Mathematics', 'math.jpg'),
('Science', 'science.jpg'),
('English', 'english.jpg'),
('History', 'history.jpg'),
('Art', 'art.jpg');


INSERT INTO `users` (`firstName`, `lastName`, `phoneNumber`, `email`, `img`, `password`, `role`, `status`, `createdAt`, `updatedAt`) VALUES
('Ali', 'Yusuf', '+998777777777', 'Ali@email.com', 'ali.jpg', 'Root1234!', 'ADMIN', 'ACTIVE', now(), now());


INSERT INTO `learningCenters` (`name`, `phoneNumber`, `img`, `address`, `regionId`, `branchNumber`, `createdBy`) VALUES
('Learning Center A', '1112223333', 'lc_a.jpg', '123 First St', 1, 3, 1),
('Learning Center B', '2223334444', 'lc_b.jpg', '456 Second St', 2, 2, 2),
('Learning Center C', '3334445555', 'lc_c.jpg', '789 Third St', 3, 1, 3),
('Learning Center D', '4445556666', 'lc_d.jpg', '101 Fourth St', 4, 4, 4),
('Learning Center E', '5556667777', 'lc_e.jpg', '202 Fifth St', 5, 0, 5);

INSERT INTO `branches` (`name`, `phoneNumber`, `img`, `address`, `regionId`, `learningCenterId`) VALUES
('Branch A1', '1112223333', 'branch_a1.jpg', '101 A St', 1, 1),
('Branch B1', '2223334444', 'branch_b1.jpg', '202 B St', 2, 2),
('Branch C1', '3334445555', 'branch_c1.jpg', '303 C St', 3, 3),
('Branch D1', '4445556666', 'branch_d1.jpg', '404 D St', 4, 4),
('Branch E1', '5556667777', 'branch_e1.jpg', '505 E St', 5, 5);

INSERT INTO `comments` (`comment`, `star`, `learningCenterId`, `userId`) VALUES
('Great learning center!', 4.5, 1, 1),
('Very helpful staff.', 5.0, 2, 2),
('Facilities could be better.', 3.5, 3, 3),
('Loved the environment!', 4.0, 4, 4),
('Good programs and teachers.', 4.5, 5, 5);

INSERT INTO `likes` (`userId`, `learningCenterId`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

INSERT INTO `fields` (`name`, `img`, `professionId`, `subjectId`) VALUES
('Field A', 'field_a.jpg', 1, NULL),
('Field B', 'field_b.jpg', NULL, 1),
('Field C', 'field_c.jpg', 2, NULL),
('Field D', 'field_d.jpg', NULL, 2),
('Field E', 'field_e.jpg', 3, NULL);

INSERT INTO `lcfields` (`fieldId`, `learningCenterId`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

INSERT INTO `userenrolments` (`userId`, `learningCenterId`, `branchId`) VALUES
(1, 1, NULL),
(2, 2, NULL),
(3, 3, NULL),
(4, 4, NULL),
(5, 5, NULL);

INSERT INTO `resourcecategories` (`name`, `img`) VALUES
('Category A', 'category_a.jpg'),
('Category B', 'category_b.jpg'),
('Category C', 'category_c.jpg'),
('Category D', 'category_d.jpg'),
('Category E', 'category_e.jpg');

INSERT INTO `resources` (`name`, `img`, `media`, `description`, `createdBy`, `categoryId`) VALUES
('Resource A', 'resource_a.jpg', 'media_a.mp4', 'Description A', 1, 1),
('Resource B', 'resource_b.jpg', 'media_b.mp4', 'Description B', 2, 2),
('Resource C', 'resource_c.jpg', 'media_c.mp4', 'Description C', 3, 3),
('Resource D', 'resource_d.jpg', 'media_d.mp4', 'Description D', 4, 4),
('Resource E', 'resource_e.jpg', 'media_e.mp4', 'Description E', 5, 5);

