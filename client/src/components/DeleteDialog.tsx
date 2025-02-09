import { useSeletedFiles } from "../hooks/useSelectedFiles"
import { CheckCircleOutline, CancelOutlined } from '@mui/icons-material'
import { useGetdataMutation } from "../redux/apis/basequeries"
import { useDispatch } from "react-redux"
import { ThunkDispatch } from "@reduxjs/toolkit"
import { setError } from "../redux/Errors/slice"
import { Requestdata } from "../functions/Requestdata"
import { useActivepath } from "../hooks/useUpaths"
import { setDialogType, setState } from "../redux/Dialog/slice"

export default function DeleteDialog() {


  const { selectedfiles } = useSeletedFiles()
  const [Form_Mutation] = useGetdataMutation()
  const {pathname} = useActivepath()

  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()

  const HandleDelete = async () => {

    if (!selectedfiles.length) {
      return
    }
    const response = await Form_Mutation({ path: `http://localhost:5000/delete`, method: "DELETE", data: { files: selectedfiles } })

    if (!response.data.success) {

      dispatch(setError("Failed to delete!"))
      setTimeout(() => {
        dispatch(setError(""))
      }, 3000)
      return
    }
    else {
      dispatch(setState(false))
      dispatch(setDialogType(""))
      Requestdata("Files deleted successfully!", Form_Mutation, dispatch, pathname)
      

    }

  }

  return (
    <div className="w-full flex h-full items-center justify-center absolute">
      <dialog className="w-[500px] flex flex-col p-[10px] gap-[20px] rounded-lg min-h-[170px] max-h-[400px] bg-black">
        <p className="text-[13px] text-white">Are you sure you want to delete these files?</p>
        <div className='flex flex-col gap-[20px] text-[13px] px-[20px] h-full overflow-y-auto'>

          {selectedfiles.map((value, index) => (

            <p className="text-gray-300" key={index}>{value}</p>

          ))}

        </div>

        <div className="flex items-center gap-[10px]">

          <button title="Confirm" onClick={() => HandleDelete()} className="bg-green-500  hover:bg-green-600 text-white rounded-lg w-[30px] h-[30px] flex items-center justify-center"><CheckCircleOutline /></button>

          <button title="Cancel" className="bg-red-500  hover:bg-red-600 text-white rounded-lg w-[30px] h-[30px] flex items-center justify-center"><CancelOutlined /></button>

        </div>


      </dialog>
    </div>
  )
}
