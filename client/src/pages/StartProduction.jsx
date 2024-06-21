import {
    Autocomplete,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { MyTextField } from "../components/MyTextField";
import { SelectMakat } from "../components/SelectMakat";
import { toast } from "react-toastify";
import axios from "axios";
import { config } from "../config";

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
    const [researchIds, setIds] = useState([]);
    const [selectedId, setSelectedId] = useState("");

    useEffect(() => {
        axios.get(`${config.url}/researches-ids`).then((result) => {
            setIds(result.data.map((d) => d.id.toString()));
        });
    }, []);

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
                <div style={{ width: "50%" }}>
                    <Autocomplete
                        options={researchIds}
                        value={selectedId}
                        onChange={(e, newValue) => setSelectedId(newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="standard"
                                label="הכנס מזהה חקר"
                                key={params.size}
                            />
                        )}
                        sx={{ mb: 2 }}
                    />
                </div>
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

                <Button
                    sx={{ m: 3 }}
                    variant="contained"
                    onClick={() => {
                        axios
                            .post(`${config.url}/price/${selectedId}`, {
                                price: value,
                            })
                            .then(async (resp) => {
                                toast.info("הנתונים נשמרו במערכת");
                                await new Promise((r) => setTimeout(r, 2000));
                                location.href = "/";
                            })
                            .catch(() =>
                                toast.error("חלה שגיאה בשמירת הנתונים")
                            );
                    }}
                    disabled={
                        !checkAllFieldsTrue(form) || !selectedId || +value <= 0
                    }
                >
                    התחל ייצור רציף
                </Button>
            </FormControl>
        </>
    );
}
