@echo off
echo Installing dependencies...
pip install -r requirements.txt

echo.
echo Starting Location Reminder application...
echo Open your browser and go to: http://localhost:5000
echo.

python app.py
