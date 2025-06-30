// Centralized campaign data
export class CampaignData {
    static characters = new Map([
        ['rothbart', {
            name: 'Rothbart',
            type: 'Dampir Paladin',
            description: 'Undead-touched holy warrior with complex moral code'
        }],
        ['duvessa', {
            name: 'Duvessa Shane', 
            type: 'Town Speaker',
            description: 'Leader of Bryn Shander, political ally',
            location: 'bryn_shander'
        }],
        ['naerth', {
            name: 'Naerth Maxildannar',
            type: 'Town Speaker',
            description: 'Evil Speaker of Targos and political rival',
            location: 'targos'
        }],
        ['vellynne', {
            name: 'Vellynne Harpell',
            type: 'Necromancer',
            description: 'Tenth Black Staff of Blackstaff Academy'
        }],
        ['illithid', {
            name: 'Freed Mind Flayer',
            type: 'Aberration',
            description: 'Mind flayer ally with Nautiloid ship'
        }]
    ]);
    
    static locations = new Map([
        ['bryn_shander', {
            name: 'Bryn Shander',
            type: 'Fortified Town',
            description: 'Central hub for Ten Towns defense'
        }],
        ['east_haven', {
            name: 'East Haven',
            type: 'Destroyed Town',
            description: 'Former town destroyed by dragon attack'
        }],
        ['targos', {
            name: 'Targos',
            type: 'Town',
            description: 'Controlled by Naerth Maxildannar'
        }],
        ['black_iron_blades', {
            name: 'Black Iron Blades',
            type: 'Weapons Shop',
            description: 'Magical weapons and items shop'
        }],
        ['reghed_glacier', {
            name: 'Reghed Glacier',
            type: 'Frozen Wasteland', 
            description: 'Treacherous territory with ancient secrets'
        }]
    ]);
    
    static items = new Map([
        ['netherese_stones', {
            name: 'Netherese Artifacts',
            type: 'Ancient Magic Items',
            description: 'Keys to Ythryn with power amplification abilities'
        }],
        ['dragon_heart', {
            name: 'Red Dragon Heart',
            type: 'Crafting Material',
            description: 'Powerful magical component from slain dragon'
        }]
    ]);
    
    static async initialize() {
        console.log('CampaignData initialized with', this.characters.size, 'characters,', this.locations.size, 'locations, and', this.items.size, 'items');
        return true;
    }
    
    static getCharacter(id) {
        const character = this.characters.get(id);
        if (!character) {
            console.warn(`Character not found: ${id}`);
            return { name: id, type: 'Unknown', description: 'Character data not available' };
        }
        return character;
    }
    
    static getLocation(id) {
        const location = this.locations.get(id);
        if (!location) {
            console.warn(`Location not found: ${id}`);
            return { name: id, type: 'Unknown', description: 'Location data not available' };
        }
        return location;
    }
    
    static getItem(id) {
        const item = this.items.get(id);
        if (!item) {
            console.warn(`Item not found: ${id}`);
            return { name: id, type: 'Unknown', description: 'Item data not available' };
        }
        return item;
    }
}
