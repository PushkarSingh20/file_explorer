import { useSelector } from "react-redux";
import { RootState } from "../redux/store";


export const useUpaths = () => {
        const { paths, activepathindex } = useSelector((state : RootState) => state.upaths)


        return {paths , activepathindex}


}


export const useActivepath = () => {
        
        const { pathname } = useSelector((state : RootState) => state.activepath)


        return {pathname }


}
