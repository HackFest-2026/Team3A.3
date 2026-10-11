# The Invisible Drag Detector

Industrial Aero-Tech command center for detecting wind-turbine yaw misalignment and estimating hidden power/revenue loss.

## Run locally
1. Install Node.js 20+ and MongoDB.
2. Copy `.env.example` to `.env.local` and set `MONGODB_URI`.
3. `npm install`
4. `npm run seed`
5. `npm run dev`
6. Open `http://localhost:3000`.

## Included
- Next.js + TypeScript + Tailwind
- MongoDB/Mongoose models and API routes
- 12-turbine + 72-hour SCADA seed dataset
- Animated responsive command center
- Interactive 3D turbine with wind-speed rotation and yaw offset
- Fleet map/grid, live telemetry ticker, KPI cards
- Power curve + yaw residual diagnostics
- Seasonal what-if simulator
- Urgency-ranked maintenance queue
- Maintenance Advisor estimates yaw contribution, severity, energy and revenue at risk, and technician checks
- Work-order creation, status updates, print/PDF browser workflow, and SMS-ready mock action

## Analytics
Power residual = expected - actual.
EMA uses `alpha=0.12` by default.
Daily financial loss integrates 144 ten-minute intervals and multiplies by PPA rate.
Mechanical stress uses the supplied velocity-squared/sine-offset relationship with a practical visualization scale.
The Maintenance Advisor is a triage heuristic based on yaw offset, residual power, estimated daily loss, and stress. The current model does not ingest measured turbulence, pitch, or sensor-health signals, so its factor assessment is a field-check guide rather than a verified root-cause diagnosis.

## Production notes
Configure a real SMS provider and authentication before production deployment. Add MongoDB indexes/TTL policies for high-volume telemetry and a scheduled SCADA ingestion worker for real telemetry.
