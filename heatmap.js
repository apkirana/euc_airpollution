/**
 * AQI Heatmap Forecast - Object-Oriented Implementation
 * Handles interactive air quality heatmap visualization for JABODETABEK region
 */

class AQIHeatmap {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            gridWidth: 20,
            gridHeight: 15,
            updateInterval: 5000, // 5 seconds
            animationDuration: 300,
            ...options
        };
        
        this.currentTimeframe = '24h';
        this.currentPollutant = 'PM2.5';
        this.isUpdating = false;
        this.tooltip = null;
        
        this.init();
    }
    
    init() {
        this.createHeatmapStructure();
        this.generateInitialData();
        this.bindEvents();
        this.startAutoUpdate();
    }
    
    createHeatmapStructure() {
        this.container.innerHTML = `
            <div class="heatmap-container">
                <div class="heatmap-info">
                    <h4><i class="fas fa-map-marked-alt"></i> Live Forecast</h4>
                    <div class="info-content">
                        <div><strong>Region:</strong> JABODETABEK</div>
                        <div><strong>Pollutant:</strong> <span id="current-pollutant">${this.currentPollutant}</span></div>
                        <div><strong>Timeframe:</strong> <span id="current-timeframe">${this.currentTimeframe}</span></div>
                        <div><strong>Updated:</strong> <span id="last-update">${new Date().toLocaleTimeString()}</span></div>
                    </div>
                </div>
                
                <div class="heatmap-controls">
                    <button class="heatmap-control-btn active" data-timeframe="24h">24H</button>
                    <button class="heatmap-control-btn" data-timeframe="48h">48H</button>
                    <button class="heatmap-control-btn" data-timeframe="72h">72H</button>
                </div>
                
                <div class="heatmap-legend">
                    <h4>AQI Scale</h4>
                    <div class="legend-item">
                        <div class="legend-color" style="background-color: #00e400;"></div>
                        <span>Good (0-50)</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background-color: #ffff00;"></div>
                        <span>Moderate (51-100)</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background-color: #ff7e00;"></div>
                        <span>Unhealthy for Sensitive (101-150)</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background-color: #ff0000;"></div>
                        <span>Unhealthy (151-200)</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background-color: #8f3f97;"></div>
                        <span>Very Unhealthy (201-300)</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background-color: #7e0023;"></div>
                        <span>Hazardous (300+)</span>
                    </div>
                </div>
                
                <div class="heatmap-grid" id="heatmap-grid"></div>
                
                <div class="heatmap-tooltip" id="heatmap-tooltip"></div>
            </div>
        `;
        
        this.grid = document.getElementById('heatmap-grid');
        this.tooltip = document.getElementById('heatmap-tooltip');
        this.createGridCells();
    }
    
    createGridCells() {
        const totalCells = this.options.gridWidth * this.options.gridHeight;
        
        for (let i = 0; i < totalCells; i++) {
            const cell = document.createElement('div');
            cell.className = 'heatmap-cell';
            cell.dataset.cellId = i;
            
            // Calculate approximate coordinates for JABODETABEK region
            const row = Math.floor(i / this.options.gridWidth);
            const col = i % this.options.gridWidth;
            
            // Map to approximate lat/lng for JABODETABEK
            const lat = -6.0 - (row / this.options.gridHeight) * 0.8; // Roughly -6.0 to -6.8
            const lng = 106.4 + (col / this.options.gridWidth) * 1.0; // Roughly 106.4 to 107.4
            
            cell.dataset.lat = lat.toFixed(4);
            cell.dataset.lng = lng.toFixed(4);
            
            this.grid.appendChild(cell);
        }
    }
    
    generateInitialData() {
        const cells = this.grid.querySelectorAll('.heatmap-cell');
        
        cells.forEach((cell, index) => {
            const aqi = this.generateAQIValue(index);
            this.updateCell(cell, aqi);
        });
    }
    
    generateAQIValue(cellIndex) {
        // Simulate realistic AQI patterns for JABODETABEK
        const row = Math.floor(cellIndex / this.options.gridWidth);
        const col = cellIndex % this.options.gridWidth;
        
        // Create hotspots around major cities
        const jakartaCenter = { row: 7, col: 8 }; // Approximate Jakarta center
        const bekasiCenter = { row: 6, col: 14 }; // Approximate Bekasi
        const tangerangCenter = { row: 8, col: 3 }; // Approximate Tangerang
        
        let baseAQI = 50; // Base moderate level
        
        // Add influence from major pollution sources
        const jakartaDistance = Math.sqrt(Math.pow(row - jakartaCenter.row, 2) + Math.pow(col - jakartaCenter.col, 2));
        const bekasiDistance = Math.sqrt(Math.pow(row - bekasiCenter.row, 2) + Math.pow(col - bekasiCenter.col, 2));
        const tangerangDistance = Math.sqrt(Math.pow(row - tangerangCenter.row, 2) + Math.pow(col - tangerangCenter.col, 2));
        
        // Higher AQI near urban centers
        baseAQI += Math.max(0, 80 - jakartaDistance * 15);
        baseAQI += Math.max(0, 60 - bekasiDistance * 12);
        baseAQI += Math.max(0, 40 - tangerangDistance * 10);
        
        // Add some randomness for realistic variation
        baseAQI += (Math.random() - 0.5) * 30;
        
        // Add time-based variation
        const timeVariation = Math.sin(Date.now() / 100000 + cellIndex) * 20;
        baseAQI += timeVariation;
        
        return Math.max(10, Math.min(300, Math.round(baseAQI)));
    }
    
    updateCell(cell, aqi) {
        const color = this.getAQIColor(aqi);
        const status = this.getAQIStatus(aqi);
        
        cell.style.backgroundColor = color;
        cell.dataset.aqi = aqi;
        cell.dataset.status = status;
        
        // Add location name based on position
        const locationName = this.getLocationName(cell.dataset.lat, cell.dataset.lng);
        cell.dataset.location = locationName;
    }
    
    getAQIColor(aqi) {
        if (aqi <= 50) return '#00e400';
        if (aqi <= 100) return '#ffff00';
        if (aqi <= 150) return '#ff7e00';
        if (aqi <= 200) return '#ff0000';
        if (aqi <= 300) return '#8f3f97';
        return '#7e0023';
    }
    
    getAQIStatus(aqi) {
        if (aqi <= 50) return 'Good';
        if (aqi <= 100) return 'Moderate';
        if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
        if (aqi <= 200) return 'Unhealthy';
        if (aqi <= 300) return 'Very Unhealthy';
        return 'Hazardous';
    }
    
    getLocationName(lat, lng) {
        // Simple location mapping based on coordinates
        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lng);
        
        if (latNum > -6.3 && lngNum > 106.7 && lngNum < 107.0) return 'Jakarta Central';
        if (latNum > -6.4 && lngNum > 106.9) return 'Bekasi';
        if (latNum > -6.7 && lngNum > 106.6 && lngNum < 107.0) return 'Bogor';
        if (lngNum < 106.7) return 'Tangerang';
        if (latNum > -6.5 && lngNum > 106.7 && lngNum < 106.9) return 'Depok';
        
        return 'JABODETABEK Region';
    }
    
    bindEvents() {
        // Timeframe controls
        const controls = this.container.querySelectorAll('.heatmap-control-btn');
        controls.forEach(btn => {
            btn.addEventListener('click', (e) => {
                controls.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentTimeframe = e.target.dataset.timeframe;
                this.updateTimeframe();
            });
        });
        
        // Cell hover events
        this.grid.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('heatmap-cell')) {
                this.showTooltip(e.target, e);
            }
        });
        
        this.grid.addEventListener('mousemove', (e) => {
            if (e.target.classList.contains('heatmap-cell')) {
                this.updateTooltipPosition(e);
            }
        });
        
        this.grid.addEventListener('mouseout', (e) => {
            if (e.target.classList.contains('heatmap-cell')) {
                this.hideTooltip();
            }
        });
    }
    
    showTooltip(cell, event) {
        const aqi = cell.dataset.aqi;
        const status = cell.dataset.status;
        const location = cell.dataset.location;
        const lat = cell.dataset.lat;
        const lng = cell.dataset.lng;
        
        this.tooltip.innerHTML = `
            <div><strong>${location}</strong></div>
            <div>AQI: <strong>${aqi}</strong> (${status})</div>
            <div>Coordinates: ${lat}, ${lng}</div>
            <div>Pollutant: ${this.currentPollutant}</div>
        `;
        
        this.tooltip.classList.add('show');
        this.updateTooltipPosition(event);
    }
    
    updateTooltipPosition(event) {
        const rect = this.container.getBoundingClientRect();
        const x = event.clientX - rect.left + 10;
        const y = event.clientY - rect.top - 10;
        
        this.tooltip.style.left = x + 'px';
        this.tooltip.style.top = y + 'px';
    }
    
    hideTooltip() {
        this.tooltip.classList.remove('show');
    }
    
    updateTimeframe() {
        document.getElementById('current-timeframe').textContent = this.currentTimeframe;
        this.refreshData();
    }
    
    refreshData() {
        if (this.isUpdating) return;
        
        this.isUpdating = true;
        const cells = this.grid.querySelectorAll('.heatmap-cell');
        
        // Add updating animation
        cells.forEach(cell => cell.classList.add('updating'));
        
        setTimeout(() => {
            cells.forEach((cell, index) => {
                const newAQI = this.generateAQIValue(index);
                this.updateCell(cell, newAQI);
                cell.classList.remove('updating');
            });
            
            document.getElementById('last-update').textContent = new Date().toLocaleTimeString();
            this.isUpdating = false;
        }, 1000);
    }
    
    startAutoUpdate() {
        setInterval(() => {
            this.refreshData();
        }, this.options.updateInterval);
    }
    
    // Public methods for external control
    setPollutant(pollutant) {
        this.currentPollutant = pollutant;
        document.getElementById('current-pollutant').textContent = pollutant;
        this.refreshData();
    }
    
    setTimeframe(timeframe) {
        this.currentTimeframe = timeframe;
        const controls = this.container.querySelectorAll('.heatmap-control-btn');
        controls.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.timeframe === timeframe);
        });
        this.updateTimeframe();
    }
    
    destroy() {
        // Cleanup method
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AQIHeatmap;
}
