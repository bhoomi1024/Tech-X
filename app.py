from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle

app = Flask(__name__)
CORS(app)  # Enables Cross-Origin Resource Sharing

# Load your saved model (update the path if needed)
with open('lstm_model.pkl', 'rb') as file:
    model = pickle.load(file)

# Helper function to reshape input data for prediction
def prepare_input_data(input_data):
    input_data = np.array(input_data).reshape((1, len(input_data), 1))
    return input_data

# Route for handling the prediction request
@app.route('/predict', methods=['POST'])
def predict():
    # Extract inputs from the request
    inputs = request.json['inputs']  # React will send inputs in JSON format

    # Check if inputs contain None or empty values and handle accordingly
    if not all(inputs) or any(value is None for value in inputs):
        return jsonify({'error': 'All input fields must be filled out.'}), 400
    
    # Convert inputs to float to handle numerical operations
    try:
        inputs = [float(value) for value in inputs]
    except ValueError as e:
        return jsonify({'error': 'Invalid input data'}), 400
    
    # Prepare input data for prediction
    input_data = prepare_input_data(inputs)
    
    # Make a prediction
    prediction = model.predict(input_data)
    prediction_value = prediction[0][0] if prediction.size > 0 else 0

    # Return the prediction result as a JSON response
    return jsonify({'prediction_text': f'Predicted Energy Consumption: {prediction_value:.2f} kW'})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
