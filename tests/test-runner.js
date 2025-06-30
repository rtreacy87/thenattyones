// Main test runner with better error handling
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
            await this.runUnitTests();
            await this.runIntegrationTests();
            await this.runPerformanceTests();
            
            this.showFinalResults();
            
        } catch (error) {
            this.log(`❌ Test suite failed: ${error.message}`, 'fail');
            console.error(error);
        }
    }
    
    async runUnitTests() {
        this.log('📦 Running Unit Tests', 'section');
        
        // Try to load each test module with error handling
        await this.tryRunTestSuite('ContentManager', () => import('./unit/content-manager.test.js'));
        await this.tryRunTestSuite('CampaignData', () => import('./unit/campaign-data.test.js'));
        await this.tryRunTestSuite('ComponentRenderer', () => import('./unit/component-renderer.test.js'));
    }
    
    async runIntegrationTests() {
        this.log('🔗 Running Integration Tests', 'section');
        
        await this.tryRunTestSuite('App Integration', () => import('./integration/app-integration.test.js'));
        await this.tryRunTestSuite('Tooltip Integration', () => import('./integration/tooltip-integration.test.js'));
    }
    
    async runPerformanceTests() {
        this.log('⚡ Running Performance Tests', 'section');
        
        await this.tryRunTestSuite('Load Performance', () => import('./performance/load-performance.test.js'));
    }
    
    async tryRunTestSuite(suiteName, moduleLoader) {
        try {
            this.log(`\n🧪 ${suiteName} Tests:`);
            
            const module = await moduleLoader();
            const TestClass = Object.values(module)[0]; // Get first export
            
            if (!TestClass) {
                throw new Error(`No test class found in ${suiteName} module`);
            }
            
            const testInstance = new TestClass();
            
            // Capture console output
            const originalLog = console.log;
            const testOutput = [];
            
            console.log = (...args) => {
                testOutput.push(args.join(' '));
            };
            
            await testInstance.runAllTests();
            
            // Restore console.log
            console.log = originalLog;
            
            // Parse and display results
            this.parseTestResults(testOutput, suiteName);
            
        } catch (error) {
            this.log(`❌ ${suiteName} test suite failed: ${error.message}`, 'fail');
            console.error(`Error in ${suiteName}:`, error);
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
                const match = line.match(/(\d+)\/(\d+) passed/);
                if (match) {
                    this.log(`📊 ${suiteName}: ${match[1]}/${match[2]} tests passed\n`);
                }
            }
        });
    }
    
    showFinalResults() {
        const duration = ((performance.now() - this.startTime) / 1000).toFixed(2);
        const passRate = this.totalTests > 0 ? ((this.passedTests / this.totalTests) * 100).toFixed(1) : 0;
        
        this.log(`\n🏁 Test Suite Complete`, 'section');
        this.log(`⏱️  Duration: ${duration}s`);
        this.log(`📊 Results: ${this.passedTests}/${this.totalTests} tests passed (${passRate}%)`);
        
        if (this.passedTests === this.totalTests && this.totalTests > 0) {
            this.log(`🎉 All tests passed! Your D&D letter project is working perfectly.`, 'pass');
        } else if (this.totalTests === 0) {
            this.log(`⚠️  No tests were run. Check that test files exist.`, 'fail');
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
