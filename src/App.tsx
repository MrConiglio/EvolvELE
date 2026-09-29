import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { ResidentialForm } from './components/ResidentialForm';
import { IndustrialForm } from './components/IndustrialForm';
import { ResultsDashboard } from './components/ResultsDashboard';
import { TechnicalReport } from './components/TechnicalReport';
import type {
  InstallationType,
  ResidentialProjectData,
  IndustrialProjectData,
} from './types/electrical';
import {
  calculateResidentialProject,
  calculateIndustrialProject,
} from './engine/calculator';

// Preset Iniziale Residenziale (Edificio Multi-Blocco Svizzero Tipico)
const INITIAL_RESIDENTIAL_DATA: ResidentialProjectData = {
  projectName: 'Residenza Belvedere - Lugano',
  engineerName: 'Ing. Marco Bernasconi (EUR ING / REG A)',
  address: 'Via Lugano 12, 6900 Lugano',
  gridOperator: 'AIL (Aziende Industriali di Lugano)',
  serviceCableLengthM: 18,
  installationMethod: 'B2', // Posa in tubo corrugato incassato nel calcestruzzo (soletta)
  cableConductor: 'Cu',
  ambientTempC: 30,
  groupedCircuits: 1,
  maxAllowedVoltageDropPercent: 1.5, // Raccomandazione SIA 380/4
  blocks: [
    {
      id: 'block-1',
      name: 'Blocco A (Scala 1)',
      apartmentsCount: 8,
      apartmentBreakerA: 25, // Default 25A
      feederSectionMm2: 6, // 5x6 mm²
      feederLengthM: 16,
      cosPhi: 0.98,
    },
    {
      id: 'block-2',
      name: 'Blocco B (Scala 2)',
      apartmentsCount: 8,
      apartmentBreakerA: 25, // Default 25A
      feederSectionMm2: 6, // 5x6 mm²
      feederLengthM: 22,
      cosPhi: 0.98,
    },
  ],
  commonServices: {
    heatPumpKw: 14.0, // Pompa di calore centralizzata
    heatPumpCosPhi: 0.86,
    heatPumpAuxHeaterKw: 6.0, // Resistenza integrativa emergenza
    liftKw: 5.5, // Ascensore 630 kg
    liftCosPhi: 0.82,
    liftStartingCurrentFactor: 2.5,
    lightingKw: 1.8, // LED scale, cantine, autorimessa
    pumpsKw: 1.5, // Pompe di circolazione riscaldamento
    ventilationKw: 1.2, // Ventilazione meccanica
    miscellaneousKw: 2.5, // Prese di servizio lavanderia comune
    reservePercent: 20, // Riserva 20%
  },
  evCharging: {
    enabled: true,
    stationCount: 6,
    stationPowerKw: 11, // 11 kW (16A trifase standard per autorimessa)
    managementType: 'dynamic', // EMS dinamico con peak shaving
    cosPhi: 0.99,
  },
  photovoltaic: {
    enabled: true,
    hasRcp: true, // Raggruppamento per il Consumo Proprio (RCP/ZEV)
    peakPowerKwp: 28.5,
    inverterPowerKva: 25.0,
    batteryStorageKwh: 0,
    selfConsumptionRatioEst: 45,
    cosPhi: 1.0,
  },
};

// Preset Esempio Complesso Grande (3 Blocchi, 30 alloggi)
const LARGE_RESIDENTIAL_EXAMPLE: ResidentialProjectData = {
  ...INITIAL_RESIDENTIAL_DATA,
  projectName: 'Complesso Residenziale Le Terrazze - Bellinzona',
  gridOperator: 'AMB (Aziende Municipalizzate Bellinzona)',
  serviceCableLengthM: 25,
  blocks: [
    {
      id: 'block-1',
      name: 'Palazzina Est',
      apartmentsCount: 12,
      apartmentBreakerA: 25,
      feederSectionMm2: 6,
      feederLengthM: 18,
      cosPhi: 0.98,
    },
    {
      id: 'block-2',
      name: 'Palazzina Centro',
      apartmentsCount: 10,
      apartmentBreakerA: 25,
      feederSectionMm2: 6,
      feederLengthM: 24,
      cosPhi: 0.98,
    },
    {
      id: 'block-3',
      name: 'Palazzina Ovest',
      apartmentsCount: 10,
      apartmentBreakerA: 25,
      feederSectionMm2: 6,
      feederLengthM: 30,
      cosPhi: 0.98,
    },
  ],
  commonServices: {
    ...INITIAL_RESIDENTIAL_DATA.commonServices,
    heatPumpKw: 24.0,
    heatPumpAuxHeaterKw: 9.0,
    liftKw: 11.0,
    lightingKw: 3.5,
  },
  evCharging: {
    enabled: true,
    stationCount: 12,
    stationPowerKw: 11,
    managementType: 'dynamic',
    cosPhi: 0.99,
  },
  photovoltaic: {
    enabled: true,
    hasRcp: true,
    peakPowerKwp: 45.0,
    inverterPowerKva: 40.0,
    batteryStorageKwh: 20,
    selfConsumptionRatioEst: 50,
    cosPhi: 1.0,
  },
};

// Preset Iniziale Industriale
const INITIAL_INDUSTRIAL_DATA: IndustrialProjectData = {
  projectName: 'Stabilimento Meccanico Ticino Tech - Manno',
  engineerName: 'Ing. Marco Bernasconi (EUR ING / REG A)',
  address: 'Via Cantonale 45, 6928 Manno',
  gridOperator: 'AIL (Aziende Industriali di Lugano)',
  serviceCableLengthM: 35,
  installationMethod: 'E', // Passerella forata orizzontale in aria
  cableConductor: 'Cu',
  ambientTempC: 30,
  groupedCircuits: 1,
  maxAllowedVoltageDropPercent: 2.0,
  expansionReservePercent: 20,
  hasPfcCorrection: true,
  targetCosPhi: 0.95,
  loads: [
    {
      id: 'load-1',
      name: 'Centri di Lavoro CNC (x3)',
      category: 'production',
      nominalPowerKw: 45.0,
      cosPhi: 0.82,
      utilizationFactorKu: 0.75,
      simultaneityFactorKs: 0.80,
    },
    {
      id: 'load-2',
      name: 'Centrale Compressori Aria Compressa',
      category: 'motor',
      nominalPowerKw: 30.0,
      cosPhi: 0.85,
      utilizationFactorKu: 0.80,
      simultaneityFactorKs: 0.90,
    },
    {
      id: 'load-3',
      name: 'Impianto Trattamento Aria & Riscaldamento (UTA/HVAC)',
      category: 'hvac',
      nominalPowerKw: 22.0,
      cosPhi: 0.88,
      utilizationFactorKu: 0.70,
      simultaneityFactorKs: 0.85,
    },
    {
      id: 'load-4',
      name: 'Illuminazione Capannone LED DALI',
      category: 'lighting',
      nominalPowerKw: 6.5,
      cosPhi: 0.96,
      utilizationFactorKu: 0.90,
      simultaneityFactorKs: 1.0,
    },
    {
      id: 'load-5',
      name: 'Server Room & Uffici Amministrazione',
      category: 'it_office',
      nominalPowerKw: 12.0,
      cosPhi: 0.92,
      utilizationFactorKu: 0.80,
      simultaneityFactorKs: 0.90,
    },
  ],
  evCharging: {
    enabled: true,
    stationCount: 4,
    stationPowerKw: 22, // 22 kW aziendali
    managementType: 'dynamic',
    cosPhi: 0.99,
  },
  photovoltaic: {
    enabled: true,
    hasRcp: true,
    peakPowerKwp: 60.0,
    inverterPowerKva: 50.0,
    batteryStorageKwh: 0,
    selfConsumptionRatioEst: 65,
    cosPhi: 1.0,
  },
};

export function App() {
  const [installationType, setInstallationType] = useState<InstallationType>('residential');
  const [residentialData, setResidentialData] = useState<ResidentialProjectData>(INITIAL_RESIDENTIAL_DATA);
  const [industrialData, setIndustrialData] = useState<IndustrialProjectData>(INITIAL_INDUSTRIAL_DATA);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  // Calcolo deterministico in tempo reale
  const result = useMemo(() => {
    if (installationType === 'residential') {
      return calculateResidentialProject(residentialData);
    } else {
      return calculateIndustrialProject(industrialData);
    }
  }, [installationType, residentialData, industrialData]);

  // Gestione aggiornamenti metadati
  const handleUpdateProjectMeta = (field: string, value: string) => {
    if (installationType === 'residential') {
      setResidentialData((prev) => ({ ...prev, [field]: value }));
    } else {
      setIndustrialData((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Reset
  const handleResetDefaults = () => {
    if (installationType === 'residential') {
      setResidentialData(INITIAL_RESIDENTIAL_DATA);
    } else {
      setIndustrialData(INITIAL_INDUSTRIAL_DATA);
    }
  };

  // Carica Preset di Esempio Avanzato
  const handleLoadExamplePreset = () => {
    if (installationType === 'residential') {
      setResidentialData(LARGE_RESIDENTIAL_EXAMPLE);
    } else {
      setIndustrialData(INITIAL_INDUSTRIAL_DATA);
    }
  };

  const currentProjectName =
    installationType === 'residential'
      ? residentialData.projectName
      : industrialData.projectName;

  const currentEngineerName =
    installationType === 'residential'
      ? residentialData.engineerName
      : industrialData.engineerName;

  const currentGridOperator =
    installationType === 'residential'
      ? residentialData.gridOperator
      : industrialData.gridOperator;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Header Sticky */}
      <Header
        installationType={installationType}
        onSelectType={setInstallationType}
        projectName={currentProjectName}
        engineerName={currentEngineerName}
        gridOperator={currentGridOperator}
        onUpdateProjectMeta={handleUpdateProjectMeta}
        onPrintReport={() => setIsReportOpen(true)}
        onResetDefaults={handleResetDefaults}
        onLoadExamplePreset={handleLoadExamplePreset}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Banner Informativo Normativo */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/20 border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-md">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🇨🇭</span>
            <div>
              <h1 className="text-sm font-bold text-white">
                Dimensionamento Elettrotecnico Conforme NIBT / NIN & Direttive Svizzere
              </h1>
              <p className="text-xs text-slate-400">
                {installationType === 'residential'
                  ? 'Configurazione alloggi con montanti 5x6 mm² / 25A default, contemporaneità tabellare NIBT 3.1.2, servizi padronali, colonnine EV con gestione dinamica carichi e bilancio allacciamento HAK per RCP/ZEV.'
                  : 'Dimensionamento carichi industriali con potenze installate, coefficienti di utilizzazione (ku), contemporaneità (ks), compensazione rifasamento (PFC) e dorsali di potenza.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] font-mono text-amber-400 border border-slate-700">
              400 V Trifase
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] font-mono text-emerald-400 border border-slate-700">
              Riempimento &le; 40%
            </span>
          </div>
        </div>

        {/* Layout a 2 Colonne su schermi ampi */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Colonna Sinistra: Modulo Inserimento Dati (7/12) */}
          <section className="lg:col-span-7 space-y-6">
            {installationType === 'residential' ? (
              <ResidentialForm
                data={residentialData}
                onChange={setResidentialData}
              />
            ) : (
              <IndustrialForm
                data={industrialData}
                onChange={setIndustrialData}
              />
            )}
          </section>

          {/* Colonna Destra: Dashboard Risultati & Schemi (5/12) */}
          <section className="lg:col-span-5 sticky top-24 space-y-6">
            <ResultsDashboard
              result={result}
              type={installationType}
              onOpenReport={() => setIsReportOpen(true)}
            />
          </section>

        </div>
      </main>

      {/* Footer Tecnico */}
      <footer className="mt-12 bg-slate-900 border-t border-slate-800 text-slate-500 py-6 text-xs no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-mono font-bold text-slate-300">EvolveELE</span>
            <span>•</span>
            <span>Motore di calcolo per Ingegneri e Progettisti Elettrici</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-400">
            <span>Riferimenti: NIBT 2020/2025</span>
            <span>•</span>
            <span>SIA 380/4</span>
            <span>•</span>
            <span>Direttive VSE / AES</span>
          </div>
        </div>
      </footer>

      {/* Modal Report Tecnico Stampabile / PDF */}
      <TechnicalReport
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        result={result}
        type={installationType}
        residentialData={residentialData}
        industrialData={industrialData}
      />

    </div>
  );
}

export default App;
