'use client';
import { useEffect, useRef, useState } from "react";
import ExplorerTable from "./explorerTable";
import Search from "./search";

export default function Explorer(){
  

  return(
    <div  className="flex flex-col max-h-full h-full">
    
      <div className="w-full max-w-full flex-none">
        
        <div className='py-1 px-1 bg-slate-800 border-t-2 border-l-2 border-r-2 border-amber-400'>
          <Search placeholder="Search..." />
        </div>
      </div>
      <div className='min-h-0'>
        <ExplorerTable />
      </div>
      
    </div>
  );
}