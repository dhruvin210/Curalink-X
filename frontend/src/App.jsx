import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { useAuthContext } from "./hooks/useAuthContext";
import LoginPage from "./pages/LoginPage";
import { ResearchWorkspaceProvider } from "./context/ResearchWorkspaceContext";
import ResearchDashboardPage from "./pages/ResearchDashboardPage";

function AppContent() {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <ResearchWorkspaceProvider>
      <ResearchDashboardPage />
    </ResearchWorkspaceProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
