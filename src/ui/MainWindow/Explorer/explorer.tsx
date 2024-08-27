'use client';
import { useEffect, useRef, useState } from "react";
import ExplorerTable from "./explorerTable";
import Search from "./search";
import FilterButton from "./filterButton";
import { Track } from "../../../lib/models";
import { Prisma } from "@prisma/client";

export default function Explorer({playlistFilter, onTrackSelect}:{playlistFilter, onTrackSelect: (track: Track) => void}){
  
  const [searchFilter, setSearchFilter] = useState<any>({});
  const [advancedFilter, setAdvancedFilter] = useState<any>({});

  const mergeQueries = (
    playlistFilter: Prisma.trackFindManyArgs | undefined,//Si no es necesario incluir un grupo select: probar solo con trackWhereInput 
    advancedFilter: Prisma.trackFindManyArgs | undefined,
    searchFilter: Prisma.trackFindManyArgs | undefined,
  ): Prisma.trackFindManyArgs => {

    const mergedQuery: Prisma.trackFindManyArgs = {
      include: {
        genres: true,
        tags: {
          include:{
            type:true
          }
        }      
      },
      where: {
        AND: [
          playlistFilter?.where || {},
          advancedFilter?.where || {},
          searchFilter?.where || {}
        ],
      }
    };
  
    return mergedQuery;
  };
  const initialQuery = mergeQueries(playlistFilter, advancedFilter, searchFilter)//PlaylistFilter + AdvancedFilter + SearchFilter
  const [explorerQuery, setExplorerQuery] = useState<Prisma.trackFindManyArgs>(initialQuery) 
  
  useEffect(() => {
    const updatedQuery = mergeQueries(playlistFilter, advancedFilter, searchFilter)
    setExplorerQuery(updatedQuery)
    console.log("Updated Explorer Query", explorerQuery)
  }, [playlistFilter, advancedFilter, searchFilter]);

  return(
    <div  className="flex flex-col max-h-full h-full">
    
      <div className="w-full max-w-full flex-none">
        
        <div className='flex items-center justify-between py-1 px-1 bg-slate-800 border-t-2 border-l-2 border-r-2 border-amber-400'>
          <Search setSearchFilter={setSearchFilter} />
          <FilterButton setAdvancedFilter={setAdvancedFilter}/>
        </div>
      </div>
      <div className='min-h-0 flex-grow'>
        <ExplorerTable explorerQuery={explorerQuery} onTrackSelect = {onTrackSelect}/>
      </div>
      
    </div>
  );
}