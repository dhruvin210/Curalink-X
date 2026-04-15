import { ThemeProvider } from "./context/ThemeContext";
import { ResearchWorkspaceProvider } from "./context/ResearchWorkspaceContext";
import ResearchDashboardPage from "./pages/ResearchDashboardPage";

export default function App() {
  return (
    <ThemeProvider>
      <ResearchWorkspaceProvider>
        <ResearchDashboardPage />
      </ResearchWorkspaceProvider>
    </ThemeProvider>
  );
}
