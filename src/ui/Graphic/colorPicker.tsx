'use client';
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
 
export default function ColorPickerWrapper() {
    const [color, setColor] =  useColor("#121212");
 
    return (
        <div>
            <h1>Color Picker</h1>
            <ColorPicker height={228}
                color={color}
                onChange={setColor} />;
        </div>
    )
};
