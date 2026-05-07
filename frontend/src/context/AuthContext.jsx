import { createContext, useMemo, useState } from "react";

const USER_STORAGE_KEY = "aurevia-current-user";
const ACCOUNT_STORAGE_KEY = "aurevia-accounts";

const demoAccount = {
  id: "demo-clinical-lead",
  name: "Anita Verma",
  email: "demo@aurevia.ai",
  password: "Demo@12345",
  role: "Clinical Innovation Lead",
  organization: "Aurevia Labs"
};

function safeRead(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function getStoredAccounts() {
  const accounts = safeRead(ACCOUNT_STORAGE_KEY, []);
  const hasDemo = accounts.some((account) => account.email === demoAccount.email);

  if (!hasDemo) {
    const nextAccounts = [demoAccount, ...accounts];
    safeWrite(ACCOUNT_STORAGE_KEY, nextAccounts);
    return nextAccounts;
  }

  return accounts;
}

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() =>
    safeRead(USER_STORAGE_KEY, null)
  );

  const [accounts, setAccounts] = useState(() => getStoredAccounts());

  const persistUser = (user) => {
    setCurrentUser(user);
    safeWrite(USER_STORAGE_KEY, user);
  };

  const login = async ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const matchedUser = accounts.find(
      (account) =>
        account.email.toLowerCase() === normalizedEmail &&
        account.password === password
    );

    if (!matchedUser) {
      throw new Error("We couldn't verify those credentials. Try the demo account or create a workspace login.");
    }

    persistUser(matchedUser);
    return matchedUser;
  };

  const register = async ({ name, email, password, role, organization }) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (accounts.some((account) => account.email.toLowerCase() === normalizedEmail)) {
      throw new Error("An account with this email already exists.");
    }

    const nextUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: role.trim() || "Research Analyst",
      organization: organization.trim() || "Independent"
    };

    const nextAccounts = [...accounts, nextUser];
    setAccounts(nextAccounts);
    safeWrite(ACCOUNT_STORAGE_KEY, nextAccounts);
    persistUser(nextUser);
    return nextUser;
  };

  const logout = () => {
    setCurrentUser(null);
    window.localStorage.removeItem(USER_STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      currentUser,
      accounts,
      isAuthenticated: Boolean(currentUser),
      demoCredentials: {
        email: demoAccount.email,
        password: demoAccount.password
      },
      login,
      register,
      logout
    }),
    [accounts, currentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

