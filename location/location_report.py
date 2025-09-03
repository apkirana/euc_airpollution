#!/usr/bin/env python3

import os
import json
import time
import folium
from folium import plugins
import requests
from datetime import datetime
from pathlib import Path

# Configuration
OUTPUT_DIR = Path("reports")
OUTPUT_FILE = "location_report.html"
def get_template():
    """Return the HTML template with proper string formatting."""
    return """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Location Report</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <style>
        body {{ padding: 20px; background-color: #f8f9fa; }}
        .card {{ margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }}
        .card-header {{ font-weight: bold; }}
        .map-container {{ height: 500px; margin: 20px 0; border-radius: 8px; overflow: hidden; }}
        .info-item {{ margin-bottom: 10px; }}
        .info-label {{ font-weight: 600; color: #495057; }}
        .info-value {{ color: #212529; }}
        .last-updated {{ font-size: 0.9em; color: #6c757d; margin-top: 20px; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="text-center mb-4">
            <h1 class="display-4"><i class="bi bi-geo-alt-fill text-primary"></i> Location Report</h1>
            <p class="lead">Generated on {generation_time}</p>
        </div>
        
        <div class="row">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header bg-primary text-white">
                        <i class="bi bi-info-circle"></i> Location Information
                    </div>
                    <div class="card-body">
                        {location_info}
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-header bg-info text-white">
                        <i class="bi bi-hdd-network"></i> Network Information
                    </div>
                    <div class="card-body">
                        {network_info}
                    </div>
                </div>
            </div>
            
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header bg-success text-white">
                        <i class="bi bi-map"></i> Interactive Map
                    </div>
                    <div class="card-body">
                        <div id="map" class="map-container">
                            {map_html}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="text-center last-updated">
            <p>Report generated at {current_time} | IP: {ip_address}</p>
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
"""

def get_public_ip():
    """Get public IP address using ipify API."""
    try:
        response = requests.get('https://api.ipify.org?format=json', timeout=10)
        response.raise_for_status()
        return response.json()['ip']
    except Exception as e:
        print(f"Error getting public IP: {e}")
        return "Unknown"

def get_location_data(ip):
    """Get location data using ipinfo.io API."""
    try:
        response = requests.get(f'https://ipinfo.io/{ip}/json', timeout=10)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error getting location data: {e}")
        return {}

def generate_map(lat, lng, location_data):
    """Generate a folium map with the current location."""
    try:
        # Create a map centered on the obtained coordinates
        m = folium.Map(
            location=[lat, lng],
            zoom_start=12,
            tiles='cartodbpositron',
            control_scale=True
        )
        
        # Add a circle marker
        folium.CircleMarker(
            location=[lat, lng],
            radius=10,
            color='#4285F4',
            fill=True,
            fill_color='#4285F4',
            fill_opacity=0.6,
            popup=folium.Popup(
                f"<b>📍 Your Location</b><br>"
                f"{location_data.get('city', 'Unknown City')}, "
                f"{location_data.get('region', 'Unknown Region')}",
                max_width=300
            )
        ).add_to(m)
        
        # Add a marker with custom icon
        folium.Marker(
            [lat, lng],
            popup=folium.Popup(
                f"<b>📌 Location Details</b><br>"
                f"City: {location_data.get('city', 'Unknown')}<br>"
                f"Region: {location_data.get('region', 'Unknown')}<br>"
                f"Country: {location_data.get('country', 'Unknown')}<br>"
                f"Postal: {location_data.get('postal', 'N/A')}",
                max_width=300
            ),
            tooltip="Click for more info",
            icon=folium.Icon(color='red', icon='info-sign')
        ).add_to(m)
        
        # Add minimap
        minimap = plugins.MiniMap()
        m.add_child(minimap)
        
        # Add measure control
        plugins.MeasureControl().add_to(m)
        
        # Add fullscreen button
        plugins.Fullscreen().add_to(m)
        
        return m._repr_html_()
    except Exception as e:
        print(f"Error generating map: {e}")
        return "<p>Could not generate map. Please check your internet connection.</p>"

def generate_html_report():
    """Generate the HTML report with location information."""
    try:
        print("🌍 Gathering location information...")
        
        # Get public IP
        public_ip = get_public_ip()
        if public_ip == "Unknown":
            raise Exception("Could not determine public IP address")
        
        # Get location data
        location_data = get_location_data(public_ip)
        if not location_data:
            raise Exception("Could not retrieve location data")
        
        # Parse location data
        lat, lng = map(float, location_data.get('loc', '0,0').split(','))
        
        # Generate map HTML
        print("🗺️ Generating interactive map...")
        map_html = generate_map(lat, lng, location_data)
        
        # Prepare location information
        location_info = ""
        for key, label in [
            ('city', 'City'),
            ('region', 'Region'),
            ('country', 'Country'),
            ('postal', 'Postal Code'),
            ('timezone', 'Timezone')
        ]:
            value = location_data.get(key, 'N/A')
            location_info += f"""
            <div class="info-item">
                <span class="info-label">{label}:</span>
                <span class="info-value">{value}</span>
            </div>
            """
        
        # Prepare network information
        network_info = f"""
        <div class="info-item">
            <span class="info-label"><i class="bi bi-globe"></i> Public IP:</span>
            <span class="info-value">{public_ip}</span>
        </div>
        <div class="info-item">
            <span class="info-label"><i class="bi bi-hdd-network"></i> ISP/Organization:</span>
            <span class="info-value">{location_data.get('org', 'Unknown')}</span>
        </div>
        <div class="info-item">
            <span class="info-label"><i class="bi bi-geo-alt"></i> Coordinates:</span>
            <span class="info-value">{lat:.4f}° N, {lng:.4f}° E</span>
        </div>
        """
        
        # Get current time
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Generate HTML
        print("📄 Generating HTML report...")
        template = get_template()
        html_content = template.format(
            generation_time=current_time,
            location_info=location_info,
            network_info=network_info,
            map_html=map_html,
            current_time=current_time,
            ip_address=public_ip
        )
        
        # Create output directory if it doesn't exist
        OUTPUT_DIR.mkdir(exist_ok=True)
        output_path = OUTPUT_DIR / OUTPUT_FILE
        
        # Save the HTML file
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        print(f"✅ Report generated successfully: {output_path.absolute()}")
        return str(output_path.absolute())
        
    except Exception as e:
        print(f"❌ Error generating report: {e}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    print("🚀 Starting location report generation...")
    report_path = generate_html_report()
    
    if report_path:
        print(f"\n✨ Report generation complete!")
        print(f"📂 Report saved to: {report_path}")
        print("\nTo view the report, open it in your web browser.")
    else:
        print("\n❌ Failed to generate the report. Please check the error messages above.")
        print("💡 Make sure you have an active internet connection and try again.")
