# The Invisible Drag Detector

**An Industrial Aero-Tech Command Center for Wind Turbine Performance Monitoring and Yaw-Related Energy Loss Detection**

The Invisible Drag Detector is a wind turbine monitoring and maintenance decision-support platform designed to identify potential yaw misalignment, estimate associated power and revenue losses, and help maintenance teams prioritize inspections.

It combines SCADA-style telemetry, performance analytics, fleet monitoring, and a maintenance advisor in an interactive dashboard.

**IMAGES 

<img width="1600" height="900" alt="cbe0d4d9-22fe-4d49-b5a8-d811b6b1c9c8" src="https://github.com/user-attachments/assets/d7fbd7e8-8706-4555-8120-3b5c13f826c2" />
<img width="1600" height="900" alt="ae88e7b6-9bcb-4e7e-bb34-179eb7edf920" src="https://github.com/user-attachments/assets/57d66084-9bc5-4931-8720-f723b30d1709" />
<img width="1600" height="900" alt="4840d967-e392-48ef-ba7a-19dc33e07fbf" src="https://github.com/user-attachments/assets/ef5ddd0b-8e16-4f35-b109-028802cdbcac" />
<img width="1600" height="900" alt="d293ee91-f911-4b3d-8f11-8b7239aac386" src="https://github.com/user-attachments/assets/8fce3ec7-d389-44fc-a942-8f0402b15739" />
<img width="1600" height="900" alt="c23b29ed-ec0f-445f-993f-a45a41cb829e" src="https://github.com/user-attachments/assets/4189b0bf-5185-453a-8a29-e60b91bab0c3" />

## Key Features

- **Fleet Monitoring:** Monitor 12 simulated turbines through an interactive fleet grid and overview dashboard.
- **Live Telemetry Simulation:** View a continuously updating telemetry ticker using the seeded dataset.
- **Interactive 3D Turbine:** Visualize turbine rotation based on wind speed and yaw offset.
- **Yaw Misalignment Analysis:** Examine yaw offsets and their relationship with power underperformance.
- **Power Residual Diagnostics:** Compare expected and actual power to identify potential performance losses.
- **KPI Dashboard:** View important fleet performance indicators and estimated financial impact.
- **What-If Simulator:** Explore how changing selected parameters affects estimated performance and loss.
- **Maintenance Priority Queue:** Rank incidents according to urgency and estimated impact.
- **Maintenance Advisor:** Estimate yaw contribution, severity, energy loss, revenue at risk, and recommended technician checks.
- **Work-Order Management:** Create maintenance work orders and update their status.
- **Print and PDF Workflow:** Use the browser's print functionality to produce printable work orders or save them as PDFs.
- **SMS-Ready Mock Action:** Preview an SMS-style notification workflow for maintenance communication.

## Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | Web application framework |
| TypeScript | Type-safe application development |
| Tailwind CSS | Responsive dashboard styling |
| MongoDB | Data storage |
| Mongoose | MongoDB data modelling |
| API Routes | Communication between the frontend and backend |
| Node.js | Application runtime |

## System Architecture

```text
Seeded SCADA-Style Data
          |
          v
   MongoDB Database
          |
          v
 Next.js API Routes
          |
          v
 Analytics and Maintenance Advisor
          |
          v
 Interactive Command Center
          |
          v
 Incident Review and Work Orders
```

The current project includes a seeded dataset containing **12 turbines and 72 hours of simulated SCADA telemetry**. A scheduled ingestion worker is a future requirement for connecting real turbine data.

## Analytics and Methodology

### 1. Power Residual

The dashboard calculates power residual as:

`Power Residual = Expected Power - Actual Power`

A positive residual indicates that actual power is below expected power. This difference can indicate underperformance, but it does not establish its cause.

### 2. Exponential Moving Average

The application uses an Exponential Moving Average (EMA) with a default smoothing factor of `alpha = 0.12` to smooth changes in telemetry or residual signals.

### 3. Energy and Revenue Loss Estimates

Daily financial loss is estimated by integrating losses across 144 ten-minute intervals and multiplying the resulting energy estimate by the configured Power Purchase Agreement (PPA) rate.

These estimates depend on the quality of the input data and the assumptions used in the calculations.

### 4. Mechanical Stress Visualization

The application uses a velocity-squared and sine-of-offset relationship with a practical visualization scale to illustrate a potential mechanical stress indicator.

This is a simplified visualization relationship, not a validated measurement of actual turbine component stress.

### 5. Maintenance Advisor

The Maintenance Advisor is a triage heuristic based on:

- Yaw offset.
- Residual power.
- Estimated daily financial loss.
- The calculated stress indicator.

It uses these factors to estimate urgency and suggest technician checks.

The current implementation does not ingest measured turbulence, blade-pitch behavior, or sensor-health signals. Consequently, component-level assessments are preliminary inspection guides, not verified fault diagnoses.

## Getting Started

### Prerequisites

Install the following:

- Node.js 20 or later.
- npm.
- MongoDB, running locally or available through a connection URI.

### Installation

**1. Clone the repository**

```bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_PROJECT_FOLDER>
```

Replace the placeholders with your repository URL and project folder name.

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Copy `.env.example` to `.env.local`.

```bash
cp .env.example .env.local
```

On Windows Command Prompt, you can use:

```cmd
copy .env.example .env.local
```

Set the MongoDB connection string in `.env.local`:

```env
MONGODB_URI=your_mongodb_connection_string
```

Use the actual variable names expected by the application. Keep credentials private and never commit `.env.local`.

**4. Seed the database**

```bash
npm run seed
```

This initializes the application with the included seed dataset.

**5. Start the development server**

```bash
npm run dev
```

**6. Open the application**

Navigate to:

`http://localhost:3000`

## Production Deployment Considerations

The current project is a development-oriented demonstration. Before using it in a real wind farm, the following improvements are required:

- **Real SCADA ingestion:** Build a scheduled ingestion worker to collect and validate telemetry from an authorized data source.
- **Persistent monitoring:** Process new readings and update incident assessments as fresh data arrives.
- **Authentication and authorization:** Secure user accounts, work orders, and maintenance actions.
- **Real notifications:** Integrate an SMS provider and implement delivery, failure handling, and logging.
- **Database performance:** Add suitable MongoDB indexes and retention or TTL policies based on data-retention requirements.
- **Validated analytics:** Test the loss-estimation methodology against trusted operational data and engineering references.
- **Component-level diagnostics:** Incorporate relevant pitch, temperature, vibration, and sensor-health signals when available.
- **Maintenance feedback:** Connect completed work orders and verified technician findings to future evaluation of inspection recommendations.
- **Operational safety:** Keep the system decision-support only unless any future control functionality undergoes the necessary engineering, safety, and authorization processes.

## Limitations

- Seeded telemetry is simulated demonstration data, not a live connection to operational wind turbines.
- Yaw offset and power residuals alone cannot confirm that yaw misalignment caused a power deficit.
- Estimated energy and revenue losses depend on model assumptions and the configured PPA rate.
- The mechanical stress indicator is a simplified visualization metric.
- The Maintenance Advisor does not establish confirmed component-level root causes.
- Real-time monitoring requires a functioning SCADA ingestion pipeline.
- SMS actions remain mock actions until a real provider is integrated.
- Production use requires security controls, operational validation, and field verification.

## Future Roadmap

1. Integrate authorized real-time SCADA telemetry.
2. Expand analysis using blade-pitch, temperature, vibration, and sensor-health measurements where available.
3. Improve anomaly detection and component-specific inspection recommendations.
4. Validate estimated energy losses against operational and maintenance records.
5. Add technician feedback and verified maintenance outcomes.
6. Integrate secure work-order management and real notification services.
7. Evaluate model performance and alert thresholds using historical and future operational data.

## Project Goal

The goal of The Invisible Drag Detector is to transform turbine telemetry into understandable performance insights and prioritized maintenance actions.

By connecting performance analysis with evidence-based inspection guidance, the platform aims to help maintenance teams investigate potential energy losses more efficiently while keeping uncertainty and the need for field verification explicit.

---

**Disclaimer:** This project is a monitoring and maintenance decision-support prototype. It does not replace manufacturer procedures, qualified technician inspections, or validated turbine protection systems.
