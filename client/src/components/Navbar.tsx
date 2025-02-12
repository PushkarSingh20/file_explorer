import SearchIcon from '@mui/icons-material/Search';
import { useState, useEffect, useMemo } from 'react';
import { io } from "socket.io-client";
import { debounce } from 'lodash';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { HandlePath } from '../functions/Handlepath';
import { useUpaths } from '../hooks/useUpaths';
import { CancelOutlined } from '@mui/icons-material';

export default function Navbar() {

  const socket = useMemo(() => io("http://127.0.0.1:5000"), []);
  const [SearchedTerm, setSerchedTerm] = useState<string>("");
  const [SearchedData, setSearchedData] = useState<string[]>([]);
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const { paths } = useUpaths()
  const [Loading, setLoading] = useState(true)
  const debouncedChangeHandler = useMemo(
    () =>
      debounce((value) => {
      
        socket.emit("searchfiles", { searched: value });
      }, 1000),
    [socket]
  );

  useEffect(() => {
    return () => debouncedChangeHandler.cancel();
  }, [debouncedChangeHandler]);

  useEffect(() => {
    const handleSearchResult = (data: any) => {

      setSearchedData((e) => [...e, JSON.parse(data)[0]])
    };

    socket.on("search_result", handleSearchResult);
    socket.on("time_out", (data) => {
     
      setLoading(false)
      socket.off("search_result", handleSearchResult);
      
    });
    return () => {
      socket.off("search_result", handleSearchResult);
      
    };
  }, [socket]);

  const handleChange = (e: any) => {
    setSerchedTerm(e.target.value);
    setSearchedData([]);
    if (e.target.value.trim() !== "") {
      debouncedChangeHandler(e.target.value);
    }
  };

  const HandleBrowsedPath = async (pathval: string[], type: string) => {
    if (type === "root") {

      await HandlePath(pathval[0], dispatch, paths)

    }
    else {
      let npath = `${pathval[0]}/${pathval[1]}`;
      await HandlePath(npath, dispatch, paths)

    }

  }

  const CancelSearch = () => {
    setSearchedData([])
    setSerchedTerm("")
  }

  return (
    <nav className='h-[80px] bg-black w-full flex items-center justify-between px-[20px] ' >

      <div className='flex flex-col gap-[7px] justify-center'>
        <h1 className='title text-cyan-500 text-lg'>File explorer</h1>
        <i className='ptitle text-white text-[12px]'>By Pushkar and Anshal</i>
      </div>

      <div className=' text-[12px] w-[600px]   text-gray-300 h-[50%] flex items-center flex-col '>
        <div className='w-full h-full bg-gray-900 rounded-full px-[20px]  flex  items-center'>

          <input placeholder='Search for something...' onChange={(e) => handleChange(e)} value={SearchedTerm} type="text" className='w-full h-full outline-none bg-transparent foucs:border-2 focus:border-cyan-500' />

          {SearchedData.length > 0 ? <button onClick={() => CancelSearch()}><CancelOutlined sx={{ fontSize: 14 }} /></button> : <span><SearchIcon sx={{ fontSize: 14 }} /></span>}

        </div>
        {SearchedData?.length > 0 && <div className='Scroller absolute w-[600px] z-[1] bg-black text-white max-h-[500px] top-[10%] p-[20px] overflow-y-auto rounded-lg flex flex-col gap-[20px]'>

          {SearchedData.map((value, index) => (
            <>
              <div className='flex flex-col gap-[20px] p-[10px] border-b-2 border-gray-600'>

                <button className='flex hover:text-gray-300' onClick={() => HandleBrowsedPath([value[0]], "root")} key={index}>{value[0]}</button>
                <div className='flex items-center gap-[20px]'>
                  <button onClick={() => HandleBrowsedPath([value[0], value[1]], "dir")} className='text-[crimson] flex items-center text-[10px] gap-[10px]'>Folder: <p className='text-white'>{value[1]}</p></button>
                  <span className='text-[crimson] flex items-center text-[10px] gap-[10px]'>File name: <p className='text-white'>{value[2]}</p></span>
                </div>

              </div>
              

            </>
          ))}
      
          {Loading ? "Loading..." : <></>}

         
        </div>}

        {(SearchedTerm.trim() !== "" && SearchedData.length === 0  && !Loading )? <p className=' absolute bg-black  text-white top-[14%] bg-black w-[600px] p-[10px] rounded-lg flex items-center justify-center'>Nothing found!</p> : ""}

      </div>
      <span></span>


    </nav>
  );
}
