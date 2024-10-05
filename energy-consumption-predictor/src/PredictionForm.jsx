import React, { useState } from 'react';
import axios from 'axios';
import { FaSolarPanel, FaChartLine } from 'react-icons/fa';

const PredictionForm = () => {
  const [inputs, setInputs] = useState({
    currentConsumption: '',
    solarEnergyProduction: '',
    batteryStorageCapacity: '',
    electricityTariff: '',
    predictedEnergyUsage: '',
    peakTariffStartTime: '',
    peakTariffEndTime: '',
  });
  const [prediction, setPrediction] = useState('');

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs to ensure they are not empty
    if (Object.values(inputs).some(value => value === '')) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/predict', {
        inputs: Object.values(inputs).map(Number),  // Convert input values to numbers
      });
      setPrediction(response.data.prediction_text);
    } catch (error) {
      console.error('Error in prediction:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-yellow-600 flex items-center mb-6">
          <FaSolarPanel className="mr-2" /> Energy Prediction
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {Object.keys(inputs).map((key, index) => (
            <div key={index} className="flex flex-col">
              <label htmlFor={key} className="text-gray-700 font-semibold mb-1">
                {key.replace(/([A-Z])/g, ' $1')}: {/* Format the label for better readability */}
              </label>
              <input
                type="number"
                step="any"
                name={key}
                value={inputs[key]}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200 ease-in-out"
                required
                placeholder={getPlaceholder(key)} // Placeholder to show units
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-yellow-300 transition duration-200 ease-in-out"
          >
            Predict
          </button>
        </form>

        {prediction && (
          <div className="mt-6 bg-blue-100 p-4 rounded-lg text-blue-900 border border-blue-300">
            <h2 className="text-xl font-semibold flex items-center">
              <FaChartLine className="mr-2" /> Prediction Result:
            </h2>
            <p className="mt-2">{prediction}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to return the appropriate placeholder based on the input name
const getPlaceholder = (key) => {
  switch (key) {
    case 'currentConsumption':
      return 'kW (Current Consumption)';
    case 'solarEnergyProduction':
      return 'kW (Solar Energy Production)';
    case 'batteryStorageCapacity':
      return 'kWh (Battery Storage Capacity)';
    case 'electricityTariff':
      return 'Currency/kWh (Electricity Tariff)';
    case 'predictedEnergyUsage':
      return 'kW (Predicted Energy Usage)';
    case 'peakTariffStartTime':
      return 'HH:mm (Peak Tariff Start Time)';
    case 'peakTariffEndTime':
      return 'HH:mm (Peak Tariff End Time)';
    default:
      return '';
  }
};

export default PredictionForm;
