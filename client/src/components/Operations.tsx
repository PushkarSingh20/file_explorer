import { FC, JSX, useState } from 'react'
import { ContentCopyOutlined, DeleteOutlineOutlined, DriveFileMoveOutlined, HttpsOutlined, NoEncryptionGmailerrorredOutlined, ColorizeOutlined, CancelOutlined, DriveFileRenameOutlineOutlined } from '@mui/icons-material'
import { Requestdata } from '../functions/Requestdata';
import { useGetdataMutation } from '../redux/apis/basequeries';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { setSelectedFiles, setType } from '../redux/selected/slice';
import { setError } from '../redux/Errors/slice';
import { useSeletedFiles } from '../hooks/useSelectedFiles';
import { setDialogType, setState } from '../redux/Dialog/slice';

interface Propdata {

    selectedfiles: string[],
    pathname: string,
    setLoadingElem: any


}


export const Operations: FC<Propdata> = ({ selectedfiles, pathname, setLoadingElem }): JSX.Element => {

    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const [Form_Mutation] = useGetdataMutation();
    const { type } = useSeletedFiles();

    const [upathname, setupatname] = useState<string>("")

    const CopyFiles = async () => {
        if (selectedfiles.length === 0) {
            return
        }
        const response = await Form_Mutation({ path: `http://localhost:5000/copy`, method: "PUT", data: { files: selectedfiles, destination: pathname } })
        setLoadingElem(true)
        if (!response.data.success) {

            dispatch(setError("Failed to copy!"))
            setTimeout(() => {
                dispatch(setError(""))
            }, 3000)
            return
        }
        else {
            Requestdata(`Files copied to ${pathname}!`, Form_Mutation, dispatch, pathname)
        }

        setLoadingElem(false)
    }

    const HandleMoveCopy = async (type: string) => {
        setupatname(pathname)
        dispatch(setType(type))
        dispatch(setSelectedFiles(selectedfiles))
    }

    const CancleAction = () => {
        dispatch(setType(null))
        dispatch(setSelectedFiles([]))
    }

    const Renamepath = () => {
        dispatch(setState(true))
        dispatch(setDialogType("rename"))
    }

    const HandleDelete = async () => {
        dispatch(setState(true))
        dispatch(setDialogType("delete"))

    }

    const MoveFiles = async () => {
        if (selectedfiles.length === 0) {
            return
        }
        setLoadingElem(true)
        const response = await Form_Mutation({ path: `http://localhost:5000/move`, method: "PUT", data: { files: selectedfiles, destination: pathname } })

        if (!response.data.success) {

            dispatch(setError("Failed to move!"))
            setTimeout(() => {
                dispatch(setError(""))
            }, 3000)
            return
        }
        else {
            Requestdata("Files moved to destination!", Form_Mutation, dispatch, pathname)


        }
        setLoadingElem(false)

    }

    const HandleEncrypt = async () => { 

        if (selectedfiles.length === 0) {
            return
        }

        setLoadingElem(true)
        const response = await Form_Mutation({ path: `http://localhost:5000/encryptfiles`, method: "POST", data: { files: selectedfiles } })

        if (response.data.success) {


            Requestdata("Files encrypted!", Form_Mutation, dispatch, pathname)
        }
        else {

            dispatch(setError(response.data.message))
            setTimeout(() => {
                dispatch(setError(""))
            }, 3000)

            dispatch(setSelectedFiles([]))
            dispatch(setType(null))
        }

        setLoadingElem(false)
    }

    const HandleDecrypt = async () => {
        if (selectedfiles.length === 0) {
            return
        }

        setLoadingElem(true)
        const response = await Form_Mutation({ path: `http://localhost:5000/decryptfiles`, method: "POST", data: { files: selectedfiles } })

        if (response.data.success) {


            Requestdata("Files decrypted!", Form_Mutation, dispatch, pathname)
        }
        else {

            dispatch(setError(response.data.message))
            setTimeout(() => {
                dispatch(setError(""))
            }, 3000)

            dispatch(setSelectedFiles([]))
            dispatch(setType(null))
        }

        setLoadingElem(false)    
    }

    return (
        selectedfiles.length > 0 ? <div className='flex items-center gap-[20px] w-full text-white w-max px-[20px]'>
            {type === "copy" ? (<div className='w-full flex items-center gap-[20px]'>


                <button onClick={() => CopyFiles()} disabled={(upathname === "this pc" || upathname === pathname) ? true : false} className={(pathname === "this pc" || upathname === pathname) ? "text-gray-500" : "text-white"} ><ColorizeOutlined sx={{ fontSize: 16 }} /></button>
                <button title='cancel' onClick={() => CancleAction()} className='hover:bg-red-500 opbtns'><CancelOutlined /></button>



            </div>
            ) : (type === "move" ? <div className='w-full flex items-center gap-[20px]'>


                <button onClick={() => MoveFiles()} disabled={(upathname === "this pc" || upathname === pathname) ? true : false} className={(pathname === "this pc" || upathname === pathname) ? "text-gray-500" : "text-white"} ><ColorizeOutlined sx={{ fontSize: 16 }} /></button>
                <button title='cancel' onClick={() => CancleAction()} className='hover:bg-red-500 opbtns'><CancelOutlined /></button>



            </div>


                : <>
                    <button onClick={() => HandleDelete()} title='delete' className='hover:bg-red-500 opbtns'><DeleteOutlineOutlined sx={{ fontSize: 16 }} /></button>

                    {selectedfiles.length === 1 ? <button onClick={() => Renamepath()} title='Rename' className='hover:bg-gray-500 opbtns'><DriveFileRenameOutlineOutlined sx={{ fontSize: 16 }} /></button> : <></>}

                    <button title='copy' onClick={() => HandleMoveCopy("copy")} className='hover:bg-gray-500 opbtns'><ContentCopyOutlined sx={{ fontSize: 16 }} /></button>

                    <button title='move' onClick={() => HandleMoveCopy("move")} className='hover:bg-gray-500 opbtns'><DriveFileMoveOutlined sx={{ fontSize: 16 }} /></button>

                    <button title='encrypt' onClick={() => HandleEncrypt()} className='hover:bg-gray-500 opbtns'><HttpsOutlined sx={{ fontSize: 16 }} /></button>
                    <button title='decrypt' onClick={() => HandleDecrypt()} className='hover:bg-gray-500 opbtns'><NoEncryptionGmailerrorredOutlined sx={{ fontSize: 16 }} /></button>
                </>)}


        </div> : <></>
    )
}
