import { useSelector } from "react-redux";
import { RootState } from "../redux/store";


export const useUsername = () => {
    const {username} = useSelector((state : RootState) => state.UserSlice)

    return {username}

}