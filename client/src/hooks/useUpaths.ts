import { useSelector } from "react-redux";
import { RootState } from "../redux/store";


export const useUpaths = () => {
        const { paths } = useSelector((state : RootState) => state.upaths)


        return {paths}


}


export const useActivepath = () => {
        
        const { pathname } = useSelector((state : RootState) => state.activepath)


        return {pathname}


}
