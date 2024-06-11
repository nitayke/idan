import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { MyTextField } from "../components/MyTextField";
import { hasEmptyFields } from "./Signup";
import axios from "axios";
import { config } from "../config";
import { toast } from "react-toastify";

export default function Login() {
    React.useEffect(() => {
        if (localStorage.getItem("userData")) {
            location.href = "/";
        }
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const obj = {
            username: data.get("username"),
            password: data.get("password"),
        };

        if (hasEmptyFields(obj)) {
            toast.error("חובה למלא את כל השדות!");
            return;
        }

        axios
            .post(`${config.url}/login`, obj)
            .then((res) => {
                localStorage.setItem("userData", JSON.stringify(obj));
                location.href = "/";
            })
            .catch((err) => {
                toast.error("שם המשתמש או הסיסמה שגויים");
            });
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    direction: "rtl",
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h4">
                    כניסה
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    <MyTextField label="שם משתמש" name="username" autoFocus />
                    <MyTextField
                        label="סיסמה"
                        name="password"
                        type="password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        כניסה
                    </Button>
                    <Link href="/signup" variant="body2">
                        אין לך חשבון? צור חשבון
                    </Link>
                </Box>
            </Box>
        </Container>
    );
}
