
import { useEffect, useState } from 'react'
import Layout from './Layout'
import { motion } from 'motion/react'
import Loading from './components/Loading'
import { useDispatch } from 'react-redux'
import { ApiThunkFunc } from './redux/apis/api'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { useMainData } from './hooks/useMaindata'
import { useUsername } from './hooks/useUsername'
import { useGetUsernamedataQuery } from "./redux/apis/basequeries";
import { setname } from './redux/user/slice'
import { useActivepath } from './hooks/useUpaths'
import { HandlePath } from './functions/Handlepath'
import { useUpaths } from "./hooks/useUpaths";




export default function App() {


  const [Data, setData] = useState([])
  const {paths} = useUpaths()
  const [PercentUsed, setPercentUsed] = useState<number[]>([])
  const { data: username, isLoading: loadingusername, error: usernameerror } = useGetUsernamedataQuery("/getuser")
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const Maindata = useMainData()
  const { username: uservalue } = useUsername()
  const {pathname} = useActivepath()



  useEffect(() => {

    if (pathname.toLowerCase() === "this pc") {
        
        dispatch(ApiThunkFunc("/getdata"))
    }

    if (!uservalue) {
      if (!loadingusername && !usernameerror) {
        dispatch(setname(username?.username))

      }
    }

  }, [pathname, dispatch, uservalue, username, loadingusername, usernameerror]);

  useEffect(() => {

   
      if (pathname.toLowerCase() === "this pc") {

       

        if (Maindata?.data) {

          for (let a of Maindata.data) {
            let usedper = (a["used"] / a["total"]) * 100;
            setPercentUsed((e) => [...e, Math.floor(usedper)])
          }
          setData(Maindata.data)
        }

  

      if (Maindata.error) {
        console.error(Maindata?.error)
      }


    }

   

  }, [Maindata , pathname])

  return (

    <Layout>

      <div className='flex flex-col gap-[10px]'>
        <p className='p-[20px] text-white'>{pathname}</p>
        {pathname.toLowerCase() === "this pc" ? <>
          {Data.length > 0 ? <div className='flex  gap-[20px] p-[20px]'>



            {Data.map((value, index) => {
              return <div key={index} className='flex hover:bg-gray-900 flex-col justify-center gap-[10px] bg-black p-[20px] w-[500px] rounded-lg h-[150px] rounded-lg items-start'>

                <div className='text-white flex w-full items-center gap-[20px]'>
                  <img src="./icons/icons8-ssd-48.png" alt="Loading" />

                  <p>{value["partition_name"]}</p>



                </div>
                {PercentUsed.map((value, id) => (
                  id === index &&

                  <div className='w-full bg-white' key={index}>

                    <motion.div animate={{ width: [0, `${value}%`] }} className={` h-[20px] flex bg-blue-500 `}>

                    </motion.div>

                  </div>
                ))}


                <div className='flex gap-[20px] text-white w-full items-center'>
                  <p><span className='text-green-500'>Total</span> {Math.floor(value["total"])}GB</p>
                  <p><span className='text-red-500'>Used</span> {Math.floor(value["used"])}GB</p>
                  <p><span className='text-yellow-500'>Free</span> {Math.floor(value["free"])}GB</p>
                </div>

              </div>
            })}

          </div> :
            <Loading />

          }

        </> : <div  className='Scroller flex h-full overflow-y-auto  text-white flex-col gap-[15px]'>

          {Maindata.data.map(( value, index ) =>(

            <button onClick={() => HandlePath(value["path"] , dispatch , paths)} key={index} className='flex px-[20px] text-[13px] items-center gap-[20px]'>
                <img src={value["isdir"] ? "./icons/icons8-folder-48.png" : "./icons/icons8-documents-48.png"} width={20} height={20} alt="" />
                <p className='text-slate-200'>{value["name"]}</p>
                <p className='text-slate-500'>{value["size"]} bytes</p>
         
            </button>

          ))}
         
        </div> }
      </div>


    </Layout>

  )
}
