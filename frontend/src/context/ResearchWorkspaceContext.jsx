import { createContext } from "react";
import { useResearchWorkspaceState } from "../hooks/useResearchWorkspaceState";

export const ResearchWorkspaceContext = createContext(null);

export function ResearchWorkspaceProvider({ children }) {
  const workspace = useResearchWorkspaceState();

  return (
    <ResearchWorkspaceContext.Provider value={workspace}>
      {children}
    </ResearchWorkspaceContext.Provider>
  );
}
