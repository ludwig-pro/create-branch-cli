import arg from "arg";
import inquirer, { QuestionCollection } from "inquirer";
import { getBranchName, typeOfChange } from "./create-branch";
import { exec } from "child_process";

type RawArgs = [string, string, string];

function parseArgumentsIntoOptions(rawArgs: RawArgs) {
  try {
    const args = arg(
      {
        "--git": Boolean,
        "--yes": Boolean,
        "--install": Boolean,
        "-g": "--git",
        "-y": "--yes",
        "-i": "--install",
      },
      {
        argv: rawArgs.slice(2),
      }
    );

    return {
      skipPrompts: args["--yes"] || false,
      git: args["--git"] || false,
      template: args._[0],
      runInstall: args["--install"] || false,
    };
  } catch (error) {
    console.log("unkown command");
    return {
      skipPrompts: false,
      git: false,
      template: undefined,
      runInstall: false,
    };
  }
}

async function promptForMissingOptions() {
  const questions: QuestionCollection[] = [];

  questions.push({
    type: "input",
    name: "author",
    message: "What is your name?",
    default: "John Doe",
  });

  questions.push({
    type: "list",
    name: "type",
    message: "Please choose the type of branch",
    choices: typeOfChange,
    default: "feature",
  });

  questions.push({
    type: "input",
    name: "context",
    message: "Please choose the type of branch",
    default: "improve-chart-performance",
  });

  const answers = await inquirer.prompt(questions);
  console.log({ answers });
  return answers;
}

export async function cli(rawArgs: RawArgs) {
  let options = parseArgumentsIntoOptions(rawArgs);
  const answer = await promptForMissingOptions();
  // @ts-ignore
  console.log(getBranchName(answer));
  // @ts-ignore
  checkBranchName(getBranchName(answer));
  // @ts-ignore
  createNewBranch(getBranchName(answer));
}

const checkBranchName = (branchName: string) => {
  exec(`git check-ref-format ${branchName}`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
};

const createNewBranch = (branchName: string) => {
  exec(`git checkout -b ${branchName}`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
};
