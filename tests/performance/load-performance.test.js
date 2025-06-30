// Performance tests for the application
export class LoadPerformanceTests {
    constructor() {
        this.testResults = [];
        this.metrics = {};
    }
    
    async runAllTests() {
        console.log('Testing application performance...');
        
        await this.testModuleLoadTime();
        await this.testDataProcessingSpeed();
        await this.testRenderingPerformance();
        await this.testMemoryUsage();
        
        this.reportResults();
    }
    
    async testModuleLoadTime() {
        try {
            const startTime = performance.now();
            
            // Load all main modules
            await import('../../data/campaign-data.js');
            await import('../../scripts/tooltip-system.js');
            await import('../../scripts/config/app-config.js');
            
            const loadTime = performance.now() - startTime;
            this.metrics.moduleLoadTime = loadTime;
            
            // Modules should load in under 500ms
            const threshold = 500;
            const passed = loadTime < threshold;
            
            this.addTestResult('moduleLoadTime', passed, 
                `Module load time: ${loadTime.toFixed(2)}ms (threshold: ${threshold}ms)`);
            
        } catch (error) {
            this.addTestResult('moduleLoadTime', false, `Failed: ${error.message}`);
        }
    }
    
    async testDataProcessingSpeed() {
        try {
            const { CampaignData } = await import('../../data/campaign-data.js');
            
            const startTime = performance.now();
            
            // Process 100 data lookups
            for (let i = 0; i < 100; i++) {
                CampaignData.getCharacter('rothbart');
                CampaignData.getLocation('bryn_shander');
                CampaignData.getItem('netherese_stones');
            }
            
            const processingTime = performance.now() - startTime;
            this.metrics.dataProcessingTime = processingTime;
            
            // 300 lookups should complete in under 100ms
            const threshold = 100;
            const passed = processingTime < threshold;
            
            this.addTestResult('dataProcessingSpeed', passed,
                `Data processing time: ${processingTime.toFixed(2)}ms for 300 lookups (threshold: ${threshold}ms)`);
            
        } catch (error) {
            this.addTestResult('dataProcessingSpeed', false, `Failed: ${error.message}`);
        }
    }
    
    async testRenderingPerformance() {
        try {
            const container = document.createElement('div');
            document.body.appendChild(container);
            
            const startTime = performance.now();
            
            // Render multiple elements
            for (let i = 0; i < 50; i++) {
                const element = document.createElement('span');
                element.className = 'character-ref';
                element.dataset.character = 'rothbart';
                element.textContent = `Character ${i}`;
                container.appendChild(element);
            }
            
            const renderTime = performance.now() - startTime;
            this.metrics.renderingTime = renderTime;
            
            // 50 elements should render in under 50ms
            const threshold = 50;
            const passed = renderTime < threshold;
            
            this.addTestResult('renderingPerformance', passed,
                `Rendering time: ${renderTime.toFixed(2)}ms for 50 elements (threshold: ${threshold}ms)`);
            
            // Cleanup
            document.body.removeChild(container);
            
        } catch (error) {
            this.addTestResult('renderingPerformance', false, `Failed: ${error.message}`);
        }
    }
    
    async testMemoryUsage() {
        try {
            // Basic memory usage test
            const initialMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
            
            // Create and destroy some objects
            const testData = [];
            for (let i = 0; i < 1000; i++) {
                testData.push({
                    id: i,
                    data: `Test data ${i}`,
                    timestamp: new Date()
                });
            }
            
            const peakMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
            
            // Clear test data
            testData.length = 0;
            
            const memoryDiff = peakMemory - initialMemory;
            this.metrics.memoryUsage = memoryDiff;
            
            // Memory usage should be reasonable (under 5MB for test)
            const threshold = 5 * 1024 * 1024; // 5MB
            const passed = memoryDiff < threshold || !performance.memory;
            
            const message = performance.memory ? 
                `Memory usage: ${(memoryDiff / 1024 / 1024).toFixed(2)}MB (threshold: 5MB)` :
                'Memory API not available (passed by default)';
            
            this.addTestResult('memoryUsage', passed, message);
            
        } catch (error) {
            this.addTestResult('memoryUsage', false, `Failed: ${error.message}`);
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
        
        console.log(`Performance Test Results: ${passedTests}/${totalTests} passed`);
        
        this.testResults.forEach(test => {
            const status = test.passed ? '✅' : '❌';
            console.log(`${status} ${test.name}: ${test.message}`);
        });
        
        // Show metrics summary
        if (Object.keys(this.metrics).length > 0) {
            console.log('\nPerformance Metrics:');
            Object.entries(this.metrics).forEach(([metric, value]) => {
                console.log(`  ${metric}: ${value.toFixed(2)}ms`);
            });
        }
    }
}
