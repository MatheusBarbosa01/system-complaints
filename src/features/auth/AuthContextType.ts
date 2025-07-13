import { UserDto } from "../user/UserType";

export interface AuthContextType {
  token: string | null;
  user: UserDto | null;
  setToken: (token: string) => void;
  logout: () => void;
}
