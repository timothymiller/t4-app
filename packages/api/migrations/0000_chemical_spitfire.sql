CREATE TABLE `Car` (
	`id` text PRIMARY KEY NOT NULL,
	`make` text NOT NULL,
	`model` text NOT NULL,
	`year` integer NOT NULL,
	`color` text NOT NULL,
	`price` real NOT NULL,
	`mileage` integer NOT NULL,
	`fuelType` text NOT NULL,
	`transmission` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `User` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL
);
