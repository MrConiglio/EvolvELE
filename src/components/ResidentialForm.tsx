import {
  Building,
  Plus,
  Trash2,
  Cpu,
  Sun,
  ShieldCheck,
  Layers,
  Store,
} from 'lucide-react';
import type {
  ResidentialProjectData,
  ApartmentBlock,
  BlockType,
} from '../types/electrical';

interface ResidentialFormProps {
  data: ResidentialProjectData;
  onChange: (updated: ResidentialProjectData) => void;
}

// Tabella professionale standard svizzera: In commerciale -> Sezione Cu consigliata
function getMinSectionForCommercialIn(inAmps: number): number {
  if (inAmps <= 25) return 6;
  if (inAmps <= 32) return 10;
  if (inAmps <= 63) return 16;  // Per 63A standard svizzero: 5x16 mm²
  if (inAmps <= 80) return 25;
  if (inAmps <= 100) return 35;
  if (inAmps <= 125) return 50;
  if (inAmps <= 160) return 70;
  if (inAmps <= 200) return 95;
  return 120;
}

// Tabella inversa: Sezione Cu -> In commerciale compatibile
function getCommercialInForSection(sectionMm2: number): number {
  if (sectionMm2 <= 6) return 25;
  if (sectionMm2 <= 10) return 32;
  if (sectionMm2 <= 16) return 63;  // 5x16 mm² -> 63A
  if (sectionMm2 <= 25) return 80;
  if (sectionMm2 <= 35) return 100;
  if (sectionMm2 <= 50) return 125;
  if (sectionMm2 <= 70) return 160;
  if (sectionMm2 <= 95) return 200;
  return 250;
}

export const ResidentialForm = ({ data, onChange }: ResidentialFormProps) => {
  const handleAddBlock = (blockType: BlockType = 'residential') => {
    const newIndex = data.blocks.length + 1;
    const isCommercial = blockType === 'commercial';
    const initialIn = 63;
    const newBlock: ApartmentBlock = {
      id: `block-${Date.now()}`,
      name: isCommercial ? `Negozio / Commerciale ${newIndex}` : `Blocco ${String.fromCharCode(64 + newIndex)}`,
      blockType: blockType,
      apartmentsCount: isCommercial ? 0 : 6,
      apartmentBreakerA: isCommercial ? initialIn : 25,
      feederSectionMm2: isCommercial ? getMinSectionForCommercialIn(initialIn) : 6,
      feederLengthM: 15,
      cosPhi: 0.95,
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
      blocks: data.blocks.map((b) => {
        if (b.id !== id) return b;
        
        const updated = { ...b, ...updates };

        if (updated.blockType === 'commercial') {
          if ('apartmentBreakerA' in updates && updates.apartmentBreakerA !== b.apartmentBreakerA) {
            const newIn = updates.apartmentBreakerA || 63;
            updated.feederSectionMm2 = getMinSectionForCommercialIn(newIn);
          } else if ('feederSectionMm2' in updates && updates.feederSectionMm2 !== b.feederSectionMm2) {
            const newSec = updates.feederSectionMm2 || 16;
            updated.apartmentBreakerA = getCommercialInForSection(newSec);
          }
        }

        return updated;
      }),
    });
  };

  const handleUpdateCommon = (field: keyof typeof data.commonServices, value: number) => {
    onChange({
      ...data,
      commonServices: {
        ...data.commonServices,
        [field]: value,
      },
    });
  };

  const totalAptCount = data.blocks.reduce((sum, b) => sum + (b.blockType !== 'commercial' ? b.apartmentsCount : 0), 0);

  return (
    <div className="space-y-6">
      
      {/* 1. SEZIONE BLOCCHI, SCALE & UNITÀ COMMERCIALI */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-800 gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Struttura Edificio, Scale & Unità Commerciali
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700 font-mono">
                  {totalAptCount} alloggi totali
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Gestione blocchi residenziali e unità commerciali con sezioni standard professionali svizzere.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => handleAddBlock('residential')}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
            >
              <Plus className="h-4 w-4" />
              <span>Blocco Apt</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddBlock('commercial')}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition"
            >
              <Store className="h-4 w-4" />
              <span>Unità Commerciale</span>
            </button>
          </div>
        </div>

        {/* Lista Blocchi / Unità */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.blocks.map((block, idx) => {
            const isCommercial = block.blockType === 'commercial';
            return (
              <div
                key={block.id}
                className={`p-4 rounded-xl border transition relative ${
                  isCommercial 
                    ? 'bg-indigo-950/30 border-indigo-900/50 hover:border-indigo-700' 
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-md font-mono text-xs flex items-center justify-center font-bold ${
                      isCommercial ? 'bg-indigo-900 text-indigo-200' : 'bg-slate-800 text-slate-300'
                    }`}>
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
                  {/* Tipologia */}
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Tipologia</label>
                    <select
                      value={block.blockType || 'residential'}
                      onChange={(e) => {
                        const newType = e.target.value as BlockType;
                        const defIn = 63;
                        handleUpdateBlock(block.id, {
                          blockType: newType,
                          apartmentBreakerA: newType === 'commercial' ? defIn : 25,
                          feederSectionMm2: newType === 'commercial' ? getMinSectionForCommercialIn(defIn) : 6,
                        });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white font-semibold focus:outline-none focus:border-amber-500"
                    >
                      <option value="residential">Residenziale (Appartamenti)</option>
                      <option value="commercial">Unità Commerciale / Negozio</option>
                    </select>
                  </div>

                  {/* N. Appartamenti OPPURE Protezione Principale In */}
                  {!isCommercial ? (
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
                  ) : (
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium text-indigo-300">
                        Protezione Principale (In)
                      </label>
                      <select
                        value={block.apartmentBreakerA || 63}
                        onChange={(e) =>
                          handleUpdateBlock(block.id, {
                            apartmentBreakerA: parseInt(e.target.value) || 63,
                          })
                        }
                        className="w-full bg-slate-900 border border-indigo-900/80 rounded-lg px-2 py-1.5 text-indigo-200 font-bold focus:outline-none focus:border-indigo-500"
                      >
                        <option value={25}>25 A</option>
                        <option value={32}>32 A</option>
                        <option value={40}>40 A</option>
                        <option value={50}>50 A</option>
                        <option value={63}>63 A (Standard Comm.)</option>
                        <option value={80}>80 A</option>
                        <option value={100}>100 A</option>
                        <option value={125}>125 A</option>
                        <option value={160}>160 A (MCCB)</option>
                        <option value={200}>200 A (MCCB)</option>
                        <option value={250}>250 A (MCCB)</option>
                      </select>
                    </div>
                  )}

                  {/* Sezione Montante Cu */}
                  <div className="col-span-2 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 text-xs">Sezione Montante Cu:</span>
                      <span className="ml-2 font-mono font-bold text-amber-400 text-xs">
                        {isCommercial ? 'Bidirezionale In &harr; Iz' : 'Calcolata da Ks'}
                      </span>
                    </div>
                    <select
                      value={block.feederSectionMm2 || 6}
                      onChange={(e) => handleUpdateBlock(block.id, { feederSectionMm2: parseFloat(e.target.value) || 6 })}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1 text-white font-mono font-bold text-xs focus:outline-none focus:border-amber-500"
                    >
                      <option value={6}>5x6 mm²</option>
                      <option value={10}>5x10 mm²</option>
                      <option value={16}>5x16 mm²</option>
                      <option value={25}>5x25 mm²</option>
                      <option value={35}>5x35 mm²</option>
                      <option value={50}>5x50 mm²</option>
                      <option value={70}>5x70 mm²</option>
                      <option value={95}>5x95 mm²</option>
                      <option value={120}>5x120 mm²</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
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
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <label className="block text-slate-400 mb-1 font-medium">Pompa di Calore (PAC)</label>
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5">
              <input
                type="number"
                min={0}
                step={0.5}
                value={data.commonServices.heatPumpKw}
                onChange={(e) => handleUpdateCommon('heatPumpKw', Math.max(0, parseFloat(e.target.value) || 0))}
                className="bg-transparent text-white font-bold w-full focus:outline-none"
              />
              <span className="text-slate-500">kW</span>
            </div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <label className="block text-slate-400 mb-1 font-medium">Riscaldatore Ausil. PAC</label>
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5">
              <input
                type="number"
                min={0}
                step={0.5}
                value={data.commonServices.heatPumpAuxHeaterKw}
                onChange={(e) => handleUpdateCommon('heatPumpAuxHeaterKw', Math.max(0, parseFloat(e.target.value) || 0))}
                className="bg-transparent text-white font-bold w-full focus:outline-none"
              />
              <span className="text-slate-500">kW</span>
            </div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <label className="block text-slate-400 mb-1 font-medium">Ascensore (Trazione)</label>
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5">
              <input
                type="number"
                min={0}
                step={0.5}
                value={data.commonServices.liftKw}
                onChange={(e) => handleUpdateCommon('liftKw', Math.max(0, parseFloat(e.target.value) || 0))}
                className="bg-transparent text-white font-bold w-full focus:outline-none"
              />
              <span className="text-slate-500">kW</span>
            </div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <label className="block text-slate-400 mb-1 font-medium">Illuminazione LED</label>
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5">
              <input
                type="number"
                min={0}
                step={0.1}
                value={data.commonServices.lightingKw}
                onChange={(e) => handleUpdateCommon('lightingKw', Math.max(0, parseFloat(e.target.value) || 0))}
                className="bg-transparent text-white font-bold w-full focus:outline-none"
              />
              <span className="text-slate-500">kW</span>
            </div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <label className="block text-slate-400 mb-1 font-medium">Pompe / Autoclave</label>
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5">
              <input
                type="number"
                min={0}
                step={0.1}
                value={data.commonServices.pumpsKw}
                onChange={(e) => handleUpdateCommon('pumpsKw', Math.max(0, parseFloat(e.target.value) || 0))}
                className="bg-transparent text-white font-bold w-full focus:outline-none"
              />
              <span className="text-slate-500">kW</span>
            </div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <label className="block text-slate-400 mb-1 font-medium">Ventilazione (VMC)</label>
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5">
              <input
                type="number"
                min={0}
                step={0.1}
                value={data.commonServices.ventilationKw}
                onChange={(e) => handleUpdateCommon('ventilationKw', Math.max(0, parseFloat(e.target.value) || 0))}
                className="bg-transparent text-white font-bold w-full focus:outline-none"
              />
              <span className="text-slate-500">kW</span>
            </div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <label className="block text-slate-400 mb-1 font-medium">Prese Servizio & Cancello</label>
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5">
              <input
                type="number"
                min={0}
                step={0.5}
                value={data.commonServices.miscellaneousKw}
                onChange={(e) => handleUpdateCommon('miscellaneousKw', Math.max(0, parseFloat(e.target.value) || 0))}
                className="bg-transparent text-white font-bold w-full focus:outline-none"
              />
              <span className="text-slate-500">kW</span>
            </div>
          </div>

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
          </div>
        </div>
      </div>

      {/* 3. EV & FOTOVOLTAICO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Ricarica Veicoli Elettrici (EV)</h3>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={data.evCharging.enabled}
                onChange={(e) => onChange({ ...data, evCharging: { ...data.evCharging, enabled: e.target.checked } })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
          {data.evCharging.enabled && (
            <div className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">N. Stazioni</label>
                  <input
                    type="number"
                    min={1}
                    value={data.evCharging.stationCount}
                    onChange={(e) => onChange({ ...data, evCharging: { ...data.evCharging, stationCount: parseInt(e.target.value) || 1 } })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Potenza Wallbox</label>
                  <select
                    value={data.evCharging.stationPowerKw}
                    onChange={(e) => onChange({ ...data, evCharging: { ...data.evCharging, stationPowerKw: parseFloat(e.target.value) || 11 } })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-semibold"
                  >
                    <option value={11}>11 kW</option>
                    <option value={22}>22 kW</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Sun className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Fotovoltaico (FV) & RCP</h3>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={data.photovoltaic.enabled}
                onChange={(e) => onChange({ ...data, photovoltaic: { ...data.photovoltaic, enabled: e.target.checked } })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>
          {data.photovoltaic.enabled && (
            <div className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Potenza Picco (kWp)</label>
                  <input
                    type="number"
                    min={1}
                    value={data.photovoltaic.peakPowerKwp}
                    onChange={(e) => onChange({ ...data, photovoltaic: { ...data.photovoltaic, peakPowerKwp: parseFloat(e.target.value) || 0 } })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Inverter (kVA)</label>
                  <input
                    type="number"
                    min={1}
                    value={data.photovoltaic.inverterPowerKva}
                    onChange={(e) => onChange({ ...data, photovoltaic: { ...data.photovoltaic, inverterPowerKva: parseFloat(e.target.value) || 0 } })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-bold"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. PARAMETRI DI POSA LINEA PRINCIPALE */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Parametri Linea di Allacciamento Generale (HAK &rarr; HVD)</h2>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <label className="block text-slate-400 mb-1 font-medium">Lunghezza Allacciamento (m)</label>
            <input
              type="number"
              min={1}
              value={data.serviceCableLengthM}
              onChange={(e) => onChange({ ...data, serviceCableLengthM: parseFloat(e.target.value) || 15 })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-bold"
            />
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <label className="block text-slate-400 mb-1 font-medium">Metodo di Posa NIBT</label>
            <select
              value={data.installationMethod}
              onChange={(e) => onChange({ ...data, installationMethod: e.target.value as 'B1' | 'B2' | 'C' | 'E' })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white font-semibold"
            >
              <option value="B2">B2: In tubo in soletta</option>
              <option value="B1">B1: In tubo in parete isolante</option>
              <option value="C">C: Fissato a parete</option>
              <option value="E">E: Passerella in aria</option>
            </select>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <label className="block text-slate-400 mb-1 font-medium">Caduta Max Ammessa (ΔU%)</label>
            <select
              value={data.maxAllowedVoltageDropPercent}
              onChange={(e) => onChange({ ...data, maxAllowedVoltageDropPercent: parseFloat(e.target.value) || 1.5 })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white font-semibold"
            >
              <option value={1.0}>1.0%</option>
              <option value={1.5}>1.5% (SIA 380)</option>
              <option value={2.0}>2.0%</option>
            </select>
          </div>
        </div>
      </div>

    </div>
  );
};