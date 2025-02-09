import { motion } from "motion/react"
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import { RefreshOutlined } from "@mui/icons-material";
import { HandlePath } from "../functions/Handlepath";
import { useUsername } from '../hooks/useUsername'
import Loading from "./Loading";
import { useDispatch } from "react-redux";
import { useUpaths } from "../hooks/useUpaths";
import { HomeSharp } from "@mui/icons-material";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { setactivepath } from "../redux/upaths/activepath";
import { setactiveindex } from "../redux/upaths/slice";
import { useGetdataMutation } from "../redux/apis/basequeries";
import { setdata } from "../redux/Data/slice";
import { setError } from "../redux/Errors/slice";
import { Requestdata } from "../functions/Requestdata";
import { useActivepath } from "../hooks/useUpaths";

const Aside = () => {

    const { username } = useUsername()
    const { paths, activepathindex } = useUpaths()
    const [GetdataMutation] = useGetdataMutation()
    const { pathname } = useActivepath()
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>()

    async function Datarequest(path: string, method: string, data: Object) {


        const response = await GetdataMutation({ path, method, data })

        return response


    }

    let Basepath = `C:/users/${username}`

    const BasicFiles = [
        {
            "name": "Desktop",
            "path": `${Basepath}/Desktop`,
            "icon": "./icons/icons8-desktop-folder-48.png"
        },
        {
            "name": "Documents",
            "path": `${Basepath}/Documents`,
            "icon": "./icons/icons8-documents-48.png"
        },
        {
            "name": "Downloads",
            "path": `${Basepath}/Downloads`,
            "icon": "./icons/icons8-download-48.png"
        },
        {
            "name": "Pictures",
            "path": `${Basepath}/Pictures`,
            "icon": "./icons/icons8-image-48.png"
        },
        {
            "name": "Music",
            "path": `${Basepath}/Music`,
            "icon": "./icons/icons8-mp3-48.png"
        },
        {
            "name": "Videos",
            "path": `${Basepath}/Videos`,
            "icon": "./icons/icons8-video-file-48.png"
        }
    ]

    const HandleBackword = async () => {

        let path_index = activepathindex - 1

        if (paths[path_index]) {


            if (paths[path_index] !== "this pc") {
                let response = await Datarequest("/getpath", "POST", { "path": paths[path_index] })
                if (response.data.success) {
                    dispatch(setdata(response.data.pathdata))

                }
                else {
                    dispatch(setError("An error occured!"));

                    setTimeout(() => {
                        dispatch(setError(""))
                    }, 3000)

                }
            }


            dispatch(setactivepath(paths[path_index]))
            dispatch(setactiveindex(path_index))
        }


    }

    const HandleForword = async () => {

        let path_index = activepathindex + 1

        if (paths[path_index]) {

            if (paths[path_index] !== "this pc") {
                let response = await Datarequest("/getpath", "POST", { "path": paths[path_index] })



                if (response.data.success) {
                    dispatch(setdata(response.data.pathdata))
                }
                else {
                    dispatch(setError("An error occured!"));

                    setTimeout(() => {
                        dispatch(setError(""))
                    }, 3000)

                }
            }

            dispatch(setactivepath(paths[path_index]))
            dispatch(setactiveindex(path_index))

        }

    }

    const Refresh = () => {
        if (pathname.toLowerCase() === "this pc") {
            return
        }
        Requestdata("", GetdataMutation, dispatch, pathname)
    }
    return (

        <aside className='Scroller w-[20%] h-full bg-black p-[20px] gap-[20px] flex flex-col  overflow-y-auto'>
            {username.trim() !== "" ? <>


                <div className="flex w-full items-center justify-between">

                    <div>

                        <button onClick={() => dispatch(setactivepath("this pc"))}><HomeSharp className="text-white" /></button>
                        <button onClick={() => Refresh()} className="text-white"> <RefreshOutlined /></button>
                    </div>
                    {paths.length > 1 ? <div className='flex text-white items-center gap-[20px] justify-end'>

                        {activepathindex !== 0 && <button onClick={() => HandleBackword()} className="bg-gray-900 w-[40px] h-[40px] rounded-full flex items-center justify-center"><ArrowBackIosNewOutlinedIcon sx={{ fontSize: 13 }} /></button>}

                        {activepathindex !== paths.length - 1 && <button onClick={() => HandleForword()} className="bg-gray-900 w-[40px] h-[40px] rounded-full flex items-center justify-center"><ArrowForwardIosOutlinedIcon sx={{ fontSize: 13 }} /></button>}


                    </div> : <></>}
                </div>

                {BasicFiles.map((value, index) => {
                    return <motion.button onClick={() => HandlePath(value.path, dispatch, paths, activepathindex + 1)} whileHover={{
                        scale: 1.1,
                        transition: { duration: 0.2, ease: 'easeInOut' }
                    }} key={index} className=" text-white text-[12px] flex items-center w-full w-full gap-[20px]">
                        <img src={value.icon} width={20} height={20} alt="loading" />
                        <p>{value.name}</p>
                    </motion.button>
                })}
            </>
                : <Loading />
            }

        </aside>
    )
}


export default Aside