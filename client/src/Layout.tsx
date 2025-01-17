import { ReactNode} from 'react';
import Navbar from './components/Navbar';
import Aside from './components/Aside';

const Layout = ({ children }: { children: ReactNode }) => {



  return (
    <div className="h-[100vh] w-[100vw] bg-[#1c1b19]">
      <Navbar />

      <div className="h-[calc(100%-80px)] w-full flex">
        <Aside  />
        {children}
      </div>
    </div>
  );
};

export default Layout;
