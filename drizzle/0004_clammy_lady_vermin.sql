CREATE TABLE `ecology` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cityId` int NOT NULL,
	`year` int NOT NULL,
	`aqi` int NOT NULL,
	`co2Emissions` int NOT NULL,
	`greenSpaceArea` int NOT NULL,
	`ecoRating` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ecology_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vehicles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cityId` int NOT NULL,
	`year` int NOT NULL,
	`totalVehicles` int NOT NULL,
	`electricVehicles` int NOT NULL,
	`gasolineVehicles` int NOT NULL,
	`chargingStations` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `vehicles_id` PRIMARY KEY(`id`)
);
