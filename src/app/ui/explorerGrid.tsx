'use client';
import { ColumnChooser, ColumnDirective, ColumnsDirective, GridComponent, Inject, Toolbar, Resize } from '@syncfusion/ej2-react-grids';
import { getAllTracks } from 'lib/actions';
import { Track } from 'lib/models';
import { useEffect, useState } from 'react';

export default function ExplorerGrid(){
const tracks: Track[] = []
const [data, setData] = useState(tracks);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await getAllTracks();;
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getData();
  }, []);

  const toolbarOptions = ['ColumnChooser'];
return(
   <GridComponent dataSource={data} toolbar={toolbarOptions} allowResizing={true} showColumnChooser={true} height={315}>
        <Inject services={[Resize]}/>
        <ColumnsDirective>
            <ColumnDirective field='name' headerText='Name' width='150' textAlign="Right"/>
            <ColumnDirective field='artist' headerText='Artist' width='150'/>
            <ColumnDirective field='length' headerText='Length' width='150' format="C2" textAlign="Right"/>
            <ColumnDirective field='bpm' headerText='BPM' width='150' format="yMd" textAlign="Right"/>
            <ColumnDirective field='album' headerText='Album' width='150' textAlign="Right"/>
            <ColumnDirective field='label' headerText='Label' width='150' format="yMd" textAlign="Right"/>
            <ColumnDirective field='key' headerText='Key' width='150'/>
            <ColumnDirective field='dateAdded' headerText='Date Added' width='150' textAlign="Right"/>
            <ColumnDirective field='rating' headerText='Rating' width='150' textAlign="Right"/>
            <ColumnDirective field='comment' headerText='Comment' width='150' textAlign="Right"/>
            <ColumnDirective field='bitrate' headerText='Bitrate' width='150' textAlign="Right"/> 
        </ColumnsDirective>
        <Inject services={[Toolbar, ColumnChooser]}/>
    </GridComponent>
)
}