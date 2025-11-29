from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime
import uuid

app = Flask(__name__)
CORS(app)

# Configuration
app.config['JSON_SORT_KEYS'] = False

# In-memory storage (will be replaced with local storage on client side)
reminders = {}

@app.route('/')
def index():
    """Serve the main application page"""
    return render_template('index.html')

@app.route('/test')
def test():
    """Serve the test page"""
    return render_template('test.html')

@app.route('/simple')
def simple():
    """Serve the simple test page"""
    return render_template('simple.html')

@app.route('/api/reminders', methods=['GET'])
def get_reminders():
    """Retrieve all reminders"""
    return jsonify(list(reminders.values()))

@app.route('/api/reminders', methods=['POST'])
def create_reminder():
    """Create a new reminder"""
    data = request.get_json()
    
    # Validate input
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    # Validate radius
    try:
        radius = float(data.get('radius', 0))
        if radius <= 0:
            return jsonify({'error': 'Radius must be a positive number greater than zero'}), 400
    except (ValueError, TypeError):
        return jsonify({'error': 'Radius must be a valid number'}), 400
    
    # Validate latitude and longitude
    try:
        latitude = float(data.get('latitude'))
        longitude = float(data.get('longitude'))
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid latitude or longitude'}), 400
    
    # Validate text
    text = data.get('text', '').strip()
    if not text:
        return jsonify({'error': 'Reminder text cannot be empty'}), 400
    
    # Create reminder
    reminder_id = str(uuid.uuid4())
    reminder = {
        'id': reminder_id,
        'latitude': latitude,
        'longitude': longitude,
        'radius': radius,
        'text': text,
        'created_at': datetime.utcnow().isoformat(),
        'triggered': False
    }
    
    reminders[reminder_id] = reminder
    return jsonify(reminder), 201

@app.route('/api/reminders/<reminder_id>', methods=['PUT'])
def update_reminder(reminder_id):
    """Update an existing reminder"""
    if reminder_id not in reminders:
        return jsonify({'error': 'Reminder not found'}), 404
    
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    reminder = reminders[reminder_id]
    
    # Update radius if provided
    if 'radius' in data:
        try:
            radius = float(data['radius'])
            if radius <= 0:
                return jsonify({'error': 'Radius must be a positive number greater than zero'}), 400
            reminder['radius'] = radius
        except (ValueError, TypeError):
            return jsonify({'error': 'Radius must be a valid number'}), 400
    
    # Update text if provided
    if 'text' in data:
        text = data['text'].strip()
        if not text:
            return jsonify({'error': 'Reminder text cannot be empty'}), 400
        reminder['text'] = text
    
    # Update coordinates if provided
    if 'latitude' in data and 'longitude' in data:
        try:
            reminder['latitude'] = float(data['latitude'])
            reminder['longitude'] = float(data['longitude'])
        except (ValueError, TypeError):
            return jsonify({'error': 'Invalid latitude or longitude'}), 400
    
    return jsonify(reminder), 200

@app.route('/api/reminders/<reminder_id>', methods=['DELETE'])
def delete_reminder(reminder_id):
    """Delete a reminder"""
    if reminder_id not in reminders:
        return jsonify({'error': 'Reminder not found'}), 404
    
    del reminders[reminder_id]
    return jsonify({'message': 'Reminder deleted'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
