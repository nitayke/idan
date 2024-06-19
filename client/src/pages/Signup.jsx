import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { MyTextField } from "../components/MyTextField";
import axios from "axios";
import { config } from "../config";
import { toast } from "react-toastify";

export function hasEmptyFields(obj) {
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && !obj[key]) return true; // Found an empty field
    }
    return false; // No empty fields found
}

export default function Signup() {
    React.useEffect(() => {
        if (localStorage.getItem("userData")) {
            location.href = "/";
        }
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const obj = {
            email: data.get("email"),
            username: data.get("username"),
            password: data.get("password"),
            firstName: data.get("firstName"),
            lastName: data.get("lastName"),
            role: data.get("role"),
        };

        if (hasEmptyFields(obj)) {
            toast.error("חובה למלא את כל השדות!");
            return;
        }

        axios
            .post(`${config.url}/signup`, obj)
            .catch((err) => {
                if (err.response.status == 409)
                    toast.error("שם המשתמש כבר קיים!");
            })
            .then((res) => {
                const { password: _, ...withoutPassword } = obj;
                localStorage.setItem(
                    "userData",
                    JSON.stringify(withoutPassword)
                );
                location.href = "/";
            });
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 3,
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
                    הרשמה
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    <MyTextField label="שם פרטי" name="firstName" autoFocus />
                    <MyTextField label="שם משפחה" name="lastName" />
                    <MyTextField label="שם משתמש" name="username" />
                    <MyTextField label="כתובת אימייל" name="email" />
                    <MyTextField label="תפקיד" name="role" />
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
                        הרשמה
                    </Button>
                    <Link href="/login" variant="body2">
                        יש לך חשבון? היכנס
                    </Link>
                </Box>
            </Box>
        </Container>
    );
}
