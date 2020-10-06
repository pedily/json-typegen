import { getDeclaration } from "./getType";

describe("getDeclaration", () => {
  describe("primitives", () => {
    it("declares false as a boolean", () => {
      expect(getDeclaration(false)).toBe("boolean");
    });

    it("declares true as a boolean", () => {
      expect(getDeclaration(true)).toBe("boolean");
    });

    it("declares null as null", () => {
      expect(getDeclaration(null)).toBe("null");
    });

    it('declares "" as a string', () => {
      expect(getDeclaration("")).toBe("string");
    });

    it("declares 1 as a number", () => {
      expect(getDeclaration(1)).toBe("number");
    });
  });

  describe("empty object", () => {
    it("declares an empty object", () => {
      expect(getDeclaration({})).toBe("{}");
    });
    it("declares an extensible empty object", () => {
      expect(getDeclaration({}, { extensible: "any" })).toBe(
        "{[key:string]:any;}"
      );
      expect(getDeclaration({}, { extensible: "unknown" })).toBe(
        "{[key:string]:unknown;}"
      );
    });
  });

  describe("shallow object", () => {
    it("declares a shallow object with a single primitive property", () => {
      expect(getDeclaration({ key: "value" })).toBe("{key:string;}");
      expect(getDeclaration({ key: 1 })).toBe("{key:number;}");
      expect(getDeclaration({ key: true })).toBe("{key:boolean;}");
      expect(getDeclaration({ key: null })).toBe("{key:null;}");
    });

    it("declares a shallow object with multiple multiple primitive properties", () => {
      expect(getDeclaration({ key: "value", otherKey: false })).toBe(
        "{key:string;otherKey:boolean;}"
      );
    });

    it("declares an extensible shallow object", () => {
      expect(getDeclaration({ key: "value" }, { extensible: "any" })).toBe(
        "{key:string;[key:string]:any;}"
      );
      expect(getDeclaration({ key: "value" }, { extensible: "unknown" })).toBe(
        "{key:string;[key:string]:unknown;}"
      );
    });
  });

  describe("nested object", () => {
    it("declares an object within an object", () => {
      expect(getDeclaration({ key: { key: "value" } })).toBe(
        "{key:{key:string;};}"
      );
    });
    it("declares an array within an object", () => {
      expect(getDeclaration({ key: ["value"] })).toBe("{key:string[];}");
    });
  });

  describe("empty array", () => {
    it("declares an empty array", () => {
      expect(getDeclaration([])).toBe("[]");
    });
    it("declares an extensible empty array", () => {
      expect(getDeclaration([], { extensible: "any" })).toBe("any[]");
      expect(getDeclaration([], { extensible: "unknown" })).toBe("unknown[]");
    });
  });

  describe("single-type array", () => {
    it("declares a single-type array of primitives", () => {
      expect(getDeclaration(["value"])).toBe("string[]");
      expect(getDeclaration([1])).toBe("number[]");
      expect(getDeclaration([true])).toBe("boolean[]");
      expect(getDeclaration([null])).toBe("null[]");
    });
    it("declares a single-type array of objects", () => {
      expect(getDeclaration([{}])).toBe("{}[]");
      expect(getDeclaration([{ key: "value" }])).toBe("{key:string;}[]");
    });
    it("declares a single-type array of arrays", () => {
      expect(getDeclaration([[]])).toBe("[][]");
      expect(getDeclaration([["value"]])).toBe("string[][]");
    });
    it("declares an extensible single-type array", () => {
      expect(getDeclaration(["value"], { extensible: "any" })).toBe(
        "(string|any)[]"
      );
      expect(getDeclaration(["value"], { extensible: "unknown" })).toBe(
        "(string|unknown)[]"
      );
    });
    it("declares a single-type array if item types are equal", () => {
      expect(getDeclaration(["value", "otherValue"])).toBe("string[]");
      expect(getDeclaration([{ key: "value" }, { key: "otherValue" }])).toBe(
        "{key:string;}[]"
      );
    });
  });

  describe("multi-type array", () => {
    it("declares a multi-type array");
    it("declares an extensible multi-type array");
  });

  describe("single-type arrays", () => {
    it("declares empty arrays", () => {
      expect(getDeclaration([])).toBe("[]");
    });

    it("detects multi-type primitive arrays", () => {
      // expect(getDeclaration())
    });

    it("detects extensible arrays");

    it("detects empty arrays");
  });
});
