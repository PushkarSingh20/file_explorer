import { easeInOut } from 'motion'
import {motion} from 'motion/react'

export default function Loading() {
    return (
        <div className='w-full h-full flex items-center justify-center'>

            <motion.img src="../icons/loading_spinner.png" animate={{ width: [0, 40 , 0] , transition: [easeInOut , Infinity] ,  }} width={40} height={40} className="mix-blend-screen" alt="" />

        </div>
    )
}
