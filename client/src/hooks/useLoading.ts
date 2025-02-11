import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

export const useLoadingState = () => {
    
    const {loading: LoadingState} = useSelector((state: RootState) => state.LoadingSlice)
    return {LoadingState}

}