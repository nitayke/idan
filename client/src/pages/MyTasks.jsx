import { useCallback, useEffect, useState } from "react";
import { SimpleTable } from "../components/SimpleTable";
import axios from "axios";
import { config } from "../config";
import { toast } from "react-toastify";
import { CircularProgress, Typography } from "@mui/material";

export function MyTasks() {
    const [rows, setRows] = useState();

    const updateRows = useCallback(() => {
        const userData = localStorage.getItem("userData");
        if (!userData) {
            location.href = "/login";
            return;
        }
        const { username } = JSON.parse(userData);
        axios(`${config.url}/tasks/${username}`)
            .then((resp) =>
                setRows(
                    resp.data.map((d) => {
                        const newObj = { ...d };
                        delete newObj.username;
                        return newObj;
                    })
                )
            )
            .catch(() => toast.error("שגיאה בקבלת הנתונים"));
    }, []);

    useEffect(updateRows, []);

    return (
        <>
            <Typography variant="h3" sx={{ textAlign: "center", m: 3 }}>
                המשימות שלי
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
                        <SimpleTable rows={rows} updateRows={updateRows} />
                    ) : (
                        <Typography variant="h4">אין משימות :)</Typography>
                    )
                ) : (
                    <CircularProgress />
                )}
            </div>
        </>
    );
}
