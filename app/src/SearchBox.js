import './Files.css';
import { useState } from 'react';
import axios from 'axios';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';

const SearchBox = ({ data, setData, apiPath, placeholder }) => {
  const handleInputChange = (input) => {
    setData({ name: input });
    handleSearch(input);
  };

  const handleSelection = (selected) => {
    if (selected.length > 0) {
      setData(selected[0]);
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const handleSearch = (query) => {
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
      onChange={handleSelection}
      onInputChange={handleInputChange}
      selected={[data.name]}
      options={options}
      placeholder={placeholder}
      renderMenuItemChildren={(option) => <p>{option.name}</p>}
    />
  );
};

export default SearchBox;
