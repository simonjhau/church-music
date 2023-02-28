import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";

import { type HymnType } from "../../types";

interface Props {
  label: string;
  options: HymnType[];
  value: string;
  setValue: (ht: number) => void;
}

export const Dropdown = ({
  label,
  options,
  value,
  setValue,
}: Props): JSX.Element => {
  const handleChange = (event: SelectChangeEvent): void => {
    setValue(parseInt(event.target.value));
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          onChange={handleChange}
          size="small"
          sx={{ mx: 2, my: 1 }}
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
