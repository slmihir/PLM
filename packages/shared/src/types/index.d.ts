export declare enum PersonaType {
    DESIGNER = "designer",
    TECH_SPEC = "tech_spec",
    PATTERN_MASTER = "pattern_master",
    TAILOR = "tailor",
    MERCHANDISER = "merchandiser",
    BUSINESS_TEAM = "business_team",
    FINANCE = "finance",
    SOURCING = "sourcing"
}
export interface User {
    id: string;
    email: string;
    name: string;
    persona: PersonaType;
    createdAt: Date;
    updatedAt: Date;
}
export declare enum FabricType {
    SOLID = "solid",
    PRINT = "print",
    RFD = "rfd",
    YARN_MILL_DYED = "yarn_mill_dyed"
}
export interface Fabric {
    fabricCode: string;
    gsm?: number;
    weight?: number;
    composition: string;
    washCare: string;
    cost: number;
    fabricType: FabricType;
    leadTime: number;
    supplierInfo: string;
    inventoryQty: number;
    lowStockThreshold: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface Trim {
    trimCode: string;
    material: string;
    nomenclature: string;
    sizeSpecs?: string;
    finish?: string;
    cost: number;
    treatmentRequirements?: string;
    leadTime: number;
    supplierInfo: string;
    inventoryQty: number;
    shelfLife?: number;
    lowStockThreshold: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface Print {
    printId: string;
    artworkFilePath: string;
    version: number;
    availabilityStatus: 'available' | 'unavailable';
    createdAt: Date;
    updatedAt: Date;
}
export interface Color {
    colorCode: string;
    colorName: string;
    season?: 'SS' | 'AW';
    hexValue?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare enum ProductStatus {
    DRAFT = "draft",
    TECH_REVIEW = "tech_review",
    PATTERN_IN_PROGRESS = "pattern_in_progress",
    SAMPLE_IN_PROGRESS = "sample_in_progress",
    FIT_REVIEW = "fit_review",
    APPROVED = "approved",
    REJECTED = "rejected"
}
export interface Product {
    id: string;
    groupId: string;
    styleId?: string;
    status: ProductStatus;
    designerId: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface ProductFabric {
    id: string;
    productId: string;
    fabricCode: string;
    isPrimary: boolean;
    estimatedConsumption?: number;
    finalConsumption?: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface ProductTrim {
    id: string;
    productId: string;
    trimCode: string;
    isPrimary: boolean;
    estimatedConsumption?: number;
    finalConsumption?: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface ProductSketch {
    id: string;
    productId: string;
    sketchFilePath: string;
    patternId?: string;
    version: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare enum TechPackStatus {
    DRAFT = "draft",
    PENDING_REVIEW = "pending_review",
    APPROVED = "approved",
    REJECTED = "rejected"
}
export interface TechPack {
    id: string;
    productId: string;
    techSpecId: string;
    pdfPath?: string;
    version: number;
    status: TechPackStatus;
    createdAt: Date;
    updatedAt: Date;
}
export interface SizeSpec {
    id: string;
    productId: string;
    size: string;
    measurements: Record<string, number>;
    createdAt: Date;
    updatedAt: Date;
}
export declare enum WorkflowStage {
    DESIGN = "design",
    TECH_SPEC = "tech_spec",
    PATTERN_MAKING = "pattern_making",
    SAMPLE_PRODUCTION = "sample_production",
    FIT_APPROVAL = "fit_approval",
    FINAL_BOM = "final_bom",
    MERCHANDISING = "merchandising",
    BUSINESS_APPROVAL = "business_approval",
    WEB_UPLOAD = "web_upload"
}
export declare enum StageStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    BLOCKED = "blocked"
}
export interface WorkflowStageRecord {
    id: string;
    productId: string;
    stage: WorkflowStage;
    status: StageStatus;
    assignedTo?: string;
    startedAt?: Date;
    completedAt?: Date;
    delayReason?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface Comment {
    id: string;
    productId: string;
    userId: string;
    commentText: string;
    attachments?: string[];
    parentCommentId?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface BOM {
    productId: string;
    fabrics: ProductFabric[];
    trims: ProductTrim[];
    patternId?: string;
}
export interface COGS {
    productId: string;
    materialCost: number;
    laborCost: number;
    washingCost: number;
    dyeingCost: number;
    totalCost: number;
    calculatedAt: Date;
}
export interface MCPTool {
    name: string;
    description: string;
    inputSchema: Record<string, any>;
}
export interface MCPResource {
    uri: string;
    name: string;
    description?: string;
    mimeType?: string;
}
export interface MCPPrompt {
    name: string;
    description: string;
    arguments?: Array<{
        name: string;
        description: string;
        required?: boolean;
    }>;
}
//# sourceMappingURL=index.d.ts.map