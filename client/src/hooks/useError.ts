import { useSelector } from "react-redux"
import { RootState } from "../redux/store"

export const useError = () => {
    
    const {error} = useSelector((state: RootState) => state.ErrorSlice)
    return {error}

}