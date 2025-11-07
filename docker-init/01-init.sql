-- PostgreSQL 15+ requires explicit permissions on the public schema
-- This script ensures the virgio user has full permissions

-- Revoke public permissions first (PostgreSQL 15+ security change)
REVOKE ALL ON SCHEMA public FROM PUBLIC;

-- Make virgio the owner of the public schema
ALTER SCHEMA public OWNER TO virgio;

-- Grant all privileges on the database
GRANT ALL PRIVILEGES ON DATABASE virgio_plm TO virgio;

-- Grant all privileges on the public schema
GRANT ALL ON SCHEMA public TO virgio;
GRANT CREATE ON SCHEMA public TO virgio;
GRANT USAGE ON SCHEMA public TO virgio;

-- Grant privileges on all existing tables and sequences
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO virgio;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO virgio;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO virgio;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO virgio;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TYPES TO virgio;

