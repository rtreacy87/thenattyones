// Performance testing for modular architecture
class PerformanceTests {
    constructor() {
        this.metrics = {};
        this.thresholds = {
            initialLoad: 2000,      // 2 seconds max
            moduleLoad: 500,        // 500ms per module max
            tooltipResponse: 100,   // 100ms max tooltip response
            memoryUsage: 10         // 10MB max memory usage
        };
    }
    
    async runPerformanceTests() {
        console.log('Running performance tests...');
        
        await this.testInitialLoadTime();
        await this.testModuleLoadTimes();
        await this.testTooltipResponseTime();
        await this.testMemoryUsage();
        
        this.reportPerformanceResults();
    }
    
    async testInitialLoadTime() {
        const startTime = performance.now();
        
        // Simulate full application load
        const app = new VellynneLetterApp();
        await app.initialize();
        
        const loadTime = performance.now() - startTime;
        this.metrics.initialLoad = loadTime;
        
        console.log(`Initial load time: ${loadTime.toFixed(2)}ms`);
    }
    
    async testModuleLoadTimes() {
        const modules = [
            () => import('../../scripts/content-manager.js'),
            () => import('../../scripts/component-renderer.js'),
            () => import('../../scripts/tooltip-system.js'),
            () => import('../../data/campaign-data.js')
        ];
        
        this.metrics.moduleLoads = [];
        
        for (const moduleLoader of modules) {
            const startTime = performance.now();
            await moduleLoader();
            const loadTime = performance.now() - startTime;
            
            this.metrics.moduleLoads.push(loadTime);
            console.log(`Module load time: ${loadTime.toFixed(2)}ms`);
        }
    }
    
    async testTooltipResponseTime() {
        // Test tooltip response time
        const testElement = document.createElement('span');
        testElement.setAttribute('data-character', 'rothbart');
        document.body.appendChild(testElement);
        
        const startTime = performance.now();
        
        const mouseoverEvent = new MouseEvent('mouseover', { bubbles: true });
        testElement.dispatchEvent(mouseoverEvent);
        
        // Wait for tooltip to appear
        await this.waitForTooltip();
        
        const responseTime = performance.now() - startTime;
        this.metrics.tooltipResponse = responseTime;
        
        console.log(`Tooltip response time: ${responseTime.toFixed(2)}ms`);
        
        document.body.removeChild(testElement);
    }
    
    async waitForTooltip() {
        return new Promise(resolve => {
            const checkTooltip = () => {
                const tooltip = document.querySelector('.tooltip-container.visible');
                if (tooltip) {
                    resolve();
                } else {
                    setTimeout(checkTooltip, 10);
                }
            };
            checkTooltip();
        });
    }
    
    reportPerformanceResults() {
        console.log('\n=== Performance Test Results ===');
        
        Object.entries(this.metrics).forEach(([metric, value]) => {
            const threshold = this.thresholds[metric];
            const passed = Array.isArray(value) ? 
                value.every(v => v <= threshold) : 
                value <= threshold;
            
            const status = passed ? '✅' : '❌';
            const displayValue = Array.isArray(value) ? 
                `avg: ${(value.reduce((a, b) => a + b, 0) / value.length).toFixed(2)}ms` :
                `${value.toFixed(2)}ms`;
            
            console.log(`${status} ${metric}: ${displayValue} (threshold: ${threshold}ms)`);
        });
    }
}

export { PerformanceTests };
