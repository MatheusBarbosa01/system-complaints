export interface AuthContextType {
  token: string | null;
  user: {
    name: string;
    email: string;
    cpf: string;
  } | null;
  setToken: (token: string) => void;
  logout: () => void;
}
