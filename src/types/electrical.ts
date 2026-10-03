export type InstallationType = 'residential' | 'industrial';

export type BlockType = 'residential' | 'commercial' | 'mixed';

export interface ApartmentBlock {
  id: string;
  name: string;
  blockType: BlockType;
  apartmentsCount: number;
  customAptPowerKw?: number;
  apartmentBreakerA?: number;
  feederSectionMm2?: number;
  feederLengthM?: number;
  cosPhi?: number;
}

export interface CommonServicesData {
  heatPumpKw: number;
  heatPumpCosPhi?: number;
  heatPumpAuxHeaterKw: number;
  liftKw: number;
  lightingKw: number;
  pumpsKw: number;
  ventilationKw: number;
  miscellaneousKw: number;
  reservePercent: number;
}

export interface EvChargingData {
  enabled: boolean;
  stationCount: number;
  stationPowerKw: number;
  managementType: 'none' | 'static' | 'dynamic';
  staticPowerCapKw?: number;
  cosPhi?: number;
}

export interface PhotovoltaicData {
  enabled: boolean;
  peakPowerKwp: number;
  inverterPowerKva: number;
  hasRcp: boolean;
  batteryStorageKwh?: number;
}

export interface ResidentialProjectData {
  projectName: string;
  engineerName: string;
  gridOperator: string;
  dsoName: string;
  installationMethod: 'B1' | 'B2' | 'C' | 'E';
  ambientTempC: number;
  groupedCircuits: number;
  serviceCableLengthM: number;
  maxAllowedVoltageDropPercent: number;
  defaultAptPowerKw: number;
  blocks: ApartmentBlock[];
  commonServices: CommonServicesData;
  evCharging: EvChargingData;
  photovoltaic: PhotovoltaicData;
}

export interface IndustrialLoadItem {
  id: string;
  name: string;
  category?: 'production' | 'motor' | 'hvac' | 'lighting' | 'it_office';
  nominalPowerKw: number;
  cosPhi: number;
  efficiency: number;
  quantity: number;
  isMotor: boolean;
  utilizationFactorKu?: number;
  simultaneityFactorKs?: number;
}

export interface IndustrialProjectData {
  projectName: string;
  engineerName: string;
  gridOperator: string;
  dsoName: string;
  installationMethod: 'B1' | 'B2' | 'C' | 'E';
  ambientTempC: number;
  groupedCircuits: number;
  serviceCableLengthM: number;
  maxAllowedVoltageDropPercent: number;
  expansionReservePercent?: number;
  hasPfcCorrection?: boolean;
  loads: IndustrialLoadItem[];
  hasPfc: boolean;
  targetCosPhi: number;
  evCharging?: EvChargingData;
  photovoltaic?: PhotovoltaicData;
}

export interface SizingResult {
  totalInstalledPowerKw: number;
  totalApparentPowerKva: number;
  totalSimultaneousActivePowerKw: number;
  totalSimultaneousApparentPowerKva: number;
  simultaneousFactorKs: number;
  cosPhiEquivalent: number;

  designCurrentIb: number;
  nominalProtectionRatingIn: number;
  protectionType: string;

  recommendedCableSectionMm2: number;
  cableDescription: string;
  cableIzRaw: number;
  correctionFactors: {
    temperature: number;
    grouping: number;
    totalCorrection: number;
  };
  cableIzCorrected: number;
  isCurrentCompliant: boolean;

  voltageDropVolts: number;
  voltageDropPercent: number;
  isVoltageDropCompliant: boolean;
  maxAllowedVoltageDropPercent: number;

  cableOuterDiameterMm: number;
  recommendedConduitSize: string;
  conduitInnerDiameterMm: number;
  conduitFillingRatioPercent: number;
  isConduitCompliant: boolean;

  apartmentsSummary?: {
    totalApartments: number;
    basePowerPerAptKw: number;
    ksCurveValue: number;
    simultaneousPowerAptKw: number;
    blocksDetails: {
      blockId: string;
      blockName: string;
      apartmentsCount: number;
      blockIb: number;
      recommendedIn: number;
      feederSectionMm2: number;
      feederVoltageDropPercent: number;
      feederConduit: string;
    }[];
  };

  commonServicesSummary?: {
    installedKw: number;
    withReserveKw: number;
    reserveKw: number;
    currentA: number;
  };

  evSummary?: {
    installedKw: number;
    activeDemandKw: number;
    simultaneityFactor: number;
    currentA: number;
  };

  pvSummary?: {
    peakPowerKwp: number;
    inverterPowerKva: number;
    maxInfeedCurrentA: number;
    hakBidirectionalStatus: string;
    gridImportPeakIb: number;
    gridExportPeakIb: number;
  };

  industrialSummary?: {
    installedTotalKw: number;
    simultaneousTotalKw: number;
    pfcRequiredKvar?: number;
  };

  stepByStepFormulas: {
    title: string;
    description: string;
    nibtRef: string;
    formula: string;
    result: string;
    valuesApplied?: string;
  }[];
}