
import { useEffect, useState } from 'react'
import Layout from './Layout'
import { motion } from 'motion/react'
import Loading from './components/Loading'
import { useDispatch } from 'react-redux'
import { ApiThunkFunc } from './redux/apis/api'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { useMainData } from './hooks/useMaindata'
import { useUsername } from './hooks/useUsername'
import { useGetBaseQueryQuery } from "./redux/apis/basequeries";
import { setname } from './redux/user/slice'
import { useActivepath } from './hooks/useUpaths'
import { HandlePath } from './functions/Handlepath'
import { useUpaths } from "./hooks/useUpaths";
import { useGetdataMutation } from './redux/apis/basequeries'
import { setdata } from './redux/Data/slice'
import { setactiveindex } from './redux/upaths/slice'
import { setactivepath } from './redux/upaths/activepath'
import { setpaths } from './redux/upaths/slice'
import { setSelectedFiles } from './redux/selected/slice'
import { useSeletedFiles } from './hooks/useSelectedFiles'
import { Operations } from './components/Operations'
import { RenameDialog } from './components/RenameDialog'
import { setError } from './redux/Errors/slice'
import { useDialogState } from './hooks/useDialogData'
import { useError } from './hooks/useError'
import { useMessage } from './hooks/useMessage'


export default function App() {


  const [Data, setData] = useState([])
  const { paths, activepathindex } = useUpaths()

  const { error: Error } = useError();
  const { message: Message } = useMessage();
  const {dialogType , state} = useDialogState()
  const [PercentUsed, setPercentUsed] = useState<number[]>([])
  const { selectedfiles, type } = useSeletedFiles()

  const { data: username, isLoading: loadingusername, error: usernameerror } = useGetBaseQueryQuery("/getuser")
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  const Maindata = useMainData()
  const { username: uservalue } = useUsername()

  const { pathname } = useActivepath()
  const [GetdataMutation] = useGetdataMutation()




  interface filesProps {

    partition_name: string,
    total: number,
    used: number,
    free: number,

  }

  let filesIcons = {

    ".rar": "icons8-rar-48.png",
    ".html": "icons8-html-48.png",
    ".css": "icons8-css-48.png",
    ".js": "icons8-js-48.png",
    ".python": "icons8-python-48.png",
    ".dll": "icons8-dll-48.png",
    ".pdf": "icons8-pdf-48.png",
    ".txt": "icons8-txt-48.png",
    ".xml": "icons8-xml-48.png",
    ".png": "icons8-image-48.png",
    ".gif": "icons8-image-48.png",
    ".mp4": "icons8-video-file-48.png",
    ".jpg": "icons8-image-48.png",
    ".mp3": "icons8-mp3-48.png",
    ".cpp": "icons8-c-48.png",
    ".msi": "icons8-msi-64.png",
    ".exe": "icons8-exe-64.png",
    ".ini": "icons8-ini-47.png",
    ".lnk": "icons8-lnk-64.png",


  }

  function GiveFileIcon(fileext: keyof typeof filesIcons, isdir: Boolean) {

    let icon = filesIcons[fileext]

    if (!isdir) {

      return <img src={(icon && `./icons/${filesIcons[fileext]}`) || "./icons/icons8-documents-48.png"} height={25} width={25} alt="" />

    }

    return <img src={`./icons/icons8-folder-48.png`} height={25} width={25} alt="" />

  }

  useEffect(() => {

    if (pathname && type !== "move" && type !== "copy") {

      dispatch(setSelectedFiles([]))

    }


  }, [pathname, dispatch, type])

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
        dispatch(setError("An error occured!"))

      }


    }



  }, [Maindata, pathname, dispatch])


  async function Datarequest(path: string, method: string, data: Object) {


    const response = await GetdataMutation({ path, method, data })

    return response


  }

  const Handledrive = async (path: string) => {
    let pathname = path.replace(/\\/g, "/")

    let response = await Datarequest("/getpath", "POST", { "path": pathname })


    if (response.data.pathdata) {

      dispatch(setdata(response.data.pathdata))
      dispatch(setpaths([...paths, pathname]))
      dispatch(setactivepath(pathname))
      dispatch(setactiveindex(activepathindex + 1))
    }
    else {
      setError("An error occured!")
      setTimeout(() => {
        setError("")
      }, 3000)

    }
  }

  const HandleSelectedFiles = (e: any, value: { path: string }) => {
    e.preventDefault()
    if (e.key !== "s") {
      return
    }
    let files: string[] = [...selectedfiles];


    if (!files.includes(value.path)) {
      files.push((value as { path: string }).path);
      dispatch(setSelectedFiles(files))


    }
  } 

  const HandleIsChecked = (value: string) => {
    let files: string[] = [...selectedfiles];

    if (files.includes(value)) {
      let filtered = files.filter((e) => e !== value)
      dispatch(setSelectedFiles(filtered))


    }


  }

  return (

    <Layout>

      <div className='flex flex-col gap-[10px] w-full h-full relative'>
        {state && dialogType === "rename" &&   <RenameDialog />}

        <div className=' w-full flex items-center justify-between'>

          <p className='p-[20px] text-white'>{pathname}</p>

          <Operations pathname={pathname} selectedfiles={selectedfiles} />


        </div>

        {Error?.trim() !== "" && <div className='flex items-center justify-center   text-white w-full'>
          <p className='text-[12px] rounded-lg  w-[90%] p-[3px] flex bg-red-500'>{Error}</p>
        </div>}

        {Message?.trim() !== "" && <div className='flex items-center justify-center  text-white w-full'>
          <p className='text-[12px] rounded-lg  w-[90%] p-[3px] flex bg-green-500'>{Message}</p>
        </div>}

        {pathname.toLowerCase() === "this pc" ? <>
          {Data.length > 0 ? <div className='flex  gap-[20px] p-[20px]'>


            {Data.map((value: filesProps, index) => {
              return <button key={index} onClick={() => Handledrive(value.partition_name)} className='flex hover:bg-gray-900 flex-col justify-center gap-[10px] bg-black p-[20px] w-[500px] rounded-lg h-[150px] rounded-lg items-start'>

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
                  <p><span className='text-green-500'>Total</span> {Math.floor(value.total)}GB</p>
                  <p><span className='text-red-500'>Used</span> {Math.floor(value.used)}GB</p>
                  <p><span className='text-yellow-500'>Free</span> {Math.floor(value.free)}GB</p>
                </div>

              </button>
            })}

          </div> :
            <Loading />

          }

        </> : <div className='Scroller flex h-full overflow-y-auto p-[10px] text-white flex-col gap-[15px]'>

          {Maindata.data.map((value, index) => (

            <div key={index} className='flex items-center '>
              {selectedfiles.includes(value["path"]) && <input type="checkbox" onChange={() => HandleIsChecked(value["path"])} checked={true} className='outline-none w-[15px] h-[15px]' />}

              <button onKeyDown={(e) => HandleSelectedFiles(e, value)} onDoubleClick={() => HandlePath(value["path"], dispatch, paths, paths.length)} key={index} className='flex px-[20px] text-[13px] items-center gap-[20px]'>

                {GiveFileIcon(value["ext"], value["isdir"])}

                <p className='text-slate-200'>{value["name"]} </p>
                <p className='text-slate-500'>{value["size"]} bytes</p>

              </button>
            </div>

          ))}

        </div>}


      </div>


    </Layout>

  )
}
