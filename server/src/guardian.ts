export interface NeuralScope {
  provider: string;
  allowedTools: string[]; // e.g., ["read_file", "list_repos"]
  deniedTools: string[]; // e.g., ["delete_repo"]
  mode: 'allowlist' | 'denylist' | 'full';
}

export class GuardianEnforcer {
  /**
   * Validates if a tool call is permitted under the given neural scopes.
   * @returns { success: boolean, reason?: string }
   */
  static validate(provider: string, tool: string, scopes: any[]): { success: boolean; reason?: string } {
    if (!scopes || scopes.length === 0) {
      return { success: true }; // Discovery Mode
    }

    // Support for simple string array (Implicit Allowlist)
    if (typeof scopes[0] === 'string') {
      if (scopes.includes(tool)) return { success: true };
      return { success: false, reason: `Neural Guardian: Tool '${tool}' is NOT AUTHORIZED (Allowlist Check).` };
    }

    // Support for complex NeuralScope objects
    const scope = (scopes as NeuralScope[]).find(s => s.provider === provider);

    if (!scope) {
      return { success: true };
    }

    if (scope.mode === 'full') return { success: true };

    if (scope.mode === 'denylist') {
      if (scope.deniedTools.includes(tool)) {
        return { success: false, reason: `Neural Guardian: Tool '${tool}' is explicitly REVOKED for ${provider}.` };
      }
      return { success: true };
    }

    if (scope.mode === 'allowlist') {
      if (!scope.allowedTools.includes(tool)) {
        return { success: false, reason: `Neural Guardian: Tool '${tool}' is NOT AUTHORIZED for ${provider}.` };
      }
      return { success: true };
    }

    return { success: true };
  }
}
