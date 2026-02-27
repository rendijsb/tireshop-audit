import { useState, useCallback, useRef, useEffect } from 'react';
import {
  ChevronDown,
  X,
  RotateCcw,
  Search,
  Snowflake,
  Sun,
  CloudSun,
  SlidersHorizontal,
  Tag,
  Gauge,
  Settings2,
} from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  count: number;
}

interface FilterSection {
  id: string;
  title: string;
  type: 'checkbox' | 'range' | 'pills';
  options?: FilterOption[];
  range?: { min: number; max: number };
}

interface FilterGroup {
  id: string;
  label: string;
  icon: React.ReactNode;
  sections: FilterSection[];
  defaultOpen: boolean;
}

const filterGroups: FilterGroup[] = [
  {
    id: 'primary',
    label: 'Pamatfiltri',
    icon: <SlidersHorizontal size={15} strokeWidth={2} />,
    defaultOpen: true,
    sections: [
      {
        id: 'season',
        title: 'Sezona',
        type: 'pills',
        options: [
          { id: 'winter', label: 'Ziemas', count: 847 },
          { id: 'summer', label: 'Vasaras', count: 1203 },
          { id: 'allseason', label: 'Vissezonas', count: 312 },
        ],
      },
      {
        id: 'width',
        title: 'Platums',
        type: 'checkbox',
        options: [
          { id: '145', label: '145', count: 18 },
          { id: '155', label: '155', count: 32 },
          { id: '165', label: '165', count: 45 },
          { id: '175', label: '175', count: 89 },
          { id: '185', label: '185', count: 112 },
          { id: '195', label: '195', count: 134 },
          { id: '205', label: '205', count: 156 },
          { id: '215', label: '215', count: 98 },
          { id: '225', label: '225', count: 87 },
          { id: '235', label: '235', count: 65 },
          { id: '245', label: '245', count: 43 },
          { id: '255', label: '255', count: 28 },
        ],
      },
      {
        id: 'height',
        title: 'Augstums',
        type: 'checkbox',
        options: [
          { id: '35', label: '35', count: 12 },
          { id: '40', label: '40', count: 34 },
          { id: '45', label: '45', count: 67 },
          { id: '50', label: '50', count: 89 },
          { id: '55', label: '55', count: 145 },
          { id: '60', label: '60', count: 112 },
          { id: '65', label: '65', count: 98 },
          { id: '70', label: '70', count: 76 },
          { id: '75', label: '75', count: 34 },
          { id: '80', label: '80', count: 21 },
        ],
      },
      {
        id: 'diameter',
        title: 'Diametrs',
        type: 'checkbox',
        options: [
          { id: 'R13', label: 'R13', count: 45 },
          { id: 'R14', label: 'R14', count: 78 },
          { id: 'R15', label: 'R15', count: 112 },
          { id: 'R16', label: 'R16', count: 156 },
          { id: 'R17', label: 'R17', count: 134 },
          { id: 'R18', label: 'R18', count: 87 },
          { id: 'R19', label: 'R19', count: 43 },
          { id: 'R20', label: 'R20', count: 21 },
          { id: 'R21', label: 'R21', count: 8 },
          { id: 'R22', label: 'R22', count: 4 },
        ],
      },
      {
        id: 'price',
        title: 'Cena',
        type: 'range',
        range: { min: 20, max: 500 },
      },
    ],
  },
  {
    id: 'brand',
    label: 'Razotaji',
    icon: <Tag size={15} strokeWidth={2} />,
    defaultOpen: true,
    sections: [
      {
        id: 'brand',
        title: 'Razotajs',
        type: 'checkbox',
        options: [
          { id: 'michelin', label: 'Michelin', count: 156 },
          { id: 'continental', label: 'Continental', count: 134 },
          { id: 'goodyear', label: 'Goodyear', count: 98 },
          { id: 'nokian', label: 'Nokian', count: 87 },
          { id: 'bridgestone', label: 'Bridgestone', count: 76 },
          { id: 'pirelli', label: 'Pirelli', count: 65 },
          { id: 'hankook', label: 'Hankook', count: 54 },
          { id: 'dunlop', label: 'Dunlop', count: 43 },
          { id: 'yokohama', label: 'Yokohama', count: 38 },
          { id: 'toyo', label: 'Toyo', count: 29 },
          { id: 'wanli', label: 'Wanli', count: 23 },
          { id: 'roadstone', label: 'Roadstone', count: 19 },
          { id: 'sunny', label: 'Sunny', count: 15 },
          { id: 'torque', label: 'Torque', count: 12 },
        ],
      },
    ],
  },
  {
    id: 'specs',
    label: 'Specifikacijas',
    icon: <Gauge size={15} strokeWidth={2} />,
    defaultOpen: false,
    sections: [
      {
        id: 'fuel',
        title: 'Degvielas ekonomija',
        type: 'checkbox',
        options: [
          { id: 'A', label: 'A', count: 34 },
          { id: 'B', label: 'B', count: 89 },
          { id: 'C', label: 'C', count: 234 },
          { id: 'D', label: 'D', count: 156 },
          { id: 'E', label: 'E', count: 67 },
        ],
      },
      {
        id: 'grip',
        title: 'Sakere (slapjais)',
        type: 'checkbox',
        options: [
          { id: 'A', label: 'A', count: 56 },
          { id: 'B', label: 'B', count: 112 },
          { id: 'C', label: 'C', count: 198 },
          { id: 'D', label: 'D', count: 87 },
          { id: 'E', label: 'E', count: 23 },
        ],
      },
      {
        id: 'noise',
        title: 'Troksnis',
        type: 'checkbox',
        options: [
          { id: '66-68', label: '66–68 dB', count: 45 },
          { id: '69-71', label: '69–71 dB', count: 178 },
          { id: '72-74', label: '72–74 dB', count: 134 },
          { id: '75+', label: '75+ dB', count: 23 },
        ],
      },
      {
        id: 'speed',
        title: 'Atruma indekss',
        type: 'checkbox',
        options: [
          { id: 'H', label: 'H (210 km/h)', count: 234 },
          { id: 'T', label: 'T (190 km/h)', count: 178 },
          { id: 'V', label: 'V (240 km/h)', count: 134 },
          { id: 'W', label: 'W (270 km/h)', count: 56 },
          { id: 'Y', label: 'Y (300 km/h)', count: 23 },
        ],
      },
      {
        id: 'load',
        title: 'Kravnesiba',
        type: 'checkbox',
        options: [
          { id: '71-80', label: '71–80', count: 67 },
          { id: '81-90', label: '81–90', count: 123 },
          { id: '91-100', label: '91–100', count: 89 },
          { id: '101-110', label: '101–110', count: 45 },
          { id: '111+', label: '111+', count: 12 },
        ],
      },
    ],
  },
  {
    id: 'extra',
    label: 'Papildus',
    icon: <Settings2 size={15} strokeWidth={2} />,
    defaultOpen: false,
    sections: [
      {
        id: 'runflat',
        title: 'Run-Flat',
        type: 'checkbox',
        options: [
          { id: 'yes', label: 'Tikai Run-Flat', count: 45 },
          { id: 'no', label: 'Standarta', count: 802 },
        ],
      },
      {
        id: 'studs',
        title: 'Radzes',
        type: 'checkbox',
        options: [
          { id: 'yes', label: 'Ar radzem', count: 67 },
          { id: 'no', label: 'Bez radzem', count: 780 },
        ],
      },
      {
        id: 'xl',
        title: 'XL / Reinforced',
        type: 'checkbox',
        options: [
          { id: 'yes', label: 'Tikai XL', count: 123 },
          { id: 'no', label: 'Standarta', count: 724 },
        ],
      },
      {
        id: 'dot',
        title: 'DOT gads',
        type: 'checkbox',
        options: [
          { id: '2025', label: '2025', count: 234 },
          { id: '2024', label: '2024', count: 312 },
          { id: '2023', label: '2023', count: 156 },
          { id: '2022-', label: '2022 un vecaki', count: 45 },
        ],
      },
      {
        id: 'oem',
        title: 'OEM markejums',
        type: 'checkbox',
        options: [
          { id: 'none', label: 'Nav', count: 612 },
          { id: 'bmw', label: 'BMW (*)', count: 34 },
          { id: 'mercedes', label: 'Mercedes (MO)', count: 28 },
          { id: 'audi', label: 'Audi (AO)', count: 21 },
          { id: 'vw', label: 'VW', count: 15 },
        ],
      },
    ],
  },
];

const seasonIcons: Record<string, React.ReactNode> = {
  winter: <Snowflake size={15} />,
  summer: <Sun size={15} />,
  allseason: <CloudSun size={15} />,
};

function Collapse({ open, children }: { open: boolean; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(open ? undefined : 0);

  useEffect(() => {
    if (!ref.current) return;
    if (open) {
      const h = ref.current.scrollHeight;
      setHeight(h);
      const t = setTimeout(() => setHeight(undefined), 200);
      return () => clearTimeout(t);
    } else {
      const h = ref.current.scrollHeight;
      setHeight(h);
      requestAnimationFrame(() => requestAnimationFrame(() => setHeight(0)));
    }
  }, [open]);

  return (
    <div
      ref={ref}
      style={{ height: height !== undefined ? height : 'auto', overflow: 'hidden' }}
      className="transition-[height] duration-200 ease-out"
    >
      {children}
    </div>
  );
}

function SeasonPills({
  section,
  selected,
  onToggle,
}: {
  section: FilterSection;
  selected: Set<string>;
  onToggle: (sectionId: string, optionId: string) => void;
}) {
  return (
    <div className="pb-3 pt-1">
      <div className="flex gap-2">
        {(section.options || []).map((opt) => {
          const active = selected.has(opt.id);
          return (
            <button
              key={opt.id}
              onClick={() => onToggle(section.id, opt.id)}
              className={`
                flex-1 flex flex-col items-center gap-0.5 py-2.5 border transition-all duration-150 cursor-pointer rounded
                ${active
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-red-200 hover:text-red-600'
                }
              `}
            >
              <span className={active ? 'text-red-200' : 'text-gray-400'}>{seasonIcons[opt.id]}</span>
              <span className="text-[12px] font-semibold leading-tight">{opt.label}</span>
              <span className={`text-[10px] ${active ? 'text-red-200' : 'text-gray-400'}`}>{opt.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SectionCheckbox({
  section,
  selected,
  onToggle,
  searchable,
}: {
  section: FilterSection;
  selected: Set<string>;
  onToggle: (sectionId: string, optionId: string) => void;
  searchable?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(selected.size > 0);
  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState('');
  const options = section.options || [];
  const limit = 6;

  const filtered = searchable && search
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;
  const visible = showAll || search ? filtered : filtered.slice(0, limit);
  const hasMore = !search && filtered.length > limit;

  return (
    <div className="py-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-1.5 text-left hover:text-red-600 transition-colors"
      >
        <span className="text-[13px] font-semibold text-gray-700">{section.title}</span>
        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <span className="text-[10px] font-bold text-white bg-red-600 w-[18px] h-[18px] flex items-center justify-center rounded-sm">
              {selected.size}
            </span>
          )}
          <ChevronDown
            size={14}
            className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      <Collapse open={isOpen}>
        <div className="pt-1 pb-0.5">
          {searchable && (
            <div className="relative mb-2">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Meklet razotaju..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-[12px] border border-gray-200 rounded focus:border-red-400 focus:ring-1 focus:ring-red-100 outline-none transition-all placeholder:text-gray-400"
              />
            </div>
          )}
          <div>
            {visible.map((opt) => {
              const checked = selected.has(opt.id);
              return (
                <label
                  key={opt.id}
                  className={`flex items-center gap-2.5 py-[6px] px-1 cursor-pointer transition-colors ${checked ? 'text-gray-900' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(section.id, opt.id)}
                    className="w-3.5 h-3.5 rounded-sm border-gray-300 text-red-600 focus:ring-red-500 focus:ring-1 cursor-pointer accent-red-600"
                  />
                  <span className={`text-[13px] flex-1 ${checked ? 'font-medium' : ''}`}>
                    {opt.label}
                  </span>
                  <span className="text-[11px] text-gray-400 tabular-nums">{opt.count}</span>
                </label>
              );
            })}
          </div>
          {hasMore && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-[12px] text-red-600 hover:text-red-700 font-medium pt-1 pl-1 transition-colors"
            >
              {showAll ? 'Radit mazak' : `+ vel ${options.length - limit}`}
            </button>
          )}
          {searchable && search && visible.length === 0 && (
            <p className="text-[12px] text-gray-400 py-2 pl-1">Nav rezultatu</p>
          )}
        </div>
      </Collapse>
    </div>
  );
}

function SectionRange({
  section,
  value,
  onChange,
}: {
  section: FilterSection;
  value: [number, number];
  onChange: (val: [number, number]) => void;
}) {
  const r = section.range!;
  const pMin = ((value[0] - r.min) / (r.max - r.min)) * 100;
  const pMax = ((value[1] - r.min) / (r.max - r.min)) * 100;

  return (
    <div className="py-3">
      <p className="text-[13px] font-semibold text-gray-700 mb-3">{section.title}</p>
      <div className="flex gap-2 items-center">
        <div className="flex-1 relative">
          <input
            type="number"
            value={value[0]}
            min={r.min}
            max={value[1]}
            onChange={(e) => onChange([Number(e.target.value), value[1]])}
            className="w-full border border-gray-200 rounded px-3 py-1.5 text-[13px] text-gray-700 focus:border-red-400 focus:ring-1 focus:ring-red-100 outline-none transition-all tabular-nums"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400">&euro;</span>
        </div>
        <span className="text-gray-300 text-sm">–</span>
        <div className="flex-1 relative">
          <input
            type="number"
            value={value[1]}
            min={value[0]}
            max={r.max}
            onChange={(e) => onChange([value[0], Number(e.target.value)])}
            className="w-full border border-gray-200 rounded px-3 py-1.5 text-[13px] text-gray-700 focus:border-red-400 focus:ring-1 focus:ring-red-100 outline-none transition-all tabular-nums"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400">&euro;</span>
        </div>
      </div>
      <div className="relative h-1 mt-3.5 mx-0.5">
        <div className="absolute inset-0 bg-gray-200" />
        <div
          className="absolute top-0 bottom-0 bg-red-600"
          style={{ left: `${pMin}%`, right: `${100 - pMax}%` }}
        />
        <input
          type="range"
          min={r.min}
          max={r.max}
          value={value[0]}
          onChange={(e) => onChange([Math.min(Number(e.target.value), value[1] - 5), value[1]])}
          className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-red-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm"
        />
        <input
          type="range"
          min={r.min}
          max={r.max}
          value={value[1]}
          onChange={(e) => onChange([value[0], Math.max(Number(e.target.value), value[0] + 5)])}
          className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-red-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm"
        />
      </div>
      <div className="flex justify-between mt-1.5 text-[10px] text-gray-400 px-0.5">
        <span>{r.min}&euro;</span>
        <span>{r.max}&euro;</span>
      </div>
    </div>
  );
}

export function TireFilterPanel() {
  const [selected, setSelected] = useState<Record<string, Set<string>>>({
    season: new Set(['winter']),
    width: new Set(['205']),
    diameter: new Set(['R16']),
  });
  const [priceRange, setPriceRange] = useState<[number, number]>([20, 500]);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(filterGroups.map((g) => [g.id, g.defaultOpen]))
  );

  const handleToggle = useCallback((sectionId: string, optionId: string) => {
    setSelected((prev) => {
      const next = { ...prev };
      const set = new Set(prev[sectionId] || []);
      if (set.has(optionId)) set.delete(optionId);
      else set.add(optionId);
      next[sectionId] = set;
      return next;
    });
  }, []);

  const handleClearAll = useCallback(() => {
    setSelected({});
    setPriceRange([20, 500]);
  }, []);

  const totalActive = Object.values(selected).reduce((s, set) => s + set.size, 0);

  const activeChips = Object.entries(selected).flatMap(([sectionId, set]) => {
    const group = filterGroups.find((g) => g.sections.some((s) => s.id === sectionId));
    const section = group?.sections.find((s) => s.id === sectionId);
    return Array.from(set).map((optId) => {
      const opt = section?.options?.find((o) => o.id === optId);
      return { key: `${sectionId}:${optId}`, sectionId, optionId: optId, label: opt?.label || optId };
    });
  });

  return (
    <div className="w-full max-w-[300px] select-none">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
          Filtri
          {totalActive > 0 && (
            <span className="ml-2 inline-flex items-center justify-center text-[10px] font-bold text-white bg-red-600 w-5 h-5 rounded-sm align-middle">
              {totalActive}
            </span>
          )}
        </h2>
        {totalActive > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1 text-[12px] text-gray-400 hover:text-red-600 transition-colors"
          >
            <RotateCcw size={11} />
            Notiirit visus
          </button>
        )}
      </div>

      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              onClick={() => handleToggle(chip.sectionId, chip.optionId)}
              className="inline-flex items-center gap-1 border border-red-200 bg-red-50 text-red-700 rounded-sm px-2 py-0.5 text-[11px] font-medium hover:bg-red-100 transition-colors group"
            >
              {chip.label}
              <X size={10} className="text-red-400 group-hover:text-red-600" />
            </button>
          ))}
        </div>
      )}

      <div className="space-y-px bg-white border border-gray-200 rounded overflow-hidden">
        {filterGroups.map((group) => {
          const isOpen = openGroups[group.id] ?? group.defaultOpen;
          const count = group.sections.reduce((s, sec) => s + (selected[sec.id]?.size || 0), 0);

          return (
            <div key={group.id} className="border-b border-gray-100 last:border-b-0">
              <button
                onClick={() => setOpenGroups((p) => ({ ...p, [group.id]: !isOpen }))}
                className={`
                  w-full flex items-center justify-between px-4 py-3 text-left transition-colors
                  ${isOpen ? 'bg-gray-50' : 'hover:bg-gray-50'}
                `}
              >
                <div className="flex items-center gap-2">
                  <span className={`${isOpen ? 'text-red-600' : 'text-gray-400'} transition-colors`}>
                    {group.icon}
                  </span>
                  <span className="text-[12px] font-bold text-gray-800 uppercase tracking-wide">
                    {group.label}
                  </span>
                  {count > 0 && (
                    <span className="text-[10px] font-bold text-white bg-red-600 w-[18px] h-[18px] flex items-center justify-center rounded-sm">
                      {count}
                    </span>
                  )}
                </div>
                <ChevronDown
                  size={15}
                  className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <Collapse open={isOpen}>
                <div className="px-4 pb-3 divide-y divide-gray-100">
                  {group.sections.map((section) =>
                    section.type === 'range' ? (
                      <SectionRange key={section.id} section={section} value={priceRange} onChange={setPriceRange} />
                    ) : section.type === 'pills' ? (
                      <SeasonPills key={section.id} section={section} selected={selected[section.id] || new Set()} onToggle={handleToggle} />
                    ) : (
                      <SectionCheckbox
                        key={section.id}
                        section={section}
                        selected={selected[section.id] || new Set()}
                        onToggle={handleToggle}
                        searchable={group.id === 'brand'}
                      />
                    )
                  )}
                </div>
              </Collapse>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-3 bg-red-600 text-white text-[13px] font-semibold py-3 rounded hover:bg-red-700 active:bg-red-800 transition-colors">
        Radit 847 rezultatus
      </button>
    </div>
  );
}
