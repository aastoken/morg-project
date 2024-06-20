import { AdjustmentsHorizontalIcon, TagIcon} from "@heroicons/react/24/outline";
import Link from 'next/link';
export default function EditTagsButton(){

  return(
  
    <Link 
    className="flex flex-row w-fit items-center gap-x-1 rounded-md px-2 py-1 text-lg bg-amber-400 hover:bg-amber-100"
    href="/edit-tags"
    >   
        TAGS
        <div className="size-5">
        <TagIcon/>
      </div>
    </Link>

  );
}