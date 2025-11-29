# Design Document

## Overview

The Location Reminder system is a Flask-based web application that combines server-side geofence management with client-side location tracking and real-time notifications. The architecture uses a map interface (Leaflet.js) for visualization, browser geolocation API for tracking, and local storage for persistence.

## Architecture

The system follows a client-server architecture:

- **Frontend**: HTML/CSS/JavaScript with Leaflet.js for mapping
- **Backend**: Flask server providing API endpoints for reminder management
- **Storage**: Browser local storage for client-side persistence and optional server-side database
- **Real-time Detection**: Client-side distance calculation to detect geofence entry

## Components and Interfaces

### Frontend Components

1. **Map Manager**
   - Initializes and manages the Leaflet map
   - Displays geofences as circles
   - Shows user's current location marker
   - Handles map interactions (click to place markers)

2. **Geofence Manager**
   - Creates, updates, and deletes geofences
   - Calculates distance between user location and geofence center
   - Detects when user enters/exits geofences

3. **Reminder Form**
   - Collects user input: location (via map click), radius, reminder text
   - Validates input before submission
   - Submits reminder data to backend

4. **Notification System**
   - Displays alarm notifications when geofence is entered
   - Plays audio alert
   - Provides dismiss functionality

5. **Location Tracker**
   - Requests browser geolocation permission
   - Continuously updates user's current position
   - Updates map marker with current location

### Backend Components

1. **Flask Application**
   - Serves static files (HTML, CSS, JS)
   - Provides REST API endpoints for reminder operations

2. **API Endpoints**
   - `GET /api/reminders` - Retrieve all reminders
   - `POST /api/reminders` - Create a new reminder
   - `PUT /api/reminders/<id>` - Update a reminder
   - `DELETE /api/reminders/<id>` - Delete a reminder

## Data Models

### Reminder Object

```json
{
  "id": "unique_identifier",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "radius": 500,
  "text": "Pick up groceries",
  "created_at": "2025-11-22T10:30:00Z",
  "triggered": false
}
```

### Geofence Calculation

Distance between two points (Haversine formula):
- Input: User location (lat1, lon1), Geofence center (lat2, lon2)
- Output: Distance in meters
- Geofence entry: distance <= radius

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

Property 1: Geofence Entry Detection
*For any* user location and geofence, if the distance from user location to geofence center is less than or equal to the radius, the system SHALL detect entry into the geofence.
**Validates: Requirements 3.1**

Property 2: Geofence Exit Detection
*For any* user location and geofence, if the distance from user location to geofence center is greater than the radius, the system SHALL not trigger an alarm.
**Validates: Requirements 3.1**

Property 3: Radius Validation
*For any* radius input, if the radius is a positive number greater than zero, the system SHALL accept it; if the radius is zero or negative, the system SHALL reject it.
**Validates: Requirements 1.2**

Property 4: Reminder Persistence Round Trip
*For any* reminder created and stored, retrieving it from storage SHALL return an equivalent reminder with the same location, radius, and text.
**Validates: Requirements 5.1, 5.2**

Property 5: Reminder Deletion
*For any* reminder that is deleted, subsequent queries to storage SHALL not return that reminder.
**Validates: Requirements 5.3**

Property 6: Reminder Update Consistency
*For any* reminder that is updated with new radius or text, retrieving it from storage SHALL return the updated values.
**Validates: Requirements 5.4**

## Error Handling

- Invalid radius input: Display error message and prevent reminder creation
- Location permission denied: Display message and disable location tracking
- Geolocation unavailable: Show fallback message
- Storage errors: Log to console and display user-friendly message
- Invalid reminder data: Validate on both client and server

## Testing Strategy

### Unit Testing

Unit tests will verify specific examples and edge cases:
- Radius validation with various inputs (0, negative, positive, decimal)
- Distance calculation with known coordinates
- Reminder CRUD operations
- Storage persistence and retrieval

### Property-Based Testing

Property-based tests will use Hypothesis (Python) and fast-check (JavaScript) to verify universal properties:
- Geofence detection across random locations and radii
- Radius validation across all numeric inputs
- Reminder persistence round-trip across various reminder data
- Reminder deletion consistency
- Reminder update consistency

Each property-based test will run a minimum of 100 iterations to ensure robustness.

### Testing Framework

- **Backend**: pytest with pytest-hypothesis for property-based testing
- **Frontend**: Jest with fast-check for property-based testing
- **Integration**: Selenium for end-to-end testing of map interactions

