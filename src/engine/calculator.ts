/**
 * EvolveELE - Motore di calcolo per il dimensionamento elettrico
 * Conforme NIBT / NIN, SIA 380/4 e prescrizioni dei gestori di rete svizzeri (VSE / DGR)
 */

import type {
  ResidentialProjectData,
  IndustrialProjectData,
  SizingResult,
} from '../types/electrical';

import {
  IZ_COPPER_XLPE_3PHASE,
  CABLE_IMPEDANCE_COPPER,
  CABLE_OUTER_DIAMETER_MM,
  SWISS_CONDUITS_PE,
  STANDARD_CABLE_SECTIONS_MM2,
  getSimultaneityFactorResidential,
  getPaeminHakRating,
  getTemperatureCorrectionFactor,
  getGroupingCorrectionFactor,
  selectNominalProtectionRating,
} from './nibt-standards';
import type { ConduitSpec } from './nibt-standards';

const VOLTAGE_UN_VOLTS = 400;
const SQRT3 = Math.sqrt(3);

export function sizeConduitForCable(cableDiameterMm: number): {
  conduit: ConduitSpec;
  fillingRatioPercent: number;
} {
  const cableAreaMm2 = Math.PI * (cableDiameterMm / 2) ** 2;

  for (const conduit of SWISS_CONDUITS_PE) {
    const innerArea = Math.PI * (conduit.innerDiameterMm / 2) ** 2;
    const ratio = (cableAreaMm2 / innerArea) * 100;
    if (conduit.innerDiameterMm > cableDiameterMm && ratio <= 40.0) {
      return {
        conduit,
        fillingRatioPercent: Number(ratio.toFixed(1)),
      };
    }
  }

  const largest = SWISS_CONDUITS_PE[SWISS_CONDUITS_PE.length - 1];
  const innerArea = Math.PI * (largest.innerDiameterMm / 2) ** 2;
  const ratio = Number(((cableAreaMm2 / innerArea) * 100).toFixed(1));

  return {
    conduit: largest,
    fillingRatioPercent: ratio,
  };
}

export function sizeMainCableAndConduit({
  designCurrentIb,
  protectionIn,
  lengthM,
  installationMethod,
  ambientTempC,
  groupedCircuits,
  cosPhi,
  maxAllowedVoltageDropPercent,
}: {
  designCurrentIb: number;
  protectionIn: number;
  lengthM: number;
  installationMethod: 'B1' | 'B2' | 'C' | 'E';
  ambientTempC: number;
  groupedCircuits: number;
  cosPhi: number;
  maxAllowedVoltageDropPercent: number;
}) {
  const fT = getTemperatureCorrectionFactor(ambientTempC);
  const fr = getGroupingCorrectionFactor(groupedCircuits);
  const totalCorrection = Number((fT * fr).toFixed(3));
  const sinPhi = Math.sin(Math.acos(Math.min(1.0, Math.max(0.1, cosPhi))));

  let chosenSection = STANDARD_CABLE_SECTIONS_MM2[0];
  let cableIzRaw = 0;
  let cableIzCorrected = 0;
  let deltaUVolts = 0;
  let deltaUPercent = 0;

  for (const section of STANDARD_CABLE_SECTIONS_MM2) {
    const izTable = IZ_COPPER_XLPE_3PHASE[section];
    if (!izTable) continue;

    const rawIz = izTable[installationMethod] || izTable.B2;
    const correctedIz = rawIz * totalCorrection;

    const impedance = CABLE_IMPEDANCE_COPPER[section] || { rOhmPerKm: 0.1, xOhmPerKm: 0.08 };
    const rTotal = (impedance.rOhmPerKm * lengthM) / 1000;
    const xTotal = (impedance.xOhmPerKm * lengthM) / 1000;

    const dU = SQRT3 * designCurrentIb * (rTotal * cosPhi + xTotal * sinPhi);
    const dUPercent = (dU / VOLTAGE_UN_VOLTS) * 100;

    chosenSection = section;
    cableIzRaw = rawIz;
    cableIzCorrected = Number(correctedIz.toFixed(1));
    deltaUVolts = Number(dU.toFixed(2));
    deltaUPercent = Number(dUPercent.toFixed(2));

    if (correctedIz >= protectionIn && dUPercent <= maxAllowedVoltageDropPercent) {
      break;
    }
  }

  const cableOuterDiameterMm = CABLE_OUTER_DIAMETER_MM[chosenSection] || 25;
  const conduitResult = sizeConduitForCable(cableOuterDiameterMm);

  return {
    sectionMm2: chosenSection,
    cableIzRaw,
    cableIzCorrected,
    fT,
    fr,
    totalCorrection,
    deltaUVolts,
    deltaUPercent,
    isCurrentCompliant: cableIzCorrected >= protectionIn && protectionIn >= designCurrentIb,
    isVoltageDropCompliant: deltaUPercent <= maxAllowedVoltageDropPercent,
    cableOuterDiameterMm,
    conduitSpec: conduitResult.conduit,
    conduitFillingRatioPercent: conduitResult.fillingRatioPercent,
    isConduitCompliant: conduitResult.fillingRatioPercent <= 40.0,
  };
}

export function calculateResidentialProject(data: ResidentialProjectData): SizingResult {
  const steps: SizingResult['stepByStepFormulas'] = [];

  let totalApartments = 0;
  let totalApartmentsNominalPowerKw = 0;
  let totalCommercialPowerKw = 0;
  let commercialDirectIbSum = 0;
  const blocksDetails: NonNullable<SizingResult['apartmentsSummary']>['blocksDetails'] = [];

  const globalDefaultAptKw = data.defaultAptPowerKw || 5.5;

  if (data.blocks && Array.isArray(data.blocks)) {
    for (const block of data.blocks) {
      const blockCosPhi = block.cosPhi || 0.95;
      const feederLen = 15;

      // 1. GESTIONE UNITÀ COMMERCIALE
      if (block.blockType === 'commercial') {
        const customIn = block.apartmentBreakerA && block.apartmentBreakerA > 25 ? block.apartmentBreakerA : 63;
        const blockCommercialKw = Number(( (customIn * VOLTAGE_UN_VOLTS * SQRT3 * blockCosPhi) / 1000 * 0.7 ).toFixed(2));
        
        totalCommercialPowerKw += blockCommercialKw;
        commercialDirectIbSum += customIn;

        const blockIb = Number(( (blockCommercialKw * 1000) / (SQRT3 * VOLTAGE_UN_VOLTS * blockCosPhi) ).toFixed(1));
        const selectedFeederSec = block.feederSectionMm2 || 16;

        const imp = CABLE_IMPEDANCE_COPPER[selectedFeederSec] || CABLE_IMPEDANCE_COPPER[16];
        const rTot = (imp.rOhmPerKm * feederLen) / 1000;
        const xTot = (imp.xOhmPerKm * feederLen) / 1000;
        const sinPhi = Math.sin(Math.acos(blockCosPhi));
        const dU = SQRT3 * blockIb * (rTot * blockCosPhi + xTot * sinPhi);
        const dUPercent = Number(((dU / VOLTAGE_UN_VOLTS) * 100).toFixed(2));

        blocksDetails.push({
          blockId: block.id,
          blockName: `${block.name} (Commerciale)`,
          apartmentsCount: 0,
          blockIb,
          recommendedIn: customIn,
          feederSectionMm2: selectedFeederSec,
          feederVoltageDropPercent: dUPercent,
          feederConduit: sizeConduitForCable(CABLE_OUTER_DIAMETER_MM[selectedFeederSec] || 25).conduit.name,
        });
        continue;
      }

      // 2. GESTIONE BLOCCO RESIDENZIALE O MISTO
      const aptCount = block.apartmentsCount || 0;
      const aptPowerKw = block.customAptPowerKw ?? globalDefaultAptKw;
      const feederSec = block.feederSectionMm2 || 6;
      
      if (aptCount > 0) {
        totalApartments += aptCount;
        const blockNominalKw = aptCount * aptPowerKw;
        totalApartmentsNominalPowerKw += blockNominalKw;

        const blockKs = getSimultaneityFactorResidential(aptCount);
        const blockActivePowerKw = blockNominalKw * blockKs;

        const blockIb = Number(((blockActivePowerKw * 1000) / (SQRT3 * VOLTAGE_UN_VOLTS * blockCosPhi)).toFixed(1));
        const blockIn = selectNominalProtectionRating(blockIb);

        const imp = CABLE_IMPEDANCE_COPPER[feederSec] || CABLE_IMPEDANCE_COPPER[6];
        const rTot = (imp.rOhmPerKm * feederLen) / 1000;
        const xTot = (imp.xOhmPerKm * feederLen) / 1000;
        const sinPhi = Math.sin(Math.acos(blockCosPhi));
        const dU = SQRT3 * blockIb * (rTot * blockCosPhi + xTot * sinPhi);
        const dUPercent = Number(((dU / VOLTAGE_UN_VOLTS) * 100).toFixed(2));

        const outerD = CABLE_OUTER_DIAMETER_MM[feederSec] || 15.8;
        const blockConduit = sizeConduitForCable(outerD).conduit.name;

        blocksDetails.push({
          blockId: block.id,
          blockName: block.name,
          apartmentsCount: aptCount,
          blockIb,
          recommendedIn: blockIn,
          feederSectionMm2: feederSec,
          feederVoltageDropPercent: dUPercent,
          feederConduit: blockConduit,
        });
      }
    }
  }

  // Contemporaneità globale per tutti gli appartamenti
  const globalAptKs = getSimultaneityFactorResidential(totalApartments);
  const aptSimultaneousPowerKw = Number((totalApartmentsNominalPowerKw * globalAptKs).toFixed(2));
  
  // Servizi Comuni
  const cs = data.commonServices || {
    heatPumpKw: 0,
    heatPumpAuxHeaterKw: 0,
    liftKw: 0,
    lightingKw: 0,
    pumpsKw: 0,
    ventilationKw: 0,
    miscellaneousKw: 0,
    reservePercent: 20,
  };

  const commonBaseKw =
    (cs.heatPumpKw || 0) +
    (cs.heatPumpAuxHeaterKw || 0) +
    (cs.liftKw || 0) +
    (cs.lightingKw || 0) +
    (cs.pumpsKw || 0) +
    (cs.ventilationKw || 0) +
    (cs.miscellaneousKw || 0);

  const reservePct = cs.reservePercent ?? 20;
  const reserveKw = Number(((commonBaseKw * reservePct) / 100).toFixed(2));
  const commonWithReserveKw = Number((commonBaseKw + reserveKw).toFixed(2));

  // Mobilità Elettrica (EV)
  let evInstalledKw = 0;
  let evActiveDemandKw = 0;
  let evSimultaneityFactor = 1.0;
  let evCurrentA = 0;

  if (data.evCharging?.enabled && (data.evCharging.stationCount || 0) > 0) {
    const ev = data.evCharging;
    evInstalledKw = ev.stationCount * ev.stationPowerKw;
    if (ev.managementType === 'none') {
      evSimultaneityFactor = ev.stationCount > 4 ? 0.8 : 1.0;
      evActiveDemandKw = Number((evInstalledKw * evSimultaneityFactor).toFixed(1));
    } else if (ev.managementType === 'static') {
      const cap = ev.staticPowerCapKw || evInstalledKw * 0.5;
      evActiveDemandKw = Math.min(evInstalledKw, cap);
      evSimultaneityFactor = Number((evActiveDemandKw / evInstalledKw).toFixed(2));
    } else {
      evSimultaneityFactor = Math.max(0.20, Number((0.15 + 0.60 / Math.sqrt(ev.stationCount)).toFixed(2)));
      evActiveDemandKw = Number((evInstalledKw * evSimultaneityFactor).toFixed(1));
    }
    evCurrentA = Number(((evActiveDemandKw * 1000) / (SQRT3 * VOLTAGE_UN_VOLTS * (ev.cosPhi || 0.95))).toFixed(1));
  }

  // Fotovoltaico (FV)
  let pvMaxInfeedCurrentA = 0;
  let pvKwp = 0;
  let pvInverterKva = 0;
  let hakStatus = 'Standard mono-direzionale (Prelevatore)';

  if (data.photovoltaic?.enabled && (data.photovoltaic.inverterPowerKva || 0) > 0) {
    const pv = data.photovoltaic;
    pvKwp = pv.peakPowerKwp || 0;
    pvInverterKva = pv.inverterPowerKva || 0;
    pvMaxInfeedCurrentA = Number(((pvInverterKva * 1000) / (SQRT3 * VOLTAGE_UN_VOLTS)).toFixed(1));
    hakStatus = pv.hasRcp ? 'Bidirezionale RCP/ZEV (Immissione e Prelievo)' : 'Impianto FV con cessione eccedenze';
  }

  // CALCOLO TOTALE CORRENTE IN INTRODUZIONE / TESTACAVO (HAK)
  const commercialActiveDemandKw = totalCommercialPowerKw;
  const gridImportPeakKw = aptSimultaneousPowerKw + commercialActiveDemandKw + commonWithReserveKw + evActiveDemandKw;
  const totalActiveDemandKw = Number(gridImportPeakKw.toFixed(2));
  const equivalentCosPhi = 0.95;
  const totalSimultaneousApparentPowerKva = Number((totalActiveDemandKw / equivalentCosPhi).toFixed(2));

  const standardImportCurrentA = (totalActiveDemandKw * 1000) / (SQRT3 * VOLTAGE_UN_VOLTS * equivalentCosPhi);
  
  // VERIFICA MINIMO PAE
  const paeMinIn = getPaeminHakRating(totalApartments);

  const analyticalOrCommercialIb = Math.max(standardImportCurrentA, commercialDirectIbSum > 0 ? commercialDirectIbSum * 0.75 : 0, pvMaxInfeedCurrentA);
  const hakDesignCurrentIb = Number(Math.max(analyticalOrCommercialIb, commercialDirectIbSum > 0 ? commercialDirectIbSum : 0).toFixed(1));

  let protectionIn = selectNominalProtectionRating(hakDesignCurrentIb);
  if (totalApartments > 0 && commercialDirectIbSum === 0) {
    protectionIn = Math.max(protectionIn, paeMinIn);
  } else if (commercialDirectIbSum > 0) {
    protectionIn = Math.max(protectionIn, commercialDirectIbSum);
  }

  const cableSizing = sizeMainCableAndConduit({
    designCurrentIb: hakDesignCurrentIb,
    protectionIn,
    lengthM: data.serviceCableLengthM || 15,
    installationMethod: data.installationMethod || 'B2',
    ambientTempC: data.ambientTempC || 30,
    groupedCircuits: data.groupedCircuits || 1,
    cosPhi: equivalentCosPhi,
    maxAllowedVoltageDropPercent: data.maxAllowedVoltageDropPercent || 1.5,
  });

  const totalInstalledPowerKw = totalApartmentsNominalPowerKw + totalCommercialPowerKw + commonBaseKw + evInstalledKw;

  return {
    totalInstalledPowerKw: Number(totalInstalledPowerKw.toFixed(1)),
    totalApparentPowerKva: Number((totalInstalledPowerKw / 0.95).toFixed(1)),
    totalSimultaneousActivePowerKw: totalActiveDemandKw,
    totalSimultaneousApparentPowerKva,
    simultaneousFactorKs: globalAptKs,
    cosPhiEquivalent: equivalentCosPhi,

    designCurrentIb: hakDesignCurrentIb,
    nominalProtectionRatingIn: protectionIn,
    protectionType: protectionIn > 125 ? 'Fusibili a coltello NH (Gr. 1/2) o Interruttore Scatolato MCCB' : 'Fusibili NH00 o Interruttore Magnetotermico MCB',

    recommendedCableSectionMm2: cableSizing.sectionMm2,
    cableDescription: `Cavo Cu 5G${cableSizing.sectionMm2} mm² XLPE`,
    cableIzRaw: cableSizing.cableIzRaw,
    correctionFactors: {
      temperature: cableSizing.fT,
      grouping: cableSizing.fr,
      totalCorrection: cableSizing.totalCorrection,
    },
    cableIzCorrected: cableSizing.cableIzCorrected,
    isCurrentCompliant: cableSizing.isCurrentCompliant,

    voltageDropVolts: cableSizing.deltaUVolts,
    voltageDropPercent: cableSizing.deltaUPercent,
    isVoltageDropCompliant: cableSizing.isVoltageDropCompliant,
    maxAllowedVoltageDropPercent: data.maxAllowedVoltageDropPercent || 1.5,

    cableOuterDiameterMm: cableSizing.cableOuterDiameterMm,
    recommendedConduitSize: cableSizing.conduitSpec.name,
    conduitInnerDiameterMm: cableSizing.conduitSpec.innerDiameterMm,
    conduitFillingRatioPercent: cableSizing.conduitFillingRatioPercent,
    isConduitCompliant: cableSizing.conduitCompliant,

    apartmentsSummary: {
      totalApartments,
      basePowerPerAptKw: globalDefaultAptKw,
      ksCurveValue: globalAptKs,
      simultaneousPowerAptKw: aptSimultaneousPowerKw,
      blocksDetails,
    },
    commonServicesSummary: {
      installedKw: commonBaseKw,
      withReserveKw: commonWithReserveKw,
      reserveKw,
      currentA: Number(((commonWithReserveKw * 1000) / (SQRT3 * VOLTAGE_UN_VOLTS * 0.88)).toFixed(1)),
    },
    evSummary: data.evCharging?.enabled ? {
      installedKw: evInstalledKw,
      activeDemandKw: evActiveDemandKw,
      simultaneityFactor: evSimultaneityFactor,
      currentA: evCurrentA,
    } : undefined,
    pvSummary: data.photovoltaic?.enabled ? {
      peakPowerKwp: pvKwp,
      inverterPowerKva: pvInverterKva,
      maxInfeedCurrentA: pvMaxInfeedCurrentA,
      hakBidirectionalStatus: hakStatus,
      gridImportPeakIb: Number(hakDesignCurrentIb.toFixed(1)),
      gridExportPeakIb: pvMaxInfeedCurrentA,
    } : undefined,

    stepByStepFormulas: steps,
  };
}

export function calculateIndustrialProject(data: IndustrialProjectData): SizingResult {
  return {} as SizingResult;
}