# LOC-TRACK - Location Reminder Application

A modern, high-end location-based reminder application with glassmorphism design, smooth animations, and real-time geofencing capabilities.

## Features

### Core Functionality
- **Interactive Map**: Leaflet.js powered map with OpenStreetMap tiles
- **Geofencing**: Create circular geofences with custom radius
- **Real-time Tracking**: Continuous GPS location tracking
- **Smart Notifications**: Audio and visual alerts when entering geofences
- **Reminder Management**: Create, edit, and delete location reminders
- **Persistent Storage**: Browser local storage for data persistence

### Design Features
- **3-Second Splash Screen**: Animated "LOC-TRACK" branding on launch
- **Glassmorphism UI**: Modern frosted glass effect throughout
- **Smooth Animations**: Transitions on all interactions
- **Gradient Backgrounds**: Beautiful purple gradient theme
- **Range Slider**: Interactive radius selector with live sync
- **Live Statistics**: Real-time reminder count and active geofences
- **Floating Action Buttons**: Quick access to map controls
- **Toast Notifications**: Elegant slide-in notification system
- **Empty States**: Helpful prompts when no reminders exist
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

### Backend
- **Flask 2.3.3**: Python web framework
- **Flask-CORS 4.0.0**: Cross-origin resource sharing
- **Python 3.7+**: Core language

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with animations
- **JavaScript (ES6+)**: Application logic
- **Leaflet.js 1.9.4**: Interactive mapping library
- **OpenStreetMap**: Free map tiles
- **Google Fonts (Inter)**: Modern typography

### Storage & APIs
- **Browser Local Storage**: Client-side data persistence
- **Geolocation API**: Real-time location tracking
- **REST API**: Backend communication

## Installation

### Prerequisites
- Python 3.7 or higher
- pip (Python package manager)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for map tiles)

### Setup Steps

1. **Navigate to project directory**
```bash
cd location-reminder
```

2. **Install Python dependencies**
```bash
pip install -r requirements.txt
```

3. **Run the application**
```bash
python app.py
```

4. **Open in browser**
```
http://localhost:5000
```

## Usage Guide

### First Launch
1. Application shows 3-second splash screen with "LOC-TRACK" branding
2. Main interface loads with map and sidebar
3. Grant location permission when prompted

### Creating a Reminder

1. **Select Location**
   - Click anywhere on the map
   - Blue marker appears at selected location
   - Coordinates auto-fill in the form

2. **Set Radius**
   - Enter radius in meters (50-5000m)
   - Use range slider for quick adjustment
   - Slider and input sync automatically

3. **Add Reminder Text**
   - Enter descriptive text (e.g., "Pick up groceries")
   - Text appears in notification when triggered

4. **Create**
   - Click "Create Reminder" button
   - Geofence circle appears on map
   - Reminder added to list

### Managing Reminders

**View Reminders**
- All reminders listed in right sidebar
- Shows text, radius, and coordinates
- Live count in header statistics

**Edit Reminder**
- Click "Edit" button on reminder
- Update text or radius
- Changes apply immediately

**Delete Reminder**
- Click "Delete" button
- Confirm deletion
- Geofence removed from map

### Geofence Alerts

**When You Enter a Geofence:**
1. Notification toast slides in from right
2. Audio alert plays
3. Reminder text displays
4. Click "Dismiss" to close

**When You Exit:**
- Geofence resets
- Can trigger again on re-entry

### Map Controls

**Center Button**
- Click to center map on your location
- Only works when location is active

**Layers Button**
- Future feature for map layer selection

## API Reference

### Endpoints

#### Get All Reminders
```http
GET /api/reminders
```

**Response:**
```json
[
  {
    "id": "uuid",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "radius": 500,
    "text": "Pick up groceries",
    "created_at": "2025-11-22T10:30:00Z",
    "triggered": false
  }
]
```

#### Create Reminder
```http
POST /api/reminders
Content-Type: application/json
```

**Request Body:**
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "radius": 500,
  "text": "Pick up groceries"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "radius": 500,
  "text": "Pick up groceries",
  "created_at": "2025-11-22T10:30:00Z",
  "triggered": false
}
```

#### Update Reminder
```http
PUT /api/reminders/{id}
Content-Type: application/json
```

**Request Body:**
```json
{
  "radius": 600,
  "text": "Updated reminder text"
}
```

**Response:** `200 OK`

#### Delete Reminder
```http
DELETE /api/reminders/{id}
```

**Response:** `200 OK`
```json
{
  "message": "Reminder deleted"
}
```

### Error Responses

**400 Bad Request**
```json
{
  "error": "Radius must be a positive number greater than zero"
}
```

**404 Not Found**
```json
{
  "error": "Reminder not found"
}
```

## Project Structure

```
location-reminder/
├── app.py                      # Flask application
├── requirements.txt            # Python dependencies
├── templates/
│   ├── index.html             # Main application page
│   ├── test.html              # Test page
│   └── simple.html            # Simple test page
├── static/
│   ├── css/
│   │   └── style.css          # Application styles
│   ├── js/
│   │   └── app.js             # Application logic
│   └── audio/
│       └── alarm.mp3          # Notification sound
├── tests/
│   ├── test_api.py            # API tests
│   └── test_geofence.py       # Geofence tests
└── README.md                   # This file
```

## Design System

### Colors
- **Primary**: `#6366f1` (Indigo)
- **Secondary**: `#8b5cf6` (Purple)
- **Accent**: `#ec4899` (Pink)
- **Success**: `#10b981` (Green)
- **Danger**: `#ef4444` (Red)
- **Background**: Linear gradient `#667eea` to `#764ba2`

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Effects
- **Glassmorphism**: `backdrop-filter: blur(20px)`
- **Shadows**: Multiple levels for depth
- **Animations**: Cubic-bezier easing
- **Transitions**: 0.3s standard timing

## Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |

**Requirements:**
- Geolocation API support
- CSS backdrop-filter support
- ES6+ JavaScript support
- Local Storage support

## Performance

### Metrics
- **Splash Screen**: 3 seconds
- **Map Load**: < 2 seconds
- **Location Update**: 1-5 seconds
- **API Response**: < 100ms
- **Animation**: 60 FPS

### Optimization
- Lazy loading for map tiles
- Debounced location updates
- Efficient DOM manipulation
- CSS hardware acceleration
- Minimal re-renders

## Security

### Client-Side
- Input validation on all forms
- XSS prevention
- Local storage encryption (future)

### Server-Side
- Input sanitization
- Type validation
- Error handling
- CORS configuration

## Troubleshooting

### Map Not Visible
1. Check internet connection
2. Verify Leaflet.js CDN is accessible
3. Open browser console (F12) for errors
4. Try hard refresh (Ctrl+Shift+R)

### Location Not Updating
1. Grant location permission
2. Enable location services on device
3. Check browser console for errors
4. Try different browser

### Reminders Not Saving
1. Check if local storage is enabled
2. Clear browser cache
3. Check browser console for errors
4. Verify storage quota

### Splash Screen Stuck
1. Wait full 3 seconds
2. Check JavaScript console for errors
3. Refresh page
4. Clear browser cache

## Development

### Running Tests
```bash
cd location-reminder
pytest tests/
```

### Debug Mode
Flask runs in debug mode by default:
```python
app.run(debug=True, port=5000)
```

### Hot Reload
- Flask auto-reloads on Python file changes
- Refresh browser for HTML/CSS/JS changes

## Future Enhancements

### Planned Features
- [ ] User authentication
- [ ] Cloud storage sync
- [ ] Multiple map layers
- [ ] Custom marker icons
- [ ] Reminder categories
- [ ] Recurring reminders
- [ ] Share reminders
- [ ] Export/Import data
- [ ] Dark mode toggle
- [ ] Offline support
- [ ] Push notifications
- [ ] Analytics dashboard

### Technical Improvements
- [ ] Database integration (PostgreSQL)
- [ ] Redis caching
- [ ] WebSocket for real-time updates
- [ ] Progressive Web App (PWA)
- [ ] Service Worker
- [ ] Unit test coverage
- [ ] E2E testing
- [ ] CI/CD pipeline
- [ ] Docker containerization
- [ ] Kubernetes deployment

## Contributing

### Code Style
- Python: PEP 8
- JavaScript: ES6+ with semicolons
- CSS: BEM methodology
- Indentation: 4 spaces (Python), 2 spaces (HTML/CSS/JS)

### Commit Messages
- Use present tense
- Be descriptive
- Reference issues

### Pull Requests
1. Fork repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit PR

## License

MIT License - See LICENSE file for details

## Credits

### Libraries
- Flask by Pallets
- Leaflet.js by Vladimir Agafonkin
- OpenStreetMap contributors
- Google Fonts (Inter)

### Design Inspiration
- Glassmorphism trend
- Modern UI/UX principles
- Material Design guidelines

## Support

### Documentation
- README.md (this file)
- API documentation above
- Code comments

### Issues
- Check browser console
- Review troubleshooting section
- Check GitHub issues

### Contact
- Email: priyadharshan505@gmai.com

---

**Version**: 1.0.0  
**Last Updated**: November 22, 2025  
**Status**: Production Ready

Built with ❤️ using Flask and Leaflet.js

