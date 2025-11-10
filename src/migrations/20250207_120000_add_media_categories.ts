import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      IF to_regclass('public.media_rels') IS NULL THEN
        CREATE TABLE "media_rels" (
          "id" serial PRIMARY KEY NOT NULL,
          "order" integer,
          "parent_id" integer NOT NULL,
          "path" varchar NOT NULL,
          "categories_id" integer
        );

        ALTER TABLE "media_rels"
          ADD CONSTRAINT "media_rels_parent_fk"
          FOREIGN KEY ("parent_id") REFERENCES "public"."media"("id")
          ON DELETE cascade ON UPDATE no action,
          ADD CONSTRAINT "media_rels_categories_fk"
          FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id")
          ON DELETE cascade ON UPDATE no action;

        CREATE INDEX "media_rels_order_idx" ON "media_rels" USING btree ("order");
        CREATE INDEX "media_rels_parent_idx" ON "media_rels" USING btree ("parent_id");
        CREATE INDEX "media_rels_path_idx" ON "media_rels" USING btree ("path");
        CREATE INDEX "media_rels_categories_id_idx" ON "media_rels" USING btree ("categories_id");
      END IF;
    END
    $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      IF to_regclass('public.media_rels') IS NOT NULL THEN
        DROP TABLE "media_rels" CASCADE;
      END IF;
    END
    $$;
  `)
}
