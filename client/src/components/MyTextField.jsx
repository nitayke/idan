import { TextField } from "@mui/material";

export function MyTextField({ label, name, ...props }) {
  return (
    <TextField
      margin="normal"
      required
      fullWidth
      id={name}
      label={label}
      name={name}
      autoComplete={name}
      dir="rtl"
      {...props}
    />
  );
}
