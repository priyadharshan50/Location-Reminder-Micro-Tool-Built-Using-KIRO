// Location Reminder Application
class LocationReminderApp {
    constructor() {
        this.map = null;
        this.userMarker = null;
        this.selectedLocation = null;
        this.reminders = [];
        this.geofenceCircles = {};
        this.triggeredGeofences = new Set();
        this.watchId = null;
        
        this.init();
    }

    init() {
        console.log('Initializing Location Reminder App');
        this.initMap();
        this.loadReminders();
        this.setupEventListeners();
        this.startLocationTracking();
    }

    initMap() {
        // Initialize map centered on a default location (New York)
        console.log('Initializing map...');
        const mapElement = document.getElementById('map');
        console.log('Map element:', mapElement);
        
        if (!mapElement) {
            console.error('Map element not found!');
            return;
        }
        
        try {
            this.map = L.map('map').setView([40.7128, -74.0060], 13);
            console.log('Map initialized:', this.map);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(this.map);

            // Handle map clicks to select location
            this.map.on('click', (e) => this.onMapClick(e));
            
            // Force map to resize and load tiles
            setTimeout(() => {
                this.map.invalidateSize();
                console.log('Map invalidated and resized');
            }, 100);
            
            console.log('Map setup complete');
        } catch (error) {
            console.error('Error initializing map:', error);
        }
    }

    onMapClick(e) {
        const { lat, lng } = e.latlng;
        this.selectedLocation = { lat, lng };
        
        // Update coordinates display
        document.getElementById('coordinates').value = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        
        // Remove previous marker if exists
        if (this.userMarker && this.userMarker.isTemp) {
            this.map.removeLayer(this.userMarker);
        }
        
        // Add temporary marker for selected location
        this.userMarker = L.marker([lat, lng], {
            icon: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
        }).addTo(this.map);
        this.userMarker.isTemp = true;
    }

    setupEventListeners() {
        const form = document.getElementById('reminderForm');
        form.addEventListener('submit', (e) => this.onFormSubmit(e));
        
        const dismissBtn = document.getElementById('dismissBtn');
        dismissBtn.addEventListener('click', () => this.dismissNotification());
        
        // Sync range slider with input
        const radiusInput = document.getElementById('radius');
        const radiusSlider = document.getElementById('radiusSlider');
        
        radiusSlider.addEventListener('input', (e) => {
            radiusInput.value = e.target.value;
        });
        
        radiusInput.addEventListener('input', (e) => {
            radiusSlider.value = e.target.value;
        });
        
        // Center map button
        const centerBtn = document.getElementById('centerBtn');
        if (centerBtn) {
            centerBtn.addEventListener('click', () => {
                if (this.userMarker && !this.userMarker.isTemp) {
                    this.map.setView(this.userMarker.getLatLng(), 15);
                }
            });
        }
        
        // Update stats
        this.updateStats();
    }

    async onFormSubmit(e) {
        e.preventDefault();
        
        const text = document.getElementById('reminderText').value.trim();
        const radius = parseFloat(document.getElementById('radius').value);
        
        // Validate inputs
        if (!text) {
            this.showError('Reminder text cannot be empty');
            return;
        }
        
        if (!radius || radius <= 0) {
            this.showError('Radius must be a positive number greater than zero');
            return;
        }
        
        if (!this.selectedLocation) {
            this.showError('Please select a location on the map');
            return;
        }
        
        try {
            const response = await fetch('/api/reminders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    latitude: this.selectedLocation.lat,
                    longitude: this.selectedLocation.lng,
                    radius: radius,
                    text: text
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                this.showError(error.error || 'Failed to create reminder');
                return;
            }
            
            const reminder = await response.json();
            this.reminders.push(reminder);
            this.saveRemindersToStorage();
            this.renderReminder(reminder);
            this.drawGeofence(reminder);
            
            // Clear form
            document.getElementById('reminderForm').reset();
            document.getElementById('coordinates').value = '';
            this.selectedLocation = null;
            
            this.showSuccess('Reminder created successfully');
        } catch (error) {
            console.error('Error creating reminder:', error);
            this.showError('Failed to create reminder');
        }
    }

    drawGeofence(reminder) {
        const circle = L.circle([reminder.latitude, reminder.longitude], {
            radius: reminder.radius,
            color: '#667eea',
            fillColor: '#667eea',
            fillOpacity: 0.2,
            weight: 2
        }).addTo(this.map);
        
        circle.bindPopup(`<strong>${reminder.text}</strong><br>Radius: ${reminder.radius}m`);
        this.geofenceCircles[reminder.id] = circle;
    }

    renderReminder(reminder) {
        const remindersList = document.getElementById('remindersList');
        const emptyState = document.getElementById('emptyState');
        
        if (emptyState) {
            emptyState.style.display = 'none';
        }
        
        const reminderItem = document.createElement('div');
        reminderItem.className = 'reminder-item';
        reminderItem.id = `reminder-${reminder.id}`;
        
        reminderItem.innerHTML = `
            <h4>${reminder.text}</h4>
            <p>Radius: ${reminder.radius}m</p>
            <div class="reminder-details">
                Lat: ${reminder.latitude.toFixed(4)}, Lng: ${reminder.longitude.toFixed(4)}
            </div>
            <div class="reminder-actions">
                <button class="btn btn-edit" onclick="app.editReminder('${reminder.id}')">Edit</button>
                <button class="btn btn-danger" onclick="app.deleteReminder('${reminder.id}')">Delete</button>
            </div>
        `;
        
        remindersList.appendChild(reminderItem);
        this.updateStats();
    }
    
    updateStats() {
        const reminderCount = document.getElementById('reminder-count');
        const activeCount = document.getElementById('active-count');
        const reminderBadge = document.getElementById('reminderBadge');
        const emptyState = document.getElementById('emptyState');
        
        if (reminderCount) reminderCount.textContent = this.reminders.length;
        if (activeCount) activeCount.textContent = this.triggeredGeofences.size;
        if (reminderBadge) reminderBadge.textContent = this.reminders.length;
        
        if (emptyState) {
            emptyState.style.display = this.reminders.length === 0 ? 'block' : 'none';
        }
    }

    async deleteReminder(reminderId) {
        if (!confirm('Are you sure you want to delete this reminder?')) {
            return;
        }
        
        try {
            const response = await fetch(`/api/reminders/${reminderId}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                this.showError('Failed to delete reminder');
                return;
            }
            
            // Remove from local array
            this.reminders = this.reminders.filter(r => r.id !== reminderId);
            this.saveRemindersToStorage();
            
            // Remove from UI
            const reminderItem = document.getElementById(`reminder-${reminderId}`);
            if (reminderItem) {
                reminderItem.remove();
            }
            
            // Remove geofence circle
            if (this.geofenceCircles[reminderId]) {
                this.map.removeLayer(this.geofenceCircles[reminderId]);
                delete this.geofenceCircles[reminderId];
            }
            
            this.updateStats();
            this.showSuccess('Reminder deleted');
        } catch (error) {
            console.error('Error deleting reminder:', error);
            this.showError('Failed to delete reminder');
        }
    }

    editReminder(reminderId) {
        const reminder = this.reminders.find(r => r.id === reminderId);
        if (!reminder) return;
        
        const newText = prompt('Enter new reminder text:', reminder.text);
        if (newText === null) return;
        
        const newRadius = prompt('Enter new radius (meters):', reminder.radius);
        if (newRadius === null) return;
        
        const radius = parseFloat(newRadius);
        if (!radius || radius <= 0) {
            this.showError('Radius must be a positive number');
            return;
        }
        
        this.updateReminder(reminderId, newText.trim(), radius);
    }

    async updateReminder(reminderId, text, radius) {
        try {
            const response = await fetch(`/api/reminders/${reminderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: text,
                    radius: radius
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                this.showError(error.error || 'Failed to update reminder');
                return;
            }
            
            const updatedReminder = await response.json();
            
            // Update in local array
            const index = this.reminders.findIndex(r => r.id === reminderId);
            if (index !== -1) {
                this.reminders[index] = updatedReminder;
            }
            
            this.saveRemindersToStorage();
            
            // Update UI
            const reminderItem = document.getElementById(`reminder-${reminderId}`);
            if (reminderItem) {
                reminderItem.innerHTML = `
                    <h4>${updatedReminder.text}</h4>
                    <p>Radius: ${updatedReminder.radius}m</p>
                    <div class="reminder-details">
                        Lat: ${updatedReminder.latitude.toFixed(4)}, Lng: ${updatedReminder.longitude.toFixed(4)}
                    </div>
                    <div class="reminder-actions">
                        <button class="btn btn-edit" onclick="app.editReminder('${updatedReminder.id}')">Edit</button>
                        <button class="btn btn-danger" onclick="app.deleteReminder('${updatedReminder.id}')">Delete</button>
                    </div>
                `;
            }
            
            // Update geofence circle
            if (this.geofenceCircles[reminderId]) {
                this.map.removeLayer(this.geofenceCircles[reminderId]);
            }
            this.drawGeofence(updatedReminder);
            
            this.showSuccess('Reminder updated');
        } catch (error) {
            console.error('Error updating reminder:', error);
            this.showError('Failed to update reminder');
        }
    }

    startLocationTracking() {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by your browser');
            return;
        }
        
        // Request permission and start tracking
        this.watchId = navigator.geolocation.watchPosition(
            (position) => this.onLocationUpdate(position),
            (error) => this.onLocationError(error),
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    }

    onLocationUpdate(position) {
        const { latitude, longitude } = position.coords;
        
        // Update or create user location marker
        if (!this.userMarker || this.userMarker.isTemp) {
            if (this.userMarker && this.userMarker.isTemp) {
                this.map.removeLayer(this.userMarker);
            }
            
            this.userMarker = L.marker([latitude, longitude], {
                icon: L.icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                })
            }).addTo(this.map);
            this.userMarker.bindPopup('Your Location');
        } else {
            this.userMarker.setLatLng([latitude, longitude]);
        }
        
        // Check geofences
        this.checkGeofences(latitude, longitude);
    }

    onLocationError(error) {
        console.error('Geolocation error:', error);
        if (error.code === error.PERMISSION_DENIED) {
            this.showError('Location permission denied. Please enable location access.');
        }
    }

    checkGeofences(userLat, userLng) {
        this.reminders.forEach(reminder => {
            const distance = this.calculateDistance(
                userLat, userLng,
                reminder.latitude, reminder.longitude
            );
            
            const isInside = distance <= reminder.radius;
            const wasTriggered = this.triggeredGeofences.has(reminder.id);
            
            if (isInside && !wasTriggered) {
                // Entered geofence
                this.triggerAlarm(reminder);
                this.triggeredGeofences.add(reminder.id);
            } else if (!isInside && wasTriggered) {
                // Exited geofence
                this.triggeredGeofences.delete(reminder.id);
            }
        });
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        // Haversine formula
        const R = 6371000; // Earth's radius in meters
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    triggerAlarm(reminder) {
        // Display notification
        document.getElementById('notificationText').textContent = reminder.text;
        const notification = document.getElementById('notification');
        notification.classList.remove('hidden');
        
        // Play audio
        const audio = document.getElementById('alarmSound');
        audio.play().catch(err => console.log('Audio play failed:', err));
    }

    dismissNotification() {
        const notification = document.getElementById('notification');
        notification.classList.add('hidden');
        
        const audio = document.getElementById('alarmSound');
        audio.pause();
        audio.currentTime = 0;
    }

    saveRemindersToStorage() {
        localStorage.setItem('reminders', JSON.stringify(this.reminders));
    }

    loadReminders() {
        const stored = localStorage.getItem('reminders');
        if (stored) {
            try {
                this.reminders = JSON.parse(stored);
                this.reminders.forEach(reminder => {
                    this.renderReminder(reminder);
                    this.drawGeofence(reminder);
                });
            } catch (error) {
                console.error('Error loading reminders:', error);
            }
        }
    }

    showError(message) {
        alert(`Error: ${message}`);
    }

    showSuccess(message) {
        console.log(`Success: ${message}`);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Remove hidden class from main app after splash screen
    setTimeout(() => {
        const mainApp = document.getElementById('main-app');
        if (mainApp) {
            mainApp.classList.remove('hidden');
        }
    }, 3000);
    
    window.app = new LocationReminderApp();
});
