import chalk from "chalk";
import inquirer, { QuestionCollection } from "inquirer";
import { getBranchName, ListOfBranchType } from "./create-branch";
import { Answer, BranchName } from "./types";
import { exec } from "child_process";
import invariant from "./helper";
import Listr from "listr";
import { getSavedAuthor, saveAuthor } from "./store";

const promptQuestions = async () => {
  const questions: QuestionCollection[] = [];

  questions.push({
    type: "input",
    name: "author",
    message: "What is your name?",
    default: getSavedAuthor(),
  });

  questions.push({
    type: "list",
    name: "type",
    message: "Please choose the type of branch",
    choices: ListOfBranchType,
  });

  questions.push({
    type: "input",
    name: "context",
    message: "Please choose the type of branch",
  });

  const answers = await inquirer.prompt(questions);

  invariant(assetAnswer(answers), "answers are not valid");

  saveAuthor(answers);

  return answers;
};

const checkBranchName = (branchName: BranchName) => {
  exec(`git check-ref-format ${branchName}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`%s ${error.message}`, chalk.red.bold("ERROR"));
      console.error(`%s ${stderr}`, chalk.red.bold("ERROR"));
      throw error;
    }

    stdout && console.log(`checkBranchName stdout: ${stdout}`);
  });
  return branchName;
};

const createNewBranch = (branchName: BranchName) => {
  exec(`git checkout -b ${branchName}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`%s ${error.message}`, chalk.red.bold("ERROR"));
      console.error(`%s ${stderr}`, chalk.red.bold("ERROR"));
      throw error;
    }

    stdout && console.log(`createNewBranch stdout: ${stdout}`);
  });
};

const assetAnswer = (answer: inquirer.Answers): answer is Answer => {
  return (
    typeof answer?.author === "string" &&
    answer?.author.length > 0 &&
    typeof answer?.type === "string" &&
    answer?.type.length > 0 &&
    typeof answer?.context === "string" &&
    answer?.context.length > 0
  );
};

export async function cli() {
  try {
    const answer = await promptQuestions();
    const branchName = getBranchName(answer);
    const tasks = new Listr([
      {
        title: "check branch name repect git rules",
        task: () => checkBranchName(branchName),
      },
      {
        title: "create new branch",
        task: () => createNewBranch(branchName),
      },
      {
        title: "checkout on the branch",
        task: () => true,
      },
    ]);
    await tasks.run();
    console.log("%s Branch is ready", chalk.green.bold("DONE"));
  } catch (error: any) {
    console.error(`%s ${error.message}`, chalk.red.bold("ERROR"));
    process.exit(1);
  }
}
