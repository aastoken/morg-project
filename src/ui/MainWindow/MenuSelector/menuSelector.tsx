import EditTagsButton from "./editTagsButton";
import LoadButton from "../../Options/loadButton";
import MainOptionsButton from "./mainOptionsButton";
import MorgLogo from "./morgLogo";

export default function MenuSelector(){

  return(
    <div className="flex w-full flex-row justify-between">
      <MorgLogo/>
      <MainOptionsButton/>
    </div>
  );
}