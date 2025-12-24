CREATE TABLE `citySummary` (
	`id` int AUTO_INCREMENT NOT NULL,
	`city` varchar(255) NOT NULL,
	`year` int NOT NULL,
	`mosquesCount` int NOT NULL,
	`churchesCount` int NOT NULL,
	`synagoguesCount` int NOT NULL,
	`totalPopulation` int NOT NULL,
	`foreignerPopulation` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `citySummary_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `communityInfrastructure` (
	`id` int AUTO_INCREMENT NOT NULL,
	`districtId` int NOT NULL,
	`type` enum('mosque','church','synagogue','cultural_center','ethnic_store') NOT NULL,
	`name` varchar(255) NOT NULL,
	`address` text,
	`community` varchar(255) NOT NULL,
	`latitude` varchar(50),
	`longitude` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `communityInfrastructure_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `demographics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`districtId` int NOT NULL,
	`year` int NOT NULL,
	`community` varchar(255) NOT NULL,
	`population` int NOT NULL,
	`percentageOfDistrict` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `demographics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `districts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`nameEn` varchar(255) NOT NULL,
	`population` int NOT NULL,
	`area` int NOT NULL,
	`foreignerPercentage` int NOT NULL,
	`dominantCommunity` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `districts_id` PRIMARY KEY(`id`),
	CONSTRAINT `districts_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `propertyPrices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`districtId` int NOT NULL,
	`year` int NOT NULL,
	`month` int NOT NULL,
	`averagePricePerSqm` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `propertyPrices_id` PRIMARY KEY(`id`)
);
