import { Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { config } from "../config";
export function Conclusions() {
    const { research_name } = useParams();
    const [conclusions, setConclusions] = useState("");
    return (
        <>
            <Typography variant="h3" sx={{ textAlign: "center", m: 3 }}>
                כתיבת מסקנות - {research_name}
            </Typography>
            <TextField
                multiline
                rows={5}
                variant="outlined"
                fullWidth
                value={conclusions}
                onChange={(e) => setConclusions(e.target.value)}
            />
            <Button
                type="submit"
                variant="contained"
                sx={{ m: 3 }}
                onClick={() => {
                    axios
                        .post(`${config.url}/conclusions/${research_name}`, {
                            conclusions,
                        })
                        .then(async (resp) => {
                            toast("המסקנות נשלחו בהצלחה");
                            await new Promise((r) => setTimeout(r, 2000));
                            location.href = "/";
                        })
                        .catch(() => toast.error("שגיאה בשליחת המסקנות"));
                }}
            >
                שליחת מסקנות
            </Button>
        </>
    );
}
