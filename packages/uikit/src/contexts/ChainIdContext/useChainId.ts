import { useContext } from "react";
import { ChainIdContext } from "./Provider";

export const useChainId = () => {
  return useContext(ChainIdContext);
};
