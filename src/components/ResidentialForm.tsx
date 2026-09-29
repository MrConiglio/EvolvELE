import {
  Building,
  Plus,
  Trash2,
  Cpu,
  Sun,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import type {
  ResidentialProjectData,
  ApartmentBlock,
  LoadManagementType,
} from '../types/electrical';

interface ResidentialFormProps {
  data: ResidentialProjectData;
  onChange: (updated: ResidentialProjectData) => void;
}

export const ResidentialForm = ({ data, onChange }: ResidentialFormProps) => {
  // Handlers per blocchi
  const handleAddBlock = () => {
    const newIndex = data.blocks.length + 1;
    const newBlock: ApartmentBlock = {
      id: `block-${Date.now()}`,
      name: `Blocco ${String.fromCharCode(64 + newIndex)}`,
      apartmentsCount: 6,
      apartmentBreakerA: 25, // Default NIBT 25A
      feederSectionMm2: 6, // Default 5x6 mm²
      feederLengthM: 15,
      cosPhi: 0.98,
    };
    onChange({
      ...data,
      blocks: [...data.blocks, newBlock],
    });
  };

  const handleRemoveBlock = (id: string) => {
    if (data.blocks.length <= 1) return;
    onChange({
      ...data,
      blocks: data.blocks.filter((b) => b.id !== id),
    });
  };

  const handleUpdateBlock = (id: string, updates: Partial<ApartmentBlock>) => {
    onChange({
      ...data,
      blocks: data.blocks.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    });
  };

  // Handlers per parti comuni
  const handleUpdateCommon = (field: keyof typeof data.commonServices, value: number) => {
    onChange({
      ...data,
      commonServices: {
        ...data.commonServices,
        [field]: value,
      },
    });
  };

  const totalAptCount = data.blocks.reduce((sum, b) => sum + b.apartmentsCount, 0);

  return (
    <div className="space-y-6">
      
      {/* 1. SEZIONE BLOCCHI & ALLOGGI */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-800 gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Struttura Edificio & Appartamenti
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700 font-mono">
                  {totalAptCount} alloggi totali
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Default NIBT svizzero: Protezione 25 A per alloggio, montante 5x6 mm² Cu XLPE.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddBlock}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/10 transition self-start sm:self-auto"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Aggiungi Blocco / Scala</span>
          </button>
        </div>

        {/* Lista Blocchi */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.blocks.map((block, idx) => (
            <div
              key={block.id}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition relative"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-md bg-slate-800 text-slate-300 font-mono text-xs flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <input
                    type="text"
                    value={block.name}
                    onChange={(e) => handleUpdateBlock(block.id, { name: e.target.value })}
                    className="bg-transparent border-b border-dashed border-slate-700 hover:border-amber-400 text-white font-semibold text-sm focus:outline-none focus:border-amber-500 px-1"
                  />
                </div>
                {data.blocks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveBlock(block.id)}
                    className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition"
                    title="Rimuovi questo blocco"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* N. Alloggi */}
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">N. Appartamenti</label>
                  <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 focus-within:border-amber-500">
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={block.apartmentsCount}
                      onChange={(e) =>
                        handleUpdateBlock(block.id, {
                          apartmentsCount: Math.max(1, parseInt(e.target.value) || 1),
                        })
                      }
                      className="bg-transparent text-white font-bold w-full focus:outline-none"
                    />
                    <span className="text-slate-500 font-medium">apt</span>
                  </div>
                </div>

                {/* Taglia Interruttore Apt (Default 25A) */}
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">
                    Protezione Alloggio (In)
                  </label>
                  <select
                    value={block.apartmentBreakerA}
                    onChange={(e) =>
                      handleUpdateBlock(block.id, {
                        apartmentBreakerA: parseInt(e.target.value) || 25,
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white font-semibold focus:outline-none focus:border-amber-500"
                  >
                    <option value={25}>25 A (Default NIBT ~17 kW)</option>
                    <option value={32}>32 A (~22 kW)</option>
                    <option value={40}>40 A (~27 kW)</option>
                    <option value={50}>50 A (~35 kW)</option>
                  </select>
                </div>

                {/* Sezione Cavo Montante (Default 6 mm²) */}
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">
                    Sezione Montante Cu
                  </label>
                  <select
                    value={block.feederSectionMm2}
                    onChange={(e) =>
                      handleUpdateBlock(block.id, {
                        feederSectionMm2: parseFloat(e.target.value) || 6,
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white font-semibold focus:outline-none focus:border-amber-500 font-mono"
                  >
                    <option value={6}>5x6 mm² (Standard)</option>
                    <option value={10}>5x10 mm²</option>
                    <option value={16}>5x16 mm²</option>
                    <option value={25}>5x25 mm²</option>
                    <option value={35}>5x35 mm²</option>
                  </select>
                </div>

                {/* Lunghezza Montante (m) */}
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">
                    Lunghezza Montante
                  </label>
                  <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 focus-within:border-amber-500">
                    <input
                      type="number"
                      min={1}
                      max={150}
                      value={block.feederLengthM}
                      onChange={(e) =>
                        handleUpdateBlock(block.id, {
                          feederLengthM: Math.max(1, parseFloat(e.target.value) || 1),
                        })
                      }
                      className="bg-transparent text-white font-bold w-full focus:outline-none"
                    />
                    <span className="text-slate-500 font-medium">m</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. PARTE PADRONALE / SERVIZI GENERALI */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Servizi Generali / Parte Padronale (Parti Comuni)
            </h2>
            <p className="text-xs text-slate-400">
              Carichi tecnologici centralizzati dell'immobile e quota di riserva per espansioni future.
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
          {/* Pompa di Calore (PAC) */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <label className="block text-slate-400 mb-1 font-medium">
              Pompa di Calore (PAC)
            </label>
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5">
              <input
                type="number"
                min={0}
                step={0.5}
                value={data.commonServices.heatPumpKw}
                onChange={(e) =>
                  handleUpdateCommon('heatPumpKw', Math.max(0, parseFloat(e.target.value) || 0))
                }
                className="bg-transparent text-white font-bold w-full focus:outline-none"
              />
              <span className="text-slate-500">kW</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Compreso compressore</span>
          </div>

          {/* Riscaldatore Elettrico Ausiliario PAC */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <label className="block text-slate-400 mb-1 font-medium">
              Riscaldatore Ausil. PAC
            </label>
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5">
              <input
                type="number"
                min={0}
                step={0.5}
                value={data.commonServices.heatPumpAuxHeaterKw}
                onChange={(e) =>
                  handleUpdateCommon(
                    'heatPumpAuxHeaterKw',
                    Math.max(0, parseFloat(e.target.value) || 0)
                  )
                }
                className="bg-transparent text-white font-bold w-full focus:outline-none"
              />
              <span className="text-slate-500">kW</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Resistenza d'emergenza</span>
          </div>

          {/* Ascensore */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <label className="block text-slate-400 mb-1 font-medium">Ascensore (Trazione)</label>
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5">
              <input
                type="number"
                min={0}
                step={0.5}
                value={data.commonServices.liftKw}
                onChange={(e) =>
                  handleUpdateCommon('liftKw', Math.max(0, parseFloat(e.target.value) || 0))
                }
                className="bg-transparent text-white font-bold w-full focus:outline-none"
              />
              <span className="text-slate-500">kW</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Trazione elettrica / idr.</span>
          </div>

          {/* Illuminazione Parti Comuni */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <label className="block text-slate-400 mb-1 font-medium">Illuminazione LED</label>
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5">
              <input
                type="number"
                min={0}
                step={0.1}
                value={data.commonServices.lightingKw}
                onChange={(e) =>
                  handleUpdateCommon('lightingKw', Math.max(0, parseFloat(e.target.value) || 0))
                }
                className="bg-transparent text-white font-bold w-full focus:outline-none"
              />
              <span className="text-slate-500">kW</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Scale, garage, esterni</span>
          </div>

          {/* Pompe & Autoclave */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <label className="block text-slate-400 mb-1 font-medium">Pompe / Autoclave</label>
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5">
              <input
                type="number"
                min={0}
                step={0.1}
                value={data.commonServices.pumpsKw}
                onChange={(e) =>
                  handleUpdateCommon('pumpsKw', Math.max(0, parseFloat(e.target.value) || 0))
                }
                className="bg-transparent text-white font-bold w-full focus:outline-none"
              />
              <span className="text-slate-500">kW</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Circolatori e sollevamento</span>
          </div>

          {/* Ventilazione Meccanica */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <label className="block text-slate-400 mb-1 font-medium">Ventilazione (VMC / Autorimessa)</label>
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5">
              <input
                type="number"
                min={0}
                step={0.1}
                value={data.commonServices.ventilationKw}
                onChange={(e) =>
                  handleUpdateCommon('ventilationKw', Math.max(0, parseFloat(e.target.value) || 0))
                }
                className="bg-transparent text-white font-bold w-full focus:outline-none"
              />
              <span className="text-slate-500">kW</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Aerazione autorimessa/cantine</span>
          </div>

          {/* Prese di Servizio & Ausiliari */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <label className="block text-slate-400 mb-1 font-medium">Prese Servizio & Cancello</label>
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5">
              <input
                type="number"
                min={0}
                step={0.5}
                value={data.commonServices.miscellaneousKw}
                onChange={(e) =>
                  handleUpdateCommon('miscellaneousKw', Math.max(0, parseFloat(e.target.value) || 0))
                }
                className="bg-transparent text-white font-bold w-full focus:outline-none"
              />
              <span className="text-slate-500">kW</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Automazioni e prese CEE</span>
          </div>

          {/* Percentuale Riserva Futura */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-400 font-medium">Riserva Padronale (%)</label>
              <span className="font-bold text-amber-400">{data.commonServices.reservePercent}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              step={5}
              value={data.commonServices.reservePercent}
              onChange={(e) => handleUpdateCommon('reservePercent', parseInt(e.target.value) || 0)}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Raccomandato SIA 380: 20%</span>
          </div>
        </div>
      </div>

      {/* 3. MOBILITÀ ELETTRICA (EV) & FOTOVOLTAICO (FV/RCP) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* EV Charging */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Ricarica Veicoli Elettrici (EV)</h3>
                <p className="text-[11px] text-slate-400">NIBT 7.22 & Gestione Dinamica Carichi</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={data.evCharging.enabled}
                onChange={(e) =>
                  onChange({
                    ...data,
                    evCharging: { ...data.evCharging, enabled: e.target.checked },
                  })
                }
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {data.evCharging.enabled && (
            <div className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">N. Stazioni / Wallbox</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Potenza Wallbox</label>
                  <select
                    value={data.evCharging.stationPowerKw}
                    onChange={(e) =>
                      onChange({
                        ...data,
                        evCharging: {
                          ...data.evCharging,
                          stationPowerKw: parseFloat(e.target.value) || 11,
                        },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-semibold focus:outline-none focus:border-emerald-500"
                  >
                    <option value={11}>11 kW (16 A trifase - Standard)</option>
                    <option value={22}>22 kW (32 A trifase)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Gestione Carichi (LMS)</label>
                <select
                  value={data.evCharging.managementType}
                  onChange={(e) =>
                    onChange({
                      ...data,
                      evCharging: {
                        ...data.evCharging,
                        managementType: e.target.value as LoadManagementType,
                      },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-semibold focus:outline-none focus:border-emerald-500"
                >
                  <option value="dynamic">
                    Dinamica EMS (Consigliata NIBT - Peak Shaving ottimizzato)
                  </option>
                  <option value="static">Statica con limite prefissato (kW)</option>
                  <option value="none">Nessuna gestione (Simultaneità 100% - Sovradimensiona HAK)</option>
                </select>
              </div>

              {data.evCharging.managementType === 'static' && (
                <div>
                  <label className="block text-slate-400 mb-1">Limite Potenza Massima Fissa (kW)</label>
                  <input
                    type="number"
                    min={5}
                    value={data.evCharging.staticPowerCapKw || 22}
                    onChange={(e) =>
                      onChange({
                        ...data,
                        evCharging: {
                          ...data.evCharging,
                          staticPowerCapKw: Math.max(1, parseFloat(e.target.value) || 1),
                        },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Photovoltaic & RCP */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Sun className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Impianto Fotovoltaico (FV) & RCP / ZEV</h3>
                <p className="text-[11px] text-slate-400">Raggruppamento Consumo Proprio Svizzero</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={data.photovoltaic.enabled}
                onChange={(e) =>
                  onChange({
                    ...data,
                    photovoltaic: { ...data.photovoltaic, enabled: e.target.checked },
                  })
                }
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {data.photovoltaic.enabled && (
            <div className="mt-4 space-y-3 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-slate-300 font-medium">Costituzione RCP / ZEV</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.photovoltaic.hasRcp}
                    onChange={(e) =>
                      onChange({
                        ...data,
                        photovoltaic: { ...data.photovoltaic, hasRcp: e.target.checked },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Potenza di Picco Moduli</label>
                  <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5">
                    <input
                      type="number"
                      min={1}
                      step={0.5}
                      value={data.photovoltaic.peakPowerKwp}
                      onChange={(e) =>
                        onChange({
                          ...data,
                          photovoltaic: {
                            ...data.photovoltaic,
                            peakPowerKwp: Math.max(0, parseFloat(e.target.value) || 0),
                          },
                        })
                      }
                      className="bg-transparent text-white font-bold w-full focus:outline-none"
                    />
                    <span className="text-slate-500">kWp</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Potenza Inverter (kVA)</label>
                  <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5">
                    <input
                      type="number"
                      min={1}
                      step={0.5}
                      value={data.photovoltaic.inverterPowerKva}
                      onChange={(e) =>
                        onChange({
                          ...data,
                          photovoltaic: {
                            ...data.photovoltaic,
                            inverterPowerKva: Math.max(0, parseFloat(e.target.value) || 0),
                          },
                        })
                      }
                      className="bg-transparent text-white font-bold w-full focus:outline-none"
                    />
                    <span className="text-slate-500">kVA</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. PARAMETRI DI POSA LINEA PRINCIPALE (HAK -> HVD) */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Parametri Linea di Allacciamento Generale (HAK &rarr; HVD)
            </h2>
            <p className="text-xs text-slate-400">
              Condizioni di posa per il calcolo della portata termica corretta (Iz') e caduta di tensione massima ammissibile.
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          {/* Lunghezza linea HAK -> HVD */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <label className="block text-slate-400 mb-1 font-medium">Lunghezza Allacciamento</label>
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5">
              <input
                type="number"
                min={1}
                max={250}
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
            <span className="text-[10px] text-slate-500 mt-1 block">Distanza HAK al Quadro HVD</span>
          </div>

          {/* Metodo di Posa NIBT */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <label className="block text-slate-400 mb-1 font-medium">Metodo di Posa NIBT</label>
            <select
              value={data.installationMethod}
              onChange={(e) =>
                onChange({
                  ...data,
                  installationMethod: e.target.value as 'B1' | 'B2' | 'C' | 'E',
                })
              }
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white font-semibold focus:outline-none focus:border-blue-500"
            >
              <option value="B2">B2: In tubo in soletta/calcestruzzo (Tipico CH)</option>
              <option value="B1">B1: In tubo in parete isolante</option>
              <option value="C">C: Fissato direttamente a parete/soffitto</option>
              <option value="E">E: Passerella forata orizzontale in aria</option>
            </select>
            <span className="text-[10px] text-slate-500 mt-1 block">Rif. NIBT Tabella 5.2</span>
          </div>

          {/* Temperatura Ambiente */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <label className="block text-slate-400 mb-1 font-medium">Temperatura Ambiente</label>
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5">
              <input
                type="number"
                min={10}
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
            <span className="text-[10px] text-slate-500 mt-1 block">Rif. NIBT 5.2.5 (Default 30°C)</span>
          </div>

          {/* Limite Caduta di Tensione SIA */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <label className="block text-slate-400 mb-1 font-medium">Caduta Max Ammessa (ΔU%)</label>
            <select
              value={data.maxAllowedVoltageDropPercent}
              onChange={(e) =>
                onChange({
                  ...data,
                  maxAllowedVoltageDropPercent: parseFloat(e.target.value) || 1.5,
                })
              }
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white font-semibold focus:outline-none focus:border-blue-500"
            >
              <option value={1.0}>1.0% (Massima qualità HAK-HVD)</option>
              <option value={1.5}>1.5% (Standard raccomandato SIA 380)</option>
              <option value={2.0}>2.0% (Tratte lunghe)</option>
              <option value={3.0}>3.0% (Valore limite NIBT)</option>
            </select>
            <span className="text-[10px] text-slate-500 mt-1 block">Tratta montante principale</span>
          </div>
        </div>
      </div>

    </div>
  );
};
