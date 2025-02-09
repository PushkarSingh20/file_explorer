import { useSelector } from "react-redux"
import { RootState } from "../redux/store"

export const useDialogState = () => {
    const {dialogType , state} = useSelector((state: RootState) => state.DialogSlice)
    return {dialogType , state}
}