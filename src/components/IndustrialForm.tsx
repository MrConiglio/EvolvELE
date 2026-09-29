import {
  Factory,
  Plus,
  Trash2,
  ShieldCheck,
  Cpu,
  Activity,
} from 'lucide-react';
import type {
  IndustrialProjectData,
  IndustrialLoadItem,
} from '../types/electrical';

interface IndustrialFormProps {
  data: IndustrialProjectData;
  onChange: (updated: IndustrialProjectData) => void;
}

export const IndustrialForm = ({ data, onChange }: IndustrialFormProps) => {
  const handleAddLoad = () => {
    const newLoad: IndustrialLoadItem = {
      id: `load-${Date.now()}`,
      name: `Nuova Linea / Macchinario ${data.loads.length + 1}`,
      category: 'production',
      nominalPowerKw: 25,
      cosPhi: 0.85,
      utilizationFactorKu: 0.8,
      simultaneityFactorKs: 0.75,
    };
    onChange({
      ...data,
      loads: [...data.loads, newLoad],
    });
  };

  const handleRemoveLoad = (id: string) => {
    if (data.loads.length <= 1) return;
    onChange({
      ...data,
      loads: data.loads.filter((l) => l.id !== id),
    });
  };

  const handleUpdateLoad = (id: string, updates: Partial<IndustrialLoadItem>) => {
    onChange({
      ...data,
      loads: data.loads.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    });
  };

  const totalInstalledKw = data.loads.reduce((sum, l) => sum + l.nominalPowerKw, 0);

  return (
    <div className="space-y-6">
      
      {/* 1. QUADRO CARICHI INDUSTRIALI */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-800 gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Factory className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Macchinari & Linee di Produzione Industriale
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-indigo-400 border border-slate-700 font-mono">
                  {totalInstalledKw.toFixed(1)} kW installati
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Inserimento carichi con fattori di utilizzazione (ku), contemporaneità (ks) e sfasamento (cosφ).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddLoad}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition self-start sm:self-auto"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Aggiungi Linea / Macchina</span>
          </button>
        </div>

        {/* Tabella / Elenco Carichi */}
        <div className="mt-4 space-y-3">
          {data.loads.map((load, idx) => (
            <div
              key={load.id}
              className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-xs"
            >
              {/* Nome & Categoria */}
              <div className="sm:col-span-4 flex items-center space-x-2">
                <span className="w-5 h-5 rounded bg-slate-800 text-slate-400 flex items-center justify-center font-mono text-[11px] font-bold">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <input
                    type="text"
                    value={load.name}
                    onChange={(e) => handleUpdateLoad(load.id, { name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white font-semibold focus:outline-none focus:border-indigo-500"
                  />
                  <select
                    value={load.category}
                    onChange={(e) =>
                      handleUpdateLoad(load.id, {
                        category: e.target.value as IndustrialLoadItem['category'],
                      })
                    }
                    className="mt-1 w-full bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 rounded px-1.5 py-0.5"
                  >
                    <option value="production">Produzione / Lavorazione meccanica</option>
                    <option value="motor">Motori / Pompe / Compressori</option>
                    <option value="hvac">HVAC / Trattamento Aria / Forni</option>
                    <option value="lighting">Illuminazione Industriale / DALI</option>
                    <option value="it_office">CED / Server / Uffici</option>
                    <option value="auxiliary">Servizi Ausiliari / Carrelli</option>
                  </select>
                </div>
              </div>

              {/* Potenza Nominale kW */}
              <div className="sm:col-span-2">
                <label className="block text-[10px] text-slate-400 mb-0.5">Potenza (P)</label>
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded px-2 py-1">
                  <input
                    type="number"
                    min={0.5}
                    step={1}
                    value={load.nominalPowerKw}
                    onChange={(e) =>
                      handleUpdateLoad(load.id, {
                        nominalPowerKw: Math.max(0.1, parseFloat(e.target.value) || 0.1),
                      })
                    }
                    className="bg-transparent text-white font-bold w-full focus:outline-none"
                  />
                  <span className="text-slate-500 text-[11px]">kW</span>
                </div>
              </div>

              {/* Fattore ku */}
              <div className="sm:col-span-2">
                <label className="block text-[10px] text-slate-400 mb-0.5">Utilizzo (ku)</label>
                <input
                  type="number"
                  min={0.1}
                  max={1.0}
                  step={0.05}
                  value={load.utilizationFactorKu}
                  onChange={(e) =>
                    handleUpdateLoad(load.id, {
                      utilizationFactorKu: Math.min(
                        1,
                        Math.max(0.1, parseFloat(e.target.value) || 0.8)
                      ),
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white font-semibold focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Fattore ks */}
              <div className="sm:col-span-2">
                <label className="block text-[10px] text-slate-400 mb-0.5">Contemporaneità (ks)</label>
                <input
                  type="number"
                  min={0.1}
                  max={1.0}
                  step={0.05}
                  value={load.simultaneityFactorKs}
                  onChange={(e) =>
                    handleUpdateLoad(load.id, {
                      simultaneityFactorKs: Math.min(
                        1,
                        Math.max(0.1, parseFloat(e.target.value) || 0.75)
                      ),
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white font-semibold focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* cosPhi & Remove */}
              <div className="sm:col-span-2 flex items-center space-x-2">
                <div className="flex-1">
                  <label className="block text-[10px] text-slate-400 mb-0.5">cosφ</label>
                  <input
                    type="number"
                    min={0.5}
                    max={1.0}
                    step={0.01}
                    value={load.cosPhi}
                    onChange={(e) =>
                      handleUpdateLoad(load.id, {
                        cosPhi: Math.min(1.0, Math.max(0.5, parseFloat(e.target.value) || 0.85)),
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>
                {data.loads.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveLoad(load.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition self-end mb-0.5"
                    title="Elimina linea"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Riserva Espansione Futura Industriale */}
        <div className="mt-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            <span className="font-bold text-slate-200">Riserva di Potenza Futura Stabilimento</span>
            <p className="text-slate-400 text-[11px]">
              Margine di espansione per futuri macchinari o ampliamento linee produttive (consigliato 20%).
            </p>
          </div>
          <div className="flex items-center space-x-3 w-full sm:w-64">
            <input
              type="range"
              min={0}
              max={50}
              step={5}
              value={data.expansionReservePercent}
              onChange={(e) =>
                onChange({
                  ...data,
                  expansionReservePercent: parseInt(e.target.value) || 0,
                })
              }
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <span className="font-bold text-indigo-400 min-w-[40px] text-right">
              {data.expansionReservePercent}%
            </span>
          </div>
        </div>
      </div>

      {/* 2. RIFASAMENTO INDUSTRIALE & MOBILITÀ/FV */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Rifasamento (PFC) */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Quadro Rifasamento Automatico (PFC)</h3>
                <p className="text-[11px] text-slate-400">Compensazione energia reattiva penale gestore</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={data.hasPfcCorrection}
                onChange={(e) =>
                  onChange({
                    ...data,
                    hasPfcCorrection: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {data.hasPfcCorrection && (
            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Target cosφ Desiderato (Rifasato)</label>
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5">
                  <input
                    type="number"
                    min={0.9}
                    max={0.99}
                    step={0.01}
                    value={data.targetCosPhi}
                    onChange={(e) =>
                      onChange({
                        ...data,
                        targetCosPhi: Math.min(0.99, Math.max(0.9, parseFloat(e.target.value) || 0.95)),
                      })
                    }
                    className="bg-transparent text-white font-bold w-full focus:outline-none"
                  />
                  <span className="text-slate-500">standard: 0.95</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  I distributori svizzeri (AIL, SES, BKW, EKZ) richiedono cosφ ≥ 0.92 per evitare penali in bolletta.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* EV & FV Industriale */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Flotta Aziendale EV & Tetto Solare FV</h3>
                <p className="text-[11px] text-slate-400">Integrazione transizione energetica per capannoni</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 font-medium">Colonnine EV</span>
                <input
                  type="checkbox"
                  checked={data.evCharging.enabled}
                  onChange={(e) =>
                    onChange({
                      ...data,
                      evCharging: { ...data.evCharging, enabled: e.target.checked },
                    })
                  }
                  className="accent-emerald-500"
                />
              </div>
              {data.evCharging.enabled && (
                <div className="space-y-1.5">
                  <input
                    type="number"
                    min={1}
                    value={data.evCharging.stationCount}
                    onChange={(e) =>
                      onChange({
                        ...data,
                        evCharging: {
                          ...data.evCharging,
                          stationCount: Math.max(1, parseInt(e.target.value) || 1),
                        },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white font-bold"
                  />
                  <span className="text-[10px] text-slate-500">Wallbox 22 kW</span>
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 font-medium">Impianto FV Capannone</span>
                <input
                  type="checkbox"
                  checked={data.photovoltaic.enabled}
                  onChange={(e) =>
                    onChange({
                      ...data,
                      photovoltaic: { ...data.photovoltaic, enabled: e.target.checked },
                    })
                  }
                  className="accent-amber-500"
                />
              </div>
              {data.photovoltaic.enabled && (
                <div className="space-y-1.5">
                  <input
                    type="number"
                    min={1}
                    value={data.photovoltaic.inverterPowerKva}
                    onChange={(e) =>
                      onChange({
                        ...data,
                        photovoltaic: {
                          ...data.photovoltaic,
                          inverterPowerKva: Math.max(1, parseFloat(e.target.value) || 1),
                        },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white font-bold"
                  />
                  <span className="text-[10px] text-slate-500">kVA Inverter</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. PARAMETRI DI POSA LINEA PRINCIPALE INDUSTRIALE */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Dorsale Principale Cabina MT/BT &rarr; Quadro Generale Industriale (QGI)
            </h2>
            <p className="text-xs text-slate-400">
              Posa cavi di potenza, verifica termica NIBT 5.2 e tolleranze di caduta di tensione.
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <label className="block text-slate-400 mb-1 font-medium">Lunghezza Dorsale</label>
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5">
              <input
                type="number"
                min={1}
                max={500}
                value={data.serviceCableLengthM}
                onChange={(e) =>
                  onChange({
                    ...data,
                    serviceCableLengthM: Math.max(1, parseFloat(e.target.value) || 1),
                  })
                }
                className="bg-transparent text-white font-bold w-full focus:outline-none"
              />
              <span className="text-slate-500">m</span>
            </div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <label className="block text-slate-400 mb-1 font-medium">Metodo di Posa</label>
            <select
              value={data.installationMethod}
              onChange={(e) =>
                onChange({
                  ...data,
                  installationMethod: e.target.value as 'B1' | 'B2' | 'C' | 'E',
                })
              }
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white font-semibold focus:outline-none"
            >
              <option value="E">E: Passerella forata orizzontale (Tipico ind.)</option>
              <option value="C">C: Fissato a parete/canale chiuso</option>
              <option value="B2">B2: In tubo interrato / soletta</option>
              <option value="B1">B1: In tubo protettivo</option>
            </select>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <label className="block text-slate-400 mb-1 font-medium">Temp. Ambiente Capannone</label>
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5">
              <input
                type="number"
                min={15}
                max={55}
                value={data.ambientTempC}
                onChange={(e) =>
                  onChange({
                    ...data,
                    ambientTempC: parseInt(e.target.value) || 30,
                  })
                }
                className="bg-transparent text-white font-bold w-full focus:outline-none"
              />
              <span className="text-slate-500">°C</span>
            </div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <label className="block text-slate-400 mb-1 font-medium">Max Caduta Ammessa (ΔU%)</label>
            <select
              value={data.maxAllowedVoltageDropPercent}
              onChange={(e) =>
                onChange({
                  ...data,
                  maxAllowedVoltageDropPercent: parseFloat(e.target.value) || 2.0,
                })
              }
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white font-semibold focus:outline-none"
            >
              <option value={1.5}>1.5% (Severo)</option>
              <option value={2.0}>2.0% (Standard industriale)</option>
              <option value={3.0}>3.0% (Massimo tollerabile NIBT)</option>
            </select>
          </div>
        </div>
      </div>

    </div>
  );
};
