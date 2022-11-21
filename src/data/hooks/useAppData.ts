import { useContext } from "react";
import AppContext from "../contexts/AppContext";

const useAppData = () => useContext(AppContext)

export default useAppData