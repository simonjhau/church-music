import './Files.css';
import { useState } from 'react';
import axios from 'axios';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';

const SearchBox = ({ setSelected, apiPath, placeholder }) => {
  const handleNameChange = (input) => {
    if (input.length > 0) {
      setSelected(input[0]);
    } else {
      setSelected({});
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const handleSearch = (query) => {
    setSelected({ name: query });
    setIsLoading(true);
    makeAndHandleRequest(query)
      .then((options) => {
        setIsLoading(false);
        setOptions(options);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const makeAndHandleRequest = (query) => {
    return axios
      .get(apiPath, { params: { q: query } })
      .then((res) => {
        setOptions(res.data);
      })
      .catch('makeAndHandleRequest failed');
  };

  return (
    <AsyncTypeahead
      id="search"
      isLoading={isLoading}
      labelKey="name"
      onSearch={handleSearch}
      onChange={handleNameChange}
      options={options}
      placeholder={placeholder}
      renderMenuItemChildren={(option) => <p>{option.name}</p>}
    />
  );
};

export default SearchBox;
