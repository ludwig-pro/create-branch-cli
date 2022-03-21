export enum BranchType {
  feature = "feat: A new feature",
  fix = "fix: A bug fix",
  docs = "docs: Documentation only changes",
  style = "style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)",
  refactor = "refactor: A code change that neither fixes a bug nor adds a feature",
  perf = "perf: A code change that improves performance",
  test = "test: Adding missing tests or correcting existing tests",
  chore = "chore: Changes to the build process or auxiliary tools and libraries",
}

export type Answer = {
  author: string;
  type: string;
  context: string;
};

export type BranchName = string;

export enum BranchNameError {
  dotSlashPattern = "branch name : no slash-separated component can begin with a dot",
  dotLockPattern = "branch name : cannot end with the sequence .lock",
  containSlash = "branch name : must contain at least one /.",
  consecutiveDot = "branch name : cannot have two consecutive dots",
  containBackSlash = "branch cannot : contain a \\",
  asciiControlChar = "branch name : no ASCII control characters",
  asciiSpecialChar = "branch name : cannot contain bytes whose values are lower than 040, or  upper than 177 in ASCII",
  consecutiveSlash = "branch name : cannot contain multiple consecutive slashes",
  startEndPattern = "branch name cannot begin or end with a slash /  or a dash - or a dot",
}
