import { useAuth0 } from "@auth0/auth0-react";
import {
  Box,
  CircularProgress,
  debounce,
  Grid,
  type SxProps,
  TextField,
  type Theme,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import axios from "axios";
import { Fragment, useEffect, useMemo, useState } from "react";

import { type Base } from "../../types";

interface Props<T> {
  type: string;
  value: T | null;
  setValue: (value: T | null) => void;
  apiUrl: string;
  sx?: SxProps<Theme>;
}

export const SearchBox = <T extends Base>({
  type,
  value,
  setValue,
  apiUrl,
  sx,
}: Props<T>): JSX.Element => {
  const { getAccessTokenSilently } = useAuth0();

  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<readonly T[]>([]);
  const [loading, setLoading] = useState(false);

  const getValuesThatMatchSearchQuery = async (
    query: string
  ): Promise<void> => {
    const token = await getAccessTokenSilently();
    const res = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: query,
      },
    });
    setOptions(res.data);
    setLoading(false);
  };

  const fetch = useMemo(
    () =>
      debounce((query: string) => {
        getValuesThatMatchSearchQuery(query).catch((err) => {
          const msg = err instanceof Error ? err.message : "Unknown error";
          setLoading(false);
          alert(msg);
        });
      }, 400),
    []
  );

  useEffect(() => {
    if (inputValue === "") {
      setOptions([]);
      setLoading(false);
      return undefined;
    }
    fetch(inputValue);
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
      value={value}
      noOptionsText={`No ${type} found`}
      onChange={(
        _event: React.SyntheticEvent<Element, Event>,
        selected: T | null
      ) => {
        if (selected) {
          setOptions(
            options.some((option) => option.id === selected.id)
              ? options
              : [selected, ...options]
          );
          setValue(selected);
        }
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onInputChange={(_event, newInputValue) => {
        setLoading(true);
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={`Search for a ${type}`}
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
      sx={{ ...sx }}
    />
  );
};
