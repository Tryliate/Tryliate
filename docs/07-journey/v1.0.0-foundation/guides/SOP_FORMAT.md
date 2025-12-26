---
description: Standard format for Agent SOPs
globs: **/*.sop.md
---
# Agent SOP Format

This rule defines the standard format for Agent SOPs (Standard Operating Procedures). 
SOPs are markdown-based instruction sets that guide AI agents through sophisticated workflows.

## Structure
Each SOP MUST include the following sections:

1. **Header**: Name of the SOP as an H1.
2. **Overview**: Description of the SOP's purpose as an H2.
3. **Parameters**: List of required and optional inputs as an H2.
4. **Steps**: Numbered list of workflow steps as an H2.
    - Each step MUST have a title as an H3.
    - Each step SHOULD include a **Constraints** section with MUST/SHOULD/MAY keywords (RFC 2119).
5. **Examples**: Concrete usage examples as an H2 (optional).
6. **Troubleshooting**: Guidance for common issues as an H2 (optional).

## Constraints
- You MUST use RFC 2119 keywords (MUST, SHOULD, MAY, MUST NOT) in constraints.
- You MUST strictly follow the steps defined in the SOP.
- You MUST validate all required parameters before starting.
- You MUST NOT skip steps unless explicitly allowed by the SOP logic.

## Parameter Handling
- Identify required and optional parameters from the SOP.
- Prompt the user for all required parameters upfront.
- Proceed with the execution only after parameters are gathered.
