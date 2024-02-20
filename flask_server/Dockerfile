# Use the official Python image as the base image
FROM python:3.8-slim

# Set the working directory
WORKDIR /flask_server

# Copy the requirements file into the container
COPY flask_server/requirements.txt .

# Install the required Python packages
RUN pip install -r requirements.txt

# Copy the rest of the application code into the container
COPY flask_server .

# Set the Flask app environment variable
ENV FLASK_APP=app.py

# Expose the port that your Flask app listens on
EXPOSE 5000

# Start the Flask app
CMD ["flask", "run", "--host=0.0.0.0"]
