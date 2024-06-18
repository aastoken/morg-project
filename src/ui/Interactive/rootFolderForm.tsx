
import { setRootFolder } from "../../lib/scripts/files";


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
          defaultValue="F:/Musica/Test_Music/"
          className="flex h-fit border-2 px-2 border-amber-300 bg-zinc-100 w-fit"
        />
        <button type="submit" className="flex px-2  bg-amber-300 hover:bg-amber-100 rounded-sm border-2 border-white w-fit h-fit">SET</button>
        </div>
      </form>
    </div>
  );
}