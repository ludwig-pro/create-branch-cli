import { pipe } from "lodash/fp";
import { BranchType, Answer, BranchName, BranchNameError } from "./types";

export const ListOfBranchType = [
  BranchType.feature,
  BranchType.fix,
  BranchType.docs,
  BranchType.style,
  BranchType.refactor,
  BranchType.perf,
  BranchType.test,
  BranchType.chore,
];

export const getBranchType = (answer: Answer["type"]) => {
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

const formatWithTick = (
  word: Answer["author"] | Answer["type"] | Answer["context"]
) => {
  return word.replace(/\s/g, "-").toLowerCase();
};

export const getBranchName = ({ author, type, context }: Answer) => {
  const formatedBranchName = `${formatWithTick(author)}/${getBranchType(
    type
  )}/${formatWithTick(context)}`;

  checkFormatBranchName(formatedBranchName);

  return formatedBranchName;
};

/**
 * check a branch name based on git rules
 * if branch name is not valid throw an error
 */
export const checkFormatBranchName = (branchName: BranchName) => {
  pipe(
    replaceDotSlashPattern,
    replaceDotLockPattern,
    containSlash,
    consecutiveDots,
    containBackSlash,
    containASCIIControlChar,
    startOrEndWithSlashDotDash,
    containSpecialASCIIRange,
    containMultipleConsecutiveSlashes
  )(branchName);
};

/**
 * rule 1 :
 * They can include slash / for hierarchical (directory) grouping,
 * but no slash-separated component can begin with a dot .
 * or end with the sequence .lock.
 */
const replaceDotSlashPattern = (branchName: BranchName) => {
  if (branchName.match(/\.\//g)) {
    throw new Error(BranchNameError.dotSlashPattern);
  }
  return branchName;
};

/**
 * rule 2 :
 * They can include slash / for hierarchical (directory) grouping,
 * but no slash-separated component can begin with a dot .
 * or end with the sequence .lock.
 */
const replaceDotLockPattern = (branchName: BranchName) => {
  if (branchName.match(/(.lock)$/g)) {
    throw new Error(BranchNameError.dotLockPattern);
  }
  return branchName;
};

/**
 * rule 3 :
 * They must contain at least one /.
 * This enforces the presence of a category like heads/, tags/ etc.
 * but the actual names are not restricted.
 * If the --allow-onelevel option is used, this rule is waived.
 */
const containSlash = (branchName: BranchName) => {
  if (branchName.includes("/")) {
    return branchName;
  }
  throw new Error(BranchNameError.containSlash);
};

/**
 * Rule 4 ;
 * They cannot have two consecutive dots .. anywhere.
 * branchName.replace(/\.\//g, "/");
 */
const consecutiveDots = (branchName: BranchName) => {
  if (branchName.includes("..")) {
    throw new Error(BranchNameError.consecutiveDot);
  }
  return branchName;
};

/**
 * Rule 5 ;
 * They cannot contain a \.
 */
const containBackSlash = (branchName: BranchName) => {
  if (branchName.includes("\\")) {
    throw new Error(BranchNameError.containBackSlash);
  }
  return branchName;
};

/**
 * Rule 6 :
 * They cannot contain a \.
 */
const containASCIIControlChar = (branchName: BranchName) => {
  if (branchName.match(/[ ~^:?*[\@{]/g)) {
    throw new Error(BranchNameError.asciiControlChar);
  }
  return branchName;
};

/**
 * Rule 7 :
 * They cannot begin or end with a slash /  or a dash - or a dot .
 */
const startOrEndWithSlashDotDash = (branchName: BranchName) => {
  if (branchName.match(/^(\.|-|\/)|(\.|-|\/)$/g)) {
    throw new Error(BranchNameError.startEndPattern);
  }
  return branchName;
};

/**
 * Rule 8:
 * They cannot contain bytes whose values are lower than \040)
 */
const containSpecialASCIIRange = (branchName: BranchName) => {
  // eslint-disable-next-line no-control-regex
  if (branchName.match(/[\x00-\x28]/g)) {
    throw new Error(BranchNameError.asciiSpecialChar);
  }
  return branchName;
};

/**
 * Rule 9
 * They cannot contain multiple consecutive slashes
 */
const containMultipleConsecutiveSlashes = (branchName: BranchName) => {
  if (branchName.includes("//")) {
    throw new Error(BranchNameError.consecutiveSlash);
  }
  return branchName;
};
