import { createContext, useState, useEffect, ReactNode, useContext } from "react";

interface User {
  nome: string;
  email: string;
  cargo: string;
}

interface AuthContextData {
  user: User | null;
  signed: boolean;
  login: (dados: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 3. Ao carregar o app, verifica se já tem usuário no "banco" do navegador
  useEffect(() => {
    const storageUser = localStorage.getItem("@TaboaoCenter:user");

    if (storageUser) {
      setUser(JSON.parse(storageUser));
    }
    setLoading(false);
  }, []);

  function login(dados: User) {
    setUser(dados);
    localStorage.setItem("@TaboaoCenter:user", JSON.stringify(dados));
  }

  function logout() {
    localStorage.removeItem("@TaboaoCenter:user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para facilitar o uso
export function useAuth() {
  return useContext(AuthContext);
}