import { Box, CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { config } from "../config";

const s = {
    r_count: "כמות החקרים",
    r_closed_count: "כמה חקרים נסגרו",
    r_open_count: "כמה חקרים עדיין פתוחים",
    r_open_percent: "אחוז החקרים הפתוחים מכלל החקרים",
    a_count: "כמה יישומי חקר נפתחו",
    a_closed_count: "כמה יישומי חקר נסגרו",
    a_price_sum: "סך כל העלויות של יישומי החקר",
    a_price_avg: "עלות של יישום חקר ממוצעת",
    u_count: "כמות המשתמשים במערכת",
};

export function Statistics() {
    const [stats, setStats] = useState();
    useEffect(() => {
        axios
            .get(`${config.url}/statistics`)
            .then((result) => {
                const data = result.data[0];
                setStats({
                    ...data,
                    r_open_count: data.r_count - data.r_closed_count,
                    r_open_percent: (
                        ((data.r_count - data.r_closed_count) / data.r_count) *
                        100
                    ).toFixed(2),
                });
            })
            .catch(() => toast.error("שגיאה בקבלת הסטטיסטיקות"));
    }, []);
    return (
        <>
            <Typography
                component="h1"
                variant="h4"
                sx={{ m: 3, textAlign: "center" }}
            >
                סטטיסטיקות
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "end",
                    mx: 19,
                    direction: "rtl",
                }}
            >
                {stats ? (
                    Object.keys(stats).map((k) => (
                        <Typography key={k} sx={{ m: 1 }}>
                            {s[k]}: {stats[k]}
                        </Typography>
                    ))
                ) : (
                    <CircularProgress />
                )}
            </Box>
        </>
    );
}
