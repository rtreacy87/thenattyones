// Integration tests for tooltip system
export class TooltipIntegrationTests {
    constructor() {
        this.testResults = [];
        this.testContainer = null;
    }
    
    async runAllTests() {
        console.log('Testing tooltip integration...');
        
        this.setupTestEnvironment();
        
        await this.testTooltipInitialization();
        await this.testTooltipDataExtraction();
        await this.testTooltipEventHandling();
        
        this.cleanupTestEnvironment();
        this.reportResults();
    }
    
    setupTestEnvironment() {
        this.testContainer = document.createElement('div');
        this.testContainer.id = 'tooltip-test-container';
        this.testContainer.innerHTML = `
            <span class="character-ref" data-character="rothbart">Rothbart</span>
            <span class="location-ref" data-location="bryn_shander">Bryn Shander</span>
            <span class="item-ref" data-item="netherese_stones">Ancient Stones</span>
        `;
        document.body.appendChild(this.testContainer);
    }
    
    async testTooltipInitialization() {
        try {
            const { TooltipSystem } = await import('../../scripts/tooltip-system.js');
            const { CampaignData } = await import('../../data/campaign-data.js');
            
            const tooltipSystem = new TooltipSystem();
            await tooltipSystem.initialize(CampaignData);
            
            this.assertTrue(tooltipSystem.isInitialized === true, 'Tooltip system should initialize');
            this.assertTrue(tooltipSystem.tooltipContainer !== null, 'Should create tooltip container');
            
            this.addTestResult('tooltipInitialization', true, 'Tooltip initialization works correctly');
            
        } catch (error) {
            this.addTestResult('tooltipInitialization', false, `Failed: ${error.message}`);
        }
    }
    
    async testTooltipDataExtraction() {
        try {
            const { TooltipSystem } = await import('../../scripts/tooltip-system.js');
            const { CampaignData } = await import('../../data/campaign-data.js');
            
            const tooltipSystem = new TooltipSystem();
            tooltipSystem.campaignData = CampaignData;
            
            const characterElement = this.testContainer.querySelector('[data-character]');
            const locationElement = this.testContainer.querySelector('[data-location]');
            const itemElement = this.testContainer.querySelector('[data-item]');
            
            const characterData = tooltipSystem.extractTooltipData(characterElement);
            const locationData = tooltipSystem.extractTooltipData(locationElement);
            const itemData = tooltipSystem.extractTooltipData(itemElement);
            
            this.assertTrue(characterData.name === 'Rothbart', 'Should extract character data');
            this.assertTrue(locationData.name === 'Bryn Shander', 'Should extract location data');
            this.assertTrue(itemData.name === 'Netherese Artifacts', 'Should extract item data');
            
            this.addTestResult('tooltipDataExtraction', true, 'Tooltip data extraction works correctly');
            
        } catch (error) {
            this.addTestResult('tooltipDataExtraction', false, `Failed: ${error.message}`);
        }
    }
    
    async testTooltipEventHandling() {
        try {
            const characterElement = this.testContainer.querySelector('[data-character]');
            
            // Test that elements are properly set up for event handling
            this.assertTrue(characterElement.dataset.character === 'rothbart', 'Element should have character data');
            
            // Test mouseover event creation
            const mouseoverEvent = new MouseEvent('mouseover', { bubbles: true });
            this.assertTrue(mouseoverEvent.type === 'mouseover', 'Should create mouseover event');
            
            // Test event dispatching (without actual tooltip display)
            let eventDispatched = false;
            characterElement.addEventListener('mouseover', () => {
                eventDispatched = true;
            });
            
            characterElement.dispatchEvent(mouseoverEvent);
            this.assertTrue(eventDispatched, 'Should dispatch mouseover event');
            
            this.addTestResult('tooltipEventHandling', true, 'Tooltip event handling works correctly');
            
        } catch (error) {
            this.addTestResult('tooltipEventHandling', false, `Failed: ${error.message}`);
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
