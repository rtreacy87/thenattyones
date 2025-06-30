// Application configuration
export class AppConfig {
    static config = {
        version: '1.0.0',
        environment: 'development',
        features: {
            tooltips: true,
            animations: true,
            responsive: true
        },
        performance: {
            maxLoadTime: 3000,
            enableCaching: true
        }
    };
    
    static async load() {
        console.log('AppConfig loaded:', this.config);
        return this.config;
    }
    
    static get(key) {
        return this.config[key];
    }
    
    static set(key, value) {
        this.config[key] = value;
    }
}
