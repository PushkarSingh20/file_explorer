import SearchIcon from '@mui/icons-material/Search';

export default function Navbar() {
  return (
    <nav className='h-[80px] bg-black w-full flex items-center justify-between px-[20px]' >
        <div className='flex flex-col gap-[7px] justify-center'>
          <h1 className='title text-cyan-500 text-lg'>File explorer</h1>
          <i className='ptitle text-white text-[12px]'>By Pushkar and Anshal</i>
        </div>

        <div className='bg-gray-900 rounded-full h-[50%] text-[12px] w-[500px] px-[20px] text-gray-300 flex items-center'>
            <input placeholder='Search for something...' type="text" className='w-full h-full outline-none bg-transparent foucs:border-2 focus:border-cyan-500' />
            <span><SearchIcon sx={{ fontSize: 14 }}/></span>
        </div>

        <div></div>

        
    </nav>
  )
}
