// Centralized campaign data with validation
export class CampaignData {
    static characters = new Map([
        ['rothbart', {
            name: 'Rothbart',
            type: 'Dampir Paladin',
            description: 'Undead-touched holy warrior with complex moral code',
            relationships: ['vellynne', 'party_member'],
            abilities: ['divine_sense', 'vampire_resistance'],
            sessionIntroduced: 1
        }],
        ['duvessa', {
            name: 'Duvessa Shane', 
            type: 'Town Speaker',
            description: 'Leader of Bryn Shander, political ally',
            location: 'bryn_shander',
            role: 'quest_giver',
            sessionIntroduced: 2
        }],
        ['naerth', {
            name: 'Naerth Maxildannar',
            type: 'Town Speaker', 
            description: 'Evil Speaker of Targos and political rival',
            location: 'targos',
            allegiance: 'zentarim',
            sessionIntroduced: 2
        }]
    ]);
    
    static locations = new Map([
        ['bryn_shander', {
            name: 'Bryn Shander',
            type: 'fortified_town',
            description: 'Central hub for Ten Towns defense',
            status: 'under_siege_preparations',
            population: 'refugee_center',
            sessionsFeatured: [1, 2]
        }],
        ['reghed_glacier', {
            name: 'Reghed Glacier', 
            type: 'frozen_wasteland',
            description: 'Treacherous territory with ancient secrets',
            threats: ['vampire_forces', 'netherese_ruins'],
            accessibility: 'currently_impassable',
            sessionsFeatured: [2]
        }]
    ]);
    
    static items = new Map([
        ['netherese_stones', {
            name: 'Netherese Artifacts',
            type: 'ancient_magic_items', 
            description: 'Keys to Ythryn with power amplification',
            abilities: ['space_time_anchoring', 'city_access'],
            sessionAcquired: 2
        }],
        ['radiant_bracers', {
            name: 'Bracers of Radiant Exuberance',
            type: 'magical_bracers',
            description: 'Cold resistance and enhanced magic',
            effects: ['fire_radiant_damage_boost', 'cold_resistance'],
            sessionCreated: 2
        }]
    ]);
    
    // Access methods with validation
    static getCharacter(id) {
        const character = this.characters.get(id);
        if (!character) {
            console.warn(`Character not found: ${id}`);
            return { name: id, type: 'unknown', description: 'Character data not available' };
        }
        return character;
    }
    
    static getLocation(id) {
        const location = this.locations.get(id);
        if (!location) {
            console.warn(`Location not found: ${id}`);
            return { name: id, type: 'unknown', description: 'Location data not available' };
        }
        return location;
    }
    
    static getItem(id) {
        const item = this.items.get(id);
        if (!item) {
            console.warn(`Item not found: ${id}`);
            return { name: id, type: 'unknown', description: 'Item data not available' };
        }
        return item;
    }
}
