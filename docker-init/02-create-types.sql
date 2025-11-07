-- Pre-create all enum types that TypeORM will need
-- This works around a TypeORM/PostgreSQL permissions bug

DO $$ BEGIN
    CREATE TYPE "public"."universe_fabrics_fabrictype_enum" AS ENUM('solid', 'print', 'rfd', 'yarn_mill_dyed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "public"."universe_trims_trimtype_enum" AS ENUM('button', 'zipper', 'label', 'thread', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "public"."users_persona_enum" AS ENUM('designer', 'tech_spec', 'pattern_master', 'sourcing');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "public"."products_status_enum" AS ENUM('draft', 'tech_review', 'approved', 'in_production');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "public"."workflow_stages_stage_enum" AS ENUM('design', 'tech_pack', 'pattern', 'sample', 'production');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "public"."workflow_stages_status_enum" AS ENUM('pending', 'in_progress', 'completed', 'blocked');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

