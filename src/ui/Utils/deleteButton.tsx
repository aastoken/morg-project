import { TrashIcon } from "@heroicons/react/24/outline";
import Popup from "reactjs-popup";


export default function DeleteButton({handleDelete}:{handleDelete : (any)=>any}){

  return(
    <Popup
    trigger ={<button 
      type="button" 
      className="flex items-center justify-center mr-1 w-8 h-8 bg-red-600 rounded-sm"
      >
        <TrashIcon className="w-6"/>
    </button>}
    nested
    modal >
      {(close:any)=>(
        <div className="flex flex-col w-72 h-52 bg-slate-300 border-4 border-red-600 justify-around items-center ">
          <div className="flex flex-col items-center bg-amber-200 p-3 rounded-md">
            <div className="text-3xl">
            CONFIRM DELETE?
          </div>
          <div>
            This action is not reversable
          </div>
          </div>
          
          
          <div className="flex flex-row w-full justify-around">
            <button className="rounded-sm bg-red-600 text-2xl w-1/3 h-12 text-black hover:text-white" onClick={handleDelete}>DELETE</button>
            <button className="rounded-sm bg-white text-2xl w-1/3 h-12 hover:bg-amber-200" onClick={close}>CANCEL</button>
          </div>
          
        </div>
      )}
        
      
      
    </Popup>
    
  )
}