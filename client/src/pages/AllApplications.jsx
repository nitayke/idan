import { useCallback, useEffect, useState } from "react";
import { SimpleTable } from "../components/SimpleTable";
import axios from "axios";
import { config } from "../config";
import { toast } from "react-toastify";
import { CircularProgress, Typography } from "@mui/material";

export function AllApplications() {
    const [rows, setRows] = useState();

    const updateRows = useCallback(() => {
        axios(`${config.url}/applications`)
            .then((resp) => setRows(resp.data))
            .catch(() => toast.error("שגיאה בקבלת הנתונים"));
    }, []);

    useEffect(updateRows, []);

    return (
        <>
            <Typography variant="h3" sx={{ textAlign: "center", m: 3 }}>
                יישומי חקר
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
                        <Typography variant="h4">אין יישומי חקר :)</Typography>
                    )
                ) : (
                    <CircularProgress />
                )}
            </div>
        </>
    );
}
