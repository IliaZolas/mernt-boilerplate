import { createContext, Dispatch, SetStateAction } from "react";

export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  imageUrl: string;
  public_id: string;
}

export interface UserContextProps {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

export const UserContext = createContext<UserContextProps>({
  user: null,
  setUser: () => {},
});

