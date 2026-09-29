import { useState } from 'react';
import {
  Zap,
  Shield,
  Layers,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Network,
  Cpu,
  Sun,
  Activity,
} from 'lucide-react';
import type { SizingResult, InstallationType } from '../types/electrical';

interface ResultsDashboardProps {
  result: SizingResult;
  type: InstallationType;
  onOpenReport: () => void;
}

export const ResultsDashboard = ({
  result,
  type,
  onOpenReport,
}: ResultsDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tree' | 'blocks' | 'formulas'>('overview');

  const {
    nominalProtectionRatingIn,
    designCurrentIb,
    totalSimultaneousActivePowerKw,
    totalSimultaneousApparentPowerKva,
    recommendedCableSectionMm2,
    cableDescription,
    cableIzCorrected,
    voltageDropPercent,
    isVoltageDropCompliant,
    maxAllowedVoltageDropPercent,
    recommendedConduitSize,
    conduitFillingRatioPercent,
    isConduitCompliant,
    protectionType,
    apartmentsSummary,
    commonServicesSummary,
    evSummary,
    pvSummary,
    industrialSummary,
  } = result;

  return (
    <div className="space-y-6">
      
      {/* HEADER RISULTATI & TAB SWITCHER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Risultati del Dimensionamento
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                Conforme NIBT / NIN
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Ricalcolo automatico deterministico in tempo reale.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sintesi Metriche
          </button>
          <button
            onClick={() => setActiveTab('tree')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
              activeTab === 'tree'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Network className="h-3.5 w-3.5" />
            <span>Albero Impianto</span>
          </button>
          {type === 'residential' && apartmentsSummary && (
            <button
              onClick={() => setActiveTab('blocks')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'blocks'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Montanti Alloggi
            </button>
          )}
          <button
            onClick={() => setActiveTab('formulas')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'formulas'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Formule NIBT
          </button>
        </div>
      </div>

      {/* 1. HERO METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Protezione Generale HAK In */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Protezione Generale (HAK)
            </span>
            <Shield className="h-4 w-4 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {nominalProtectionRatingIn}
            </span>
            <span className="text-lg font-bold text-amber-400">A</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <span>Corrente di progetto Ib:</span>
            <span className="font-mono font-bold text-white">{designCurrentIb} A</span>
          </div>
          <span className="mt-1 block text-[10px] text-slate-500 truncate" title={protectionType}>
            {protectionType}
          </span>
        </div>

        {/* Potenza di Progetto P_sim */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Potenza Simultanea di Picco
            </span>
            <Activity className="h-4 w-4 text-blue-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {totalSimultaneousActivePowerKw}
            </span>
            <span className="text-lg font-bold text-blue-400">kW</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <span>Potenza apparente:</span>
            <span className="font-mono font-bold text-white">
              {totalSimultaneousApparentPowerKva} kVA
            </span>
          </div>
          <span className="mt-1 block text-[10px] text-slate-500">
            cosφ eq: {result.cosPhiEquivalent} • ks: {result.simultaneousFactorKs}
          </span>
        </div>

        {/* Cavo Principale di Alimentazione */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Cavo di Allacciamento Cu
            </span>
            <Layers className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {recommendedCableSectionMm2}
            </span>
            <span className="text-lg font-bold text-emerald-400">mm²</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <span>Portata corretta Iz':</span>
            <span className="font-mono font-bold text-emerald-400">
              {cableIzCorrected} A &ge; {nominalProtectionRatingIn} A
            </span>
          </div>
          <span className="mt-1 block text-[10px] text-slate-500 truncate" title={cableDescription}>
            5G{recommendedCableSectionMm2} mm² XLPE
          </span>
        </div>

        {/* Tubo Protettivo & Riempimento */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Tubo Protettivo (NIBT)
            </span>
            <span className="font-mono font-bold text-xs text-indigo-400">
              {recommendedConduitSize}
            </span>
          </div>
          
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {conduitFillingRatioPercent}%
            </span>
            <span className="text-xs font-semibold text-slate-400">/ 40% max</span>
          </div>

          {/* Visual Progress Bar Riempimento */}
          <div className="mt-3 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                conduitFillingRatioPercent <= 35
                  ? 'bg-emerald-500'
                  : conduitFillingRatioPercent <= 42
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, (conduitFillingRatioPercent / 40) * 100)}%` }}
            ></div>
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <span>Caduta di tensione:</span>
            <span
              className={`font-mono font-bold ${
                isVoltageDropCompliant ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {voltageDropPercent}% (max {maxAllowedVoltageDropPercent}%)
            </span>
          </div>
        </div>

      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card Dettaglio Alloggi o Industriale */}
          <div className="lg:col-span-2 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Ripartizione Potenze e Simultaneità</span>
              <span className="text-xs text-slate-400 font-normal">
                {type === 'residential' ? 'Complesso Residenziale' : 'Stabilimento Industriale'}
              </span>
            </h3>

            {type === 'residential' && apartmentsSummary && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Alloggi Totali</span>
                  <span className="text-lg font-bold text-white font-mono">
                    {apartmentsSummary.totalApartments}
                  </span>
                  <span className="text-[11px] text-amber-400 block mt-1">
                    ks NIBT: {apartmentsSummary.ksCurveValue}
                  </span>
                </div>
                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Potenza Alloggi Simultanea</span>
                  <span className="text-lg font-bold text-white font-mono">
                    {apartmentsSummary.simultaneousPowerAptKw} kW
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Base: {apartmentsSummary.basePowerPerAptKw} kW / apt
                  </span>
                </div>
                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Servizi Generali (Padronale)</span>
                  <span className="text-lg font-bold text-white font-mono">
                    {commonServicesSummary?.withReserveKw || 0} kW
                  </span>
                  <span className="text-[11px] text-indigo-400 block mt-1">
                    Incl. {commonServicesSummary?.reserveKw} kW riserva
                  </span>
                </div>
              </div>
            )}

            {type === 'industrial' && industrialSummary && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Carichi Totali Installati</span>
                  <span className="text-lg font-bold text-white font-mono">
                    {industrialSummary.installedTotalKw} kW
                  </span>
                </div>
                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Potenza Simultanea con Riserva</span>
                  <span className="text-lg font-bold text-white font-mono">
                    {industrialSummary.simultaneousTotalKw} kW
                  </span>
                </div>
                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Batteria Rifasamento PFC</span>
                  <span className="text-lg font-bold text-white font-mono">
                    {industrialSummary.pfcRequiredKvar ? `${industrialSummary.pfcRequiredKvar} kvar` : 'Non richiesta'}
                  </span>
                </div>
              </div>
            )}

            {/* Indicatori Tecnologici (EV / FV) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {evSummary && (
                <div className="p-3.5 bg-slate-950/60 rounded-xl border border-emerald-900/40 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
                      <Cpu className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-white block">Mobilità Elettrica (EV)</span>
                      <span className="text-[11px] text-slate-400">
                        {evSummary.installedKw} kW inst. &rarr; {evSummary.activeDemandKw} kW picco
                      </span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-emerald-400">
                    {evSummary.currentA} A
                  </span>
                </div>
              )}

              {pvSummary && (
                <div className="p-3.5 bg-slate-950/60 rounded-xl border border-amber-900/40 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
                      <Sun className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-white block">Fotovoltaico & RCP (ZEV)</span>
                      <span className="text-[11px] text-slate-400">
                        {pvSummary.peakPowerKwp} kWp • Inv. {pvSummary.inverterPowerKva} kVA
                      </span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-amber-400">
                    {pvSummary.maxInfeedCurrentA} A imm.
                  </span>
                </div>
              )}
            </div>

            {/* Pulsante rapido report */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={onOpenReport}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-900/30 transition"
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>Genera Relazione Tecnica Completa A4</span>
              </button>
            </div>
          </div>

          {/* Checklist di Conformità Normativa NIBT / SIA */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Verifica Regole Tecniche NIBT</span>
            </h3>

            <div className="space-y-3 text-xs">
              {/* Regola 1: Iz' >= In >= Ib */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start space-x-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-200 block">Condizione Sovraccarico</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    <span className="font-mono">Iz' ({cableIzCorrected} A)</span> &ge;{' '}
                    <span className="font-mono">In ({nominalProtectionRatingIn} A)</span> &ge;{' '}
                    <span className="font-mono">Ib ({designCurrentIb} A)</span>
                  </p>
                  <span className="text-[10px] text-emerald-500 font-semibold">Verificata (NIBT 4.3.3)</span>
                </div>
              </div>

              {/* Regola 2: Caduta di tensione */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start space-x-2.5">
                {isVoltageDropCompliant ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-bold text-slate-200 block">Caduta di Tensione (ΔU%)</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Valore calcolato: <span className="font-mono font-bold text-white">{voltageDropPercent}%</span>{' '}
                    (limite impostato: {maxAllowedVoltageDropPercent}%)
                  </p>
                  <span
                    className={`text-[10px] font-semibold ${
                      isVoltageDropCompliant ? 'text-emerald-500' : 'text-rose-400'
                    }`}
                  >
                    {isVoltageDropCompliant ? 'Conforme raccomandazione SIA 380/4' : 'Attenzione: Supera il limite'}
                  </span>
                </div>
              </div>

              {/* Regola 3: Riempimento tubo KRFWG */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start space-x-2.5">
                {isConduitCompliant ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-bold text-slate-200 block">Riempimento Tubo KRFWG</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Sezione cavo: <span className="font-mono">{conduitFillingRatioPercent}%</span> dell'area utile interna
                    del tubo {recommendedConduitSize}.
                  </p>
                  <span className="text-[10px] text-emerald-500 font-semibold">
                    Conforme (Tiro cavo agevole &le; 40%)
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB CONTENT: VISUAL TREE (ALBERO DISTRIBUTIVO) */}
      {activeTab === 'tree' && (
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Network className="h-5 w-5 text-amber-400" />
                <span>Schema Unifilare Concettuale & Albero di Distribuzione</span>
              </h3>
              <p className="text-xs text-slate-400">
                Topologia dell'alimentazione dal punto di consegna del Gestore di Rete (HAK) ai quadri terminali.
              </p>
            </div>
          </div>

          <div className="space-y-6 text-xs">
            {/* Livello 0: Rete e HAK */}
            <div className="flex flex-col items-center">
              <div className="p-3 rounded-xl bg-slate-950 border-2 border-slate-700 text-center shadow-lg w-72">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Rete Elettrica di Distribuzione (DSO)
                </span>
                <p className="text-white font-mono font-bold mt-0.5">400 V Trifase • 50 Hz</p>
              </div>

              <div className="h-6 w-0.5 bg-slate-700"></div>

              {/* HAK Box */}
              <div className="p-4 rounded-2xl bg-amber-950/40 border-2 border-amber-500/80 text-center shadow-xl w-80 relative">
                <span className="inline-block px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[10px] uppercase mb-1">
                  HAK (Cassetta di Introduzione)
                </span>
                <p className="text-lg font-mono font-extrabold text-white">
                  In = {nominalProtectionRatingIn} A
                </p>
                <p className="text-[11px] text-amber-300">
                  Ib = {designCurrentIb} A • {protectionType}
                </p>
              </div>

              <div className="h-8 w-0.5 bg-amber-500/60 relative flex items-center justify-center">
                <span className="absolute bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-300 font-mono">
                  Cu 5G{recommendedCableSectionMm2} mm² • {recommendedConduitSize}
                </span>
              </div>

              {/* HVD Box (Quadro Generale) */}
              <div className="p-4 rounded-2xl bg-indigo-950/50 border-2 border-indigo-500/80 text-center shadow-xl w-96">
                <span className="inline-block px-2 py-0.5 rounded bg-indigo-500 text-white font-bold text-[10px] uppercase mb-1">
                  HVD / QGI (Quadro Generale Principale)
                </span>
                <p className="text-sm font-bold text-white">
                  Potenza di Progetto: {totalSimultaneousActivePowerKw} kW ({totalSimultaneousApparentPowerKva} kVA)
                </p>
                <p className="text-[11px] text-indigo-300">
                  ΔU totale calcolata: {voltageDropPercent}%
                </p>
              </div>
            </div>

            {/* Rami in Parallelo */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Ramo Blocchi Alloggi */}
              {apartmentsSummary && (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-amber-400 font-bold">
                    <Layers className="h-4 w-4" />
                    <span>Montanti Alloggi</span>
                  </div>
                  <p className="text-slate-300">
                    {apartmentsSummary.totalApartments} appartamenti (ks = {apartmentsSummary.ksCurveValue})
                  </p>
                  <p className="text-slate-400 font-mono text-[11px]">
                    Potenza: {apartmentsSummary.simultaneousPowerAptKw} kW
                  </p>
                  <div className="pt-2 border-t border-slate-800 text-[11px] space-y-1">
                    {apartmentsSummary.blocksDetails.map((b) => (
                      <div key={b.blockId} className="flex justify-between text-slate-400">
                        <span>{b.blockName}:</span>
                        <span className="font-mono text-white">In {b.recommendedIn}A • 5x{b.feederSectionMm2}mm²</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ramo Padronale / Servizi Comuni */}
              {commonServicesSummary && (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-indigo-400 font-bold">
                    <Activity className="h-4 w-4" />
                    <span>Servizi Generali / Padronale</span>
                  </div>
                  <p className="text-slate-300">
                    PAC, Ascensore, Ausiliari (+ riserva)
                  </p>
                  <p className="text-slate-400 font-mono text-[11px]">
                    Potenza: {commonServicesSummary.withReserveKw} kW
                  </p>
                  <p className="text-slate-400 font-mono text-[11px]">
                    Corrente d'impiego: {commonServicesSummary.currentA} A
                  </p>
                </div>
              )}

              {/* Ramo Ricarica EV */}
              {evSummary && (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                    <Cpu className="h-4 w-4" />
                    <span>Quadro Ricarica EV</span>
                  </div>
                  <p className="text-slate-300">
                    Gestione Carichi con Peak Shaving
                  </p>
                  <p className="text-slate-400 font-mono text-[11px]">
                    Domanda attiva: {evSummary.activeDemandKw} kW (Ib: {evSummary.currentA} A)
                  </p>
                </div>
              )}

              {/* Ramo Fotovoltaico / RCP */}
              {pvSummary && (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-amber-400 font-bold">
                    <Sun className="h-4 w-4" />
                    <span>Inverter FV & RCP / ZEV</span>
                  </div>
                  <p className="text-slate-300">
                    {pvSummary.peakPowerKwp} kWp • {pvSummary.inverterPowerKva} kVA
                  </p>
                  <p className="text-slate-400 font-mono text-[11px]">
                    Corrente immissione: {pvSummary.maxInfeedCurrentA} A
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: MONTANTI ALLOGGI (RESIDENZIALE) */}
      {activeTab === 'blocks' && apartmentsSummary && (
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg overflow-x-auto">
          <h3 className="text-sm font-bold text-white mb-4">
            Dettaglio Montanti per Blocco e Singolo Alloggio
          </h3>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3">Blocco / Scala</th>
                <th className="pb-3">N. Alloggi</th>
                <th className="pb-3">Corrente Ib (A)</th>
                <th className="pb-3">Protezione In (A)</th>
                <th className="pb-3">Sezione Montante Cu</th>
                <th className="pb-3">Tubo KRFWG</th>
                <th className="pb-3">Caduta ΔU%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {apartmentsSummary.blocksDetails.map((b) => (
                <tr key={b.blockId} className="hover:bg-slate-950/50">
                  <td className="py-2.5 font-sans font-semibold text-white">{b.blockName}</td>
                  <td className="py-2.5 text-slate-300">{b.apartmentsCount} alloggi</td>
                  <td className="py-2.5 text-amber-400 font-bold">{b.blockIb} A</td>
                  <td className="py-2.5 text-emerald-400 font-bold">{b.recommendedIn} A</td>
                  <td className="py-2.5 text-slate-200">5G{b.feederSectionMm2} mm²</td>
                  <td className="py-2.5 text-indigo-400">{b.feederConduit}</td>
                  <td className="py-2.5 text-slate-300">{b.feederVoltageDropPercent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT: FORMULE NIBT APPLICATE */}
      {activeTab === 'formulas' && (
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-white">
            Sviluppo Analitico delle Formule Elettrotecniche (NIBT / SIA)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.stepByStepFormulas.map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400">{step.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {step.nibtRef}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">{step.description}</p>
                <div className="p-2.5 rounded-lg bg-slate-900 font-mono text-[11px] text-slate-200 overflow-x-auto border border-slate-800">
                  {step.formula}
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80">
                  <span className="text-slate-400">Risultato:</span>
                  <span className="font-mono font-bold text-emerald-400">{step.result}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
