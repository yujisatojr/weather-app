from flask import render_template, jsonify, send_file, request
import requests
from app import app
from config import api_key
from utils import format_unix_time, kelvin_to_celsius, celsius_to_fahrenheit

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

@app.route('/current_weather')
def get_current_weather():
    # Get the current weather data by city name
    API_KEY = api_key
    city_name = request.args.get('city_name', default=None)

    if city_name == None:
        lat, lon = 39.76, -98.5 # Set default coordinates as United States
    else:
        lat, lon = get_coordinate(city_name)

    if not lat or not lon:
        return jsonify({'error': 'Unable to fetch coordinates for the specified city'}), 404

    url = f'https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude=minutely,hourly,daily&appid={API_KEY}'
    response = requests.get(url)
    data = response.json()

    if response.status_code == 200:
        current_weather = data.get('current', {})
        weather_description = current_weather.get('weather', [{}])[0]
        current_time = format_unix_time(current_weather.get('dt', 0), data.get('timezone_offset', 0))
        temp_c = kelvin_to_celsius(current_weather.get('temp', 0))
        temp_f = celsius_to_fahrenheit(temp_c)

        formatted_response = {
            'main_weather': current_weather.get('main', ''),
            'description': weather_description.get('description', ''),
            'icon_id': weather_description.get('icon', ''),
            'unix_datetime': current_weather.get('dt', 0),
            'current_time': current_time,
            'humidity': current_weather.get('humidity', 0),
            'temp_c': temp_c,
            'temp_f': temp_f,
            'latitude': data.get('lat', 0),
            'longitude': data.get('lon', 0),
        }
        return jsonify(formatted_response)
    else:
        return jsonify({'error': 'Unable to fetch current weather'}), 500
    
@app.route('/historical_weather/<time>')
def get_historical_weather():
    # Get the historical weather data by city name
    API_KEY = api_key
    city_name = request.args.get('city_name', default=None)
    time = request.args.get('time', default=None)

    if city_name == None:
        lat, lon = 39.76, -98.5 # Set default coordinates as United States
    else:
        lat, lon = get_coordinate(city_name)

    if not lat or not lon:
        return jsonify({'error': 'Unable to fetch coordinates for the specified city'}), 404
    
    if time == None:
        return jsonify({'error': 'Please provide the time in the Unix format'}), 404

    url = f'https://api.openweathermap.org/data/3.0/onecall/timemachine?lat={lat}&lon={lon}&dt={time}&appid={API_KEY}'
    response = requests.get(url)
    data = response.json()

    if response.status_code == 200:
        historical_data = data.get('data', [])
        weather_data = historical_data[0]
        weather_description = weather_data.get('weather', [{}])[0]

        formatted_response = {
            'current_time': format_unix_time(weather_data.get('dt', 0), data.get('timezone_offset', 0)),
            'temp_c': kelvin_to_celsius(weather_data.get('temp', 0)),
            'temp_f': celsius_to_fahrenheit(kelvin_to_celsius(weather_data.get('temp', 0))),
            'weather_main': weather_description.get('main', ''),
            'weather_description': weather_description.get('description', ''),
            'icon_id': weather_description.get('icon', ''),
        }
        return jsonify(formatted_response)
    else:
        return jsonify({'error': 'Unable to fetch current weather'}), 500

# @app.route('/weather_icon/<icon_id>')
# def get_weather_icon():
#     # Get the weather image by icon ID
#     icon_id = request.args.get('icon_id', default=None)
#     api_url = f'https://openweathermap.org/img/wn/{icon_id}@2x.png'

#     response = requests.get(api_url)
#     if response.status_code == 200:
#         return response
#     else:
#         return jsonify({'error': 'Error fetching weather icon'}), 500
