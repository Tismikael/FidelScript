CREATE TABLE "progress" (
	"id" serial PRIMARY KEY,
	"user_id" integer,
	"family_id" smallint,
	"part_completion" smallint
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY,
	"username" varchar(256),
	"email" varchar(256),
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "progress" ADD CONSTRAINT "progress_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");