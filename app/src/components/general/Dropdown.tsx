import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";

import { type NumberIdBase } from "../../types";

interface Props<T> {
  label: string;
  options: T[];
  value: number;
  setValue: (id: number) => void;
}

export const Dropdown = <T extends NumberIdBase>({
  label,
  options,
  value,
  setValue,
}: Props<T>): JSX.Element => {
  const handleChange = (event: SelectChangeEvent): void => {
    setValue(parseInt(event.target.value));
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Select
          label={label}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={String(value)}
          onChange={handleChange}
          size="small"
        >
          {options.map((option) => {
            return (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
};
