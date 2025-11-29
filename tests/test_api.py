"""
Unit tests for Flask API endpoints
"""
import pytest
import json
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app


@pytest.fixture
def client():
    """Create a test client for the Flask app"""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def test_get_reminders_empty(client):
    """Test retrieving reminders when none exist"""
    response = client.get('/api/reminders')
    assert response.status_code == 200
    assert response.json == []


def test_create_reminder_valid(client):
    """Test creating a valid reminder"""
    reminder_data = {
        'latitude': 40.7128,
        'longitude': -74.0060,
        'radius': 500,
        'text': 'Pick up groceries'
    }
    
    response = client.post('/api/reminders',
                          data=json.dumps(reminder_data),
                          content_type='application/json')
    
    assert response.status_code == 201
    data = response.json
    assert data['latitude'] == 40.7128
    assert data['longitude'] == -74.0060
    assert data['radius'] == 500
    assert data['text'] == 'Pick up groceries'
    assert 'id' in data
    assert 'created_at' in data


def test_create_reminder_invalid_radius_zero(client):
    """Test creating reminder with zero radius"""
    reminder_data = {
        'latitude': 40.7128,
        'longitude': -74.0060,
        'radius': 0,
        'text': 'Test reminder'
    }
    
    response = client.post('/api/reminders',
                          data=json.dumps(reminder_data),
                          content_type='application/json')
    
    assert response.status_code == 400
    assert 'Radius must be a positive number' in response.json['error']


def test_create_reminder_invalid_radius_negative(client):
    """Test creating reminder with negative radius"""
    reminder_data = {
        'latitude': 40.7128,
        'longitude': -74.0060,
        'radius': -100,
        'text': 'Test reminder'
    }
    
    response = client.post('/api/reminders',
                          data=json.dumps(reminder_data),
                          content_type='application/json')
    
    assert response.status_code == 400
    assert 'Radius must be a positive number' in response.json['error']


def test_create_reminder_empty_text(client):
    """Test creating reminder with empty text"""
    reminder_data = {
        'latitude': 40.7128,
        'longitude': -74.0060,
        'radius': 500,
        'text': ''
    }
    
    response = client.post('/api/reminders',
                          data=json.dumps(reminder_data),
                          content_type='application/json')
    
    assert response.status_code == 400
    assert 'Reminder text cannot be empty' in response.json['error']


def test_create_reminder_whitespace_text(client):
    """Test creating reminder with whitespace-only text"""
    reminder_data = {
        'latitude': 40.7128,
        'longitude': -74.0060,
        'radius': 500,
        'text': '   '
    }
    
    response = client.post('/api/reminders',
                          data=json.dumps(reminder_data),
                          content_type='application/json')
    
    assert response.status_code == 400
    assert 'Reminder text cannot be empty' in response.json['error']


def test_create_and_retrieve_reminder(client):
    """Test creating and then retrieving a reminder"""
    reminder_data = {
        'latitude': 40.7128,
        'longitude': -74.0060,
        'radius': 500,
        'text': 'Test reminder'
    }
    
    # Create reminder
    create_response = client.post('/api/reminders',
                                 data=json.dumps(reminder_data),
                                 content_type='application/json')
    assert create_response.status_code == 201
    reminder_id = create_response.json['id']
    
    # Retrieve all reminders
    get_response = client.get('/api/reminders')
    assert get_response.status_code == 200
    reminders = get_response.json
    assert len(reminders) == 1
    assert reminders[0]['id'] == reminder_id


def test_update_reminder(client):
    """Test updating a reminder"""
    # Create reminder
    reminder_data = {
        'latitude': 40.7128,
        'longitude': -74.0060,
        'radius': 500,
        'text': 'Original text'
    }
    
    create_response = client.post('/api/reminders',
                                 data=json.dumps(reminder_data),
                                 content_type='application/json')
    reminder_id = create_response.json['id']
    
    # Update reminder
    update_data = {
        'text': 'Updated text',
        'radius': 1000
    }
    
    update_response = client.put(f'/api/reminders/{reminder_id}',
                                data=json.dumps(update_data),
                                content_type='application/json')
    
    assert update_response.status_code == 200
    updated = update_response.json
    assert updated['text'] == 'Updated text'
    assert updated['radius'] == 1000


def test_delete_reminder(client):
    """Test deleting a reminder"""
    # Create reminder
    reminder_data = {
        'latitude': 40.7128,
        'longitude': -74.0060,
        'radius': 500,
        'text': 'Test reminder'
    }
    
    create_response = client.post('/api/reminders',
                                 data=json.dumps(reminder_data),
                                 content_type='application/json')
    reminder_id = create_response.json['id']
    
    # Delete reminder
    delete_response = client.delete(f'/api/reminders/{reminder_id}')
    assert delete_response.status_code == 200
    
    # Verify it's deleted
    get_response = client.get('/api/reminders')
    assert len(get_response.json) == 0


def test_delete_nonexistent_reminder(client):
    """Test deleting a reminder that doesn't exist"""
    response = client.delete('/api/reminders/nonexistent-id')
    assert response.status_code == 404


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
