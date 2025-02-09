import { useSelector } from "react-redux";
import { RootState } from "../redux/store";



export const useSeletedFiles = () => {

    const {files : selectedfiles , type}  = useSelector((state : RootState) => state.SliceSelected )

    return {selectedfiles , type}

    
}
