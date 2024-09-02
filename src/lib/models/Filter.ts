import { DBGenre } from "./Genre"
import { DBTag } from "./Tag"

export type FilterRow = {
  id: number,
  selectedKey: string,
  selectedComparator: string,
  selectedTags: DBTag[],
  selectedGenres: DBGenre[],
  inputValue: string,
  inputValueMin: string,
  inputValueMax: string
}

export type FilterData = {
  id: number,
  allConditions: boolean,
  filterRows: FilterRow[]
}