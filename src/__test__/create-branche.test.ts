import {
  formatBranchName,
  getBranchName,
  getBranchType,
} from "../create-branch";

describe("create-branch utilities", () => {
  it("should create a branch", () => {
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

  it("should return branch name correctly", () => {
    expect(
      getBranchName({
        author: "ludwig",
        type: "feat: A new feature",
        context: "context de la branche",
      })
    ).toBe("ludwig/feature/context-de-la-branche");
  });
  describe("formatBranchName", () => {
    it("can include slash / for hierarchical (directory) grouping, but no slash-separated component can begin with a dot . or end with the sequence <.lock>", () => {
      expect(formatBranchName("ludwig./type./context")).toBe(
        "ludwig/type/context"
      );
      expect(formatBranchName("ludwig./type./context.lock")).toBe(
        "ludwig/type/context"
      );
      expect(formatBranchName("ludwig./type.lock/context")).toBe(
        "ludwig/type.lock/context"
      );
    });
    it("branch name must contain at least one /.", () => {
      expect(() => {
        formatBranchName("ludwig");
      }).toThrow();
      expect(() => {
        formatBranchName("ludwig");
      }).toThrowError("branch name must contain at least one /.");
      expect(formatBranchName("ludwig/type")).toBe("ludwig/type");
    });
  });
});

// no dot => .
// no ASCII control characters space, tilde ~, caret ^, or colon : anywhere
// They cannot have question-mark ?, asterisk *, or open bracket [ anywhere.
// They cannot begin or end with a slash /  or a dash - or a dot .
// They cannot contain @{ or @ or \
// They cannot start with  -
// command to check "git check-ref-format"

// Git imposes the following rules on how references are named:

// They cannot have two consecutive dots .. anywhere.

// They cannot have ASCII control characters (i.e. bytes whose values are lower than \040, or \177 DEL), space, tilde ~, caret ^, or colon : anywhere.

// They cannot have question-mark ?, asterisk *, or open bracket [ anywhere. See the --refspec-pattern option below for an exception to this rule.

// They cannot begin or end with a slash / or contain multiple consecutive slashes (see the --normalize option below for an exception to this rule)

// They cannot end with a dot ..

// They cannot contain a sequence @{.

// They cannot be the single character @.

// They cannot contain a \.
