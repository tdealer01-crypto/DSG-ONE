import { getToolDeclarations } from "../src/lib/agent/tools";

export function getServerToolDeclarations() {
  return getToolDeclarations().map((t: any) => ({
    type: "function",
    function: {
      name: t.name,
      description: t.description,
      parameters: t.parameters || {
        type: "object",
        properties: {},
      },
    },
  }));
}
