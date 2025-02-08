import { FC, JSX } from 'react'
import { ContentCopyOutlined, DeleteOutlineOutlined, DriveFileMoveOutlined, HttpsOutlined, NoEncryptionGmailerrorredOutlined } from '@mui/icons-material';
import { useGetdataMutation } from '../redux/apis/basequeries'
import { setdata } from '../redux/Data/slice';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { setSelectedFiles } from '../redux/selected/slice';
import { setError } from '../redux/Errors/slice';
import { setMessage } from '../redux/Message/slice';

interface Propdata {

    selectedfiles: string[],
    pathname: string,


}


export const Operations: FC<Propdata> = ({selectedfiles , pathname }): JSX.Element => {

    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const [Form_Mutation] = useGetdataMutation();
    

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
                 const response =    await Form_Mutation({ path:   `http://localhost:5000/getpath`  , method: "POST" , data: {path:  pathname}})

                    if (response.data.success) {
                        dispatch(setSelectedFiles([]))
                        dispatch(setdata(response.data.pathdata))
                        dispatch(setMessage("Delated!"))
                        setTimeout(() => {
                           dispatch(setMessage(""))
                        } , 3000)
                    }
                    else{
                        dispatch(setError("An error occured!"))
                       
                        return
                    }


            }

    }

    return (
        selectedfiles.length > 0 ? <div className='flex items-center gap-[20px] w-full text-white w-max px-[20px]'>

            <button onClick={() => HandleDelete()} title='delete' className='hover:bg-red-500 opbtns'><DeleteOutlineOutlined sx={{ fontSize: 16 }} /></button>
            <button title='copy' className='hover:bg-gray-500 opbtns'><ContentCopyOutlined sx={{ fontSize: 16 }} /></button>
            <button title='move' className='hover:bg-gray-500 opbtns'><DriveFileMoveOutlined sx={{ fontSize: 16 }} /></button>
            <button title='encrypt' className='hover:bg-gray-500 opbtns'><HttpsOutlined sx={{ fontSize: 16 }} /></button>
            <button title='decrypt' className='hover:bg-gray-500 opbtns'><NoEncryptionGmailerrorredOutlined sx={{ fontSize: 16 }} /></button>


        </div> : <></>
    )
}
