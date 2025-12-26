CREATE TABLE `averageIncome` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cityId` int NOT NULL,
	`districtId` int,
	`year` int NOT NULL,
	`averageMonthlyIncome` int NOT NULL,
	`medianMonthlyIncome` int NOT NULL,
	`foreignerAverageIncome` int NOT NULL,
	`incomeGrowthRate` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `averageIncome_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `governmentDecisions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cityId` int,
	`country` varchar(100) NOT NULL,
	`year` int NOT NULL,
	`month` int NOT NULL,
	`decisionType` varchar(100) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`officialPromise` text NOT NULL,
	`actualOutcome` text NOT NULL,
	`impactScore` int NOT NULL,
	`economicImpact` text,
	`socialImpact` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `governmentDecisions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `socialBenefits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cityId` int NOT NULL,
	`year` int NOT NULL,
	`totalBenefitsSpending` int NOT NULL,
	`unemploymentBenefits` int NOT NULL,
	`housingBenefits` int NOT NULL,
	`childBenefits` int NOT NULL,
	`refugeeBenefits` int NOT NULL,
	`beneficiariesCount` int NOT NULL,
	`foreignerBeneficiariesPercent` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `socialBenefits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `taxBurden` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cityId` int NOT NULL,
	`year` int NOT NULL,
	`averageTaxRate` int NOT NULL,
	`socialSecurityRate` int NOT NULL,
	`totalTaxRevenue` int NOT NULL,
	`taxRevenuePerCapita` int NOT NULL,
	`socialSpendingPercent` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `taxBurden_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `unemployment` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cityId` int NOT NULL,
	`districtId` int,
	`year` int NOT NULL,
	`unemploymentRate` int NOT NULL,
	`youthUnemploymentRate` int NOT NULL,
	`longTermUnemployed` int NOT NULL,
	`foreignerUnemploymentRate` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `unemployment_id` PRIMARY KEY(`id`)
);
