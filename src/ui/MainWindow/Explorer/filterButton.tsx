import { FunnelIcon } from '@heroicons/react/24/outline';
import Popup from 'reactjs-popup';
import ModalFilter from './modalFilter';

export default function FilterButton(){

  return(
    <Popup trigger={<button className="flex w-fit h-full p-2 bg-white"> <FunnelIcon className='flex w-[24px]'/> </button>} modal>    
      <ModalFilter/> 
    </Popup>
    
  );
}