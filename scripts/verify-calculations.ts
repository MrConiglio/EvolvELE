/**
 * Script di validazione numerica e conformità NIBT per EvolveELE
 */

import {
  getSimultaneityFactorResidential,
  selectNominalProtectionRating,
  getTemperatureCorrectionFactor,
  getGroupingCorrectionFactor,
  STANDARD_PROTECTION_RATINGS_A,
} from '../src/engine/nibt-standards';

import {
  calculateResidentialProject,
  calculateIndustrialProject,
  sizeConduitForCable,
  sizeMainCableAndConduit,
} from '../src/engine/calculator';

import type {
  ResidentialProjectData,
  IndustrialProjectData,
} from '../src/types/electrical';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

console.log('--- INIZIO VERIFICA MOTORE DI CALCOLO NIBT SVIZZERO ---');

// 1. Verifica Tabella e Interpolazione Contemporaneità NIBT 3.1.2
const ks1 = getSimultaneityFactorResidential(1);
const ks2 = getSimultaneityFactorResidential(2);
const ks4 = getSimultaneityFactorResidential(4);
const ks10 = getSimultaneityFactorResidential(10);
const ks20 = getSimultaneityFactorResidential(20);

assert(ks1 === 1.0, `ks per 1 appartamento deve essere 1.00 (ottenuto: ${ks1})`);
assert(ks2 === 0.80, `ks per 2 appartamenti deve essere 0.80 (ottenuto: ${ks2})`);
assert(ks4 === 0.63, `ks per 4 appartamenti deve essere 0.63 (ottenuto: ${ks4})`);
assert(ks10 === 0.44, `ks per 10 appartamenti deve essere 0.44 (ottenuto: ${ks10})`);
assert(ks20 === 0.34, `ks per 20 appartamenti deve essere 0.34 (ottenuto: ${ks20})`);

// 2. Verifica Taglia Protezione Nominale In >= Ib
assert(selectNominalProtectionRating(24.5) === 25, 'Ib = 24.5 A -> In = 25 A');
assert(selectNominalProtectionRating(25.1) === 32, 'Ib = 25.1 A -> In = 32 A');
assert(selectNominalProtectionRating(62.0) === 63, 'Ib = 62.0 A -> In = 63 A');
assert(selectNominalProtectionRating(98.4) === 100, 'Ib = 98.4 A -> In = 100 A');
assert(selectNominalProtectionRating(145.0) === 160, 'Ib = 145.0 A -> In = 160 A');

// 3. Verifica Fattori di Correzione Temperatura e Raggruppamento NIBT 5.2.5 / 5.2.6
assert(getTemperatureCorrectionFactor(30) === 1.0, 'fT a 30°C deve essere 1.00');
assert(getTemperatureCorrectionFactor(40) === 0.91, 'fT a 40°C deve essere 0.91');
assert(getGroupingCorrectionFactor(1) === 1.0, 'fr con 1 circuito deve essere 1.00');
assert(getGroupingCorrectionFactor(2) === 0.80, 'fr con 2 circuiti deve essere 0.80');

// 4. Verifica Tubo Protettivo KRFWG serie svizzera e riempimento <= 40%
const conduit6mm = sizeConduitForCable(15.8); // Cavo 5x6 mm² montante appartamento
assert(
  conduit6mm.conduit.name === 'KRFWG M25' || conduit6mm.conduit.name === 'KRFWG M32',
  `Cavo 5x6 mm² alloggiato in ${conduit6mm.conduit.name} con riempimento ${conduit6mm.fillingRatioPercent}%`
);
assert(conduit6mm.fillingRatioPercent <= 45.0, 'Riempimento tubo montante deve essere <= 45% (prassi NIBT cavo singolo)');

// 5. Test Caso Completo Residenziale: 16 appartamenti (2 blocchi da 8) + PAC + EV + FV RCP
const testResidential: ResidentialProjectData = {
  projectName: 'Test Residenziale 16 Alloggi',
  engineerName: 'Test Ingegneria',
  address: 'Lugano',
  gridOperator: 'AIL',
  serviceCableLengthM: 20,
  installationMethod: 'B2',
  cableConductor: 'Cu',
  ambientTempC: 30,
  groupedCircuits: 1,
  maxAllowedVoltageDropPercent: 1.5,
  blocks: [
    {
      id: 'b1',
      name: 'Blocco 1',
      apartmentsCount: 8,
      apartmentBreakerA: 25,
      feederSectionMm2: 6,
      feederLengthM: 15,
      cosPhi: 0.98,
    },
    {
      id: 'b2',
      name: 'Blocco 2',
      apartmentsCount: 8,
      apartmentBreakerA: 25,
      feederSectionMm2: 6,
      feederLengthM: 20,
      cosPhi: 0.98,
    },
  ],
  commonServices: {
    heatPumpKw: 15,
    heatPumpCosPhi: 0.85,
    heatPumpAuxHeaterKw: 6,
    liftKw: 6,
    liftCosPhi: 0.82,
    liftStartingCurrentFactor: 2.5,
    lightingKw: 2,
    pumpsKw: 1.5,
    ventilationKw: 1,
    miscellaneousKw: 2,
    reservePercent: 20,
  },
  evCharging: {
    enabled: true,
    stationCount: 8,
    stationPowerKw: 11,
    managementType: 'dynamic',
    cosPhi: 0.99,
  },
  photovoltaic: {
    enabled: true,
    hasRcp: true,
    peakPowerKwp: 30,
    inverterPowerKva: 27,
    batteryStorageKwh: 0,
    selfConsumptionRatioEst: 45,
    cosPhi: 1.0,
  },
};

const resResult = calculateResidentialProject(testResidential);

console.log(`\nRisultati Test Residenziale:`);
console.log(`- N. alloggi: ${resResult.apartmentsSummary?.totalApartments}`);
console.log(`- ks applicato: ${resResult.simultaneousFactorKs}`);
console.log(`- Potenza simultanea alloggi: ${resResult.apartmentsSummary?.simultaneousPowerAptKw} kW`);
console.log(`- Potenza totale con servizi e riserva: ${resResult.totalSimultaneousActivePowerKw} kW`);
console.log(`- Corrente di progetto Ib: ${resResult.designCurrentIb} A`);
console.log(`- Protezione generale In: ${resResult.nominalProtectionRatingIn} A (${resResult.protectionType})`);
console.log(`- Cavo generale Cu: ${resResult.recommendedCableSectionMm2} mm² (Iz' = ${resResult.cableIzCorrected} A)`);
console.log(`- Tubo raccomandato: ${resResult.recommendedConduitSize} (Riempimento: ${resResult.conduitFillingRatioPercent}%)`);
console.log(`- Caduta di tensione: ${resResult.voltageDropPercent}% (limite ${testResidential.maxAllowedVoltageDropPercent}%)`);

assert(resResult.isCurrentCompliant, 'Condizione termica Iz\' >= In >= Ib verificata');
assert(resResult.isVoltageDropCompliant, 'Caduta di tensione conforme limite SIA');
assert(resResult.isConduitCompliant, 'Percentuale riempimento tubo conforme');

// 6. Test Caso Completo Industriale con Rifasamento
const testIndustrial: IndustrialProjectData = {
  projectName: 'Test Stabilimento Industriale',
  engineerName: 'Test Ingegneria',
  address: 'Bellinzona',
  gridOperator: 'AMB',
  serviceCableLengthM: 30,
  installationMethod: 'E',
  cableConductor: 'Cu',
  ambientTempC: 30,
  groupedCircuits: 1,
  maxAllowedVoltageDropPercent: 2.0,
  expansionReservePercent: 20,
  hasPfcCorrection: true,
  targetCosPhi: 0.95,
  loads: [
    {
      id: 'l1',
      name: 'Macchine CNC',
      category: 'production',
      nominalPowerKw: 60,
      cosPhi: 0.80,
      utilizationFactorKu: 0.8,
      simultaneityFactorKs: 0.8,
    },
    {
      id: 'l2',
      name: 'Compressori',
      category: 'motor',
      nominalPowerKw: 40,
      cosPhi: 0.85,
      utilizationFactorKu: 0.85,
      simultaneityFactorKs: 0.9,
    },
  ],
  evCharging: {
    enabled: false,
    stationCount: 0,
    stationPowerKw: 11,
    managementType: 'none',
    cosPhi: 0.99,
  },
  photovoltaic: {
    enabled: false,
    hasRcp: false,
    peakPowerKwp: 0,
    inverterPowerKva: 0,
    batteryStorageKwh: 0,
    selfConsumptionRatioEst: 0,
    cosPhi: 1.0,
  },
};

const indResult = calculateIndustrialProject(testIndustrial);
console.log(`\nRisultati Test Industriale:`);
console.log(`- Potenza simultanea totale con riserva: ${indResult.totalSimultaneousActivePowerKw} kW`);
console.log(`- Batteria rifasamento necessaria: ${indResult.industrialSummary?.pfcRequiredKvar} kvar`);
console.log(`- Corrente di progetto Ib: ${indResult.designCurrentIb} A`);
console.log(`- Protezione generale In: ${indResult.nominalProtectionRatingIn} A`);
console.log(`- Cavo Cu: ${indResult.recommendedCableSectionMm2} mm²`);

assert(indResult.isCurrentCompliant, 'Condizione sovraccarico industriale verificata');
assert(
  (indResult.industrialSummary?.pfcRequiredKvar || 0) > 0,
  'Rifasamento calcolato correttamente (> 0 kvar)'
);

console.log('\n🎉 TUTTI I TEST E BENCHMARK NIBT SUPERATI CON SUCCESSO!');
