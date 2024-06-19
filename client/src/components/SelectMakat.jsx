import { Autocomplete, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { config } from "../config";

export function SelectMakat({ selectedMakat, setSelectedMakat }) {
    const [allMakats, setAllMakats] = useState([]);

    useEffect(() => {
        // get all the makats from the server
        axios(`${config.url}/products`).then((result) =>
            setAllMakats(result.data)
        );
    }, []);

    return (
        <Autocomplete
            options={allMakats}
            value={selectedMakat}
            onChange={(e, newValue) => setSelectedMakat(newValue)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="standard"
                    label='הכנס מק"ט'
                    key={params.size}
                />
            )}
            sx={{ mb: 2 }}
        />
    );
}
