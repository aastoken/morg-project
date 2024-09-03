import { FunnelIcon } from '@heroicons/react/24/outline';
import Popup from 'reactjs-popup';
import ModalFilter from '../Filter/modalFilter';
import { ReactNode, useEffect, useId, useState } from 'react';
import { FilterData } from '../../../lib/models';
import { buildAdvancedQuery } from '../../../lib/scripts/toolbox';

export default function FilterButton({ setAdvancedFilter }) {
  const [filterData, setFilterData] = useState<FilterData>({
    id:-1,
    allConditions: true,
    filterRows: []
  });
  const popupId = useId();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This will run only on the client
    setIsClient(true);
  }, []);

  const handleApplyFilter = (appliedFilterData: FilterData) => {
    setFilterData(appliedFilterData);
    const explorerQuery = buildAdvancedQuery(appliedFilterData.filterRows, appliedFilterData.allConditions);
    console.log("AdvancedFilter:", explorerQuery);
    setAdvancedFilter(explorerQuery);
  };

  return (
    <>{isClient && (<Popup
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
          filterData={filterData}
          setFilterData={setFilterData}
          onApplyFilter={handleApplyFilter}
          close={close}
        />
        
      )}
    </Popup>)}
    </>
  );
}