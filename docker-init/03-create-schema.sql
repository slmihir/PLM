-- Create all database tables manually (TypeORM synchronize disabled due to permissions bug)

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    persona "public"."users_persona_enum" NOT NULL,
    "passwordHash" VARCHAR(255),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Universe tables
CREATE TABLE IF NOT EXISTS universe_fabrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "fabricCode" VARCHAR(255) UNIQUE NOT NULL,
    "fabricType" "public"."universe_fabrics_fabrictype_enum" NOT NULL,
    "inventoryQty" INTEGER DEFAULT 0,
    "lowStockThreshold" INTEGER DEFAULT 100,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS universe_trims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "trimCode" VARCHAR(255) UNIQUE NOT NULL,
    "trimType" "public"."universe_trims_trimtype_enum" NOT NULL,
    "inventoryQty" INTEGER DEFAULT 0,
    "lowStockThreshold" INTEGER DEFAULT 50,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS universe_prints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "printCode" VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS universe_colors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "colorCode" VARCHAR(255) UNIQUE NOT NULL,
    "colorName" VARCHAR(255) NOT NULL,
    hex VARCHAR(7),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "groupId" VARCHAR(255) UNIQUE NOT NULL,
    "styleId" VARCHAR(255),
    "designerId" VARCHAR(255) NOT NULL,
    status "public"."products_status_enum" DEFAULT 'draft',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product relationships
CREATE TABLE IF NOT EXISTS product_fabrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "productId" UUID REFERENCES products(id) ON DELETE CASCADE,
    "fabricCode" VARCHAR(255) NOT NULL,
    "isPrimary" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_trims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "productId" UUID REFERENCES products(id) ON DELETE CASCADE,
    "trimCode" VARCHAR(255) NOT NULL,
    "isPrimary" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_sketches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "productId" UUID REFERENCES products(id) ON DELETE CASCADE,
    "sketchUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tech packs
CREATE TABLE IF NOT EXISTS tech_packs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "productId" UUID UNIQUE REFERENCES products(id) ON DELETE CASCADE,
    "techPackUrl" TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS size_specs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "techPackId" UUID REFERENCES tech_packs(id) ON DELETE CASCADE,
    size VARCHAR(10) NOT NULL,
    measurements JSONB NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "productId" UUID REFERENCES products(id) ON DELETE CASCADE,
    "userId" UUID REFERENCES users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workflow stages
CREATE TABLE IF NOT EXISTS workflow_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "productId" UUID REFERENCES products(id) ON DELETE CASCADE,
    stage "public"."workflow_stages_stage_enum" NOT NULL,
    status "public"."workflow_stages_status_enum" DEFAULT 'pending',
    "assignedTo" VARCHAR(255),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_designer ON products("designerId");
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_product_fabrics_product ON product_fabrics("productId");
CREATE INDEX IF NOT EXISTS idx_product_trims_product ON product_trims("productId");
CREATE INDEX IF NOT EXISTS idx_workflow_stages_product ON workflow_stages("productId");
CREATE INDEX IF NOT EXISTS idx_comments_product ON comments("productId");

