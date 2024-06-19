import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TableHead,
    TableRow,
    TextField,
} from "@mui/material";
import axios from "axios";
import { config } from "../config";
import { toast } from "react-toastify";
import { useState } from "react";

// for presenting the column names without the _ and in upper case
function littleSnakeToRegular(string) {
    const words = string.split("_");

    const regularString = words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    return regularString;
}

const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

export function SimpleTable({ rows, updateRows }) {
    const [open, setOpen] = useState(false);
    const [missionDone, setMissionDone] = useState("");
    const [rowId, setRowId] = useState("");

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            {Object.keys(rows[0]).map((o) => (
                                <TableCell key={o}>
                                    {littleSnakeToRegular(o)}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{
                                    "&:last-child td, &:last-child th": {
                                        border: 0,
                                    },
                                }}
                            >
                                {Object.values(row).map((v) => {
                                    if (isoRegex.test(v)) {
                                        const d = new Date(v);
                                        return (
                                            <TableCell key={d.getTime()}>
                                                {d.toLocaleDateString()}
                                            </TableCell>
                                        );
                                    }
                                    return <TableCell key={v}>{v}</TableCell>;
                                })}
                                <TableCell>
                                    {row.status === "opened" && (
                                        <Button
                                            onClick={() => {
                                                setOpen(true);
                                                // when the user finishes a task,
                                                // the dialog will be opened
                                                setRowId(row.id);
                                            }}
                                        >
                                            סיימתי
                                        </Button>
                                    )}
                                    {row.users && !row.conclusions && (
                                        <Button
                                            onClick={() => {
                                                location.href = `/conclusions/${row.research_name}`;
                                            }}
                                        >
                                            לכתיבת מסקנות
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog fullWidth open={open} onClose={() => setOpen(false)}>
                <DialogTitle>סיום משימה</DialogTitle>
                <DialogContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        fontFamily: "Heebo",
                    }}
                >
                    <TextField
                        multiline
                        rows={5}
                        label="סיכום משימה"
                        value={missionDone}
                        onChange={(e) => setMissionDone(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setOpen(false);
                            setMissionDone("");
                        }}
                    >
                        ביטול
                    </Button>
                    <Button
                        onClick={() => {
                            setOpen(false);
                            axios
                                .put(`${config.url}/tasks/${rowId}`, {
                                    conclusions: missionDone,
                                })
                                .then((res) => {
                                    updateRows();
                                    toast.info("הנתונים עודכנו בהצלחה");
                                })
                                .catch(() =>
                                    toast.error("שגיאה בעדכון הנתונים")
                                );
                        }}
                        color="primary"
                    >
                        אישור
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
