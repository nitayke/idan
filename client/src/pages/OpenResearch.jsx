import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { MyTextField } from "../components/MyTextField";
import { Autocomplete, TextField } from "@mui/material";
import { Biotech } from "@mui/icons-material";
import { config } from "../config";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { SelectMakat } from "../components/SelectMakat";
import { hasEmptyFields } from "./Signup";
import { toast } from "react-toastify";
import { SelectPeople } from "../components/SelectPeople";
import { MyDatePicker } from "../components/MyDatePicker";

export function OpenResearch() {
    const [selectedMakat, setSelectedMakat] = React.useState("");
    const [selectedUsers, setSelectedUsers] = React.useState([]);
    const [date, setDate] = React.useState(new Date());

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const research = {
            manager_username: JSON.parse(localStorage.getItem("userData"))
                .username,
            research_name: data.get("research_name"),
            users: selectedUsers,
            open_date: new Date().toJSON().slice(0, 19).replace("T", " "),
            dest_date: date.toJSON().slice(0, 19).replace("T", " "),
            makat: selectedMakat,
            reason: data.get("reason"),
        };

        if (hasEmptyFields(research)) {
            toast.error("חובה למלא את כל השדות!");
            return;
        }

        axios
            .post(`${config.url}/researches`, research)
            .then((res) => {
                localStorage.setItem("research", JSON.stringify(research));
                location.href = "/add-tasks/" + res.data;
            })
            .catch(() => {
                toast.error("שגיאה בשליחת הנתונים");
            });
    };

    return (
        <Container component="main" maxWidth="sm">
            <CssBaseline />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mt: 3,
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <Biotech />
                </Avatar>
                <Typography component="h1" variant="h4">
                    פתיחת חקר
                </Typography>
            </Box>
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{
                    mt: 1,
                    flexDirection: "column",
                    display: "flex",
                }}
            >
                <MyTextField label="שם החקר" name="research_name" autoFocus />
                <SelectMakat
                    selectedMakat={selectedMakat}
                    setSelectedMakat={setSelectedMakat}
                />
                <SelectPeople setSelectedUsers={setSelectedUsers} />
                <MyDatePicker date={date} setDate={(e) => setDate(e)} />
                <MyTextField label="סיבת החקר" name="reason" />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    פתיחת חקר
                </Button>
            </Box>
        </Container>
    );
}
