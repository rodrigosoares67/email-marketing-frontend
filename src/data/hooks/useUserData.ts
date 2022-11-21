import { useContext } from "react";
import UserContext from "../contexts/UserContext";

const useUserData = () => useContext(UserContext)

export default useUserData