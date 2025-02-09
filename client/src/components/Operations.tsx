import { FC, JSX , useState } from 'react'
import { ContentCopyOutlined, DeleteOutlineOutlined, DriveFileMoveOutlined, HttpsOutlined, NoEncryptionGmailerrorredOutlined , ColorizeOutlined , CancelOutlined} from '@mui/icons-material'

import { useGetdataMutation } from '../redux/apis/basequeries'
import { setdata } from '../redux/Data/slice';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { setSelectedFiles , setType } from '../redux/selected/slice';
import { setError } from '../redux/Errors/slice';
import { setMessage } from '../redux/Message/slice';
import { useSeletedFiles } from '../hooks/useSelectedFiles';

interface Propdata {

    selectedfiles: string[],
    pathname: string,


}


export const Operations: FC<Propdata> = ({selectedfiles , pathname }): JSX.Element => {

    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const [Form_Mutation] = useGetdataMutation();
    const {type } = useSeletedFiles();

    const [upathname, setupatname] = useState<string>("")

    const Requestdata = async (message : string) => {

        const response =    await Form_Mutation({ path:   `http://localhost:5000/getpath`  , method: "POST" , data: {path:  pathname}})

        if (response.data.success) {
           
            
            dispatch(setdata(response.data.pathdata))
            dispatch(setMessage(message))
          
            setTimeout(() => {
               dispatch(setMessage(""))
            } , 3000)
        }
        else{
            dispatch(setError("An error occured!"))
         
            return
        }
        dispatch(setSelectedFiles([]))
        dispatch(setType(null));
    }

    const HandleMove = async () => {
        setupatname(pathname)
        dispatch(setType("move"))
        dispatch(setSelectedFiles(selectedfiles))
    }

    const CancleAction = () => {
        dispatch(setType(null))
        dispatch(setSelectedFiles([]))
    }

    const HandleDelete = async () => {
         
            if (!selectedfiles.length) {
                return
            }
            const response  = await Form_Mutation({ path:   `http://localhost:5000/delete`  , method: "DELETE" , data: {files: selectedfiles} })

            if (!response.data.success) {

                dispatch(setError("Failed to delete!"))
                setTimeout(() => {
                    dispatch(setError(""))
                } , 3000)
                return
            }
            else{
             
                Requestdata("Files deleted successfully!")


            }

    }

    const MoveFiles = async () => {
        if (!selectedfiles.length) {
            return
        }
        const response  = await Form_Mutation({ path:   `http://localhost:5000/move`  , method: "PUT" , data: {files: selectedfiles , destination: pathname} })

        if (!response.data.success) {

            dispatch(setError("Failed to move!"))
            setTimeout(() => {
                dispatch(setError(""))
            } , 3000)
            return
        }
        else{
            Requestdata("Files moved to destination!")


        }


    }

    return (
        selectedfiles.length > 0 ? <div className='flex items-center gap-[20px] w-full text-white w-max px-[20px]'>
           {type === "move"  ? <div className='w-full flex items-center gap-[20px]'>
            <>
            
            <button onClick={() => MoveFiles()} disabled={(upathname === "this pc" ||  upathname === pathname) ? true : false} className={(upathname === "this pc" ||  upathname === pathname)  ?  "text-gray-500" : "text-white"} ><ColorizeOutlined sx={{ fontSize: 16 }}/></button>
            <button title='cancel' onClick={() => CancleAction()} className='hover:bg-red-500 opbtns'><CancelOutlined /></button>

            </>

           </div>

           
           :  <>
            <button onClick={() => HandleDelete()} title='delete' className='hover:bg-red-500 opbtns'><DeleteOutlineOutlined sx={{ fontSize: 16 }} /></button>
            <button title='copy' className='hover:bg-gray-500 opbtns'><ContentCopyOutlined sx={{ fontSize: 16 }} /></button>
            <button title='move' onClick={() => HandleMove()}  className='hover:bg-gray-500 opbtns'><DriveFileMoveOutlined sx={{ fontSize: 16 }} /></button>
            <button title='encrypt' className='hover:bg-gray-500 opbtns'><HttpsOutlined sx={{ fontSize: 16 }} /></button>
            <button title='decrypt' className='hover:bg-gray-500 opbtns'><NoEncryptionGmailerrorredOutlined sx={{ fontSize: 16 }} /></button>
            </>}


        </div> : <></>
    )
}
