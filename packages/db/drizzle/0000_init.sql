CREATE TABLE `about_info` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`short_name` text NOT NULL,
	`title` text NOT NULL,
	`current_company` text,
	`tech_stack` text,
	`hero_adjectives` text,
	`hero` text,
	`terminal_resume` text,
	`link` text,
	`bio` text
);
--> statement-breakpoint
CREATE TABLE `about_skills` (
	`id` text PRIMARY KEY NOT NULL,
	`soft` text,
	`frontend` text,
	`backend` text,
	`design` text,
	`language` text,
	`tooling` text
);
--> statement-breakpoint
CREATE TABLE `blog` (
	`id` text PRIMARY KEY NOT NULL,
	`subtitle` text,
	`description` text,
	`content` text,
	`icon` text,
	`cover` text,
	`association` text,
	`tags` text DEFAULT '[]' NOT NULL,
	`links` text DEFAULT '[]' NOT NULL,
	`gallery` text DEFAULT '[]' NOT NULL,
	`draft` integer DEFAULT false NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`title` text NOT NULL,
	`date` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `blog_draft_date_idx` ON `blog` (`draft`,"date" desc);--> statement-breakpoint
CREATE TABLE `career` (
	`id` text PRIMARY KEY NOT NULL,
	`subtitle` text,
	`description` text,
	`content` text,
	`icon` text,
	`cover` text,
	`association` text,
	`tags` text DEFAULT '[]' NOT NULL,
	`links` text DEFAULT '[]' NOT NULL,
	`gallery` text DEFAULT '[]' NOT NULL,
	`draft` integer DEFAULT false NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`position` text NOT NULL,
	`company` text NOT NULL,
	`type` text,
	`role_type` text,
	`location` text,
	`start_date` integer NOT NULL,
	`end_date` integer
);
--> statement-breakpoint
CREATE TABLE `education` (
	`id` text PRIMARY KEY NOT NULL,
	`subtitle` text,
	`description` text,
	`content` text,
	`icon` text,
	`cover` text,
	`association` text,
	`tags` text DEFAULT '[]' NOT NULL,
	`links` text DEFAULT '[]' NOT NULL,
	`gallery` text DEFAULT '[]' NOT NULL,
	`draft` integer DEFAULT false NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`degree` text NOT NULL,
	`field` text NOT NULL,
	`school` text NOT NULL,
	`location` text,
	`start_date` integer NOT NULL,
	`end_date` integer
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`subtitle` text,
	`description` text,
	`content` text,
	`icon` text,
	`cover` text,
	`association` text,
	`tags` text DEFAULT '[]' NOT NULL,
	`links` text DEFAULT '[]' NOT NULL,
	`gallery` text DEFAULT '[]' NOT NULL,
	`draft` integer DEFAULT false NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`title` text NOT NULL,
	`date_start` integer NOT NULL,
	`date_end` integer
);
--> statement-breakpoint
CREATE INDEX `projects_draft_date_start_idx` ON `projects` (`draft`,"date_start" desc);--> statement-breakpoint
CREATE TABLE `testimonies` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`subtitle` text,
	`content` text NOT NULL,
	`association` text,
	`link` text,
	`date` integer,
	`draft` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`role` text DEFAULT 'GUEST' NOT NULL
);
