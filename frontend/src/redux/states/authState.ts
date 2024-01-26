import { User } from "@/utils/hooks/useProfile";

type AuthState = {
  accessToken: string;
  user: User;
};

export const authState: AuthState = {
  accessToken: "",
  user: {} as User,
};
