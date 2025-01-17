import { useSelector } from "react-redux";
import { RootState } from "../redux/store";



export const useMainData = () => {
    const maindata = useSelector((state: RootState) =>  state.DataSlice)
    return maindata
}
