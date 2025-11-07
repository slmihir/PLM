"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StageStatus = exports.WorkflowStage = exports.TechPackStatus = exports.ProductStatus = exports.FabricType = exports.PersonaType = void 0;
var PersonaType;
(function (PersonaType) {
    PersonaType["DESIGNER"] = "designer";
    PersonaType["TECH_SPEC"] = "tech_spec";
    PersonaType["PATTERN_MASTER"] = "pattern_master";
    PersonaType["TAILOR"] = "tailor";
    PersonaType["MERCHANDISER"] = "merchandiser";
    PersonaType["BUSINESS_TEAM"] = "business_team";
    PersonaType["FINANCE"] = "finance";
    PersonaType["SOURCING"] = "sourcing";
})(PersonaType || (exports.PersonaType = PersonaType = {}));
var FabricType;
(function (FabricType) {
    FabricType["SOLID"] = "solid";
    FabricType["PRINT"] = "print";
    FabricType["RFD"] = "rfd";
    FabricType["YARN_MILL_DYED"] = "yarn_mill_dyed";
})(FabricType || (exports.FabricType = FabricType = {}));
var ProductStatus;
(function (ProductStatus) {
    ProductStatus["DRAFT"] = "draft";
    ProductStatus["TECH_REVIEW"] = "tech_review";
    ProductStatus["PATTERN_IN_PROGRESS"] = "pattern_in_progress";
    ProductStatus["SAMPLE_IN_PROGRESS"] = "sample_in_progress";
    ProductStatus["FIT_REVIEW"] = "fit_review";
    ProductStatus["APPROVED"] = "approved";
    ProductStatus["REJECTED"] = "rejected";
})(ProductStatus || (exports.ProductStatus = ProductStatus = {}));
var TechPackStatus;
(function (TechPackStatus) {
    TechPackStatus["DRAFT"] = "draft";
    TechPackStatus["PENDING_REVIEW"] = "pending_review";
    TechPackStatus["APPROVED"] = "approved";
    TechPackStatus["REJECTED"] = "rejected";
})(TechPackStatus || (exports.TechPackStatus = TechPackStatus = {}));
var WorkflowStage;
(function (WorkflowStage) {
    WorkflowStage["DESIGN"] = "design";
    WorkflowStage["TECH_SPEC"] = "tech_spec";
    WorkflowStage["PATTERN_MAKING"] = "pattern_making";
    WorkflowStage["SAMPLE_PRODUCTION"] = "sample_production";
    WorkflowStage["FIT_APPROVAL"] = "fit_approval";
    WorkflowStage["FINAL_BOM"] = "final_bom";
    WorkflowStage["MERCHANDISING"] = "merchandising";
    WorkflowStage["BUSINESS_APPROVAL"] = "business_approval";
    WorkflowStage["WEB_UPLOAD"] = "web_upload";
})(WorkflowStage || (exports.WorkflowStage = WorkflowStage = {}));
var StageStatus;
(function (StageStatus) {
    StageStatus["PENDING"] = "pending";
    StageStatus["IN_PROGRESS"] = "in_progress";
    StageStatus["COMPLETED"] = "completed";
    StageStatus["BLOCKED"] = "blocked";
})(StageStatus || (exports.StageStatus = StageStatus = {}));
//# sourceMappingURL=index.js.map