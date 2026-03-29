CREATE TABLE `items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`list_id` integer NOT NULL,
	`name` text NOT NULL,
	`quantity` real DEFAULT 1 NOT NULL,
	`price` real DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (datetime('now', 'localtime')) NOT NULL,
	FOREIGN KEY (`list_id`) REFERENCES `lists`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `lists` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`budget_limit` real,
	`created_at` text DEFAULT (datetime('now', 'localtime')) NOT NULL
);
