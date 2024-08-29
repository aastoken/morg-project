'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import FilterButton from './filterButton';
import { Prisma } from '@prisma/client';

export default function Search({ setSearchFilter }:{setSearchFilter:(any) => void}) {

  const handleSearch= useDebouncedCallback((term: string) => {
    const query = {
      where: {
        OR: [
          { filename: { contains: term } },
          { folder: { contains: term } },
          { name: { contains: term } },
          { artist: { contains: term } },
          { album: { contains: term } },
          { label: { contains: term } },
          { key: { contains: term } },
          { comment: { contains: term } }
        ],
      },
    };

    setSearchFilter(query);
    console.log("searchFilter set to", query)
  }, 300);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-sm border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        id="search" 
        placeholder="Search..."
        onChange={(e)=>{
          handleSearch(e.target.value);
        }}
        
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      
    </div>
  );
}
