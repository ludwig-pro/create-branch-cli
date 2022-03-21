import {
  checkFormatBranchName,
  getBranchName,
  getBranchType,
} from "../create-branch";
import { BranchNameError } from "../types";

describe("create-branch utilities ", () => {
  it("getBranchType should return the correct branch type", () => {
    expect(getBranchType("feat: A new feature")).toBe("feature");
    expect(getBranchType("fix: A bug fix")).toBe("fix");
    expect(getBranchType("docs: Documentation only changes")).toBe("docs");
    expect(
      getBranchType(
        "style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)"
      )
    ).toBe("style");
    expect(
      getBranchType(
        "refactor: A code change that neither fixes a bug nor adds a feature"
      )
    ).toBe("refactor");
    expect(getBranchType("perf: A code change that improves performance")).toBe(
      "perf"
    );
    expect(
      getBranchType("test: Adding missing tests or correcting existing tests")
    ).toBe("test");
    expect(
      getBranchType(
        "chore: Changes to the build process or auxiliary tools and libraries"
      )
    ).toBe("chore");
    expect(getBranchType("unknown")).toBe("unknown");
  });

  it("getBranchName should return branch name correctly", () => {
    expect(
      getBranchName({
        author: "ludwig",
        type: "feat: A new feature",
        context: "context de la branche",
      })
    ).toBe("ludwig/feature/context-de-la-branche");
    expect(
      getBranchName({
        author: "author",
        type: "feat: A new feature",
        context: "context",
      })
    ).toBe("author/feature/context");
  });

  describe("checkFormatBranchName", () => {
    it("should include slash / for hierarchical (directory) grouping, but no slash-separated component can begin with a dot . or end with the sequence <.lock>", () => {
      expect(() => {
        checkFormatBranchName("ludwig./type./context");
      }).toThrow();
      expect(() => {
        checkFormatBranchName("ludwig./type./context");
      }).toThrowError(BranchNameError.dotSlashPattern);
    });

    it("should not end with the sequence .lock", () => {
      expect(() => {
        checkFormatBranchName("ludwig/type/context.lock");
      }).toThrow();
      expect(() => {
        checkFormatBranchName("ludwig/type/context.lock");
      }).toThrowError(BranchNameError.dotLockPattern);
      expect(checkFormatBranchName("ludwig/type.lock/context")).toBeUndefined();
    });

    it("should contain at least one /.", () => {
      expect(() => {
        checkFormatBranchName("ludwig");
      }).toThrow();
      expect(() => {
        checkFormatBranchName("ludwig");
      }).toThrowError(BranchNameError.containSlash);
    });

    it("should not have two consecutive dots .. anywhere", () => {
      expect(() => {
        checkFormatBranchName("ludwig..vantours/type/context");
      }).toThrow();
      expect(() => {
        checkFormatBranchName("ludwig..vantours/type/context");
      }).toThrowError(BranchNameError.consecutiveDot);
    });

    it("should not contain a back slash", () => {
      expect(() => {
        checkFormatBranchName("author\\type/context");
      }).toThrow();
      expect(() => {
        checkFormatBranchName("author\\type/context");
      }).toThrowError(BranchNameError.containBackSlash);
    });

    it("should not contain ASCII control characters", () => {
      expect(() => {
        checkFormatBranchName("author/ty~pe/context");
      }).toThrow();
      expect(() => {
        checkFormatBranchName("author/ty^pe/context");
      }).toThrow();
      expect(() => {
        checkFormatBranchName("author/ty:pe/context");
      }).toThrow();
      expect(() => {
        checkFormatBranchName("author/ty[pe/context");
      }).toThrow();
      expect(() => {
        checkFormatBranchName("author/ty?pe/context");
      }).toThrow();
      expect(() => {
        checkFormatBranchName("author/ty*pe/context");
      }).toThrow();
      expect(() => {
        checkFormatBranchName("author/ty@pe/context");
      }).toThrow();
      expect(() => {
        checkFormatBranchName("author/ty{pe/context");
      }).toThrow();
      expect(() => {
        checkFormatBranchName("author/ty{@pe/context");
      }).toThrow();
      expect(() => {
        checkFormatBranchName("author/ty:pe/context");
      }).toThrowError(BranchNameError.asciiControlChar);
    });

    it("should not begin or end with a slash /  or a dash - or a dot", () => {
      expect(() => {
        checkFormatBranchName(".author/type/context");
      }).toThrow();
      expect(() => {
        checkFormatBranchName("-author/type/context");
      }).toThrow();
      expect(() => {
        checkFormatBranchName("/author/type/context");
      }).toThrow();
      expect(() => {
        checkFormatBranchName("author/type/context.");
      }).toThrow();
      expect(() => {
        checkFormatBranchName("author/type/context-");
      }).toThrow();
      expect(() => {
        checkFormatBranchName("author/type/context/");
      }).toThrow();
      expect(() => {
        checkFormatBranchName("author/type/context/");
      }).toThrowError(BranchNameError.startEndPattern);
    });

    it("should not contain bytes whose values are lower than 40", () => {
      expect(() => {
        checkFormatBranchName("²/²/²");
      }).not.toThrow();
      expect(() => {
        checkFormatBranchName("²?/²?/²?");
      }).toThrow();
      expect(() => {
        checkFormatBranchName("aut#hor/t#ype/con#text");
      }).toThrowError(BranchNameError.asciiSpecialChar);
    });

    it("should not contain multiple consecutive slashes", () => {
      expect(() => {
        checkFormatBranchName("author//type//context");
      }).toThrow();
      expect(() => {
        checkFormatBranchName("author//type//context");
      }).toThrowError(BranchNameError.consecutiveSlash);
    });
  });
});
