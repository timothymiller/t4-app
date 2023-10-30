CREATE TABLE `Session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`active_expires` integer NOT NULL,
	`idle_expires` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `UserKey` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`hashed_password` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `VerificationCode` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`code` text NOT NULL,
	`expires` integer NOT NULL,
	`timeout_until` integer,
	`timeout_seconds` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_session_userId` ON `Session` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_userKey_userId` ON `UserKey` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `VerificationCode_user_id_unique` ON `VerificationCode` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_verificationCode_userId` ON `VerificationCode` (`user_id`);