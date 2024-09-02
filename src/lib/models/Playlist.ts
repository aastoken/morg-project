import { FilterData } from './Filter';
import { PlaylistTrack } from './Track';

export type Playlist = {
  id: number,
  name: string,
  description: string,
  filterData: FilterData,
  filterDataId: number,
  tracks: PlaylistTrack[]
}