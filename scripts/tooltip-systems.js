// Dedicated tooltip management system
class TooltipSystem {
    constructor() {
        this.tooltipContainer = null;
        this.currentTooltip = null;
        this.campaignData = null;
        this.isInitialized = false;
    }
    
    async initialize(campaignData) {
        if (this.isInitialized) return;
        
        this.campaignData = campaignData;
        this.createTooltipContainer();
        this.bindEventListeners();
        this.isInitialized = true;
    }
    
    createTooltipContainer() {
        this.tooltipContainer = document.createElement('div');
        this.tooltipContainer.id = 'tooltip-container';
        this.tooltipContainer.className = 'tooltip-container';
        this.tooltipContainer.setAttribute('role', 'tooltip');
        this.tooltipContainer.setAttribute('aria-hidden', 'true');
        
        this.tooltipContainer.innerHTML = `
            <div class="tooltip-content">
                <div class="tooltip-header">
                    <span class="tooltip-title"></span>
                    <span class="tooltip-type"></span>
                </div>
                <div class="tooltip-body">
                    <p class="tooltip-description"></p>
                    <div class="tooltip-details"></div>
                </div>
                <div class="tooltip-arrow"></div>
            </div>
        `;
        
        document.body.appendChild(this.tooltipContainer);
    }
    
    bindEventListeners() {
        document.addEventListener('mouseover', this.handleMouseOver.bind(this));
        document.addEventListener('mouseout', this.handleMouseOut.bind(this));
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
    
    handleMouseOver(event) {
        const target = event.target;
        const tooltipData = this.extractTooltipData(target);
        
        if (tooltipData) {
            this.showTooltip(target, tooltipData);
        }
    }
    
    handleMouseOut(event) {
        const target = event.target;
        if (this.shouldHideTooltip(target, event.relatedTarget)) {
            this.hideTooltip();
        }
    }
    
    extractTooltipData(element) {
        // Character references
        if (element.dataset.character) {
            return this.campaignData.getCharacter(element.dataset.character);
        }
        
        // Location references
        if (element.dataset.location) {
            return this.campaignData.getLocation(element.dataset.location);
        }
        
        // Item references
        if (element.dataset.item) {
            return this.campaignData.getItem(element.dataset.item);
        }
        
        return null;
    }
    
    showTooltip(targetElement, data) {
        this.populateTooltipContent(data);
        this.positionTooltip(targetElement);
        this.tooltipContainer.setAttribute('aria-hidden', 'false');
        this.tooltipContainer.classList.add('visible');
        this.currentTooltip = { element: targetElement, data };
    }
    
    populateTooltipContent(data) {
        const title = this.tooltipContainer.querySelector('.tooltip-title');
        const type = this.tooltipContainer.querySelector('.tooltip-type');
        const description = this.tooltipContainer.querySelector('.tooltip-description');
        
        title.textContent = data.name;
        type.textContent = data.type;
        description.textContent = data.description;
    }
    
    positionTooltip(targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const tooltipRect = this.tooltipContainer.getBoundingClientRect();
        
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 10;
        
        // Viewport boundary adjustments
        left = Math.max(10, Math.min(left, window.innerWidth - tooltipRect.width - 10));
        
        if (top < 10) {
            top = rect.bottom + 10;
            this.tooltipContainer.classList.add('below');
        } else {
            this.tooltipContainer.classList.remove('below');
        }
        
        this.tooltipContainer.style.left = `${left}px`;
        this.tooltipContainer.style.top = `${top}px`;
    }
    
    hideTooltip() {
        if (this.currentTooltip) {
            this.tooltipContainer.setAttribute('aria-hidden', 'true');
            this.tooltipContainer.classList.remove('visible');
            this.currentTooltip = null;
        }
    }
}

export { TooltipSystem };
