/**
 * VallaBus API Integration
 * Handles all API calls to the VallaBus API for bus stop and real-time data
 */

// API Configuration
const VALLABUS_API_BASE = 'https://api.vallabus.com';
const CACHE_DURATION = 25000; // 25 seconds cache as per API docs

class VallaBusAPI {
    constructor() {
        this.cache = new Map();
        this.lastFetch = new Map();
    }

    /**
     * Fetch all bus stops (paradas)
     * Endpoint: GET /v2/paradas/
     */
    async getAllStops() {
        const cacheKey = 'all_stops';
        const cached = this.getFromCache(cacheKey, 3600000); // Cache for 1 hour
        if (cached) return cached;

        try {
            const response = await fetch(`${VALLABUS_API_BASE}/v2/paradas/`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            this.setCache(cacheKey, data);
            return data;
        } catch (error) {
            console.error('Error fetching all stops:', error);
            throw error;
        }
    }

    /**
     * Fetch stop details with all lines
     * Endpoint: GET /v2/parada/{stopId}
     */
    async getStopInfo(stopId) {
        const cacheKey = `stop_${stopId}`;
        const cached = this.getFromCache(cacheKey, CACHE_DURATION);
        if (cached) return cached;

        try {
            const response = await fetch(`${VALLABUS_API_BASE}/v2/parada/${stopId}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            this.setCache(cacheKey, data);
            return data;
        } catch (error) {
            console.error(`Error fetching stop ${stopId}:`, error);
            throw error;
        }
    }

    /**
     * Fetch specific line at a stop
     * Endpoint: GET /v2/parada/{stopId}/{lineId}
     */
    async getStopLineInfo(stopId, lineId) {
        const cacheKey = `stop_${stopId}_line_${lineId}`;
        const cached = this.getFromCache(cacheKey, CACHE_DURATION);
        if (cached) return cached;

        try {
            const response = await fetch(`${VALLABUS_API_BASE}/v2/parada/${stopId}/${lineId}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            this.setCache(cacheKey, data);
            return data;
        } catch (error) {
            console.error(`Error fetching stop ${stopId} line ${lineId}:`, error);
            throw error;
        }
    }

    /**
     * Fetch bus positions (optional enhancement)
     * Endpoint: GET /v2/busPosition/
     */
    async getBusPositions() {
        const cacheKey = 'bus_positions';
        const cached = this.getFromCache(cacheKey, 15000); // Cache for 15 seconds
        if (cached) return cached;

        try {
            const response = await fetch(`${VALLABUS_API_BASE}/v2/busPosition/`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            this.setCache(cacheKey, data);
            return data;
        } catch (error) {
            console.error('Error fetching bus positions:', error);
            throw error;
        }
    }

    /**
     * Helper: Get data from cache if not expired
     */
    getFromCache(key, maxAge) {
        const lastFetch = this.lastFetch.get(key);
        if (!lastFetch || Date.now() - lastFetch > maxAge) {
            return null;
        }
        return this.cache.get(key);
    }

    /**
     * Helper: Set data in cache
     */
    setCache(key, data) {
        this.cache.set(key, data);
        this.lastFetch.set(key, Date.now());
    }

    /**
     * Helper: Clear cache
     */
    clearCache() {
        this.cache.clear();
        this.lastFetch.clear();
    }

    /**
     * Parse arrival times to get minutes remaining
     */
    parseArrivalTime(fechaHoraLlegada) {
        const arrivalTime = new Date(fechaHoraLlegada);
        const now = new Date();
        const diffMs = arrivalTime - now;
        const diffMins = Math.round(diffMs / 60000);
        return diffMins;
    }

    /**
     * Format occupancy status to Spanish
     */
    formatOccupancy(occupancyStatus) {
        const occupancyMap = {
            'EMPTY': 'Vacío',
            'MANY_SEATS_AVAILABLE': 'Muchos asientos',
            'FEW_SEATS_AVAILABLE': 'Pocos asientos',
            'STANDING_ROOM_ONLY': 'Solo de pie',
            'CRUSHED_STANDING_ROOM_ONLY': 'Muy lleno',
            'FULL': 'Completo',
            'NOT_ACCEPTING_PASSENGERS': 'No admite pasajeros'
        };
        return occupancyMap[occupancyStatus] || 'Desconocido';
    }
}

// Export singleton instance
const vallaBusAPI = new VallaBusAPI();
