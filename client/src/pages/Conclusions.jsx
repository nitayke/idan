import { TextField, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
export function Conclusions() {
    const { research_name } = useParams();
    return (
        <>
            <Typography variant="h3" sx={{ textAlign: "center", m: 3 }}>
                כתיבת מסקנות - {research_name}
            </Typography>
            <TextField multiline rows={5} variant="outlined" fullWidth />
        </>
    );
}
