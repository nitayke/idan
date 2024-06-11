import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";

function littleSnakeToRegular(string) {
    const words = string.split("_");

    const regularString = words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    return regularString;
}

export function SimpleTable({ rows }) {
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
                            key={row.name}
                            sx={{
                                "&:last-child td, &:last-child th": {
                                    border: 0,
                                },
                            }}
                        >
                            {Object.values(row).map((v) => (
                                <TableCell key={v}>{v}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
