import getAPIFromAtoms from "jotai-wrapper";
import { atom } from "jotai";

export const { useAtom, useAtomValue, useSetAtom, getAtom, selectAtom } =
  getAPIFromAtoms({
    counter: atom(0),
  });
