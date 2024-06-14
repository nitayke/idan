import { useCallback, useEffect, useState } from "react";
import { SimpleTable } from "../components/SimpleTable";
import axios from "axios";
import { config } from "../config";
import { toast } from "react-toastify";
import { CircularProgress, Typography } from "@mui/material";

export function MyResearches() {
    const [rows, setRows] = useState();

    useEffect(() => {
        const userData = localStorage.getItem("userData");
        if (!userData) {
            location.href = "/login";
            return;
        }
        const { username } = JSON.parse(userData);
        axios(`${config.url}/researches/${username}`)
            .then((resp) =>
                setRows(
                    resp.data.map((d) => {
                        const newObj = { ...d };
                        delete newObj.manager_username;
                        return newObj;
                    })
                )
            )
            .catch(() => toast.error("שגיאה בקבלת הנתונים"));
    }, []);

    return (
        <>
            <Typography variant="h3" sx={{ textAlign: "center", m: 3 }}>
                החקרים שלי
            </Typography>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: 40,
                }}
            >
                {rows ? (
                    rows.length ? (
                        <SimpleTable rows={rows} />
                    ) : (
                        <Typography variant="h4">אין חקרים :)</Typography>
                    )
                ) : (
                    <CircularProgress />
                )}
            </div>
        </>
    );
}
