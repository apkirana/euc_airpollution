/**
 * Admin Dashboard Controller - Object-Oriented Implementation
 * Manages the overall admin dashboard functionality and integrates with heatmap
 */

class AdminDashboard {
    constructor() {
        this.heatmap = null;
        this.agentStatusContainer = null;
        this.aiReportOutput = null;
        this.generateBtn = null;
        
        this.agents = [
            { name: 'Orchestrator Agent', status: 'Idle', task: 'Receiving new user prompt...' },
            { name: 'Data Collection Agent', status: 'Idle', task: 'Fetching latest satellite & sensor data...' },
            { name: 'Training Agent', status: 'Idle', task: 'Running LSTM forecast model...' },
            { name: 'Explanation Agent', status: 'Idle', task: 'Generating natural language report...' }
        ];
        
        this.init();
    }
    
    init() {
        this.initializeElements();
        this.initializeHeatmap();
        this.bindControlEvents();
    }
    
    initializeElements() {
        this.agentStatusContainer = document.getElementById('agent-status-container');
        this.aiReportOutput = document.getElementById('ai-report-output');
        this.generateBtn = document.getElementById('generate-report-btn');
    }
    
    initializeHeatmap() {
        // Initialize the AQI Heatmap
        this.heatmap = new AQIHeatmap('heatmap-container', {
            gridWidth: 20,
            gridHeight: 15,
            updateInterval: 8000, // 8 seconds for admin dashboard
            animationDuration: 500
        });
    }
    
    bindControlEvents() {
        // Bind city selector to heatmap
        const citySelector = document.getElementById('city');
        if (citySelector) {
            citySelector.addEventListener('change', (e) => {
                this.handleCityChange(e.target.value);
            });
        }
        
        // Bind forecast period to heatmap
        const forecastSelector = document.getElementById('forecast');
        if (forecastSelector) {
            forecastSelector.addEventListener('change', (e) => {
                const timeframe = this.mapForecastToTimeframe(e.target.value);
                this.heatmap.setTimeframe(timeframe);
            });
        }
        
        // Bind pollutant selector to heatmap
        const pollutantSelector = document.getElementById('pollutant');
        if (pollutantSelector) {
            pollutantSelector.addEventListener('change', (e) => {
                this.heatmap.setPollutant(e.target.value);
            });
        }
    }
    
    handleCityChange(city) {
        // Update heatmap focus based on selected city
        console.log(`Focusing on city: ${city}`);
        // Could implement map centering or filtering here
    }
    
    mapForecastToTimeframe(forecast) {
        const mapping = {
            'Next 24 Hours': '24h',
            'Next 48 Hours': '48h',
            'Next 72 Hours': '72h'
        };
        return mapping[forecast] || '24h';
    }
    
    updateAgentStatus(index, newStatus, task = 'Idle') {
        if (!this.agentStatusContainer) return;
        
        const agentDiv = this.agentStatusContainer.children[index];
        if (!agentDiv) return;
        
        const statusDot = agentDiv.querySelector('.status-dot');
        const statusText = agentDiv.querySelector('p:last-child');
        
        if (statusDot) {
            statusDot.className = `status-dot mr-3 ${newStatus === 'Active' ? 'status-active animate-pulse' : 'status-idle'}`;
        }
        
        if (statusText) {
            statusText.textContent = `Status: ${newStatus === 'Active' ? task : 'Idle'}`;
        }
    }
    
    async generateAIReport() {
        if (!this.generateBtn || !this.aiReportOutput) return;
        
        this.generateBtn.disabled = true;
        this.generateBtn.textContent = 'Generating...';
        this.aiReportOutput.style.display = 'none';
        this.aiReportOutput.innerHTML = '';
        
        // Simulate agent workflow
        for (let i = 0; i < this.agents.length; i++) {
            this.updateAgentStatus(i, 'Active', this.agents[i].task);
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
            this.updateAgentStatus(i, 'Idle');
        }
        
        // Get current city selection for personalized report
        const citySelector = document.getElementById('city');
        const selectedCity = citySelector ? citySelector.value : 'Bekasi';
        
        // Display the report with dynamic content
        this.aiReportOutput.innerHTML = this.generateReportHTML(selectedCity);
        this.aiReportOutput.style.display = 'block';
        this.generateBtn.disabled = false;
        this.generateBtn.textContent = 'Generate Report';
    }
    
    generateReportHTML(city) {
        const reports = {
            'Jakarta': {
                aqi: 87,
                status: 'Moderate',
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-600',
                pollutant: 'PM2.5',
                time: '2 PM - 6 PM',
                recommendation: 'Sensitive individuals should limit outdoor activities during peak traffic hours.',
                forecastData: [65, 72, 78, 85, 87, 89, 92, 88, 82, 75, 68, 62, 58, 55, 60, 65, 70, 75, 80, 85, 87, 84, 78, 70]
            },
            'Bekasi': {
                aqi: 165,
                status: 'Unhealthy',
                color: 'text-red-600',
                bgColor: 'bg-red-600',
                pollutant: 'NO₂',
                time: '1 PM - 5 PM',
                recommendation: 'It is advised to reduce non-essential industrial activities during peak hours to lower the immediate health risk to workers and nearby residential zones.',
                forecastData: [145, 152, 158, 162, 165, 168, 172, 169, 163, 155, 148, 142, 138, 135, 140, 145, 150, 155, 160, 165, 167, 164, 158, 150]
            },
            'Bogor': {
                aqi: 45,
                status: 'Good',
                color: 'text-green-600',
                bgColor: 'bg-green-600',
                pollutant: 'O₃',
                time: '10 AM - 2 PM',
                recommendation: 'Air quality is satisfactory. Outdoor activities are safe for all individuals.',
                forecastData: [35, 38, 42, 45, 48, 50, 52, 49, 46, 42, 38, 35, 32, 30, 33, 36, 40, 43, 45, 47, 48, 46, 42, 38]
            },
            'Tangerang': {
                aqi: 92,
                status: 'Moderate',
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-600',
                pollutant: 'PM2.5',
                time: '3 PM - 7 PM',
                recommendation: 'Moderate air quality. Sensitive groups should consider limiting prolonged outdoor exertion.',
                forecastData: [75, 80, 85, 88, 92, 95, 98, 94, 89, 83, 78, 72, 68, 65, 70, 75, 80, 85, 90, 92, 94, 91, 85, 78]
            },
            'Depok': {
                aqi: 78,
                status: 'Moderate',
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-600',
                pollutant: 'PM10',
                time: '12 PM - 4 PM',
                recommendation: 'Air quality is acceptable for most people. Sensitive individuals may experience minor symptoms.',
                forecastData: [65, 68, 72, 75, 78, 80, 82, 79, 76, 72, 68, 64, 60, 58, 62, 66, 70, 74, 76, 78, 79, 77, 73, 68]
            }
        };
        
        const report = reports[city] || reports['Bekasi'];
        const reportId = `report-${Date.now()}`;
        
        // Generate chart after a short delay to ensure DOM is ready
        setTimeout(() => {
            this.generateForecastChart(`chart-${reportId}`, report.forecastData, city, report.bgColor);
        }, 100);
        
        return `
            <div id="${reportId}" class="report-content">
                <div class="flex justify-between items-center mb-4">
                    <h4 class="font-bold text-lg text-gray-800">AQI Forecast Report: ${city}</h4>
                    <div class="flex space-x-2">
                        <button onclick="window.adminDashboard.generateReportLink('${reportId}')" class="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition">
                            <i class="fas fa-link mr-1"></i>Generate Link
                        </button>
                        <button onclick="window.adminDashboard.exportReportPDF('${reportId}')" class="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition">
                            <i class="fas fa-file-pdf mr-1"></i>Export PDF
                        </button>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                    <div class="space-y-3 text-gray-700 text-sm">
                        <p><span class="font-semibold text-indigo-600">Current AQI:</span> <span class="font-bold ${report.color}">${report.aqi} (${report.status})</span></p>
                        <p><span class="font-semibold text-indigo-600">Primary Pollutant:</span> ${report.pollutant}</p>
                        <p><span class="font-semibold text-indigo-600">Peak Hours:</span> ${report.time}</p>
                        <p><span class="font-semibold text-indigo-600">Confidence Level:</span> High (88%)</p>
                        <p><span class="font-semibold text-indigo-600">Generated:</span> ${new Date().toLocaleString()}</p>
                    </div>
                    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                        <h6 class="font-semibold text-indigo-600 mb-2">Health Recommendation</h6>
                        <p class="text-sm text-gray-700">${report.recommendation}</p>
                    </div>
                </div>
                
                <div class="mb-4">
                    <h5 class="font-bold text-md text-gray-800 mb-3 flex items-center">
                        <i class="fas fa-chart-line mr-2 text-indigo-600"></i>
                        24-Hour AQI Forecast
                    </h5>
                    <div class="bg-white p-4 rounded-lg border shadow-sm">
                        <canvas id="chart-${reportId}" width="400" height="200"></canvas>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                    <div class="bg-green-50 p-3 rounded-lg">
                        <div class="text-2xl font-bold text-green-600">${Math.min(...report.forecastData)}</div>
                        <div class="text-xs text-gray-600">Min AQI</div>
                    </div>
                    <div class="bg-red-50 p-3 rounded-lg">
                        <div class="text-2xl font-bold text-red-600">${Math.max(...report.forecastData)}</div>
                        <div class="text-xs text-gray-600">Max AQI</div>
                    </div>
                    <div class="bg-blue-50 p-3 rounded-lg">
                        <div class="text-2xl font-bold text-blue-600">${Math.round(report.forecastData.reduce((a,b) => a+b) / report.forecastData.length)}</div>
                        <div class="text-xs text-gray-600">Avg AQI</div>
                    </div>
                    <div class="bg-purple-50 p-3 rounded-lg">
                        <div class="text-2xl font-bold text-purple-600">${report.forecastData.filter(v => v > 100).length}</div>
                        <div class="text-xs text-gray-600">Unhealthy Hours</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    generateForecastChart(canvasId, data, city, bgColor) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Chart settings
        const padding = 40;
        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;
        
        const maxValue = Math.max(...data);
        const minValue = Math.min(...data);
        const valueRange = maxValue - minValue || 1;
        
        // Draw grid lines
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        
        // Horizontal grid lines
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
            
            // Y-axis labels
            const value = Math.round(maxValue - (valueRange / 5) * i);
            ctx.fillStyle = '#6b7280';
            ctx.font = '12px Inter';
            ctx.textAlign = 'right';
            ctx.fillText(value.toString(), padding - 10, y + 4);
        }
        
        // Vertical grid lines
        for (let i = 0; i <= 6; i++) {
            const x = padding + (chartWidth / 6) * i;
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, height - padding);
            ctx.stroke();
            
            // X-axis labels (hours)
            const hour = i * 4;
            ctx.fillStyle = '#6b7280';
            ctx.font = '12px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(`${hour}:00`, x, height - padding + 20);
        }
        
        // Draw the line chart
        ctx.strokeStyle = bgColor.includes('red') ? '#dc2626' : 
                         bgColor.includes('yellow') ? '#d97706' : 
                         bgColor.includes('green') ? '#16a34a' : '#3b82f6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        data.forEach((value, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Draw data points
        ctx.fillStyle = ctx.strokeStyle;
        data.forEach((value, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
        
        // Chart title
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 14px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(`${city} AQI Forecast - Next 24 Hours`, width / 2, 25);
        
        // Y-axis title
        ctx.save();
        ctx.translate(15, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('AQI Value', 0, 0);
        ctx.restore();
    }
    
    generateReportLink(reportId) {
        const reportElement = document.getElementById(reportId);
        if (!reportElement) return;
        
        // Create a shareable URL with report data
        const reportData = {
            id: reportId,
            timestamp: Date.now(),
            content: reportElement.innerHTML
        };
        
        // In a real implementation, you would save this to a database
        // For now, we'll create a data URL
        const encodedData = btoa(JSON.stringify(reportData));
        const shareUrl = `${window.location.origin}${window.location.pathname}?report=${encodedData}`;
        
        // Copy to clipboard
        navigator.clipboard.writeText(shareUrl).then(() => {
            // Show success message
            const button = event.target;
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check mr-1"></i>Copied!';
            button.classList.remove('bg-blue-600', 'hover:bg-blue-700');
            button.classList.add('bg-green-600');
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.classList.remove('bg-green-600');
                button.classList.add('bg-blue-600', 'hover:bg-blue-700');
            }, 2000);
        }).catch(err => {
            alert('Failed to copy link to clipboard. Please copy manually: ' + shareUrl);
        });
    }
    
    exportReportPDF(reportId) {
        const reportElement = document.getElementById(reportId);
        if (!reportElement) return;
        
        // Create a new window for PDF generation
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('Please allow popups to export PDF');
            return;
        }
        
        // Get the report content
        const reportContent = reportElement.innerHTML;
        
        // Create a print-friendly HTML document
        const printHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>AQI Forecast Report</title>
                <meta charset="UTF-8">
                <style>
                    body {
                        font-family: 'Inter', Arial, sans-serif;
                        margin: 20px;
                        color: #1f2937;
                        line-height: 1.6;
                    }
                    .report-content {
                        max-width: 800px;
                        margin: 0 auto;
                    }
                    h4, h5, h6 {
                        color: #1f2937;
                        margin-top: 20px;
                        margin-bottom: 10px;
                    }
                    .grid {
                        display: grid;
                        gap: 16px;
                        margin: 16px 0;
                    }
                    .grid-cols-1 { grid-template-columns: 1fr; }
                    .grid-cols-2 { grid-template-columns: 1fr 1fr; }
                    .grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
                    .bg-gradient-to-r, .bg-green-50, .bg-red-50, .bg-blue-50, .bg-purple-50 {
                        padding: 12px;
                        border-radius: 8px;
                        border: 1px solid #e5e7eb;
                    }
                    .text-center { text-align: center; }
                    .font-bold { font-weight: bold; }
                    .font-semibold { font-semibold: 600; }
                    .text-2xl { font-size: 1.5rem; }
                    .text-xs { font-size: 0.75rem; }
                    .text-sm { font-size: 0.875rem; }
                    .mb-2 { margin-bottom: 8px; }
                    .mb-3 { margin-bottom: 12px; }
                    .mb-4 { margin-bottom: 16px; }
                    .p-3 { padding: 12px; }
                    .p-4 { padding: 16px; }
                    .rounded-lg { border-radius: 8px; }
                    .border { border: 1px solid #e5e7eb; }
                    .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
                    canvas {
                        max-width: 100%;
                        height: auto;
                        border: 1px solid #e5e7eb;
                        border-radius: 8px;
                    }
                    button { display: none; }
                    .text-indigo-600 { color: #4f46e5; }
                    .text-green-600 { color: #16a34a; }
                    .text-red-600 { color: #dc2626; }
                    .text-blue-600 { color: #2563eb; }
                    .text-purple-600 { color: #9333ea; }
                    .text-yellow-600 { color: #d97706; }
                    .text-gray-600 { color: #6b7280; }
                    .text-gray-700 { color: #374151; }
                    .text-gray-800 { color: #1f2937; }
                    @media print {
                        body { margin: 0; }
                        .report-content { max-width: none; }
                    }
                </style>
            </head>
            <body>
                <div class="report-content">
                    ${reportContent}
                </div>
                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                        }, 1000);
                    };
                </script>
            </body>
            </html>
        `;
        
        printWindow.document.write(printHTML);
        printWindow.document.close();
    }
    
    // Public methods for external control
    refreshHeatmap() {
        if (this.heatmap) {
            this.heatmap.refreshData();
        }
    }
    
    setHeatmapPollutant(pollutant) {
        if (this.heatmap) {
            this.heatmap.setPollutant(pollutant);
        }
    }
    
    setHeatmapTimeframe(timeframe) {
        if (this.heatmap) {
            this.heatmap.setTimeframe(timeframe);
        }
    }
    
    destroy() {
        if (this.heatmap) {
            this.heatmap.destroy();
        }
    }
}

// Global function for backward compatibility
function generateAIReport() {
    if (window.adminDashboard) {
        window.adminDashboard.generateAIReport();
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.adminDashboard = new AdminDashboard();
});
