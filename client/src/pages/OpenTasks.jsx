import { useEffect, useState } from "react";
import { SimpleTable } from "../components/SimpleTable";
import axios from "axios";
import { config } from "../config";
import { toast } from "react-toastify";
import { CircularProgress, Typography } from "@mui/material";

export function OpenTasks() {
    const [rows, setRows] = useState();
    useEffect(() => {
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
            .catch((err) => toast.error("שגיאה בקבלת הנתונים"));
    }, []);
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
                        <SimpleTable rows={rows} />
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
