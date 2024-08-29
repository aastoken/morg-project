import { DBGenre } from "./Genre"
import { DBTag } from "./Tag"

export type FilterRow = {
  id,
  selectedKey: string,
  selectedComparator: string,
  selectedTags: DBTag[],
  selectedGenres: DBGenre[],
  inputValue: string,
  inputValueMin: string,
  inputValueMax: string
}