
import { setRootFolder } from "../../lib/scripts/files";
import config from '../../../morg_config/config.json';

export default function RootFolderForm(){

  return(
    <div  >
      <form action={setRootFolder} className="flex flex-col  text-lg" >
        <label htmlFor="path">Root Library Folder</label>
        <div className="flex flex-row align-text-bottom gap-1 items-center text-xl">
        <input
          type="text"
          id="path"
          name="path"
          defaultValue={`${config.library_root}`}
          className="flex h-fit border-2 px-2 border-amber-300 bg-zinc-100 w-full"
        />
        <button type="submit" className="flex px-2  bg-amber-300 hover:bg-amber-100 rounded-sm border-2 border-white w-fit h-fit">SET</button>
        </div>
      </form>
    </div>
  );
}