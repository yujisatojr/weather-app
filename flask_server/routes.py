from flask import render_template, jsonify
import requests
from app import app
from config import api_key

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/coordinate/<city_name>')
def get_coordinate(city_name):
    # Use Geocoding API to convert city name to latitude and longitude
    API_KEY = api_key
    url = f'http://api.openweathermap.org/geo/1.0/direct?q={city_name}&appid={API_KEY}'

    response = requests.get(url)
    data = response.json()

    if response.status_code == 200 and data:
        lat = data[0]['lat']
        lon = data[0]['lon']
        return lat, lon
    else:
        return None

@app.route('/current')
def get_current_weather():
    # Get the current weather data by city name
    API_KEY = api_key
    city_name = 'dallas'
    lat, lon = get_coordinate(city_name)

    if not lat or not lon:
        return jsonify({'error': 'Unable to fetch coordinates for the specified city'}), 404

    url = f'https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&appid={API_KEY}'
    response = requests.get(url)
    data = response.json()

    if response.status_code == 200:
        return jsonify(data)
    else:
        return jsonify({'error': 'Unable to fetch current weather'}), 500
