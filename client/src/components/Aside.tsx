import { motion } from "motion/react"
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import { HandlePath } from "../functions/Handlepath";
import { useUsername } from '../hooks/useUsername'
import Loading from "./Loading";
import { useDispatch } from "react-redux";
import { useUpaths } from "../hooks/useUpaths";

import { ThunkDispatch } from "@reduxjs/toolkit";

const Aside = () => {
    const { username } = useUsername()
    const {paths} = useUpaths()
    
    const dispatch = useDispatch<ThunkDispatch <any, any, any>>()


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


   

    return (

        <aside className='Scroller w-[20%] h-full bg-black p-[20px] gap-[20px] flex flex-col  overflow-y-auto'>
          {username.trim() !== "" ?   <>
                <div className='flex text-white items-center gap-[20px] justify-end'>

                    <button className="bg-gray-900 w-[40px] h-[40px] rounded-full flex items-center justify-center"><ArrowBackIosNewOutlinedIcon sx={{ fontSize: 13 }} /></button>
                    <button className="bg-gray-900 w-[40px] h-[40px] rounded-full flex items-center justify-center"><ArrowForwardIosOutlinedIcon sx={{ fontSize: 13 }} /></button>



                </div>

                {BasicFiles.map((value, index) => {
                    return <motion.button onClick={() => HandlePath(value.path , dispatch , paths)} whileHover={{
                        scale: 1.1,
                        transition: { duration: 0.2, ease: 'easeInOut' }
                    }} key={index} className=" text-white text-[12px] flex items-center w-full w-full gap-[20px]">
                        <img src={value.icon} width={20} height={20} alt="loading" />
                        <p>{value.name}</p>
                    </motion.button>
                })}
            </>
            : <Loading/>
            }

        </aside>
    )
}


export default Aside