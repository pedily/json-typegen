import { getDeclaration } from "./getType";
import example from "./example.json";

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

  describe("object", () => {
    describe("empty object", () => {
      it("declares an empty object", () => {
        expect(getDeclaration({})).toBe("{}");
      });

      it("declares an extensible empty object", () => {
        expect(getDeclaration({}, { additionalProperties: "any" })).toBe(
          "{[key:string]:any;}"
        );
        expect(getDeclaration({}, { additionalProperties: "unknown" })).toBe(
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
        expect(
          getDeclaration({ key: "value" }, { additionalProperties: "any" })
        ).toBe("{key:string;[key:string]:any;}");
        expect(
          getDeclaration({ key: "value" }, { additionalProperties: "unknown" })
        ).toBe("{key:string;[key:string]:unknown;}");
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
  });

  describe("array", () => {
    describe("empty array", () => {
      it("declares an empty array", () => {
        expect(getDeclaration([])).toBe("[]");
      });

      it("declares an extensible empty array", () => {
        expect(getDeclaration([], { additionalItems: "any" })).toBe("any[]");
        expect(getDeclaration([], { additionalItems: "unknown" })).toBe(
          "unknown[]"
        );
      });
    });

    describe("single-type", () => {
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
        expect(getDeclaration(["value"], { additionalItems: "any" })).toBe(
          "(string|any)[]"
        );
        expect(getDeclaration(["value"], { additionalItems: "unknown" })).toBe(
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

    describe("multi-type", () => {
      it("declares a multi-type array", () => {
        expect(getDeclaration(["value", 1, true, null])).toBe(
          "(string|number|boolean|null)[]"
        );
      });

      it("declares an extensible multi-type array", () => {
        expect(
          getDeclaration(["value", 1, true, null], {
            additionalItems: "any"
          })
        ).toBe("(string|number|boolean|null|any)[]");
        expect(
          getDeclaration(["value", 1, true, null], {
            additionalItems: "unknown"
          })
        ).toBe("(string|number|boolean|null|unknown)[]");
      });
    });
  });

  describe("examples", () => {
    describe("pokeapi response", () => {
      it("declares pokeapi response", () => {
        expect(getDeclaration(example)).toBe(
          "{count:number;next:string;previous:string;results:{name:string;url:string;}[];}"
        );
      });

      it("declares pokeapi response with additional items", () => {
        expect(getDeclaration(example, { additionalItems: "any" })).toBe(
          "{count:number;next:string;previous:string;results:({name:string;url:string;}|any)[];}"
        );
      });

      it("declares pokeapi response with additional properties", () => {
        expect(getDeclaration(example, { additionalProperties: "any" })).toBe(
          "{count:number;next:string;previous:string;results:{name:string;url:string;[key:string]:any;}[];[key:string]:any;}"
        );
      });

      it("declares pokeapi response with additional items and additional properties", () => {
        expect(getDeclaration(example, { additionalProperties: "any" })).toBe(
          "{count:number;next:string;previous:string;results:{name:string;url:string;[key:string]:any;}[];[key:string]:any;}"
        );
      });
    });
  });
});
