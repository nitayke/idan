import { Autocomplete, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { config } from "../config";

export function SelectPeople({ setSelectedUsers }) {
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        if (!localStorage.getItem("userData")) {
            location.href = "/login";
        }
        axios(`${config.url}/users`)
            .then((result) => {
                setAllUsers(result.data);
            })
            .catch(() => {
                toast.error("שגיאה בקבלת הנתונים");
            });
    }, []);

    return (
        <Autocomplete
            multiple
            fullWidth
            label="צוות מטפל"
            options={allUsers}
            getOptionLabel={(option) =>
                `${option.first_name} ${option.last_name}`
            }
            onChange={(e, newValue) => setSelectedUsers(newValue)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="standard"
                    label="בחר אנשים"
                    key={params.size}
                />
            )}
            sx={{ mb: 2 }}
        />
    );
}
