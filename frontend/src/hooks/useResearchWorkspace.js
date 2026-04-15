import { useContext } from "react";
import { ResearchWorkspaceContext } from "../context/ResearchWorkspaceContext";

export function useResearchWorkspace() {
  const context = useContext(ResearchWorkspaceContext);

  if (!context) {
    throw new Error("useResearchWorkspace must be used inside ResearchWorkspaceProvider.");
  }

  return context;
}
