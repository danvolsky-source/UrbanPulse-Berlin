CREATE TABLE `browsingHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`cityId` int NOT NULL,
	`visitedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `browsingHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notificationPreferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`emailNotifications` int NOT NULL DEFAULT 1,
	`pushNotifications` int NOT NULL DEFAULT 1,
	`governmentDecisions` int NOT NULL DEFAULT 1,
	`priceChanges` int NOT NULL DEFAULT 1,
	`migrationEvents` int NOT NULL DEFAULT 1,
	`weeklyDigest` int NOT NULL DEFAULT 1,
	`monthlyDigest` int NOT NULL DEFAULT 0,
	`priceChangeThreshold` int NOT NULL DEFAULT 10,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notificationPreferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `notificationPreferences_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('government_decision','price_change','migration_event','digest') NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`relatedCityId` int,
	`relatedUrl` varchar(500),
	`isRead` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `savedCities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`cityId` int NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `savedCities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `avatar` text;--> statement-breakpoint
ALTER TABLE `users` ADD `oauthProvider` enum('manus','google') DEFAULT 'manus' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `communityPreference` varchar(50);