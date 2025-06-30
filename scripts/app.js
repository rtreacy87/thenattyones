// Application bootstrap
import { CampaignData } from '../data/campaign-data.js';
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
            console.log('🚀 Initializing D&D Letter App...');
            
            await this.loadConfiguration();
            await this.initializeDataLayer();
            await this.renderLetter();
            await this.enableInteractivity();
            
            this.hideLoadingIndicator();
            this.isInitialized = true;
            
            console.log('✅ App initialized successfully!');
            
        } catch (error) {
            this.handleInitializationError(error);
        }
    }
    
    async loadConfiguration() {
        await AppConfig.load();
        console.log('📋 Configuration loaded');
    }
    
    async initializeDataLayer() {
        await CampaignData.initialize();
        console.log('📚 Campaign data initialized');
    }
    
    async renderLetter() {
        const container = document.getElementById('app-container');
        
        try {
            // Load letter data from JSON
            const letterData = await this.contentManager.loadLetterContent('vellynne-session2');
            
            // Render using component system
            this.componentRenderer.renderLetter(container, letterData);
            
            console.log('📝 Letter content rendered from JSON');
            
        } catch (error) {
            console.error('Failed to render letter:', error);
            this.showErrorMessage('Failed to load letter content.');
        }
    }
    
    async enableInteractivity() {
        await this.tooltipSystem.initialize(CampaignData);
        console.log('🖱️ Interactive features enabled');
    }
    
    hideLoadingIndicator() {
        const loading = document.getElementById('loading-indicator');
        if (loading) {
            loading.style.display = 'none';
        }
    }
    
    handleInitializationError(error) {
        console.error('❌ Application initialization failed:', error);
        this.showErrorMessage('Failed to load letter. Please refresh and try again.');
    }
    
    showErrorMessage(message) {
        const container = document.getElementById('app-container');
        container.innerHTML = `<div class="error-message">${message}</div>`;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new VellynneLetterApp();
    app.initialize();
});

export { VellynneLetterApp };
