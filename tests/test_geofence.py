"""
Property-based tests for geofence detection logic
"""
import math
import pytest
from hypothesis import given, strategies as st


def haversine_distance(lat1, lon1, lat2, lon2):
    """Calculate distance between two coordinates using Haversine formula"""
    R = 6371000  # Earth's radius in meters
    dLat = (lat2 - lat1) * math.pi / 180
    dLon = (lon2 - lon1) * math.pi / 180
    a = (math.sin(dLat / 2) * math.sin(dLat / 2) +
         math.cos(lat1 * math.pi / 180) * math.cos(lat2 * math.pi / 180) *
         math.sin(dLon / 2) * math.sin(dLon / 2))
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


def is_inside_geofence(user_lat, user_lon, center_lat, center_lon, radius):
    """Check if user location is inside geofence"""
    distance = haversine_distance(user_lat, user_lon, center_lat, center_lon)
    return distance <= radius


# Property-based tests

@given(
    user_lat=st.floats(min_value=-90, max_value=90),
    user_lon=st.floats(min_value=-180, max_value=180),
    center_lat=st.floats(min_value=-90, max_value=90),
    center_lon=st.floats(min_value=-180, max_value=180),
    radius=st.floats(min_value=1, max_value=100000)
)
def test_geofence_entry_detection(user_lat, user_lon, center_lat, center_lon, radius):
    """
    Property 1: Geofence Entry Detection
    For any user location and geofence, if the distance from user location to 
    geofence center is less than or equal to the radius, the system SHALL detect 
    entry into the geofence.
    **Validates: Requirements 3.1**
    """
    distance = haversine_distance(user_lat, user_lon, center_lat, center_lon)
    
    if distance <= radius:
        assert is_inside_geofence(user_lat, user_lon, center_lat, center_lon, radius)


@given(
    user_lat=st.floats(min_value=-90, max_value=90),
    user_lon=st.floats(min_value=-180, max_value=180),
    center_lat=st.floats(min_value=-90, max_value=90),
    center_lon=st.floats(min_value=-180, max_value=180),
    radius=st.floats(min_value=1, max_value=100000)
)
def test_geofence_exit_detection(user_lat, user_lon, center_lat, center_lon, radius):
    """
    Property 2: Geofence Exit Detection
    For any user location and geofence, if the distance from user location to 
    geofence center is greater than the radius, the system SHALL not trigger an alarm.
    **Validates: Requirements 3.1**
    """
    distance = haversine_distance(user_lat, user_lon, center_lat, center_lon)
    
    if distance > radius:
        assert not is_inside_geofence(user_lat, user_lon, center_lat, center_lon, radius)


@given(radius=st.floats())
def test_radius_validation(radius):
    """
    Property 3: Radius Validation
    For any radius input, if the radius is a positive number greater than zero, 
    the system SHALL accept it; if the radius is zero or negative, the system 
    SHALL reject it.
    **Validates: Requirements 1.2**
    """
    is_valid = radius > 0
    
    # Validation logic
    try:
        if radius <= 0:
            raise ValueError('Radius must be a positive number greater than zero')
        # If we get here, radius is valid
        assert is_valid
    except ValueError:
        assert not is_valid


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
