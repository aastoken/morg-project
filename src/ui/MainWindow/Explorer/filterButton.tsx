import { FunnelIcon } from '@heroicons/react/24/outline';
import Popup from 'reactjs-popup';
import ModalFilter from '../Filter/modalFilter';
import { ReactNode, useId, useState } from 'react';

export default function FilterButton({ setAdvancedFilter }) {
  const [filterRowsData, setFilterRowsData] = useState([]);
  const [allConditions, setAllConditions] = useState(true);
  const popupId = useId();
  return (
    <Popup
      trigger={
        <button aria-describedby={popupId} className="flex w-fit h-full p-2 bg-white">
          <FunnelIcon className="flex w-[24px]" />
        </button>
      }
      aria-describedby={popupId}
      modal
      nested
    >
      {(close: any) => (
        
        <ModalFilter
          type={'filter'}
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