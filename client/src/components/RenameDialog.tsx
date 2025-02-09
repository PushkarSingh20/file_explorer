import { FC , JSX } from "react"
import { useSeletedFiles } from "../hooks/useSelectedFiles"
import { useState } from "react"
import { CheckCircleOutline , CancelOutlined } from "@mui/icons-material"
import { useGetdataMutation } from "../redux/apis/basequeries"
import { useActivepath } from "../hooks/useUpaths"
import { Requestdata } from "../functions/Requestdata"
import { useDispatch } from "react-redux"
import { ThunkDispatch } from "@reduxjs/toolkit"
import { setDialogType , setState } from "../redux/Dialog/slice"

interface Props {
    setLoadingElem : any
}

export const RenameDialog : FC<Props> =  ({ setLoadingElem }) : JSX.Element => {
    
    const [Error, setError] = useState<string>("")
    const {selectedfiles} :  { selectedfiles: string[] } = useSeletedFiles()

    const [NewName, setNewName] = useState<string>("")
    const [FormMutation] = useGetdataMutation()

    const {pathname} = useActivepath()
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>()

    const UpdateData = async () => {
        
        const response  = await FormMutation({ path: "/rename" , method: "PATCH" , data: {name: selectedfiles[0] , new: pathname + NewName}   })
        setLoadingElem(true)
        if (response.data.success) {

            Requestdata(`Renamed ${selectedfiles[0]} to ${pathname + NewName}` ,  FormMutation , dispatch , pathname )
            dispatch(setDialogType(""))
            dispatch(setState(false))
        }
        else{
            setError("An error occured!")
            setTimeout(() => {
                setError("")
            } , 3000)
        }
        setLoadingElem(false)

    }

  return (
    selectedfiles.length === 1 ? <div className="w-full flex h-full items-center justify-center absolute">
        <dialog className="w-[500px] flex flex-col p-[10px] gap-[20px] rounded-lg h-[170px] bg-black">
                <h1 className="text-white ">Rename: {selectedfiles[0]?.slice(0, 20)}</h1>
                {Error?.trim() !== "" ? <p className="text-white bg-red-500 rounded-lg p-[5px] text-[14px]">{Error}</p> : <></> }
                <input type="text" value={NewName} onChange={(e) => setNewName(e.target.value)} placeholder="Enter new name." className="w-full p-[5px] rounded-lg border-2 border-cyan-600 outline-none" />

                <div className="flex items-center gap-[10px]">
                    {NewName.trim() !== "" ?     <button title="Save" onClick={() => UpdateData()} className="bg-green-500  hover:bg-green-600 text-white rounded-lg w-[30px] h-[30px] flex items-center justify-center"><CheckCircleOutline/></button> : <></> }
                        <button title="Cancel" className="bg-red-500  hover:bg-red-600 text-white rounded-lg w-[30px] h-[30px] flex items-center justify-center"><CancelOutlined/></button>
                </div>
                
        
        </dialog>
    </div> : <></>
  )
}
