# Implementation Plan

- [-] 1. Set up Flask project structure and dependencies

  - Create Flask application with basic configuration
  - Set up project directories: static (CSS, JS), templates (HTML)
  - Install required dependencies: Flask, Flask-CORS
  - Create requirements.txt with all dependencies
  - _Requirements: 1.1, 2.1, 3.1_

- [ ] 2. Create backend API endpoints for reminder management
  - Implement GET /api/reminders endpoint to retrieve all reminders
  - Implement POST /api/reminders endpoint to create new reminders
  - Implement PUT /api/reminders/<id> endpoint to update reminders
  - Implement DELETE /api/reminders/<id> endpoint to delete reminders
  - Add input validation for radius (positive number > 0)
  - _Requirements: 1.2, 4.2, 4.3, 5.1_

- [ ]* 2.1 Write property test for radius validation
  - **Property 3: Radius Validation**
  - **Validates: Requirements 1.2**

- [ ] 3. Create HTML template and basic map interface
  - Create index.html with map container and form elements
  - Include Leaflet.js library and CSS
  - Create form for entering reminder text and radius
  - Add buttons for creating, editing, and deleting reminders
  - _Requirements: 1.1, 1.3, 1.4_

- [ ] 4. Implement map initialization and marker placement
  - Initialize Leaflet map centered on default location
  - Implement click handler to place markers on map
  - Store clicked coordinates for reminder creation
  - Display visual feedback when location is selected
  - _Requirements: 1.1, 1.4_

- [ ]* 4.1 Write unit test for map marker placement
  - Test that clicking map stores correct coordinates
  - Test that marker appears at clicked location

- [ ] 5. Implement geofence circle rendering
  - Create function to draw circles on map based on radius
  - Display all saved reminders as circles on map
  - Update circle display when reminders are added/removed
  - Color code circles for visual distinction
  - _Requirements: 1.4, 4.1_

- [ ]* 5.1 Write unit test for circle rendering
  - Test that circles are drawn with correct radius
  - Test that circles appear at correct coordinates

- [ ] 6. Implement location tracking with browser geolocation API
  - Request user permission for location access
  - Continuously track user's current location
  - Update user position marker on map
  - Handle location permission denial gracefully
  - _Requirements: 2.1, 2.2, 2.3_

- [ ]* 6.1 Write unit test for location tracking
  - Test that location updates are received
  - Test that user marker updates on location change

- [ ] 7. Implement geofence detection logic
  - Create function to calculate distance between two coordinates (Haversine formula)
  - Implement geofence entry detection by comparing distance to radius
  - Track which geofences have been triggered to avoid duplicate alarms
  - _Requirements: 3.1_

- [ ]* 7.1 Write property test for geofence entry detection
  - **Property 1: Geofence Entry Detection**
  - **Validates: Requirements 3.1**

- [ ]* 7.2 Write property test for geofence exit detection
  - **Property 2: Geofence Exit Detection**
  - **Validates: Requirements 3.1**

- [ ] 8. Implement alarm notification system
  - Create notification UI component
  - Display reminder text when geofence is entered
  - Implement dismiss button to clear notification
  - Add visual styling for alarm state
  - _Requirements: 3.2, 3.4_

- [ ]* 8.1 Write unit test for notification display
  - Test that notification shows correct reminder text
  - Test that dismiss button clears notification

- [ ] 9. Implement audio alert functionality
  - Create or include audio file for alarm sound
  - Play audio when geofence is entered
  - Stop audio when notification is dismissed
  - _Requirements: 3.3_

- [ ] 10. Implement local storage persistence
  - Create functions to save reminders to browser local storage
  - Create functions to load reminders from local storage
  - Create functions to update reminders in local storage
  - Create functions to delete reminders from local storage
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ]* 10.1 Write property test for reminder persistence round trip
  - **Property 4: Reminder Persistence Round Trip**
  - **Validates: Requirements 5.1, 5.2**

- [ ]* 10.2 Write property test for reminder deletion
  - **Property 5: Reminder Deletion**
  - **Validates: Requirements 5.3**

- [ ]* 10.3 Write property test for reminder update consistency
  - **Property 6: Reminder Update Consistency**
  - **Validates: Requirements 5.4**

- [ ] 11. Implement reminder form and submission
  - Create form validation for all inputs
  - Implement form submission to create reminders
  - Clear form after successful submission
  - Display success/error messages
  - _Requirements: 1.2, 1.3, 1.4_

- [ ]* 11.1 Write unit test for form validation
  - Test that invalid radius is rejected
  - Test that empty text is rejected
  - Test that valid inputs are accepted

- [ ] 12. Implement reminder management UI
  - Create list view of all reminders
  - Implement edit functionality to modify radius and text
  - Implement delete functionality with confirmation
  - Display reminder details when selected
  - _Requirements: 4.1, 4.2, 4.3_

- [ ]* 12.1 Write unit test for reminder management
  - Test that reminders appear in list
  - Test that edit updates reminder
  - Test that delete removes reminder

- [ ] 13. Implement application initialization and data loading
  - Load all saved reminders from local storage on app start
  - Render all reminders on map
  - Initialize location tracking
  - Handle first-time user experience
  - _Requirements: 4.4, 5.2_

- [ ]* 13.1 Write unit test for app initialization
  - Test that reminders are loaded from storage
  - Test that reminders are displayed on map

- [ ] 14. Checkpoint - Ensure all tests pass
  - Run all unit tests and verify they pass
  - Run all property-based tests and verify they pass
  - Fix any failing tests
  - Ask the user if questions arise

- [ ] 15. Integration testing and end-to-end validation
  - Test complete workflow: create reminder → track location → trigger alarm
  - Test reminder persistence across page reloads
  - Test multiple reminders simultaneously
  - Test edge cases: very small radius, very large radius, overlapping geofences
  - _Requirements: All_

- [ ]* 15.1 Write integration test for complete workflow
  - Test creating reminder, moving into geofence, receiving alarm

- [ ] 16. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
