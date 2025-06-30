// Integration tests for full application flow
import { VellynneLetterApp } from '../../scripts/app.js';

class AppIntegrationTests {
    constructor() {
        this.testResults = [];
        this.testContainer = null;
    }
    
    async runAllTests() {
        console.log('Running integration tests...');
        
        this.setupTestEnvironment();
        
        await this.testFullApplicationLoad();
        await this.testTooltipInteraction();
        await this.testResponsiveLayout();
        await this.testDataFlowIntegrity();
        
        this.cleanupTestEnvironment();
        this.reportResults();
    }
    
    setupTestEnvironment() {
        // Create isolated test container
        this.testContainer = document.createElement('div');
        this.testContainer.id = 'test-app-container';
        this.testContainer.innerHTML = '<div id="loading-indicator">Loading...</div>';
        document.body.appendChild(this.testContainer);
    }
    
    async testFullApplicationLoad() {
        try {
            const app = new VellynneLetterApp();
            
            // Override container for testing
            const originalGetElementById = document.getElementById;
            document.getElementById = (id) => {
                if (id === 'app-container') return this.testContainer;
                return originalGetElementById.call(document, id);
            };
            
            await app.initialize();
            
            // Verify application loaded correctly
            this.assertTrue(app.isInitialized, 'Application should be initialized');
            this.assertTrue(this.testContainer.querySelector('.vellynne-letter'), 'Letter should be rendered');
            this.assertTrue(this.testContainer.querySelector('.letter-header'), 'Header should be present');
            
            // Restore original function
            document.getElementById = originalGetElementById;
            
            this.addTestResult('fullApplicationLoad', true, 'Application loads and renders correctly');
            
        } catch (error) {
            this.addTestResult('fullApplicationLoad', false, `Failed: ${error.message}`);
        }
    }
    
    async testTooltipInteraction() {
        try {
            // Find interactive element
            const characterRef = this.testContainer.querySelector('[data-character]');
            this.assertTrue(characterRef !== null, 'Should have character reference elements');
            
            // Simulate mouseover
            const mouseoverEvent = new MouseEvent('mouseover', { bubbles: true });
            characterRef.dispatchEvent(mouseoverEvent);
            
            // Check if tooltip appears
            await this.waitForElement('.tooltip-container.visible', 1000);
            const tooltip = document.querySelector('.tooltip-container.visible');
            this.assertTrue(tooltip !== null, 'Tooltip should appear on hover');
            
            // Simulate mouseout
            const mouseoutEvent = new MouseEvent('mouseout', { bubbles: true });
            characterRef.dispatchEvent(mouseoutEvent);
            
            this.addTestResult('tooltipInteraction', true, 'Tooltip system works correctly');
            
        } catch (error) {
            this.addTestResult('tooltipInteraction', false, `Failed: ${error.message}`);
        }
    }
    
    async waitForElement(selector, timeout = 1000) {
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeout) {
            const element = document.querySelector(selector);
            if (element) return element;
            
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        throw new Error(`Element ${selector} not found within ${timeout}ms`);
    }
    
    assertTrue(condition, message) {
        if (!condition) {
            throw new Error(`Assertion failed: ${message}`);
        }
    }
    
    addTestResult(testName, passed, message) {
        this.testResults.push({ name: testName, passed, message });
    }
    
    cleanupTestEnvironment() {
        if (this.testContainer && this.testContainer.parentNode) {
            this.testContainer.parentNode.removeChild(this.testContainer);
        }
    }
    
    reportResults() {
        const passedTests = this.testResults.filter(test => test.passed).length;
        const totalTests = this.testResults.length;
        
        console.log(`\nIntegration Test Results: ${passedTests}/${totalTests} passed`);
        
        this.testResults.forEach(test => {
            const status = test.passed ? '✅' : '❌';
            console.log(`${status} ${test.name}: ${test.message}`);
        });
    }
}

export { AppIntegrationTests };
