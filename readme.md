# Agentic AI for AQI Forecasting (euc_airpollution)

**Note:** This repository contains the prototype and supporting materials for a submission to the **European Universities' Competition on Artificial Intelligence** in the "AI and Climate Change Solutions" category.

## 1. Project Overview

This project presents a novel **agentic AI system** designed to deliver a fully autonomous workflow for Air Quality Index (AQI) forecasting. Focused on the JABODETABEK (Jakarta, Bogor, Depok, Tangerang, and Bekasi) megaregion in Indonesia—an area facing a severe and persistent air quality crisis—our system provides an end-to-end solution for data integration, analysis, and the generation of explainable insights.

The core of this project is a multi-agent architecture where specialized AI agents collaborate to manage the entire modeling lifecycle, from real-time data acquisition to the delivery of actionable reports for policymakers. This approach overcomes the limitations of traditional, static forecasting models by introducing adaptability, transparency, and scalability.

## 2. Key Features

- **Autonomous Multi-Agent System:** The workflow is driven by a team of specialized agents (Orchestrator, Data Collection, Preprocessing, ML Operations, and Reporting) that manage tasks without manual intervention.
    
- **End-to-End Data Pipeline:** The system automates the entire data pipeline, including sourcing data from diverse APIs (GEE, IQAir), cleaning and validation, and preprocessing for time-series analysis.
    
- **Accurate Time-Series Forecasting:** A Long Short-Term Memory (LSTM) neural network is used to generate high-accuracy AQI forecasts, capturing complex temporal patterns in pollution data.
    
- **Explainable AI (XAI) Reporting:** A dedicated Explanation Agent uses a Large Language Model (LLM) to translate complex quantitative forecasts into clear, natural language summaries, making the results accessible to non-expert stakeholders.

## 3. System Architecture

The system is designed with a modular, server-hosted core that separates responsibilities into distinct agent layers. The **Orchestrator Agent** acts as the central controller, receiving user requests and delegating tasks to the appropriate agents.

- **Data Pipeline Agents:** Handle the acquisition and preparation of data.
    
- **ML Operations Agents:** Manage the loading of the LSTM model and the execution of the forecast.
    
- **Reporting Layer:** Focuses on converting the model's output into human-readable reports and visualizations.

_Figure 1: High-level system architecture showing the interaction between agent layers._

## 4. Web Dashboard Prototype

To demonstrate the system's capabilities, we have designed an interactive web interface. The prototype includes a landing page introducing the project and a comprehensive dashboard for visualizing the forecasts.

**Key features of the dashboard include:**

- An interactive heatmap of the JABODETABEK region.
    
- An **"Ask the AI"** feature that allows users to submit natural language queries for custom forecasts (e.g., "What is the forecast for the Bekasi industrial area tomorrow?").
    
- A **"Live Agent Status"** panel that visualizes the autonomous workflow in real-time, showing which agents are active as they work to fulfill a user's request.

_Figure 2: A mockup of the interactive web dashboard._

## 5. Technology Stack

- **Backend & AI:** Python
    
- **Machine Learning:** PyTorch / TensorFlow (for LSTM)
    
- **Agentic AI Framework:** LangChain / Custom Implementation
    
- **Data Sources:** Google Earth Engine (GEE), IQAir API, AQICN.org
    
- **Data Quality:** openclean-core
    
- **Frontend:** HTML, CSS (Tailwind), JavaScript

## 6. Live Demo
The prototype of our web dashboard is hosted on GitHub Pages. You can access the live website here:

https://apkirana.github.io/euc_airpollution/

6. Technology Stack
Backend & AI: Python

Machine Learning: PyTorch / TensorFlow (for LSTM)

Agentic AI Framework: LangChain / Custom Implementation

Data Sources: Google Earth Engine (GEE), IQAir API, AQICN.org

Data Quality: openclean-core

Frontend: HTML, CSS (Tailwind), JavaScript



## 7. Getting Started

To get started with the project, please follow the steps below:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/euc_airpollution.git
   cd euc_airpollution
   ```
   Install Dependencies:
Make sure you have Python installed (preferably Python 3.7 or higher). You can 

1. install the necessary packages using pip.
```bash
pip install -r requirements.txt
 ```

2. Run the Application:
Execute the following command to start the server:
```bash
python run_app.py
```

3. Access the Web Interface:
Open your web browser and go to http://localhost:5000 to interact with the dashboard.

## 8. License
This project is licensed under the MIT License - see the LICENSE file for details.

## . Acknowledgments
We would like to thank our mentors and professors for their guidance throughout this project. Your support has been invaluable!
For any questions, please feel free to raise an issue in this repository or contact the project team directly.
