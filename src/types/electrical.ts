// Types for EvolveELE Electrical Sizing Application (Swiss NIBT / NIN)

export type InstallationType = 'residential' | 'industrial';

export type LoadManagementType = 'none' | 'static' | 'dynamic';

export type BlockType = 'residential' | 'commercial' | 'mixed';

export interface CommercialUnit {
  id: string;
  name: string;
  installedPowerKw: number;
  cosPhi: number;
}

export interface ApartmentBlock {
  id: string;
  name: string;
  blockType: BlockType; // 'residential' | 'commercial' | 'mixed'
  
  // Sezione Residenziale
  apartmentsCount: number;
  apartmentBreakerA: number; // Default 25A
  customAptPowerKw?: number; // Se definito, sovrascrive il default globale di progetto

  // Sezione Commerciale / Terziario (per negozi, uffici, ecc. nel blocco)
  commercialUnits?: CommercialUnit[];

  // Montante del blocco
  feederSectionMm2: number; // Default 6 mm² (5x6)
  feederLengthM: number; // Default 15 m
  cosPhi: number; // Default 0.98 - 1.0
}

export interface CommonServicesLoads {
  // Parti Comuni / Padronale
  heatPumpKw: number; // Pompa di calore (PAC)
  heatPumpCosPhi: number;
  heatPumpAuxHeaterKw: number; // Riscaldatore elettrico ausiliario PAC
  liftKw: number; // Ascensore
  liftCosPhi: number;
  liftStartingCurrentFactor: number; // Corrente di spunto (tipicamente 2.5 - 3x)
  lightingKw: number; // Illuminazione scale, garage, esterni (LED)
  pumpsKw: number; // Pompe circolazione / autoclave
  ventilationKw: number; // Ventilazione meccanica / autorimessa
  miscellaneousKw: number; // Prese di servizio, cancello, ecc.
  reservePercent: number; // Riserva ampliamento futuro (default 20%)
}

export interface EVChargingConfig {
  enabled: boolean;
  stationCount: number;
  stationPowerKw: number; // 11 kW o 22 kW
  managementType: LoadManagementType; // 'none' (simultaneity 1.0), 'static' (user max cap), 'dynamic' (EMS with reduced simultaneity)
  staticPowerCapKw?: number; // Quota fissa se static
  cosPhi: number; // Default 0.99
}

export interface PhotovoltaicConfig {
  enabled: boolean;
  hasRcp: boolean; // ZEV / RCP (Raggruppamento ai fini del Consumo Proprio)
  peakPowerKwp: number; // Potenza picco moduli (kWp)
  inverterPowerKva: number; // Potenza nominale inverter (kVA)
  batteryStorageKwh: number; // Accumulo a batteria opzionale (kWh)
  selfConsumptionRatioEst: number; // Stima autoconsumo % (es. 40%)
  cosPhi: number; // Default 1.0
}

export interface ResidentialProjectData {
  projectName: string;
  engineerName: string;
  address: string;
  gridOperator: string; // Gestore di rete (es. AIL, SES, AMB, BKW, CKW, EKZ, SIG)
  serviceCableLengthM: number; // Lunghezza allacciamento HAK -> HVD
  installationMethod: 'B1' | 'B2' | 'C' | 'E'; // Tipo di posa NIBT
  cableConductor: 'Cu' | 'Al';
  ambientTempC: number; // Default 30°C
  groupedCircuits: number; // Default 1 (fattore raggruppamento)
  maxAllowedVoltageDropPercent: number; // Default 1.5% o 2.0%
  
  defaultAptPowerKw: number; // Potenza convenzionale unitaria di default per appartamento (es. 5.5 kW)
  
  blocks: ApartmentBlock[];
  commonServices: CommonServicesLoads;
  evCharging: EVChargingConfig;
  photovoltaic: PhotovoltaicConfig;
}

export interface IndustrialLoadItem {
  id: string;
  name: string;
  category: 'production' | 'motor' | 'hvac' | 'lighting' | 'it_office' | 'auxiliary';
  nominalPowerKw: number;
  cosPhi: number;
  utilizationFactorKu: number; // Fattore di utilizzazione (0.1 - 1.0)
  simultaneityFactorKs: number; // Fattore di contemporaneità (0.1 - 1.0)
  startingCurrentFactor?: number; // Per motori
}

export interface IndustrialProjectData {
  projectName: string;
  engineerName: string;
  address: string;
  gridOperator: string;
  serviceCableLengthM: number;
  installationMethod: 'B1' | 'B2' | 'C' | 'E';
  cableConductor: 'Cu' | 'Al';
  ambientTempC: number;
  groupedCircuits: number;
  maxAllowedVoltageDropPercent: number;
  expansionReservePercent: number; // Riserva espansione industriale (default 20%)
  loads: IndustrialLoadItem[];
  hasPfcCorrection: boolean; // Rifasamento presente
  targetCosPhi: number; // cosPhi rifasato desiderato (es. 0.95)
  evCharging: EVChargingConfig;
  photovoltaic: PhotovoltaicConfig;
}

export interface SizingResult {
  // Potenze
  totalInstalledPowerKw: number;
  totalApparentPowerKva: number;
  totalSimultaneousActivePowerKw: number;
  totalSimultaneousApparentPowerKva: number;
  simultaneousFactorKs: number;
  cosPhiEquivalent: number;
  
  // Correnti di progetto
  designCurrentIb: number; // Corrente d'impiego Ib (A)
  nominalProtectionRatingIn: number; // Protezione nominale In (A)
  protectionType: string; // es. "Interruttore magnetotermico MCCB o Fusibili gG/NH"
  
  // Cavo principale
  recommendedCableSectionMm2: number;
  cableDescription: string;
  cableIzRaw: number; // Portata tabellare Iz
  correctionFactors: {
    temperature: number; // fT
    grouping: number; // fr
    totalCorrection: number; // fT * fr
  };
  cableIzCorrected: number; // Iz' = Iz * fT * fr
  isCurrentCompliant: boolean; // Iz' >= In >= Ib
  
  // Caduta di tensione
  voltageDropVolts: number;
  voltageDropPercent: number;
  isVoltageDropCompliant: boolean;
  maxAllowedVoltageDropPercent: number;
  
  // Tubo protettivo / Canalizzazione
  cableOuterDiameterMm: number;
  recommendedConduitSize: string; // es. "KRFWG M50"
  conduitInnerDiameterMm: number;
  conduitFillingRatioPercent: number;
  isConduitCompliant: boolean; // <= 40%
  
  // Dettagli sotto-circuiti
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
    reactivePowerKvar: number;
    pfcRequiredKvar?: number;
  };

  // Formule e note per il report
  stepByStepFormulas: {
    title: string;
    description: string;
    formula: string;
    valuesApplied: string;
    result: string;
    nibtRef: string;
  }[];
}