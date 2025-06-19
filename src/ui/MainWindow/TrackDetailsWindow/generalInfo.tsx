import { useEffect, useState } from "react";
import { DBGenre, DBTag, DBTagType, DBTrack } from "../../../lib/models";
import { getTagTypesFromTagArray } from "../../../lib/scripts/toolbox";
import GenresVisualizer from "../GenreBrowser/genresVisualizer";
import TagTypesVisualizer from "../TagBrowser/tagTypesVisualizer";
import { Button } from "../../Utils/button";
import Popup from "reactjs-popup";
import TagBrowser from "../TagBrowser/tagBrowser";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import GenreBrowser from "../GenreBrowser/genreBrowser";
import { updateTrackFromDBTrack } from "../../../lib/actions";
import { writeTrackToFile } from "../../../lib/actions/writeLibrary";

export default function GeneralInfo({selectedTrack, onSave}:{selectedTrack:DBTrack|null, onSave: () => void;}){
    const [tagTypes, setTagTypes] = useState<DBTagType[]>([]);
    const [editedTrack, setEditedTrack] = useState<DBTrack | null>(null);
    useEffect(() => {
        if (selectedTrack) {
          setEditedTrack({ ...selectedTrack });
          const updatedTagTypes = getTagTypesFromTagArray(selectedTrack.tags);
          setTagTypes(updatedTagTypes);
        } else {
          setEditedTrack(null);
          setTagTypes([]); // clear if no track
        }
      }, [selectedTrack]);

    
    const handleTagSelect = (selectedTag: DBTag) => {
      if (!editedTrack) return;

      const tagExists = editedTrack.tags.some((t) => t.id === selectedTag.id);
      const updatedTags = tagExists
        ? editedTrack.tags.filter((t) => t.id !== selectedTag.id) // remove
        : [...editedTrack.tags, selectedTag]; // add

      setEditedTrack({ ...editedTrack, tags: updatedTags });
      setTagTypes(getTagTypesFromTagArray(updatedTags));
    };

    const handleGenreSelect = (selectedGenre: DBGenre) => {
      if (!editedTrack) return;

      const genreExists = editedTrack.genres.some((g) => g.id === selectedGenre.id);
      const updatedGenres = genreExists
        ? editedTrack.genres.filter((g) => g.id !== selectedGenre.id) // remove
        : [...editedTrack.genres, selectedGenre]; // add

      setEditedTrack({ ...editedTrack, genres: updatedGenres });
    };
  
    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      if (!editedTrack) return;
      console.log("Edited track: "+ JSON.stringify(editedTrack, null, 2))
      console.log("Edited track's length: "+editedTrack.length)
      try {
        await updateTrackFromDBTrack(editedTrack);
        await writeTrackToFile(editedTrack);
        console.log("Track updated successfully!")
        onSave();
      } catch (error) {
        console.error(error);
        console.log("Error updating track.");
      }
    };
     
  if (!editedTrack) {
    return (
    <div className="flex flex-col items-top justify-left  w-full p-1 bg-slate-100 space-y-2">
        <div className="flex flex-row w-full space-x-2">
            <div className="flex flex-col  w-3/6 bg-slate-300 px-2 py-1">
                <p className="text-xl"><strong>Title</strong></p>
                <p className="text-lg">Artist</p>
                <p className="text-sm text-slate-500">File name</p>
            </div> 
            <div className="flex flex-col flex-wrap  w-1/12 h-full bg-slate-300 px-2">
                <p className="text-xl">BPM</p>
                <p className="text-lg">0</p>
                <p className="text-xl">KEY</p>
                <p className="text-lg">None</p>
            </div>
            <div className="flex flex-col w-1/12 flex-grow overflow-y-auto bg-slate-300">
                <p className="text-xl">Genre</p>
                <div className="bg-slate-200 h-full">
                

                </div>
            </div>
            <div className="flex flex-col w-5/12 flex-grow overflow-y-auto bg-slate-300">
                <p className="text-xl">Tags</p>
                <div className="bg-slate-200 h-full">
                

                </div>
            </div>
           
            
        </div>
        <div className="flex flex-row w-full justify-left space-x-2">
        <p className="bg-slate-300 w-1/3 px-2"><strong>Album:</strong> </p>
        <p className="bg-slate-300 w-1/3 px-2"><strong>Label:</strong>  </p>
        <p className="bg-slate-300 w-1/3 px-2"><strong>Rating:</strong>  </p>
        
        </div>
    </div>)
  }

  return (
    
    <form
      id="trackDetailsForm"
      className="flex flex-col items-top justify-left w-full p-1 bg-slate-100 space-y-2"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-row w-full space-x-2">
        <div className="flex flex-col w-3/6 bg-slate-300 rounded px-2 py-1">
          <input
            className="text-xl font-bold bg-slate-200  p-1"
            value={editedTrack.name ?? ""}
            onChange={(e) => setEditedTrack({ ...editedTrack, name: e.target.value })}
            placeholder="Title"
          />
          <input
            className="text-lg bg-slate-200  p-1"
            value={editedTrack.artist ?? ""}
            onChange={(e) => setEditedTrack({ ...editedTrack, artist: e.target.value })}
            placeholder="Artist"
          />
          <p className="text-sm text-slate-500">{editedTrack.filename}</p>
        </div>
        <div className="flex flex-col items-center w-1/12 h-full rounded bg-slate-300 px-2">
          <p className="text-xl">BPM</p>
          <input
            className="text-lg bg-slate-200 p-1  w-full box-border"
            type="number"
            value={editedTrack.bpm ?? ""}
            onChange={(e) =>
              setEditedTrack({ ...editedTrack, bpm: Number(e.target.value) })
            }
            placeholder="BPM"
          />
          <p className="text-xl">KEY</p>
          <input
            className="text-lg bg-slate-200 p-1 mb-1  w-full box-border"
            value={editedTrack.key ?? ""}
            onChange={(e) => setEditedTrack({ ...editedTrack, key: e.target.value })}
            placeholder="Key"
          />
        </div>
        <div className="flex flex-col w-1/12 flex-grow overflow-y-auto rounded bg-slate-300">
          <div className="flex flex-row justify-between">
            <p className="text-xl">Genre</p>
            <Popup
              trigger={<div className="flex w-1/4 h-full p-1 justify-center bg-amber-300"><PencilSquareIcon className="w-5" /></div>}
              modal
              nested
              position={["top center"]}
              contentStyle={{ marginTop: "50px" }}
            >
              <div className="flex flex-col relative justify-start w-[400px] max-h-[400px] top-0 bg-slate-600 border-2 p-1">
                <GenreBrowser onGenreSelect={handleGenreSelect} />
              </div>
            </Popup>
          </div>
          <div className="bg-slate-200 h-full">
            <GenresVisualizer genres={editedTrack.genres} onGenreSelect={handleGenreSelect} />
          </div>
        </div>
        <div className="flex flex-col w-5/12 flex-grow overflow-y-auto rounded bg-slate-300">
          <div className="flex flex-row justify-between">
            <p className="text-xl">Tags</p>
            <Popup
              trigger={<div className="flex w-1/12 h-full p-1 justify-center bg-amber-300"><PencilSquareIcon className="w-5" /></div>}
              modal
              nested
              position={["right center"]}
              contentStyle={{ marginTop: "50px", marginRight: "50px" }}
            >
              <div className="flex flex-col relative justify-start w-[400px] max-h-[400px] top-0 bg-slate-600 border-2 p-1">
                <TagBrowser onTagSelect={handleTagSelect} />
              </div>
            </Popup>
          </div>
          <div className="bg-slate-200 h-full">
            <TagTypesVisualizer tag_types={tagTypes} onTagSelect={handleTagSelect} />
          </div>
        </div>
      </div>
      <div className="flex flex-row w-full justify-left space-x-2">
        <div className="bg-slate-300 w-1/3 p-2 flex items-center space-x-2 rounded">
          <strong>Album:</strong>
          <input
            className="bg-slate-200 rounded p-1 flex-grow"
            value={editedTrack.album ?? ""}
            onChange={(e) => setEditedTrack({ ...editedTrack, album: e.target.value })}
            placeholder="Album"
          />
        </div>
        <div className="bg-slate-300 w-1/3 p-2 flex items-center space-x-2 rounded">
          <strong>Label:</strong>
          <input
            className="bg-slate-200 rounded p-1 flex-grow"
            value={editedTrack.label ?? ""}
            onChange={(e) => setEditedTrack({ ...editedTrack, label: e.target.value })}
            placeholder="Label"
          />
        </div>
        <div className="bg-slate-300 w-1/4 p-2 flex items-center space-x-2 rounded">
          <strong>Rating:</strong>
          <input
            className="bg-slate-200 rounded p-1 flex-grow"
            value={editedTrack.rating ?? ""}
            onChange={(e) => setEditedTrack({ ...editedTrack, rating: Number(e.target.value) })}
            placeholder="Rating"
            type="number"
          />
        </div>
        <Button className="flex flex-grow bg-amber-300 justify-center" type="submit">
          Save
        </Button>
      </div>
    </form>
    
   
  );
}