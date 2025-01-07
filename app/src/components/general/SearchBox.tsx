import { useAuth0 } from "@auth0/auth0-react";
import { debounce, type SxProps, type Theme } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import axios from "axios";
import {
  Fragment,
  type ReactElement,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { type Base } from "../../types";

interface SearchBoxProps<T> {
  type: string;
  value: T | null;
  setValue: (value: T | null) => void;
  apiUrl: string;
  navigateOnSelection: boolean;
  sx?: SxProps<Theme>;
}

export const SearchBox = <T extends Base>({
  type,
  value,
  setValue,
  apiUrl,
  navigateOnSelection,
  sx,
}: SearchBoxProps<T>): ReactElement => {
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<readonly T[]>([]);
  const [loading, setLoading] = useState(false);

  const getValuesThatMatchSearchQuery = async (
    query: string,
    value: T | null,
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

    let newOptions: readonly T[] = [];
    if (value) {
      newOptions = [value];
    }
    newOptions = [...newOptions, ...res.data];
    setOptions(newOptions);
    setLoading(false);
  };

  const fetch = useMemo(
    () =>
      debounce((query: string, value: T | null) => {
        getValuesThatMatchSearchQuery(query, value).catch((err) => {
          const msg = err instanceof Error ? err.message : "Unknown error";
          setLoading(false);
          alert(msg);
        });
      }, 400),
    [],
  );

  useEffect(() => {
    if (inputValue === "") {
      setOptions(value ? [value] : []);
      setLoading(false);
      return undefined;
    }
    fetch(inputValue, value);
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
      noOptionsText={`No ${type} found`}
      onChange={(
        _event: React.SyntheticEvent<Element, Event>,
        newValue: T | null,
      ) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
        if (newValue && navigateOnSelection) {
          navigate(newValue.id);
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
            {parts.map((part, index) => (
              <Box
                key={index}
                component="span"
                sx={{ fontWeight: part.highlight ? "bold" : "regular" }}
              >
                {part.text}
              </Box>
            ))}
          </li>
        );
      }}
      sx={{ ...sx }}
    />
  );
};
