// Unit tests for CampaignData module
export class CampaignDataTests {
    constructor() {
        this.testResults = [];
    }
    
    async runAllTests() {
        console.log('Testing CampaignData module...');
        
        await this.testCharacterRetrieval();
        await this.testLocationRetrieval();
        await this.testItemRetrieval();
        await this.testDataValidation();
        
        this.reportResults();
    }
    
    async testCharacterRetrieval() {
        try {
            // Import the actual CampaignData
            const { CampaignData } = await import('../../data/campaign-data.js');
            
            const rothbart = CampaignData.getCharacter('rothbart');
            const unknown = CampaignData.getCharacter('nonexistent');
            
            this.assertTrue(rothbart.name === 'Rothbart', 'Should find Rothbart character data');
            this.assertTrue(rothbart.type === 'Dampir Paladin', 'Should have correct character type');
            this.assertTrue(unknown.name === 'nonexistent', 'Should handle unknown characters gracefully');
            
            this.addTestResult('characterRetrieval', true, 'Character data retrieval works correctly');
            
        } catch (error) {
            this.addTestResult('characterRetrieval', false, `Failed: ${error.message}`);
        }
    }
    
    async testLocationRetrieval() {
        try {
            const { CampaignData } = await import('../../data/campaign-data.js');
            
            const brynShander = CampaignData.getLocation('bryn_shander');
            const unknown = CampaignData.getLocation('nonexistent');
            
            this.assertTrue(brynShander.name === 'Bryn Shander', 'Should find Bryn Shander location data');
            this.assertTrue(brynShander.type === 'fortified_town', 'Should have correct location type');
            this.assertTrue(unknown.type === 'unknown', 'Should handle unknown locations gracefully');
            
            this.addTestResult('locationRetrieval', true, 'Location data retrieval works correctly');
            
        } catch (error) {
            this.addTestResult('locationRetrieval', false, `Failed: ${error.message}`);
        }
    }
    
    async testItemRetrieval() {
        try {
            const { CampaignData } = await import('../../data/campaign-data.js');
            
            const stones = CampaignData.getItem('netherese_stones');
            const unknown = CampaignData.getItem('nonexistent');
            
            this.assertTrue(stones.name === 'Netherese Artifacts', 'Should find item data');
            this.assertTrue(stones.type === 'ancient_magic_items', 'Should have correct item type');
            this.assertTrue(unknown.type === 'unknown', 'Should handle unknown items gracefully');
            
            this.addTestResult('itemRetrieval', true, 'Item data retrieval works correctly');
            
        } catch (error) {
            this.addTestResult('itemRetrieval', false, `Failed: ${error.message}`);
        }
    }
    
    async testDataValidation() {
        try {
            const { CampaignData } = await import('../../data/campaign-data.js');
            
            // Test that Maps are properly initialized
            this.assertTrue(CampaignData.characters instanceof Map, 'Characters should be a Map');
            this.assertTrue(CampaignData.locations instanceof Map, 'Locations should be a Map');
            this.assertTrue(CampaignData.items instanceof Map, 'Items should be a Map');
            
            // Test that we have some data
            this.assertTrue(CampaignData.characters.size > 0, 'Should have character data');
            this.assertTrue(CampaignData.locations.size > 0, 'Should have location data');
            this.assertTrue(CampaignData.items.size > 0, 'Should have item data');
            
            this.addTestResult('dataValidation', true, 'Data structure validation works correctly');
            
        } catch (error) {
            this.addTestResult('dataValidation', false, `Failed: ${error.message}`);
        }
    }
    
    assertTrue(condition, message) {
        if (!condition) {
            throw new Error(`Assertion failed: ${message}`);
        }
    }
    
    addTestResult(testName, passed, message) {
        this.testResults.push({
            name: testName,
            passed: passed,
            message: message
        });
    }
    
    reportResults() {
        const passedTests = this.testResults.filter(test => test.passed).length;
        const totalTests = this.testResults.length;
        
        console.log(`Test Results: ${passedTests}/${totalTests} passed`);
        
        this.testResults.forEach(test => {
            const status = test.passed ? '✅' : '❌';
            console.log(`${status} ${test.name}: ${test.message}`);
        });
    }
}
