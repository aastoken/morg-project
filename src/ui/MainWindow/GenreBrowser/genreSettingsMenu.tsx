"use client";

import React, { useEffect, useState } from "react";
import { DBGenre } from "../../../lib/models";
import { createGenre, updateGenre, deleteGenre } from "../../../lib/actions/genreActions";
import DeleteButton from "../../Utils/deleteButton";
import { ColorPicker, useColor, IColor } from "react-color-palette";
import "react-color-palette/css";
import Popup from "reactjs-popup";
import { Button } from "../../Utils/button";

export default function GenreSettingsMenu({
  mode,
  genre,
  close,
  onGenreChange,
}: {
  mode: 'create' | 'edit';
  genre: DBGenre;
  close: () => void;
  onGenreChange: (genre?: DBGenre) => void;
}) {
  const [headerText, setHeaderText] = useState("");
  const [confirmationButtonText, setConfirmationButtonText] = useState("");
  const [genreData, setGenreData] = useState<DBGenre>(genre);
  const [color, setColor] = useColor(genre.color || "#ffffff");

  useEffect(() => {
    if (mode === "create") {
      setHeaderText("CREATE GENRE");
      setConfirmationButtonText("Create Genre");
    } else {
      setHeaderText("EDIT GENRE");
      setConfirmationButtonText("Apply Changes");
    }
  }, [mode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGenreData({ ...genreData, [e.target.name]: e.target.value });
  };

  const handleColorChange = (newColor: IColor) => {
    setColor(newColor);
    setGenreData({ ...genreData, color: newColor.hex });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let result: DBGenre;
    if (mode === "create") {
      result = await createGenre({ name: genreData.name, color: genreData.color });
    } else {
      result = await updateGenre(genreData);
    }
    onGenreChange(result);
    close();
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    const deleted = await deleteGenre(genreData.id);
    console.log("Deleted genre: ", deleted)
    onGenreChange();
    close();
  };

  return (
    <form
      className="flex flex-col w-[300px] h-[360px] bg-slate-600 border-4 border-white"
      onSubmit={handleSubmit}
    >
      <div className="flex h-10 w-full bg-slate-300 items-center justify-between">
        <div className="text-xl p-2">{headerText}</div>
        {mode === "edit" && <DeleteButton handleDelete={handleDelete} />}
      </div>

      <div className="flex flex-col mt-2 px-2">
        <label className="text-white mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={genreData.name}
          onChange={handleInputChange}
          className="w-full p-1 rounded bg-slate-200"
          placeholder="Genre Name"
        />
      </div>

      <div className="flex flex-col mt-4 px-2">
        <span className="text-white mb-1">Color</span>
        <Popup
          trigger={
            <div
              className="w-full h-8 border-2 rounded cursor-pointer"
              style={{ backgroundColor: color.hex }}
            />
          }
          modal
          nested
        >
          <ColorPicker
            height={160}
            color={color}
            onChange={handleColorChange}
          />
        </Popup>
      </div>

      <div className="mt-auto p-2">
        <Button type="submit" className="w-full">
          {confirmationButtonText}
        </Button>
      </div>
    </form>
  );
}
