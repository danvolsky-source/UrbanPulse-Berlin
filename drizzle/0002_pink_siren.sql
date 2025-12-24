ALTER TABLE `districts` DROP INDEX `districts_name_unique`;--> statement-breakpoint
ALTER TABLE `districts` ADD `city` varchar(100) DEFAULT 'Berlin' NOT NULL;