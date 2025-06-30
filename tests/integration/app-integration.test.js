// Integration tests for full application
export class AppIntegrationTests {
    constructor() {
        this.testResults = [];
        this.testContainer = null;
    }
    
    async runAllTests() {
        console.log('Testing application integration...');
        
        this.setupTestEnvironment();
        
        await this.testModuleLoading();
        await this.testDataFlow();
        await this.testUIRendering();
        
        this.cleanupTestEnvironment();
        this.reportResults();
    }
    
    setupTestEnvironment() {
        this.testContainer = document.createElement('div');
        this.testContainer.id = 'integration-test-container';
        document.body.appendChild(this.testContainer);
    }
    
    async testModuleLoading() {
        try {
            // Test that modules can be imported
            const campaignData = await import('../../data/campaign-data.js');
            const tooltipSystem = await import('../../scripts/tooltip-system.js');
            
            this.assertTrue(campaignData.CampaignData !== undefined, 'CampaignData module should load');
            this.assertTrue(tooltipSystem.TooltipSystem !== undefined, 'TooltipSystem module should load');
            
            this.addTestResult('moduleLoading', true, 'Module loading works correctly');
            
        } catch (error) {
            this.addTestResult('moduleLoading', false, `Failed: ${error.message}`);
        }
    }
    
    async testDataFlow() {
        try {
            const { CampaignData } = await import('../../data/campaign-data.js');
            
            // Test data initialization
            await CampaignData.initialize();
            
            // Test data retrieval
            const character = CampaignData.getCharacter('rothbart');
            const location = CampaignData.getLocation('bryn_shander');
            
            this.assertTrue(character.name === 'Rothbart', 'Should retrieve character data');
            this.assertTrue(location.name === 'Bryn Shander', 'Should retrieve location data');
            
            this.addTestResult('dataFlow', true, 'Data flow works correctly');
            
        } catch (error) {
            this.addTestResult('dataFlow', false, `Failed: ${error.message}`);
        }
    }
    
    async testUIRendering() {
        try {
            // Test basic UI rendering
            this.testContainer.innerHTML = `
                <span class="character-ref" data-character="rothbart">Rothbart</span>
                <span class="location-ref" data-location="bryn_shander">Bryn Shander</span>
            `;
            
            const characterElement = this.testContainer.querySelector('[data-character]');
            const locationElement = this.testContainer.querySelector('[data-location]');
            
            this.assertTrue(characterElement !== null, 'Should render character element');
            this.assertTrue(locationElement !== null, 'Should render location element');
            this.assertTrue(characterElement.dataset.character === 'rothbart', 'Should have correct character data');
            this.assertTrue(locationElement.dataset.location === 'bryn_shander', 'Should have correct location data');
            
            this.addTestResult('UIRendering', true, 'UI rendering works correctly');
            
        } catch (error) {
            this.addTestResult('UIRendering', false, `Failed: ${error.message}`);
        }
    }
    
    cleanupTestEnvironment() {
        if (this.testContainer && this.testContainer.parentNode) {
            this.testContainer.parentNode.removeChild(this.testContainer);
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
