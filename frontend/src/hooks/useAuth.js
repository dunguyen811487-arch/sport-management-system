import { useAuth } from "../contexts/AuthContext";

const useAuthHook = () => {
  return useAuth();
};

export default useAuthHook;