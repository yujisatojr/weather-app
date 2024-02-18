from datetime import datetime, timedelta

# Convert Unix time to datetime based on the given timezone
def format_unix_time(unix_time, timezone):
    
    try:
        utc_datetime = datetime.utcfromtimestamp(unix_time)

        localized_datetime = utc_datetime + timedelta(seconds=timezone)

        formatted_time = localized_datetime.strftime('%A %m/%d %I:%M %p')
        return formatted_time
    except Exception as e:
        print(f"Error formatting time: {e}")
        return ""

# Convert temperature
def kelvin_to_celsius(temp_k):
    return temp_k - 273.15

def celsius_to_fahrenheit(temp_c):
    return (temp_c * 9/5) + 32