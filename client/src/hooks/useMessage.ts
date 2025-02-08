import { useSelector } from "react-redux"
import { RootState } from "../redux/store"

export const useMessage = () => {
    
    const {message} = useSelector((state: RootState) => state.MessageSlice)
    return {message}

}