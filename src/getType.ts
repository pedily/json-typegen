interface Options {
  extensible?: "any" | "unknown";
}

type JSONType = "string" | "number" | "boolean" | "object" | "array" | "null";

/**
 * Takes a randomly nested property from a JSON-object
 * and returns its JSONType
 */
export function getType(json: any): JSONType {
  if (json === null) return "null";

  const jsonType = typeof json;

  if (jsonType === "object") {
    if (Array.isArray(json)) return "array";

    return "object";
  }

  switch (jsonType) {
    case "number":
    case "boolean":
    case "string":
      return jsonType;

    default:
      throw new Error(`invalid JSON type ${jsonType}`);
  }
}

function isPrimitiveType(jsonType: JSONType): boolean {
  switch (jsonType) {
    case "boolean":
    case "null":
    case "number":
    case "string":
      return true;

    default:
      return false;
  }
}

/**
 * Takes a parsed JSON object and returns a matching type declaration
 */
export function getDeclaration(json: any, options: Options = {}): string {
  const jsonType = getType(json);

  if (isPrimitiveType(jsonType)) {
    return jsonType;
  }

  if (jsonType === "object") {
    const obj = json as { [key: string]: any };
    const propertyDeclarations = Object.keys(obj).map(
      (key) => `${key}:${getDeclaration(obj[key], options)};`
    );
    if (options.extensible) {
      propertyDeclarations.push(`[key:string]:${options.extensible};`);
    }

    return `{${propertyDeclarations.join("")}}`;
  }

  if (jsonType === "array") {
    const arr = json as any[];
    const itemDeclarations = [
      ...new Set(arr.map((item) => getDeclaration(item, options)))
    ];
    if (options.extensible) {
      itemDeclarations.push(options.extensible);
    }
    if (itemDeclarations.length === 0) return "[]";
    if (itemDeclarations.length === 1) return `${itemDeclarations[0]}[]`;
    if (itemDeclarations.length) return `(${itemDeclarations.join("|")})[]`;
  }
}
