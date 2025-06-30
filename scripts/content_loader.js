/**
 * Content Loader - Campaign Data Management System
 * Handles loading, parsing, and providing access to D&D campaign data
 */

const ContentLoader = {
    // Private data storage
    _campaignData: null,
    _isInitialized: false,
    _loadingPromise: null,

    /**
     * Initialize the content loader system
     * @returns {Promise} Resolves when data is loaded and processed
     */
    async initialize() {
        if (this._isInitialized) {
            return this._campaignData;
        }

        if (this._loadingPromise) {
            return this._loadingPromise;
        }

        this._loadingPromise = this._loadCampaignData();
        return this._loadingPromise;
    },

    /**
     * Load campaign data from embedded JSON script tag
     * @private
     * @returns {Promise} Campaign data loading promise
     */
    async _loadCampaignData() {
        try {
            // Find the embedded JSON data in the HTML
            const dataScript = document.getElementById('campaign-data');
            
            if (!dataScript) {
                throw new Error('Campaign data script not found in HTML');
            }

            // Parse the JSON content
            const jsonContent = dataScript.textContent || dataScript.innerText;
            this._campaignData = JSON.parse(jsonContent);

            // Validate data structure
            this._validateDataStructure();

            // Process and enhance data
            this._processDataEnhancements();

            this._isInitialized = true;
            console.log('Campaign data loaded successfully:', this._campaignData);
            
            return this._campaignData;

        } catch (error) {
            console.error('Failed to load campaign data:', error);
            // Provide fallback data to prevent complete failure
            this._campaignData = this._getFallbackData();
            this._isInitialized = true;
            return this._campaignData;
        }
    },

    /**
     * Validate that required data structure exists
     * @private
     */
    _validateDataStructure() {
        const requiredSections = ['characters', 'locations', 'items', 'events'];
        
        for (const section of requiredSections) {
            if (!this._campaignData[section]) {
                console.warn(`Missing campaign data section: ${section}`);
                this._campaignData[section] = {};
            }
        }
    },

    /**
     * Process and enhance raw data with computed properties
     * @private
     */
    _processDataEnhancements() {
        // Add computed properties to characters
        Object.keys(this._campaignData.characters).forEach(key => {
            const character = this._campaignData.characters[key];
            character.id = key;
            character.displayName = character.name || this._capitalizeWords(key);
        });

        // Add computed properties to locations
        Object.keys(this._campaignData.locations).forEach(key => {
            const location = this._campaignData.locations[key];
            location.id = key;
            location.displayName = location.name || this._capitalizeWords(key);
        });

        // Add computed properties to items
        Object.keys(this._campaignData.items).forEach(key => {
            const item = this._campaignData.items[key];
            item.id = key;
            item.displayName = item.name || this._capitalizeWords(key);
        });

        // Add computed properties to events
        Object.keys(this._campaignData.events).forEach(key => {
            const event = this._campaignData.events[key];
            event.id = key;
            event.displayName = event.name || this._capitalizeWords(key);
        });
    },

    /**
     * Get character data by ID
     * @param {string} characterId - Character identifier
     * @returns {Object|null} Character data or null if not found
     */
    getCharacter(characterId) {
        if (!this._isInitialized) {
            console.warn('ContentLoader not initialized. Call initialize() first.');
            return null;
        }

        return this._campaignData.characters[characterId] || null;
    },

    /**
     * Get location data by ID
     * @param {string} locationId - Location identifier
     * @returns {Object|null} Location data or null if not found
     */
    getLocation(locationId) {
        if (!this._isInitialized) {
            console.warn('ContentLoader not initialized. Call initialize() first.');
            return null;
        }

        return this._campaignData.locations[locationId] || null;
    },

    /**
     * Get item data by ID
     * @param {string} itemId - Item identifier
     * @returns {Object|null} Item data or null if not found
     */
    getItem(itemId) {
        if (!this._isInitialized) {
            console.warn('ContentLoader not initialized. Call initialize() first.');
            return null;
        }

        return this._campaignData.items[itemId] || null;
    },

    /**
     * Get event data by ID
     * @param {string} eventId - Event identifier
     * @returns {Object|null} Event data or null if not found
     */
    getEvent(eventId) {
        if (!this._isInitialized) {
            console.warn('ContentLoader not initialized. Call initialize() first.');
            return null;
        }

        return this._campaignData.events[eventId] || null;
    },

    /**
     * Get all data of a specific type
     * @param {string} type - Data type: 'characters', 'locations', 'items', 'events'
     * @returns {Object} All data of the specified type
     */
    getAllOfType(type) {
        if (!this._isInitialized) {
            console.warn('ContentLoader not initialized. Call initialize() first.');
            return {};
        }

        return this._campaignData[type] || {};
    },

    /**
     * Search across all data types
     * @param {string} searchTerm - Term to search for
     * @returns {Array} Array of matching results with type and data
     */
    search(searchTerm) {
        if (!this._isInitialized) {
            return [];
        }

        const results = [];
        const term = searchTerm.toLowerCase();

        // Search characters
        Object.entries(this._campaignData.characters).forEach(([id, data]) => {
            if (this._matchesSearch(data, term)) {
                results.push({ type: 'character', id, data });
            }
        });

        // Search locations
        Object.entries(this._campaignData.locations).forEach(([id, data]) => {
            if (this._matchesSearch(data, term)) {
                results.push({ type: 'location', id, data });
            }
        });

        // Search items
        Object.entries(this._campaignData.items).forEach(([id, data]) => {
            if (this._matchesSearch(data, term)) {
                results.push({ type: 'item', id, data });
            }
        });

        // Search events
        Object.entries(this._campaignData.events).forEach(([id, data]) => {
            if (this._matchesSearch(data, term)) {
                results.push({ type: 'event', id, data });
            }
        });

        return results;
    },

    /**
     * Check if data matches search term
     * @private
     * @param {Object} data - Data object to search
     * @param {string} term - Search term
     * @returns {boolean} True if matches
     */
    _matchesSearch(data, term) {
        const searchableFields = ['name', 'displayName', 'description', 'type'];
        
        return searchableFields.some(field => {
            const value = data[field];
            return value && value.toLowerCase().includes(term);
        });
    },

    /**
     * Capitalize words for display names
     * @private
     * @param {string} str - String to capitalize
     * @returns {string} Capitalized string
     */
    _capitalizeWords(str) {
        return str.split('_')
                 .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                 .join(' ');
    },

    /**
     * Provide fallback data if loading fails
     * @private
     * @returns {Object} Basic fallback data structure
     */
    _getFallbackData() {
        return {
            characters: {
                rothbart: {
                    name: 'Rothbart',
                    type: 'Dampir Paladin',
                    description: 'Undead-touched holy warrior',
                    displayName: 'Rothbart'
                }
            },
            locations: {
                bryn_shander: {
                    name: 'Bryn Shander',
                    type: 'Fortified Town',
                    description: 'Central hub of Ten Towns',
                    displayName: 'Bryn Shander'
                }
            },
            items: {
                netherese_stones: {
                    name: 'Netherese Artifacts',
                    type: 'Ancient Magic Items',
                    description: 'Powerful ancient artifacts',
                    displayName: 'Netherese Artifacts'
                }
            },
            events: {
                vampire_yeti_attack: {
                    name: 'Vampire-Yeti Assault',
                    description: 'Coordinated attack on caravan',
                    displayName: 'Vampire-Yeti Assault'
                }
            }
        };
    },

    /**
     * Get initialization status
     * @returns {boolean} True if initialized
     */
    isInitialized() {
        return this._isInitialized;
    },

    /**
     * Reset the loader (for testing purposes)
     */
    reset() {
        this._campaignData = null;
        this._isInitialized = false;
        this._loadingPromise = null;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContentLoader;
}