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

  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      console.log("Input JSON:", jsonInput);
      const parsedInput = JSON.parse(jsonInput);
      setError('');

      // Call the backend API
      const res = await axios.post('http://localhost:5000/bfhl', parsedInput);
      console.log("Response:", res.data);
      setResponse(res.data);

      // Reset filtered response
      setFilteredResponse(null);
    } catch (err) {
      console.error("Error parsing JSON:", err);
      setError('Invalid JSON input');
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
    document.title = 'Your Roll Number';
  }, []);

  const fade = useSpring({ opacity: response ? 1 : 0 });

  return (
    <div className="App">
      <h1>Your Roll Number</h1>
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
          <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>
        </animated.div>
      )}
    </div>
  );
}

export default App;
