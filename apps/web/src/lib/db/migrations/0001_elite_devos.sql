CREATE TABLE "course" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"price" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"category_tag" text[] DEFAULT '{}'::text[] NOT NULL,
	"thumbnail" text,
	"rating" numeric(3, 1),
	"created_by" uuid,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course_enrollment" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"enrolled_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "course" ADD CONSTRAINT "course_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_enrollment" ADD CONSTRAINT "course_enrollment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_enrollment" ADD CONSTRAINT "course_enrollment_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;