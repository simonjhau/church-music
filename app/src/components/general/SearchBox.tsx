import { useAuth0 } from "@auth0/auth0-react";
import { Box, CircularProgress, Grid, TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";

import { type Hymn } from "../../types";

interface Props {
  value: Hymn | null;
  setValue: (h: Hymn | null) => void;
}

export const SearchBox = ({ value, setValue }: Props): JSX.Element => {
  const { getAccessTokenSilently } = useAuth0();

  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<readonly Hymn[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (inputValue === "") {
      setOptions([]);
      setLoading(false);
      return undefined;
    }

    const getHymnsThatMatchSearchQuery = async (): Promise<void> => {
      const token = await getAccessTokenSilently();
      const res = await axios.get(`/api/hymns/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: inputValue,
        },
      });
      setOptions(res.data);
      setLoading(false);
    };

    getHymnsThatMatchSearchQuery().catch((err) => {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setLoading(false);
      alert(msg);
    });
  }, [inputValue]);

  return (
    <Autocomplete
      size="small"
      id="async-search"
      getOptionLabel={(option) => option.name}
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      noOptionsText="No hymns"
      onChange={(
        _event: React.SyntheticEvent<Element, Event>,
        selectedHymn: Hymn | null
      ) => {
        if (selectedHymn) {
          setOptions(selectedHymn ? [selectedHymn, ...options] : options);
          setValue(selectedHymn);
        }
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onInputChange={(_event, newInputValue) => {
        setLoading(true);
        setValue(null);
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search for a hymn"
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </Fragment>
            ),
          }}
        />
      )}
      renderOption={(props, option) => {
        const text = option.name;
        const matches = match(option.name, inputValue);
        const parts = parse(text, matches);

        return (
          <li {...props} key={option.id}>
            <Grid container alignItems="center">
              <Grid
                item
                sx={{ width: "calc(100% - 44px)", wordWrap: "break-word" }}
              >
                {parts.map((part, index) => (
                  <Box
                    key={index}
                    component="span"
                    sx={{ fontWeight: part.highlight ? "bold" : "regular" }}
                  >
                    {part.text}
                  </Box>
                ))}
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
};
