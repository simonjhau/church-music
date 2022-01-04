// @ts-nocheck
// To-do - typescript this up
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { useState } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import './SearchBox.css';

const SearchBox = ({
  data,
  setData,
  apiPath,
  placeholder,
  addLabel,
  size = '',
  disabled = false,
}) => {
  const { getAccessTokenSilently } = useAuth0();

  const handleInputChange = (input) => {
    setData({ id: '', name: input, altName: '' });
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
    if (query) {
      setIsLoading(true);
      makeAndHandleRequest(query)
        .then((options) => {
          setIsLoading(false);
          setOptions(options);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  };

  const makeAndHandleRequest = async (query) => {
    const token = await getAccessTokenSilently();
    return axios
      .get(apiPath, {
        headers: { Authorization: `Bearer ${token}` },
        params: { q: query },
      })
      .then((res) => {
        setOptions(res.data);
      })
      .catch('makeAndHandleRequest failed');
  };

  if (addLabel) {
    return (
      <Form.Group as={Row} controlId="searchBox">
        <Form.Label column={size} sm="3">
          {placeholder}:
        </Form.Label>
        <Col sm="9">
          <AsyncTypeahead
            id="search"
            className="searchBox"
            isLoading={isLoading}
            labelKey="name"
            onSearch={handleSearch}
            onChange={handleSelection}
            onInputChange={handleInputChange}
            selected={[data.name]}
            options={options}
            placeholder={placeholder}
            renderMenuItemChildren={(option) => <p>{option.name}</p>}
            size={size ? size : null}
            disabled={disabled}
          />
        </Col>
      </Form.Group>
    );
  } else {
    return (
      <AsyncTypeahead
        id="search"
        className="searchBox"
        isLoading={isLoading}
        labelKey="name"
        onSearch={handleSearch}
        onChange={handleSelection}
        onInputChange={handleInputChange}
        selected={[data.name]}
        options={options}
        placeholder={placeholder}
        renderMenuItemChildren={(option) => <p>{option.name}</p>}
        size={size ? size : null}
        disabled={disabled}
      />
    );
  }
};

export default SearchBox;
