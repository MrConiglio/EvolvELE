import {
  Printer,
  X,
  FileCheck,
  Calendar,
  User,
} from 'lucide-react';
import type {
  SizingResult,
  ResidentialProjectData,
  IndustrialProjectData,
  InstallationType,
} from '../types/electrical';

interface TechnicalReportProps {
  isOpen: boolean;
  onClose: () => void;
  result: SizingResult;
  type: InstallationType;
  residentialData?: ResidentialProjectData;
  industrialData?: IndustrialProjectData;
}

export const TechnicalReport = ({
  isOpen,
  onClose,
  result,
  type,
  residentialData,
  industrialData,
}: TechnicalReportProps) => {
  if (!isOpen) return null;

  const projectName =
    (type === 'residential' ? residentialData?.projectName : industrialData?.projectName) ||
    'Progetto Elettrico Standard';
  const engineerName =
    (type === 'residential' ? residentialData?.engineerName : industrialData?.engineerName) ||
    'Ingegnere Responsabile';
  const gridOperator =
    (type === 'residential' ? residentialData?.gridOperator : industrialData?.gridOperator) ||
    'Gestore di Rete Cantonale Svizzero';
  const currentDate = new Date().toLocaleDateString('it-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex justify-center p-2 sm:p-6">
      
      {/* Modal / Report Container */}
      <div className="bg-white text-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-300 print-container">
        
        {/* Barra Comandi (Nascosta durante la stampa) */}
        <div className="no-print bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <FileCheck className="h-5 w-5 text-emerald-400" />
            <span className="font-bold text-sm">
              Anteprima Relazione Tecnica Elettrotecnica NIBT / SIA
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition"
            >
              <Printer className="h-4 w-4" />
              <span>Stampa / Salva in PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Chiudi anteprima"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* CONTENUTO REPORT STAMPABILE (A4 STYLE) */}
        <div className="p-8 sm:p-12 space-y-8 bg-white font-sans text-xs leading-relaxed text-slate-800">
          
          {/* Header Ufficiale */}
          <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black font-mono tracking-tight text-slate-950">
                  Evolve<span className="text-amber-600">ELE</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold border border-red-200">
                  🇨🇭 NORMATIVA SVIZZERA
                </span>
              </div>
              <h1 className="text-lg font-bold text-slate-950 uppercase tracking-tight mt-1">
                Relazione Tecnica di Calcolo e Dimensionamento Elettrico
              </h1>
              <p className="text-[11px] text-slate-600">
                Conformità: NIBT/NIN 2020-2025 • SIA 380/4 • Prescrizioni Gestori di Rete VSE / DGR
              </p>
            </div>

            <div className="text-right text-[11px] space-y-1">
              <div className="flex items-center space-x-1 justify-end text-slate-600">
                <Calendar className="h-3.5 w-3.5" />
                <span>Data di calcolo: <strong>{currentDate}</strong></span>
              </div>
              <div className="flex items-center space-x-1 justify-end text-slate-600">
                <User className="h-3.5 w-3.5" />
                <span>Ingegnere: <strong>{engineerName}</strong></span>
              </div>
              <div className="text-slate-600">
                Gestore (DSO): <strong>{gridOperator}</strong>
              </div>
            </div>
          </div>

          {/* Dati Generali del Progetto */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
            <div>
              <span className="text-slate-500 block">Nome Opera / Progetto:</span>
              <strong className="text-slate-950 font-semibold">{projectName}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Tipologia Installazione:</span>
              <strong className="text-slate-950 uppercase font-semibold">
                {type === 'residential' ? 'Residenziale Alloggi' : 'Industriale / Terziario'}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">Tensione di Esercizio:</span>
              <strong className="text-slate-950 font-mono">3L+N+PE 400/230 V - 50 Hz</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Sistema di Distribuzione:</span>
              <strong className="text-slate-950 font-mono">TN-S / TN-C-S (NIBT)</strong>
            </div>
          </div>

          {/* TABELLA DI SINTESI DEI RISULTATI ESECUTIVI */}
          <div>
            <h2 className="text-sm font-bold text-slate-950 uppercase tracking-wide border-b border-slate-300 pb-1 mb-3">
              1. Sintesi dei Risultati di Dimensionamento Esecutivo
            </h2>

            <table className="w-full text-left text-[11px] border border-slate-300">
              <tbody>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <td className="p-2.5 font-semibold text-slate-700 w-1/3">
                    Dispositivo di Protezione Generale (HAK / HVD)
                  </td>
                  <td className="p-2.5 font-bold font-mono text-slate-950 text-sm">
                    In = {result.nominalProtectionRatingIn} A
                  </td>
                  <td className="p-2.5 text-slate-600">
                    {result.protectionType} (Conforme NIBT 4.3)
                  </td>
                </tr>

                <tr className="border-b border-slate-200">
                  <td className="p-2.5 font-semibold text-slate-700">
                    Massima Corrente d'Impiego di Progetto (Ib)
                  </td>
                  <td className="p-2.5 font-bold font-mono text-slate-950">
                    Ib = {result.designCurrentIb} A
                  </td>
                  <td className="p-2.5 text-slate-600">
                    Condizione verif.: Ib ({result.designCurrentIb} A) &le; In ({result.nominalProtectionRatingIn} A) &le; Iz' ({result.cableIzCorrected} A)
                  </td>
                </tr>

                <tr className="border-b border-slate-200 bg-slate-50">
                  <td className="p-2.5 font-semibold text-slate-700">
                    Potenza Attiva Simultanea / Apparente
                  </td>
                  <td className="p-2.5 font-bold font-mono text-slate-950">
                    P = {result.totalSimultaneousActivePowerKw} kW
                  </td>
                  <td className="p-2.5 text-slate-600">
                    S = {result.totalSimultaneousApparentPowerKva} kVA (cosφ = {result.cosPhiEquivalent}, ks = {result.simultaneousFactorKs})
                  </td>
                </tr>

                <tr className="border-b border-slate-200">
                  <td className="p-2.5 font-semibold text-slate-700">
                    Cavo di Alimentazione Principale (Cu XLPE)
                  </td>
                  <td className="p-2.5 font-bold font-mono text-slate-950">
                    Cu 5G{result.recommendedCableSectionMm2} mm²
                  </td>
                  <td className="p-2.5 text-slate-600">
                    Portata corretta Iz' = {result.cableIzCorrected} A (Tabellare Iz = {result.cableIzRaw} A, fT={result.correctionFactors.temperature}, fr={result.correctionFactors.grouping})
                  </td>
                </tr>

                <tr className="border-b border-slate-200 bg-slate-50">
                  <td className="p-2.5 font-semibold text-slate-700">
                    Verifica Caduta di Tensione Totale (ΔU%)
                  </td>
                  <td className="p-2.5 font-bold font-mono text-slate-950">
                    ΔU = {result.voltageDropPercent}% ({result.voltageDropVolts} V)
                  </td>
                  <td className="p-2.5 text-slate-600">
                    Limite ammesso: &le; {result.maxAllowedVoltageDropPercent}% • Stato:{' '}
                    <span className="font-bold text-emerald-700">CONFORME</span>
                  </td>
                </tr>

                <tr className="border-b border-slate-200">
                  <td className="p-2.5 font-semibold text-slate-700">
                    Tubo Protettivo Serie Svizzera KRFWG
                  </td>
                  <td className="p-2.5 font-bold font-mono text-slate-950">
                    {result.recommendedConduitSize}
                  </td>
                  <td className="p-2.5 text-slate-600">
                    Fattore riempimento: <strong>{result.conduitFillingRatioPercent}%</strong> (&le; 40% prescritto) • Cavo Ø est. {result.cableOuterDiameterMm} mm
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* SVILUPPO FORMULE PASSO-PASSO */}
          <div className="page-break-inside-avoid">
            <h2 className="text-sm font-bold text-slate-950 uppercase tracking-wide border-b border-slate-300 pb-1 mb-3">
              2. Sviluppo Analitico delle Formule Elettrotecniche (Passo-Passo)
            </h2>

            <div className="space-y-3">
              {result.stepByStepFormulas.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] space-y-1.5"
                >
                  <div className="flex justify-between items-center font-bold text-slate-900">
                    <span>
                      2.{idx + 1} {step.title}
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal italic">
                      Rif. {step.nibtRef}
                    </span>
                  </div>
                  <p className="text-slate-600">{step.description}</p>
                  <div className="p-2 bg-white rounded border border-slate-200 font-mono text-[10px] text-slate-900">
                    {step.formula}
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between text-slate-700 pt-1 text-[10px]">
                    <span>Valori applicati: {step.valuesApplied}</span>
                    <span className="font-bold text-slate-950 mt-1 sm:mt-0 font-mono">
                      {step.result}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DETTAGLIO ALLOGGI E MONTANTI */}
          {type === 'residential' && result.apartmentsSummary && (
            <div className="page-break-inside-avoid">
              <h2 className="text-sm font-bold text-slate-950 uppercase tracking-wide border-b border-slate-300 pb-1 mb-3">
                3. Tabella Montanti di Blocco e Quadri Secondari
              </h2>

              <table className="w-full text-left text-[11px] border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 font-semibold text-slate-700">
                    <th className="p-2">Colonna / Blocco</th>
                    <th className="p-2">Alloggi</th>
                    <th className="p-2">Ib Calcolata</th>
                    <th className="p-2">Protezione In</th>
                    <th className="p-2">Cavo Montante Cu</th>
                    <th className="p-2">Tubo KRFWG</th>
                    <th className="p-2">Caduta ΔU%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  {result.apartmentsSummary.blocksDetails.map((b) => (
                    <tr key={b.blockId}>
                      <td className="p-2 font-sans font-semibold text-slate-900">{b.blockName}</td>
                      <td className="p-2 text-slate-700">{b.apartmentsCount} alloggi</td>
                      <td className="p-2 font-bold text-slate-950">{b.blockIb} A</td>
                      <td className="p-2 font-bold text-emerald-800">{b.recommendedIn} A</td>
                      <td className="p-2 text-slate-800">5G{b.feederSectionMm2} mm²</td>
                      <td className="p-2 text-slate-700">{b.feederConduit}</td>
                      <td className="p-2 text-slate-700">{b.feederVoltageDropPercent}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* DISTINTA MATERIALI PRINCIPALI PER CAPITOLATO */}
          <div className="page-break-inside-avoid">
            <h2 className="text-sm font-bold text-slate-950 uppercase tracking-wide border-b border-slate-300 pb-1 mb-3">
              4. Distinta Sintetica Materiali di Allacciamento
            </h2>

            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-700">
              <li>
                <strong>Cavo Principale:</strong> Cavo di potenza con isolamento XLPE senza alogeni conforme CPR,
                sezione <strong>5G{result.recommendedCableSectionMm2} mm² Cu</strong> (tipo TT-CLD / CH-N07V-U/R).
              </li>
              <li>
                <strong>Tubo Protettivo Generale:</strong> Tubo flessibile corrugato serie svizzera pesante
                <strong> {result.recommendedConduitSize}</strong> autoestinguente e privo di alogeni.
              </li>
              <li>
                <strong>Organo di Protezione Generale:</strong> Dispositivo di sezionamento e protezione da{' '}
                <strong>{result.nominalProtectionRatingIn} A</strong> ({result.protectionType}).
              </li>
              {type === 'residential' && (
                <li>
                  <strong>Montanti Alloggi:</strong> Cavi Cu 5G6 mm² protetti ciascuno da interruttore magnetotermico da 25 A.
                </li>
              )}
            </ul>
          </div>

          {/* TIMBRO E FIRMA APPROVAZIONE */}
          <div className="page-break-inside-avoid pt-6 border-t-2 border-slate-300 grid grid-cols-2 gap-8 text-[11px]">
            <div>
              <span className="font-bold text-slate-950 block mb-1">
                Dichiarazione di Conformità Elettrotecnica
              </span>
              <p className="text-slate-600 text-[10px]">
                I calcoli sopra riportati sono stati eseguiti in conformità alle Norme d'Installazione a Bassa Tensione
                svizzere (NIBT / NIN), alle prescrizioni dei gestori di rete cantonali (VSE / DGR) e alle raccomandazioni SIA.
              </p>
            </div>

            <div className="flex flex-col items-end justify-between h-24">
              <span className="font-semibold text-slate-700">
                Timbro e Firma del Progettista Elettrotecnico:
              </span>
              <div className="border-b border-slate-400 w-48 text-center pb-1 text-slate-400 font-mono text-[10px]">
                {engineerName}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
