import { useState } from 'react';
import {
  Zap,
  Building2,
  Factory,
  FileText,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import type { InstallationType } from '../types/electrical';

interface HeaderProps {
  installationType: InstallationType;
  onSelectType: (type: InstallationType) => void;
  projectName: string;
  engineerName: string;
  gridOperator: string;
  onUpdateProjectMeta: (field: string, value: string) => void;
  onPrintReport: () => void;
  onResetDefaults: () => void;
  onLoadExamplePreset: () => void;
}

export const Header = ({
  installationType,
  onSelectType,
  projectName,
  engineerName,
  gridOperator,
  onUpdateProjectMeta,
  onPrintReport,
  onResetDefaults,
  onLoadExamplePreset,
}: HeaderProps) => {
  const [showMetaModal, setShowMetaModal] = useState(false);

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-xl backdrop-blur-md bg-opacity-95 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Zap className="h-6 w-6 text-amber-400 fill-amber-400/20" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white font-mono">
                  Evolve<span className="text-amber-400">ELE</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-950/80 text-red-300 border border-red-800/60">
                  <span className="mr-1 text-[11px]">🇨🇭</span> NIBT / SIA
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
                  v2026.1
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Dimensionamento Elettrico Rapido Normato Svizzero
              </p>
            </div>
          </div>

          {/* Type Selector (Residenziale vs Industriale) */}
          <div className="flex items-center bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => onSelectType('residential')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                installationType === 'residential'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Building2 className="h-4 w-4" />
              <span>Residenziale (Alloggi)</span>
            </button>
            <button
              onClick={() => onSelectType('industrial')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                installationType === 'industrial'
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Factory className="h-4 w-4" />
              <span>Industriale (Carichi)</span>
            </button>
          </div>

          {/* Actions & Project Info */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={() => setShowMetaModal(!showMetaModal)}
              title="Dati del Progetto ed Ente Gestore"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
              <span className="truncate max-w-[120px]">{projectName || 'Dati Progetto'}</span>
            </button>

            <button
              onClick={onLoadExamplePreset}
              title="Carica dati di esempio completo"
              className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-amber-400 hover:text-amber-300 text-xs font-medium border border-amber-500/20 transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Esempio</span>
            </button>

            <button
              onClick={onResetDefaults}
              title="Ripristina valori iniziali"
              className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={onPrintReport}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition"
            >
              <FileText className="h-4 w-4" />
              <span>Report PDF</span>
            </button>
          </div>
        </div>

        {/* Modal Dati Progetto / Gestore Cantonale */}
        {showMetaModal && (
          <div className="mt-2 p-4 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fadeIn">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Nome del Progetto
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => onUpdateProjectMeta('projectName', e.target.value)}
                placeholder="es. Residenza Al Parco - Lugano"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Ingegnere / Progettista
              </label>
              <input
                type="text"
                value={engineerName}
                onChange={(e) => onUpdateProjectMeta('engineerName', e.target.value)}
                placeholder="es. Ing. E. Bianchi"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Gestore di Rete (DSO)
              </label>
              <select
                value={gridOperator}
                onChange={(e) => onUpdateProjectMeta('gridOperator', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="AIL (Aziende Industriali di Lugano)">AIL (Lugano - Ticino)</option>
                <option value="SES (Società Elettrica Sopracenerina)">SES (Sopraceneri - Ticino)</option>
                <option value="AMB (Aziende Municipalizzate Bellinzona)">AMB (Bellinzona)</option>
                <option value="AET (Azienda Elettrica Ticinese)">AET (Ticino)</option>
                <option value="BKW Energie AG">BKW (Berna / Soletta / Giura)</option>
                <option value="EKZ (Elektrizitätswerke des Kantons Zürich)">EKZ (Zurigo)</option>
                <option value="ewz (Elektrizitätswerk der Stadt Zürich)">ewz (Città di Zurigo / Grigioni)</option>
                <option value="CKW (Centralschweizerische Kraftwerke)">CKW (Svizzera Centrale)</option>
                <option value="SIG (Services Industriels de Genève)">SIG (Ginevra)</option>
                <option value="Romande Energie">Romande Energie (Vaud / Vallese)</option>
                <option value="Altro Gestore Cantonale">Altro Gestore Svizzero</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
