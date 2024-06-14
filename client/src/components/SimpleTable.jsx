import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import axios from "axios";
import { config } from "../config";
import { toast } from "react-toastify";

function littleSnakeToRegular(string) {
    const words = string.split("_");

    const regularString = words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    return regularString;
}

const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

export function SimpleTable({ rows, updateRows }) {
    console.log(rows);
    return (
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
                                            axios
                                                .put(
                                                    `${config.url}/tasks/${row.id}`
                                                )
                                                .then((res) => {
                                                    updateRows();
                                                    toast.info(
                                                        "הנתונים עודכנו בהצלחה"
                                                    );
                                                });
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
    );
}
