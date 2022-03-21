import { Answer } from "./types";
import Conf from "conf";
import { isEmpty, isNil } from "lodash";

const store = new Conf();

const isSafeAuthor = (author: unknown): author is Answer["author"] => {
  return !isNil(author) && !isEmpty(author) && typeof author === "string";
};

export const saveAuthor = (answers: Answer) => {
  store.set("author", answers.author);
};

export const getSavedAuthor = () => {
  const author = store.get("author");
  return isSafeAuthor(author) ? author : undefined;
};
