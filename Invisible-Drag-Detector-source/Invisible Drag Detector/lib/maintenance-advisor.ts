import type { Turbine } from '../types';

export type MaintenanceAssessment = {
  yawLikelihood: 'High' | 'Possible' | 'Low';
  yawLossShare: number;
  severity: 'Critical' | 'High' | 'Moderate' | 'Low';
  energyAtRiskKWhPerDay: number;
  moneyAtRiskUSDPerDay: number;
  likelyFactors: string[];
  checks: string[];
  evidenceNote: string;
};

/** A transparent triage heuristic. The current SCADA model has no direct turbulence, pitch, or sensor-health inputs. */
export function assessMaintenance(t: Turbine): MaintenanceAssessment {
  const m = t.currentMetrics;
  const offset = Math.abs(m.relativeYawOffset);
  const yawLikelihood: MaintenanceAssessment['yawLikelihood'] = offset >= 7 ? 'High' : offset >= 3.5 ? 'Possible' : 'Low';
  const yawLossShare = Math.round(Math.min(0.9, Math.max(0.08, (offset / 12) ** 2)) * 100);
  const severity: MaintenanceAssessment['severity'] = m.dailyFinancialLossUSD >= 750 || m.mechanicalStressScore >= 85 ? 'Critical' : m.dailyFinancialLossUSD >= 350 || m.mechanicalStressScore >= 65 ? 'High' : m.dailyFinancialLossUSD >= 100 || m.mechanicalStressScore >= 40 ? 'Moderate' : 'Low';
  const factors = [
    ...(yawLikelihood !== 'Low' ? ['Yaw misalignment is a plausible contributor'] : []),
    ...(m.residualKW > Math.max(100, m.expectedPowerKW * 0.12) && yawLikelihood !== 'High' ? ['Power-curve underperformance beyond the current yaw signal'] : []),
    ...(m.mechanicalStressScore >= 60 ? ['Elevated mechanical stress; inspect drive train and blade condition'] : []),
  ];
  if (!factors.length) factors.push('No strong yaw or stress signal; verify sensors and operating conditions');
  const checks = [
    ...(yawLikelihood !== 'Low' ? ['Compare nacelle heading with an independent wind vane; verify encoder zero and yaw brake/drive response.'] : []),
    'Check anemometer cleanliness/calibration and compare wind speed/direction with nearby turbines.',
    'Review turbulence, curtailment, pitch angle, blade condition, air density, and alarms against peer turbines.',
    'Confirm the power curve after checks; the present model cannot isolate these causes from power residual alone.',
  ];
  return {
    yawLikelihood,
    yawLossShare,
    severity,
    energyAtRiskKWhPerDay: Math.round(m.dailyFinancialLossUSD / 0.082),
    moneyAtRiskUSDPerDay: Math.round(m.dailyFinancialLossUSD),
    likelyFactors: factors,
    checks,
    evidenceNote: 'Triage estimate from yaw offset, power residual, stress score, and estimated daily loss. Turbulence, pitch, and sensor-health measurements are not currently used by the model.',
  };
}
