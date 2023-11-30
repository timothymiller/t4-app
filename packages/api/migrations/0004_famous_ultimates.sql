CREATE TABLE `AuthMethod` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`hashed_password` text,
	`hash_method` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`totp_secret` text,
	`totp_expires` integer,
	`timeout_until` integer,
	`timeout_seconds` integer,
	FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_userKey_userId` ON `AuthMethod` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_session_userId` ON `Session` (`user_id`);
