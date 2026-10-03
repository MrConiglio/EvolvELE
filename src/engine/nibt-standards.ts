/**
 * Norme Svizzere d'Installazione a Bassa Tensione (NIBT / NIN)
 * Tabelle di riferimento e costanti ingegneristiche
 */

export const STANDARD_PROTECTION_RATINGS_A = [
  16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000
];

export const STANDARD_CABLE_SECTIONS_MM2 = [
  1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300
];

export const IZ_COPPER_XLPE_3PHASE: Record<number, { B1: number; B2: number; C: number; E: number }> = {
  1.5: { B1: 17.5, B2: 16.5, C: 19.5, E: 22 },
  2.5: { B1: 24, B2: 23, C: 27, E: 30 },
  4: { B1: 32, B2: 30, C: 36, E: 40 },
  6: { B1: 41, B2: 38, C: 46, E: 52 },
  10: { B1: 57, B2: 52, C: 63, E: 71 },
  16: { B1: 76, B2: 69, C: 85, E: 96 },
  25: { B1: 101, B2: 90, C: 112, E: 119 },
  35: { B1: 125, B2: 111, C: 138, E: 147 },
  50: { B1: 151, B2: 133, C: 168, E: 179 },
  70: { B1: 192, B2: 168, C: 213, E: 229 },
  95: { B1: 232, B2: 201, C: 258, E: 278 },
  120: { B1: 269, B2: 232, C: 299, E: 322 },
  150: { B1: 309, B2: 265, C: 344, E: 371 },
  185: { B1: 353, B2: 300, C: 392, E: 424 },
  240: { B1: 415, B2: 351, C: 461, E: 500 },
  300: { B1: 477, B2: 401, C: 530, E: 576 },
};

export const CABLE_IMPEDANCE_COPPER: Record<number, { rOhmPerKm: number; xOhmPerKm: number }> = {
  1.5: { rOhmPerKm: 14.8, xOhmPerKm: 0.115 },
  2.5: { rOhmPerKm: 8.9, xOhmPerKm: 0.105 },
  4: { rOhmPerKm: 5.5, xOhmPerKm: 0.098 },
  6: { rOhmPerKm: 3.7, xOhmPerKm: 0.092 },
  10: { rOhmPerKm: 2.2, xOhmPerKm: 0.086 },
  16: { rOhmPerKm: 1.38, xOhmPerKm: 0.083 },
  25: { rOhmPerKm: 0.88, xOhmPerKm: 0.081 },
  35: { rOhmPerKm: 0.63, xOhmPerKm: 0.080 },
  50: { rOhmPerKm: 0.47, xOhmPerKm: 0.079 },
  70: { rOhmPerKm: 0.33, xOhmPerKm: 0.078 },
  95: { rOhmPerKm: 0.24, xOhmPerKm: 0.077 },
  120: { rOhmPerKm: 0.19, xOhmPerKm: 0.076 },
  150: { rOhmPerKm: 0.15, xOhmPerKm: 0.076 },
  185: { rOhmPerKm: 0.12, xOhmPerKm: 0.075 },
  240: { rOhmPerKm: 0.093, xOhmPerKm: 0.075 },
  300: { rOhmPerKm: 0.075, xOhmPerKm: 0.074 },
};

export const CABLE_OUTER_DIAMETER_MM: Record<number, number> = {
  1.5: 10.5,
  2.5: 12.2,
  4: 14.0,
  6: 15.8,
  10: 19.5,
  16: 23.5,
  25: 28.0,
  35: 32.0,
  50: 38.0,
  70: 44.0,
  95: 50.0,
  120: 56.0,
  150: 62.0,
  185: 68.0,
  240: 76.0,
  300: 84.0,
};

export interface ConduitSpec {
  name: string;
  outerDiameterMm: number;
  innerDiameterMm: number;
  maxUsefulAreaMm2: number;
}

export const SWISS_CONDUITS_KRFWG: ConduitSpec[] = [
  { name: 'KRFWG M16', outerDiameterMm: 16, innerDiameterMm: 10.7, maxUsefulAreaMm2: (Math.PI * (10.7 / 2) ** 2) * 0.40 },
  { name: 'KRFWG M20', outerDiameterMm: 20, innerDiameterMm: 14.1, maxUsefulAreaMm2: (Math.PI * (14.1 / 2) ** 2) * 0.40 },
  { name: 'KRFWG M25', outerDiameterMm: 25, innerDiameterMm: 18.3, maxUsefulAreaMm2: (Math.PI * (18.3 / 2) ** 2) * 0.40 },
  { name: 'KRFWG M32', outerDiameterMm: 32, innerDiameterMm: 24.3, maxUsefulAreaMm2: (Math.PI * (24.3 / 2) ** 2) * 0.40 },
  { name: 'KRFWG M40', outerDiameterMm: 40, innerDiameterMm: 31.2, maxUsefulAreaMm2: (Math.PI * (31.2 / 2) ** 2) * 0.40 },
  { name: 'KRFWG M50', outerDiameterMm: 50, innerDiameterMm: 39.6, maxUsefulAreaMm2: (Math.PI * (39.6 / 2) ** 2) * 0.40 },
  { name: 'KRFWG M63', outerDiameterMm: 63, innerDiameterMm: 50.6, maxUsefulAreaMm2: (Math.PI * (50.6 / 2) ** 2) * 0.40 },
  { name: 'KRFWG M75', outerDiameterMm: 75, innerDiameterMm: 62.0, maxUsefulAreaMm2: (Math.PI * (62.0 / 2) ** 2) * 0.40 },
  { name: 'KRFWG M90', outerDiameterMm: 90, innerDiameterMm: 76.0, maxUsefulAreaMm2: (Math.PI * (76.0 / 2) ** 2) * 0.40 },
  { name: 'KRFWG M110', outerDiameterMm: 110, innerDiameterMm: 94.0, maxUsefulAreaMm2: (Math.PI * (94.0 / 2) ** 2) * 0.40 },
];

// Tabella tubi in Polietilene (PE) per linee di entrata e allacciamento interrato HAK -> HVD
export const SWISS_CONDUITS_PE: ConduitSpec[] = [
  { name: 'PE 80', outerDiameterMm: 80, innerDiameterMm: 68.0, maxUsefulAreaMm2: (Math.PI * (68.0 / 2) ** 2) * 0.40 },
  { name: 'PE 100', outerDiameterMm: 100, innerDiameterMm: 86.0, maxUsefulAreaMm2: (Math.PI * (86.0 / 2) ** 2) * 0.40 },
  { name: 'PE 120', outerDiameterMm: 120, innerDiameterMm: 103.0, maxUsefulAreaMm2: (Math.PI * (103.0 / 2) ** 2) * 0.40 },
  { name: 'PE 150', outerDiameterMm: 150, innerDiameterMm: 129.0, maxUsefulAreaMm2: (Math.PI * (129.0 / 2) ** 2) * 0.40 },
  { name: 'PE 200', outerDiameterMm: 200, innerDiameterMm: 172.0, maxUsefulAreaMm2: (Math.PI * (172.0 / 2) ** 2) * 0.40 },
];

export const NIBT_SIMULTANEITY_TABLE_RESIDENTIAL: { count: number; ks: number }[] = [
  { count: 1, ks: 1.00 },
  { count: 2, ks: 0.80 },
  { count: 3, ks: 0.70 },
  { count: 4, ks: 0.63 },
  { count: 5, ks: 0.58 },
  { count: 6, ks: 0.54 },
  { count: 7, ks: 0.51 },
  { count: 8, ks: 0.48 },
  { count: 9, ks: 0.46 },
  { count: 10, ks: 0.44 },
  { count: 12, ks: 0.41 },
  { count: 15, ks: 0.38 },
  { count: 20, ks: 0.34 },
  { count: 25, ks: 0.32 },
  { count: 30, ks: 0.30 },
  { count: 40, ks: 0.28 },
  { count: 50, ks: 0.26 },
  { count: 60, ks: 0.25 },
  { count: 80, ks: 0.23 },
  { count: 100, ks: 0.22 },
  { count: 150, ks: 0.20 },
  { count: 200, ks: 0.18 },
];

/**
 * Tabella PAE - Corrente nominale minima del sezionatore di allacciamento
 */
export const PAE_MIN_HAK_RATINGS: { minApt: number; maxApt: number; minInA: number }[] = [
  { minApt: 1, maxApt: 1, minInA: 25 },
  { minApt: 2, maxApt: 3, minInA: 40 },
  { minApt: 4, maxApt: 9, minInA: 63 },
  { minApt: 10, maxApt: 15, minInA: 80 },
  { minApt: 16, maxApt: 21, minInA: 100 },
  { minApt: 22, maxApt: 30, minInA: 125 },
  { minApt: 31, maxApt: 40, minInA: 160 },
  { minApt: 41, maxApt: 60, minInA: 200 },
  { minApt: 61, maxApt: 100, minInA: 250 },
];

export function getPaeminHakRating(apartmentsCount: number): number {
  if (apartmentsCount <= 0) return 25;
  for (const row of PAE_MIN_HAK_RATINGS) {
    if (apartmentsCount >= row.minApt && apartmentsCount <= row.maxApt) {
      return row.minInA;
    }
  }
  return 315;
}

export function getSimultaneityFactorResidential(apartmentsCount: number): number {
  if (apartmentsCount <= 0) return 1.0;
  if (apartmentsCount === 1) return 1.0;

  const table = NIBT_SIMULTANEITY_TABLE_RESIDENTIAL;
  if (apartmentsCount >= table[table.length - 1].count) {
    return Math.max(0.16, Number((0.14 + 0.80 / Math.sqrt(apartmentsCount)).toFixed(3)));
  }

  for (let i = 0; i < table.length - 1; i++) {
    const curr = table[i];
    const next = table[i + 1];
    if (apartmentsCount === curr.count) return curr.ks;
    if (apartmentsCount === next.count) return next.ks;

    if (apartmentsCount > curr.count && apartmentsCount < next.count) {
      const ratio = (apartmentsCount - curr.count) / (next.count - curr.count);
      const interpolated = curr.ks + ratio * (next.ks - curr.ks);
      return Number(interpolated.toFixed(3));
    }
  }

  return 0.22;
}

export function getTemperatureCorrectionFactor(tempC: number): number {
  if (tempC <= 10) return 1.15;
  if (tempC <= 15) return 1.12;
  if (tempC <= 20) return 1.08;
  if (tempC <= 25) return 1.04;
  if (tempC <= 30) return 1.00;
  if (tempC <= 35) return 0.96;
  if (tempC <= 40) return 0.91;
  if (tempC <= 45) return 0.87;
  if (tempC <= 50) return 0.82;
  if (tempC <= 55) return 0.76;
  if (tempC <= 60) return 0.71;
  return 0.65;
}

export function getGroupingCorrectionFactor(circuitCount: number): number {
  if (circuitCount <= 1) return 1.00;
  if (circuitCount === 2) return 0.80;
  if (circuitCount === 3) return 0.70;
  if (circuitCount === 4) return 0.65;
  if (circuitCount === 5) return 0.60;
  if (circuitCount === 6) return 0.57;
  if (circuitCount === 7) return 0.54;
  if (circuitCount === 8) return 0.52;
  return 0.50;
}

export function selectNominalProtectionRating(designCurrentIb: number): number {
  for (const rating of STANDARD_PROTECTION_RATINGS_A) {
    if (rating >= designCurrentIb) {
      return rating;
    }
  }
  return 1000;
}