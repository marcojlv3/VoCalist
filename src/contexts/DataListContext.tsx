import { createContext } from "react";

export const DataListContext = createContext({
    sortDescendant: () => {},
    sortAscendant: () => {},
    searchByName: (name:string) => {}
});
  
 
  
