import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      IF to_regclass('public.gallery_tags') IS NULL THEN
        CREATE TABLE "gallery_tags" (
          "id" serial PRIMARY KEY NOT NULL,
          "title" varchar NOT NULL,
          "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
          "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
        );
      END IF;
    END
    $$;

    ALTER TABLE "pages_rels"
      ADD COLUMN IF NOT EXISTS "gallery_tags_id" integer;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'pages_rels_gallery_tags_fk'
      ) THEN
        ALTER TABLE "pages_rels"
          ADD CONSTRAINT "pages_rels_gallery_tags_fk"
          FOREIGN KEY ("gallery_tags_id") REFERENCES "public"."gallery_tags"("id")
          ON DELETE cascade ON UPDATE no action;
      END IF;
    END
    $$;

    CREATE INDEX IF NOT EXISTS "pages_rels_gallery_tags_id_idx"
      ON "pages_rels" USING btree ("gallery_tags_id");

    ALTER TABLE "_pages_v_rels"
      ADD COLUMN IF NOT EXISTS "gallery_tags_id" integer;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = '_pages_v_rels_gallery_tags_fk'
      ) THEN
        ALTER TABLE "_pages_v_rels"
          ADD CONSTRAINT "_pages_v_rels_gallery_tags_fk"
          FOREIGN KEY ("gallery_tags_id") REFERENCES "public"."gallery_tags"("id")
          ON DELETE cascade ON UPDATE no action;
      END IF;
    END
    $$;

    CREATE INDEX IF NOT EXISTS "_pages_v_rels_gallery_tags_id_idx"
      ON "_pages_v_rels" USING btree ("gallery_tags_id");

    ALTER TABLE "media_rels"
      DROP CONSTRAINT IF EXISTS "media_rels_categories_fk";

    ALTER TABLE "media_rels"
      DROP COLUMN IF EXISTS "categories_id";

    ALTER TABLE "media_rels"
      ADD COLUMN IF NOT EXISTS "gallery_tags_id" integer;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'media_rels_gallery_tags_fk'
      ) THEN
        ALTER TABLE "media_rels"
          ADD CONSTRAINT "media_rels_gallery_tags_fk"
          FOREIGN KEY ("gallery_tags_id") REFERENCES "public"."gallery_tags"("id")
          ON DELETE cascade ON UPDATE no action;
      END IF;
    END
    $$;

    CREATE INDEX IF NOT EXISTS "media_rels_gallery_tags_id_idx"
      ON "media_rels" USING btree ("gallery_tags_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "media_rels_gallery_tags_id_idx";
    ALTER TABLE "media_rels" DROP CONSTRAINT IF EXISTS "media_rels_gallery_tags_fk";
    ALTER TABLE "media_rels" DROP COLUMN IF EXISTS "gallery_tags_id";
    ALTER TABLE "media_rels" ADD COLUMN IF NOT EXISTS "categories_id" integer;
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'media_rels_categories_fk'
      ) THEN
        ALTER TABLE "media_rels"
          ADD CONSTRAINT "media_rels_categories_fk"
          FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id")
          ON DELETE cascade ON UPDATE no action;
      END IF;
    END
    $$;
    CREATE INDEX IF NOT EXISTS "media_rels_categories_id_idx"
      ON "media_rels" USING btree ("categories_id");

    DROP INDEX IF EXISTS "_pages_v_rels_gallery_tags_id_idx";
    ALTER TABLE "_pages_v_rels" DROP CONSTRAINT IF EXISTS "_pages_v_rels_gallery_tags_fk";
    ALTER TABLE "_pages_v_rels" DROP COLUMN IF EXISTS "gallery_tags_id";

    DROP INDEX IF EXISTS "pages_rels_gallery_tags_id_idx";
    ALTER TABLE "pages_rels" DROP CONSTRAINT IF EXISTS "pages_rels_gallery_tags_fk";
    ALTER TABLE "pages_rels" DROP COLUMN IF EXISTS "gallery_tags_id";

    DROP TABLE IF EXISTS "gallery_tags" CASCADE;
  `)
}
