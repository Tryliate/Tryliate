# Neural Implementation SOP (Feature Build)

## Overview
This SOP guides Trymate during the "Code Generation" phase of a neural workflow. It follows a 
Plan-Execute-Verify pattern to ensure the generated code matches the architectural design.

## Parameters
- **task_context** (required): The feature or bug description.
- **base_path** (required): The root directory for the code changes.

## Steps
### 1. File Inventory
Map out the affected files in the codebase using existing MCP directory tools.

**Constraints:**
- You MUST identify all dependencies before modifying a file.
- You SHOULD check for existing unit tests.

### 2. Implementation
Generate and apply the diffs using the internal Code Editor tools.

**Constraints:**
- You MUST follow the existing project styling (e.g., Lucide icons, Framer Motion).
- You MUST NOT introduce new top-level dependencies without verification.

### 3. Verification
Run the `bun type-check` tool to ensure everything is correct.

**Constraints:**
- You MUST resolve all TypeScript errors before declaring a task "Finished".
- You SHOULD generate a summary report for the Tryliate UI.
