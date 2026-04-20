import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import PageContainer from '../ui/PageContainer';
import SectionHeader from '../ui/SectionHeader';
import { getGlobalMarketHotspots } from '../../utils/api';

const REFRESH_MS = 5 * 60 * 1000;

const METRIC_MODES = [
  { key: 'mortgageRate', apiMetric: 'mortgage', label: 'Mortgage', unit: '%' },
  { key: 'personalLoan', apiMetric: 'personal', label: 'Personal', unit: '%' },
  { key: 'autoLoan', apiMetric: 'auto', label: 'Auto', unit: '%' },
  { key: 'businessLoan', apiMetric: 'business', label: 'Business', unit: '%' },
  { key: 'inflation', apiMetric: 'inflation', label: 'Inflation', unit: '%' },
  { key: 'policyRate', apiMetric: 'policy', label: 'Policy Rate', unit: '%' },
];

const CONTINENT_OPTIONS = ['All', 'Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania'];
const LIMIT_OPTIONS = [10, 25, 50, 100];
const RATE_MIN = 0;
const RATE_MAX = 75;

const DEFAULT_FILTERS = {
  continent: 'All',
  country: '',
  metricKey: METRIC_MODES[0].key,
  min: RATE_MIN,
  max: RATE_MAX,
  limit: 25,
};

const FALLBACK_HOTSPOTS = [
  { city: 'New York', country: 'United States', lat: 40.7128, lng: -74.006, mortgageRate: 6.82, personalLoan: 11.4, autoLoan: 8.3, businessLoan: 9.6, policyRate: 5.5, inflation: 3.2, currency: 'USD', trend: 'Rates steady as inflation cools', banks: ['JPMorgan Chase', 'Bank of America'], updatedAt: '2026-04-21T10:00:00' },
  { city: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278, mortgageRate: 5.88, personalLoan: 8.9, autoLoan: 6.8, businessLoan: 8.4, policyRate: 5.25, inflation: 3.1, currency: 'GBP', trend: 'Housing credit stabilizing', banks: ['HSBC', 'Barclays'], updatedAt: '2026-04-21T10:00:00' },
  { city: 'Mumbai', country: 'India', lat: 19.076, lng: 72.8777, mortgageRate: 8.55, personalLoan: 11.6, autoLoan: 9.35, businessLoan: 10.2, policyRate: 6.5, inflation: 4.9, currency: 'INR', trend: 'Retail growth driven by housing', banks: ['HDFC Bank', 'ICICI Bank'], updatedAt: '2026-04-21T10:00:00' },
  { city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, mortgageRate: 1.45, personalLoan: 4.2, autoLoan: 2.3, businessLoan: 3.7, policyRate: 0.75, inflation: 1.7, currency: 'JPY', trend: 'Normalization phase for rates', banks: ['MUFG', 'SMBC'], updatedAt: '2026-04-21T10:00:00' },
  { city: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, mortgageRate: 6.12, personalLoan: 10.1, autoLoan: 7.4, businessLoan: 8.6, policyRate: 4.35, inflation: 3.4, currency: 'AUD', trend: 'Housing affordability under pressure', banks: ['CBA', 'Westpac'], updatedAt: '2026-04-21T10:00:00' },
  { city: 'Sao Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333, mortgageRate: 9.45, personalLoan: 28.4, autoLoan: 19.3, businessLoan: 17.8, policyRate: 10.5, inflation: 4.7, currency: 'BRL', trend: 'Credit demand strong despite tight policy', banks: ['Itaú', 'Bradesco'], updatedAt: '2026-04-21T10:00:00' },
  { city: 'Johannesburg', country: 'South Africa', lat: -26.2041, lng: 28.0473, mortgageRate: 11.9, personalLoan: 16.8, autoLoan: 13.4, businessLoan: 14.7, policyRate: 8.25, inflation: 5.4, currency: 'ZAR', trend: 'Consumer credit remains resilient', banks: ['Standard Bank', 'Absa'], updatedAt: '2026-04-21T10:00:00' },
  { city: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lng: 55.2708, mortgageRate: 5.1, personalLoan: 7.9, autoLoan: 6.1, businessLoan: 7.4, policyRate: 5.4, inflation: 2.8, currency: 'AED', trend: 'Real estate lending remains active', banks: ['Emirates NBD', 'ADCB'], updatedAt: '2026-04-21T10:00:00' },
];

function latLngToVector3(lat, lng, radius = 1.82) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function GlobeMesh() {
  const meshRef = useRef(null);
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.13;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.75, 64, 64]} />
      <meshStandardMaterial
        color="#0a2c47"
        metalness={0.38}
        roughness={0.42}
        emissive="#0f4f73"
        emissiveIntensity={0.24}
      />
    </mesh>
  );
}

function getHeatColor(normalizedValue = 0.5) {
  const value = Number.isFinite(normalizedValue) ? normalizedValue : 0.5;
  const hue = 210 - value * 210;
  const saturation = 86;
  const lightness = 56;
  return new THREE.Color(`hsl(${hue} ${saturation}% ${lightness}%)`);
}

function PulseMarker({ item, onHover, active, normalizedMetric }) {
  const markerRef = useRef(null);
  const pulseRef = useRef(null);
  const position = useMemo(() => latLngToVector3(item.lat, item.lng, 1.85), [item.lat, item.lng]);
  const markerColor = useMemo(() => getHeatColor(normalizedMetric), [normalizedMetric]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (pulseRef.current) pulseRef.current.scale.setScalar(1 + Math.sin(t * 2.8) * 0.26);
    if (markerRef.current) markerRef.current.scale.setScalar(active ? 1.3 : 1);
  });

  return (
    <group position={position}>
      <mesh
        ref={markerRef}
        onPointerOver={(event) => {
          event.stopPropagation();
          onHover(item);
        }}
        onPointerOut={() => onHover(null)}
      >
        <sphereGeometry args={[0.033, 18, 18]} />
        <meshStandardMaterial color={markerColor} emissive={markerColor} emissiveIntensity={active ? 1.52 : 0.95} />
      </mesh>
      <mesh ref={pulseRef}>
        <ringGeometry args={[0.045, 0.07, 24]} />
        <meshBasicMaterial color={markerColor} transparent opacity={0.58} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Scene({ hotspots, onHover, hovered, metricKey, minMetric, maxMetric }) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight intensity={0.75} position={[4, 3, 3]} />
      <pointLight intensity={0.45} position={[-2, -1, -2]} color="#2c9cbf" />
      <GlobeMesh />
      {hotspots.map((item) => {
        const metricValue = Number(item?.[metricKey] ?? 0);
        const range = maxMetric - minMetric || 1;
        const normalizedMetric = (metricValue - minMetric) / range;
        return (
        <PulseMarker
          key={`${item.city}-${item.country}`}
          item={item}
          onHover={onHover}
          active={hovered?.city === item.city}
          normalizedMetric={normalizedMetric}
        />
      );
      })}
      <OrbitControls enablePan={false} minDistance={3.5} maxDistance={6.8} />
    </>
  );
}

export default function GlobeSection() {
  const [hotspots, setHotspots] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [debouncedCountry, setDebouncedCountry] = useState(DEFAULT_FILTERS.country);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const selectedMode = useMemo(
    () => METRIC_MODES.find((mode) => mode.key === filters.metricKey) || METRIC_MODES[0],
    [filters.metricKey]
  );

  const effectiveMin = Math.min(filters.min, filters.max);
  const effectiveMax = Math.max(filters.min, filters.max);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedCountry(filters.country.trim());
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [filters.country]);

  const minMetric = useMemo(() => {
    if (!hotspots.length) return 0;
    return Math.min(...hotspots.map((item) => Number(item?.[selectedMode.key] ?? 0)));
  }, [hotspots, selectedMode.key]);

  const maxMetric = useMemo(() => {
    if (!hotspots.length) return 1;
    return Math.max(...hotspots.map((item) => Number(item?.[selectedMode.key] ?? 0)));
  }, [hotspots, selectedMode.key]);

  const fetchHotspots = useCallback(async (background = false) => {
    if (background) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const data = await getGlobalMarketHotspots({
        continent: filters.continent === 'All' ? '' : filters.continent,
        country: debouncedCountry,
        metric: selectedMode.apiMetric,
        min: effectiveMin,
        max: effectiveMax,
        limit: filters.limit,
      });

      if (Array.isArray(data)) {
        setHotspots(data);
        setError('');
      } else {
        setHotspots([]);
        setError('Live feed returned no records. Showing fallback market sample.');
      }
    } catch {
      setHotspots(FALLBACK_HOTSPOTS);
      setError('Live feed unavailable. Showing fallback market sample.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [debouncedCountry, effectiveMax, effectiveMin, filters.continent, filters.limit, selectedMode.apiMetric]);

  useEffect(() => {
    fetchHotspots(false);
    const id = setInterval(() => {
      fetchHotspots(true);
    }, REFRESH_MS);
    return () => clearInterval(id);
  }, [fetchHotspots]);

  useEffect(() => {
    if (!hovered) return;
    const stillVisible = hotspots.some((item) => item.city === hovered.city && item.country === hovered.country);
    if (!stillVisible) setHovered(null);
  }, [hotspots, hovered]);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateNumericFilter = useCallback((key, value) => {
    const parsed = Number(value);
    const boundedValue = Number.isFinite(parsed)
      ? Math.max(RATE_MIN, Math.min(RATE_MAX, parsed))
      : RATE_MIN;
    setFilters((prev) => ({ ...prev, [key]: boundedValue }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const hoveredMetricValue = Number(hovered?.[selectedMode.key] ?? 0);
  const hoveredUpdatedAt = hovered?.updatedAt
    ? new Date(hovered.updatedAt).toLocaleString()
    : 'N/A';

  return (
    <section className="py-16 sm:py-20">
      <PageContainer>
        <SectionHeader
          eyebrow="Global Market Pulse"
          title="Worldwide live finance globe"
          description="Track lending and macro conditions across major financial cities with live metric overlays and heatmap intensity."
          align="center"
          className="mb-8"
        />

        <div className="relative overflow-hidden rounded-3xl border border-[var(--border-medium)] bg-[linear-gradient(158deg,rgba(3,20,36,0.96),rgba(6,34,55,0.98))] p-4 shadow-[0_24px_64px_rgba(3,16,31,0.52)] sm:p-6">
          <div className="mb-4 rounded-2xl border border-white/15 bg-black/25 p-3 shadow-[0_10px_28px_rgba(0,0,0,0.25)] backdrop-blur sm:p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">Globe Filters</p>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-[11px] text-white/80">
                  {hotspots.length} results
                </span>
                <span className="rounded-full border border-white/20 bg-black/30 px-2.5 py-1 text-[11px] text-white/80">
                  {isRefreshing ? 'Refreshing...' : 'Auto refresh 5m'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              <label className="flex flex-col gap-1.5 text-xs text-white/70">
                Continent
                <select
                  value={filters.continent}
                  onChange={(event) => updateFilter('continent', event.target.value)}
                  className="h-9 rounded-xl border border-white/15 bg-[#0b1d30] px-3 text-sm text-white outline-none transition focus:border-white/35"
                >
                  {CONTINENT_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5 text-xs text-white/70">
                Country Search
                <input
                  type="text"
                  value={filters.country}
                  onChange={(event) => updateFilter('country', event.target.value)}
                  placeholder="Type country name"
                  className="h-9 rounded-xl border border-white/15 bg-[#0b1d30] px-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/35"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-xs text-white/70">
                Metric
                <select
                  value={filters.metricKey}
                  onChange={(event) => updateFilter('metricKey', event.target.value)}
                  className="h-9 rounded-xl border border-white/15 bg-[#0b1d30] px-3 text-sm text-white outline-none transition focus:border-white/35"
                >
                  {METRIC_MODES.map((mode) => (
                    <option key={mode.key} value={mode.key}>{mode.label}</option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5 text-xs text-white/70">
                Limit
                <select
                  value={filters.limit}
                  onChange={(event) => updateFilter('limit', Number(event.target.value))}
                  className="h-9 rounded-xl border border-white/15 bg-[#0b1d30] px-3 text-sm text-white outline-none transition focus:border-white/35"
                >
                  {LIMIT_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1fr_auto]">
              <div className="rounded-xl border border-white/12 bg-white/[0.03] p-2.5">
                <div className="mb-1.5 flex items-center justify-between text-xs text-white/70">
                  <span>Min Value</span>
                  <span>{filters.min.toFixed(2)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={RATE_MIN}
                    max={RATE_MAX}
                    step="0.1"
                    value={filters.min}
                    onChange={(event) => updateNumericFilter('min', event.target.value)}
                    className="w-full accent-cyan-400"
                  />
                  <input
                    type="number"
                    min={RATE_MIN}
                    max={RATE_MAX}
                    step="0.1"
                    value={filters.min}
                    onChange={(event) => updateNumericFilter('min', event.target.value)}
                    className="h-8 w-20 rounded-lg border border-white/15 bg-[#0b1d30] px-2 text-xs text-white outline-none focus:border-white/35"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-white/12 bg-white/[0.03] p-2.5">
                <div className="mb-1.5 flex items-center justify-between text-xs text-white/70">
                  <span>Max Value</span>
                  <span>{filters.max.toFixed(2)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={RATE_MIN}
                    max={RATE_MAX}
                    step="0.1"
                    value={filters.max}
                    onChange={(event) => updateNumericFilter('max', event.target.value)}
                    className="w-full accent-amber-400"
                  />
                  <input
                    type="number"
                    min={RATE_MIN}
                    max={RATE_MAX}
                    step="0.1"
                    value={filters.max}
                    onChange={(event) => updateNumericFilter('max', event.target.value)}
                    className="h-8 w-20 rounded-lg border border-white/15 bg-[#0b1d30] px-2 text-xs text-white outline-none focus:border-white/35"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={resetFilters}
                className="h-10 self-end rounded-xl border border-white/25 bg-white/5 px-4 text-sm font-semibold text-white transition hover:border-white/45 hover:bg-white/10"
              >
                Reset Filters
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="relative h-[340px] overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_50%_30%,rgba(43,151,255,0.13),transparent_55%)] sm:h-[420px]">
              <Canvas camera={{ position: [0, 0.2, 4.8], fov: 48 }} dpr={[1, 1.8]}>
                <Scene
                  hotspots={hotspots}
                  onHover={setHovered}
                  hovered={hovered}
                  metricKey={selectedMode.key}
                  minMetric={minMetric}
                  maxMetric={maxMetric}
                />
              </Canvas>

              {!isLoading && hotspots.length === 0 ? (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="rounded-xl border border-white/15 bg-black/55 px-4 py-2 text-center backdrop-blur">
                    <p className="text-sm font-medium text-white">No markers match current filters</p>
                    <p className="mt-1 text-xs text-white/65">Try widening your value range or resetting filters.</p>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-3">
              <div className="rounded-2xl border border-white/15 bg-black/25 p-4 backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/55">Heatmap Metric</p>
                <p className="mt-1 text-sm font-semibold text-white">{selectedMode.label}</p>
                <div className="mt-3 h-2 rounded-full bg-[linear-gradient(90deg,#3b82f6,#f59e0b,#ef4444)]" />
                <div className="mt-1 flex justify-between text-[11px] text-white/60">
                  <span>{minMetric.toFixed(2)}{selectedMode.unit}</span>
                  <span>{maxMetric.toFixed(2)}{selectedMode.unit}</span>
                </div>
              </div>

              <div className="min-h-52 rounded-2xl border border-white/15 bg-black/25 p-4 backdrop-blur">
                {isLoading ? (
                  <p className="text-sm text-white/70">Loading global hotspots...</p>
                ) : hotspots.length === 0 ? (
                  <>
                    <p className="text-xs uppercase tracking-[0.16em] text-white/55">No Results</p>
                    <p className="mt-2 text-sm text-white/75">No hotspots match these filters yet. Adjust continent, country, metric range, or limit.</p>
                  </>
                ) : hovered ? (
                  <>
                    <p className="text-xs uppercase tracking-[0.16em] text-white/55">Live Marker</p>
                    <h3 className="mt-1 text-lg font-semibold text-white">{hovered.city}, {hovered.country}</h3>
                    <p className="mt-1 text-sm text-white/70">{hovered.trend}</p>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg border border-white/15 bg-white/5 px-2 py-2 text-white/85">Mortgage: {Number(hovered.mortgageRate).toFixed(2)}%</div>
                      <div className="rounded-lg border border-white/15 bg-white/5 px-2 py-2 text-white/85">Personal: {Number(hovered.personalLoan).toFixed(2)}%</div>
                      <div className="rounded-lg border border-white/15 bg-white/5 px-2 py-2 text-white/85">Auto: {Number(hovered.autoLoan).toFixed(2)}%</div>
                      <div className="rounded-lg border border-white/15 bg-white/5 px-2 py-2 text-white/85">Business: {Number(hovered.businessLoan).toFixed(2)}%</div>
                      <div className="rounded-lg border border-white/15 bg-white/5 px-2 py-2 text-white/85">Policy: {Number(hovered.policyRate).toFixed(2)}%</div>
                      <div className="rounded-lg border border-white/15 bg-white/5 px-2 py-2 text-white/85">Inflation: {Number(hovered.inflation).toFixed(2)}%</div>
                    </div>
                    <p className="mt-3 text-xs text-white/70">Currency: {hovered.currency} | Focus metric: {hoveredMetricValue.toFixed(2)}{selectedMode.unit}</p>
                    <p className="mt-2 text-xs text-white/55">Banks: {Array.isArray(hovered.banks) ? hovered.banks.slice(0, 3).join(', ') : 'N/A'}</p>
                    <p className="mt-2 text-xs text-white/55">Updated: {hoveredUpdatedAt}</p>
                  </>
                ) : (
                  <>
                    <p className="text-xs uppercase tracking-[0.16em] text-white/55">Interaction</p>
                    <p className="mt-2 text-sm text-white/75">Rotate the globe and hover a marker to inspect city-level lending and macro metrics.</p>
                    <p className="mt-3 text-xs text-white/60">Coverage spans North America, South America, Europe, Africa, Asia, and Oceania.</p>
                  </>
                )}
              </div>

              {error ? (
                <div className="rounded-xl border border-amber-300/35 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">{error}</div>
              ) : null}
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
