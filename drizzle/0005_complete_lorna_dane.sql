CREATE TABLE `communityGrowth` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cityId` int NOT NULL,
	`districtId` int,
	`year` int NOT NULL,
	`communityType` varchar(100) NOT NULL,
	`percentage` int NOT NULL,
	`growthRate` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `communityGrowth_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `migrationEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cityId` int NOT NULL,
	`year` int NOT NULL,
	`month` int NOT NULL,
	`eventType` varchar(100) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`impactScore` int NOT NULL,
	`affectedCommunity` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `migrationEvents_id` PRIMARY KEY(`id`)
);
