CREATE TABLE `rentalPrices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cityId` int NOT NULL,
	`districtId` int,
	`year` int NOT NULL,
	`apartmentType` varchar(50) NOT NULL,
	`monthlyRent` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rentalPrices_id` PRIMARY KEY(`id`)
);
