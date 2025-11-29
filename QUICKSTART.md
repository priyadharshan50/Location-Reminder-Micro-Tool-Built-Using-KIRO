# Quick Start Guide

## Running the Application

### Windows
```bash
run.bat
```

### Linux/Mac
```bash
bash run.sh
```

### Manual Start
```bash
pip install -r requirements.txt
python app.py
```

Then open: **http://localhost:5000**

## First Steps

1. **Allow Location Access**: When prompted, grant location permission to your browser
2. **Click on Map**: Select a location by clicking anywhere on the map
3. **Set Radius**: Enter a radius in meters (e.g., 500)
4. **Add Text**: Enter what you want to be reminded about
5. **Create**: Click "Create Reminder"

## What Happens Next

- A blue circle appears on the map showing your geofence
- Your current location is shown as a red marker
- When you move into the blue circle, an alarm will trigger
- The reminder text will appear in a notification
- Click "Dismiss" to close the notification

## Tips

- Use smaller radius values (100-500m) for precise locations
- You can have multiple reminders active at once
- Reminders are saved automatically in your browser
- Edit reminders by clicking the "Edit" button
- Delete reminders by clicking the "Delete" button

## Troubleshooting

**Map is blank?**
- Refresh the page (F5)
- Check browser console (F12) for errors
- Ensure internet connection is active

**Location not updating?**
- Check if location services are enabled
- Grant location permission when prompted
- Try a different browser

**Reminders not saving?**
- Check if local storage is enabled
- Clear browser cache
- Try a different browser
