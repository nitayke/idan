import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { MyTextField } from "../components/MyTextField";

function checkAllFieldsTrue(obj) {
    for (const key in obj) {
        if (!obj[key]) {
            return false; // If any field is false, return false
        }
    }
    return true; // If all fields are true, return true
}

export function StartProduction() {
    const [form, setForm] = useState({
        clean: false,
        new_prod: false,
        return: false,
        future: false,
    });
    const [value, setValue] = useState(0);

    const isError = !checkAllFieldsTrue(form);

    return (
        <>
            <Typography variant="h3" sx={{ textAlign: "center", m: 3 }}>
                כניסה לייצור רציף
            </Typography>
            <FormControl
                sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    m: 4,
                }}
            >
                <FormControlLabel
                    control={
                        <Checkbox
                            value={form.clean}
                            onChange={() =>
                                setForm((last) => ({
                                    ...last,
                                    clean: !last.clean,
                                }))
                            }
                        />
                    }
                    label="בוצע ניקוי מלאי"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            value={form.new_prod}
                            onChange={() =>
                                setForm((last) => ({
                                    ...last,
                                    new_prod: !last.new_prod,
                                }))
                            }
                        />
                    }
                    label="נכתב נוהל ייצור חדש למוצר"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            value={form.return}
                            onChange={() =>
                                setForm((last) => ({
                                    ...last,
                                    return: !last.return,
                                }))
                            }
                        />
                    }
                    label="כל היחידות חזרו מהלקוח לתיקון"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            value={form.future}
                            onChange={() =>
                                setForm((last) => ({
                                    ...last,
                                    future: !last.future,
                                }))
                            }
                        />
                    }
                    label="אין הזמנות עתידיות מהספק"
                />
                <MyTextField
                    label="עלות היישום בדולרים"
                    name="price"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    fullWidth={false}
                    type="number"
                />
                {!isError && (
                    <Button sx={{ m: 3 }} variant="contained">
                        התחל ייצור רציף
                    </Button>
                )}
            </FormControl>
        </>
    );
}
