import { FunnelIcon } from '@heroicons/react/24/outline';
import Popup from 'reactjs-popup';
import ModalFilter from '../Filter/modalFilter';
import { ReactNode, useState } from 'react';

export default function FilterButton({ setAdvancedFilter }) {
  const [filterRowsData, setFilterRowsData] = useState([]);
  const [allConditions, setAllConditions] = useState(true);

  return (
    <Popup
      trigger={
        <button className="flex w-fit h-full p-2 bg-white">
          <FunnelIcon className="flex w-[24px]" />
        </button>
      }
      modal
      nested
    >
      {(close: any) => (
        
        <ModalFilter
          setAdvancedFilter={setAdvancedFilter}
          filterRowsData={filterRowsData}
          setFilterRowsData={setFilterRowsData}
          allConditions={allConditions}
          setAllConditions={setAllConditions}
          close={close}
        />
        
      )}
    </Popup>
  );
}