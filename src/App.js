import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useSpring, animated } from 'react-spring';
import './App.css';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [filteredResponse, setFilteredResponse] = useState(null);

  const options = [
    { value: 'Alphabets', label: 'Alphabets' },
    { value: 'Numbers', label: 'Numbers' },
    { value: 'Highest alphabet', label: 'Highest Alphabet' },
  ];

  const API_URL = process.env.REACT_APP_API_URL || 'https://your-vercel-backend-url.vercel.app/api';

  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const cleanInput = jsonInput.replace(/'/g, '"');
      console.log("Cleaned Input:", cleanInput);
      
      let parsedInput;
      try {
        parsedInput = JSON.parse(cleanInput);
        if (!parsedInput.data) {
          throw new Error('Input must have a "data" field');
        }
      } catch (err) {
        setError('Invalid JSON input. Format should be: {"data":["M","1","334","4","B"]}');
        return;
      }

      const res = await axios.post(`${API_URL}/bfhl`, parsedInput);
      console.log("Response:", res.data);
      setResponse(res.data);
      setError('');
      setFilteredResponse(null);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || 'Invalid JSON input');
    }
  };

  const handleSelectChange = (selected) => {
    setSelectedOptions(selected);
    console.log("Selected Options:", selected);
  };

  const filterResponse = () => {
    if (!response) return;

    let filtered = {};
    selectedOptions.forEach(option => {
      if (option.value === 'Alphabets') {
        filtered.alphabets = response.alphabets;
      }
      if (option.value === 'Numbers') {
        filtered.numbers = response.numbers;
      }
      if (option.value === 'Highest alphabet') {
        filtered.highestAlphabet = response.highest_alphabet;
      }
    });
    setFilteredResponse(filtered);
  };

  useEffect(() => {
    document.title = 'Qualifier-1';
  }, []);

  const fade = useSpring({ opacity: response ? 1 : 0 });

  return (
    <div className="App">
      <h1>Enter Data</h1>
      <input
        type="text"
        value={jsonInput}
        onChange={handleInputChange}
        placeholder='Enter JSON'
      />
      <button onClick={handleSubmit}>Submit</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {response && (
        <animated.div style={fade}>
          <h2>Multi Filter</h2>
          <Select
            isMulti
            options={options}
            onChange={handleSelectChange}
            className="Select"
          />
          <button onClick={filterResponse}>Filter Response</button>
        </animated.div>
      )}

      {filteredResponse && (
        <animated.div style={fade}>
          <h2>Filtered Response</h2>
          <div className="filtered-results">
            {filteredResponse.numbers && (
              <p>Numbers: {filteredResponse.numbers.join(',')}</p>
            )}
            {filteredResponse.highestAlphabet && (
              <p>Highest Alphabet: {filteredResponse.highestAlphabet[0]}</p>
            )}
            {filteredResponse.alphabets && (
              <p>Alphabets: {filteredResponse.alphabets.join(',')}</p>
            )}
          </div>
        </animated.div>
      )}
    </div>
  );
}

export default App;
