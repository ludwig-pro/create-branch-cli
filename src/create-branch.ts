import { pipe } from "lodash/fp";
enum BranchType {
  feature = "feat: A new feature",
  fix = "fix: A bug fix",
  docs = "docs: Documentation only changes",
  style = "style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)",
  refactor = "refactor: A code change that neither fixes a bug nor adds a feature",
  perf = "perf: A code change that improves performance",
  test = "test: Adding missing tests or correcting existing tests",
  chore = "chore: Changes to the build process or auxiliary tools and libraries",
}

export const typeOfChange = [
  BranchType.feature,
  BranchType.fix,
  BranchType.docs,
  BranchType.style,
  BranchType.refactor,
  BranchType.perf,
  BranchType.test,
  BranchType.chore,
];

export const getBranchType = (answer: string) => {
  switch (answer) {
    case BranchType.feature:
      return "feature";
    case BranchType.fix:
      return "fix";
    case BranchType.docs:
      return "docs";
    case BranchType.style:
      return "style";
    case BranchType.refactor:
      return "refactor";
    case BranchType.perf:
      return "perf";
    case BranchType.test:
      return "test";
    case BranchType.chore:
      return "chore";
    default:
      return "unknown";
  }
};

const formatWithTick = (word: string) => {
  return word.replace(/\s/g, "-").toLowerCase();
};

export const getBranchName = ({
  author,
  type,
  context,
}: {
  author: string;
  type: string;
  context: string;
}) => {
  return `${formatWithTick(author)}/${getBranchType(type)}/${formatWithTick(
    context
  )}`;
};

export const formatBranchName = (branchName: string) => {
  return pipe(
    replaceDotSlashPattern,
    replaceDotLockPattern,
    containSlash
  )(branchName);
};

/**
 * rule 1 :
 * They can include slash / for hierarchical (directory) grouping,
 * but no slash-separated component can begin with a dot .
 * or end with the sequence .lock.
 */
const replaceDotSlashPattern = (branchName: string) => {
  return branchName.replace(/\.\//g, "/");
};

const replaceDotLockPattern = (branchName: string) => {
  return branchName.replace(/(.lock)$/g, "");
};

/**
 * rule 2 :
 * They must contain at least one /.
 * This enforces the presence of a category like heads/, tags/ etc.
 * but the actual names are not restricted.
 * If the --allow-onelevel option is used, this rule is waived.
 */
const containSlash = (branchName: string) => {
  if (branchName.includes("/")) {
    return branchName;
  }
  throw new Error("branch name must contain at least one /.");
};

/**
 * Rule 3 ;
 * They cannot have two consecutive dots .. anywhere.
 */
// const consecutiveDots = (branchName: string) => {
//   return branchName.replace(/\.\//g, "/");
// };
