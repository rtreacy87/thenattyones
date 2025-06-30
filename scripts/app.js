// Application bootstrap and module coordination
import { CampaignData } from './data/campaign-data.js';
import { ContentManager } from './content-manager.js';
import { ComponentRenderer } from './component-renderer.js';
import { TooltipSystem } from './tooltip-system.js';
import { AppConfig } from './config/app-config.js';

class VellynneLetterApp {
    constructor() {
        this.contentManager = new ContentManager();
        this.componentRenderer = new ComponentRenderer();
        this.tooltipSystem = new TooltipSystem();
        this.isInitialized = false;
    }
    
    async initialize() {
        try {
            await this.loadConfiguration();
            await this.initializeDataLayer();
            await this.renderLetter();
            await this.enableInteractivity();
            
            this.hideLoadingIndicator();
            this.isInitialized = true;
            
        } catch (error) {
            this.handleInitializationError(error);
        }
    }
    
    async loadConfiguration() {
        // Load app configuration
        await AppConfig.load();
    }
    
    async initializeDataLayer() {
        // Initialize campaign data
        await CampaignData.initialize();
    }
    
    async renderLetter() {
        const container = document.getElementById('app-container');
        const letterData = await this.contentManager.loadLetterContent('vellynne-session2');
        
        this.componentRenderer.renderLetter(container, letterData);
    }
    
    async enableInteractivity() {
        await this.tooltipSystem.initialize(CampaignData);
    }
    
    hideLoadingIndicator() {
        const loading = document.getElementById('loading-indicator');
        if (loading) {
            loading.style.display = 'none';
        }
    }
    
    handleInitializationError(error) {
        console.error('Application initialization failed:', error);
        this.showErrorMessage('Failed to load letter. Please refresh and try again.');
    }
    
    showErrorMessage(message) {
        const container = document.getElementById('app-container');
        container.innerHTML = `<div class="error-message">${message}</div>`;
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new VellynneLetterApp();
    app.initialize();
});

export { VellynneLetterApp };
