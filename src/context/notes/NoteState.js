import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
    const s1 = {
        "name": "Pradum",
        "class": "A"
    }

    const [state, setstate] = useState(s1);
    const update = () => {
        setTimeout(() => {
            setstate({
                "name": "Stranger",
                "class": "B"
            })
            
        }, 1000);
    }

    return (
        <NoteContext.Provider value={{state:state, update:update}}>
            {props.childern}
        </NoteContext.Provider>
    )
}


export default NoteState;