// Main test runner that coordinates all test suites
export class TestRunner {
    constructor(outputElement) {
        this.output = outputElement;
        this.totalTests = 0;
        this.passedTests = 0;
        this.startTime = 0;
    }
    
    async runAllTests() {
        this.startTime = performance.now();
        this.log('🧪 Starting D&D Letter Project Test Suite\n', 'section');
        
        try {
            // Unit Tests
            await this.runUnitTests();
            
            // Integration Tests  
            await this.runIntegrationTests();
            
            // Performance Tests
            await this.runPerformanceTests();
            
            this.showFinalResults();
            
        } catch (error) {
            this.log(`❌ Test suite failed: ${error.message}`, 'fail');
            console.error(error);
        }
    }
    
    async runUnitTests() {
        this.log('📦 Running Unit Tests', 'section');
        
        const { ContentManagerTests } = await import('./unit/content-manager.test.js');
        const { CampaignDataTests } = await import('./unit/campaign-data.test.js');
        const { ComponentRendererTests } = await import('./unit/component-renderer.test.js');
        
        const contentTests = new ContentManagerTests();
        const dataTests = new CampaignDataTests();
        const rendererTests = new ComponentRendererTests();
        
        await this.runTestSuite('ContentManager', contentTests);
        await this.runTestSuite('CampaignData', dataTests);
        await this.runTestSuite('ComponentRenderer', rendererTests);
    }
    
    async runIntegrationTests() {
        this.log('🔗 Running Integration Tests', 'section');
        
        const { AppIntegrationTests } = await import('./integration/app-integration.test.js');
        const { TooltipIntegrationTests } = await import('./integration/tooltip-integration.test.js');
        
        const appTests = new AppIntegrationTests();
        const tooltipTests = new TooltipIntegrationTests();
        
        await this.runTestSuite('App Integration', appTests);
        await this.runTestSuite('Tooltip Integration', tooltipTests);
    }
    
    async runPerformanceTests() {
        this.log('⚡ Running Performance Tests', 'section');
        
        const { LoadPerformanceTests } = await import('./performance/load-performance.test.js');
        
        const perfTests = new LoadPerformanceTests();
        await this.runTestSuite('Load Performance', perfTests);
    }
    
    async runTestSuite(suiteName, testInstance) {
        try {
            this.log(`\n🧪 ${suiteName} Tests:`);
            
            // Capture console output for test results
            const originalLog = console.log;
            const testOutput = [];
            
            console.log = (...args) => {
                testOutput.push(args.join(' '));
            };
            
            // Run the test suite
            await testInstance.runAllTests();
            
            // Restore console.log
            console.log = originalLog;
            
            // Parse and display results
            this.parseTestResults(testOutput, suiteName);
            
        } catch (error) {
            this.log(`❌ ${suiteName} test suite failed: ${error.message}`, 'fail');
        }
    }
    
    parseTestResults(testOutput, suiteName) {
        let suitePassed = 0;
        let suiteTotal = 0;
        
        testOutput.forEach(line => {
            if (line.includes('✅')) {
                this.log(`  ${line}`, 'pass');
                suitePassed++;
                suiteTotal++;
                this.passedTests++;
                this.totalTests++;
            } else if (line.includes('❌')) {
                this.log(`  ${line}`, 'fail');
                suiteTotal++;
                this.totalTests++;
            } else if (line.includes('Test Results:')) {
                // Parse summary line
                const match = line.match(/(\d+)\/(\d+) passed/);
                if (match) {
                    this.log(`📊 ${suiteName}: ${match[1]}/${match[2]} tests passed\n`);
                }
            }
        });
    }
    
    showFinalResults() {
        const duration = ((performance.now() - this.startTime) / 1000).toFixed(2);
        const passRate = ((this.passedTests / this.totalTests) * 100).toFixed(1);
        
        this.log(`\n🏁 Test Suite Complete`, 'section');
        this.log(`⏱️  Duration: ${duration}s`);
        this.log(`📊 Results: ${this.passedTests}/${this.totalTests} tests passed (${passRate}%)`);
        
        if (this.passedTests === this.totalTests) {
            this.log(`🎉 All tests passed! Your D&D letter project is working perfectly.`, 'pass');
        } else {
            this.log(`⚠️  Some tests failed. Check the details above.`, 'fail');
        }
    }
    
    log(message, className = '') {
        const div = document.createElement('div');
        div.textContent = message;
        if (className) {
            div.className = className;
        }
        this.output.appendChild(div);
        
        // Also log to console for debugging
        console.log(message);
    }
}
