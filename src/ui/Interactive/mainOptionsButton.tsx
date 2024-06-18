import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import Link from 'next/link';

export default function MainOptionsButton(){

  return(
  
    <Link
    className="flex flex-row w-fit items-center gap-x-1 rounded-md px-2 py-1 text-lg bg-amber-400 hover:bg-amber-100"
    href="/options"
    >     
        OPTIONS
        <div className="size-5">
        <Cog6ToothIcon/>
      </div>
    </Link>

  );
}