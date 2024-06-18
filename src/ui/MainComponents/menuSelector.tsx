import EditTagsButton from "../Interactive/editTagsButton";
import LoadButton from "../Interactive/loadButton";
import MainOptionsButton from "../Interactive/mainOptionsButton";
import MorgLogo from "../Graphic/morgLogo";

export default function MenuSelector(){

  return(
    <>
      <MorgLogo/>
      <EditTagsButton/>
      <MainOptionsButton/>
    </>
  );
}