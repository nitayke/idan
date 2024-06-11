import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { ReportProblem } from "@mui/icons-material";
import { Checkbox, FormControlLabel } from "@mui/material";
import axios from "axios";
import { config } from "../config";
import { toast } from "react-toastify";
import { SelectMakat } from "../components/SelectMakat";

export function BadProduct() {
    React.useEffect(() => {
        if (!localStorage.getItem("userData")) {
            location.href = "login";
        }
    }, []);

    const [isClientReport, setClientReport] = React.useState(false);
    const [selectedMakat, setSelectedMakat] = React.useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isClientReport) {
            location.href = "/open-research";
        } else {
            axios
                .get(`${config.url}/bad-product/${selectedMakat}`)
                .then((result) => {
                    if (result.data.includes("אינו")) {
                        toast.success(result.data);
                    } else if (result.data.includes("קיים")) {
                        toast.info(result.data);
                    } else {
                        toast.warning(result.data);
                    }
                });
        }
    };

    return (
        <Container component="main" maxWidth="sm">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 5,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    direction: "rtl",
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <ReportProblem />
                </Avatar>
                <Typography component="h1" variant="h4">
                    בדיקת רכיב בעייתי
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 3 }}
                >
                    <SelectMakat
                        selectedMakat={selectedMakat}
                        setSelectedMakat={setSelectedMakat}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                value={isClientReport}
                                onChange={() =>
                                    setClientReport((last) => !last)
                                }
                            />
                        }
                        label="האם דווח על ידי הלקוח"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 4, mb: 2 }}
                    >
                        {isClientReport ? "פתח חקר" : "בדוק רכיב"}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
