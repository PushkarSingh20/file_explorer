import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { io } from "socket.io-client";

export default function Navbar() {

  const socket = io("http://127.0.0.1:5000")
  const [SearchedTerm , setSerchedTerm] = useState<string>("")
 


  const HandleSearchedTerm = (e: string) => {
    setSerchedTerm(e)
    socket.emit("searchfiles" , {searched: e })
  }

  socket.on("search_result", (data) => {
    console.log("Found:", JSON.parse(data));
  });


  return (
    <nav className='h-[80px] bg-black w-full flex items-center justify-between px-[20px]' >
        <div className='flex flex-col gap-[7px] justify-center'>
          <h1 className='title text-cyan-500 text-lg'>File explorer</h1>
          <i className='ptitle text-white text-[12px]'>By Pushkar and Anshal</i>
        </div>

        <div className='bg-gray-900 rounded-full h-[50%] text-[12px] w-[500px] px-[20px] text-gray-300 flex items-center'>
            <input placeholder='Search for something...' onChange={(e) => HandleSearchedTerm(e.target.value)} value={SearchedTerm} type="text" className='w-full h-full outline-none bg-transparent foucs:border-2 focus:border-cyan-500' />
            <span><SearchIcon sx={{ fontSize: 14 }}/></span>
        </div>

        <div></div>

        
    </nav>
  )
}
