// Tooltip system for interactive elements
export class TooltipSystem {
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
        
        console.log('TooltipSystem initialized');
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
                </div>
                <div class="tooltip-arrow"></div>
            </div>
        `;
        
        document.body.appendChild(this.tooltipContainer);
    }
    
    bindEventListeners() {
        document.addEventListener('mouseover', this.handleMouseOver.bind(this));
        document.addEventListener('mouseout', this.handleMouseOut.bind(this));
    }
    
    handleMouseOver(event) {
        const target = event.target;
        const tooltipData = this.extractTooltipData(target);
        
        if (tooltipData) {
            this.showTooltip(target, tooltipData);
        }
    }
    
    handleMouseOut(event) {
        if (this.currentTooltip) {
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
        
        let left = rect.left + (rect.width / 2) - 150; // Assume 300px width tooltip
        let top = rect.top - 100; // Assume 80px height tooltip
        
        // Simple viewport boundary check
        left = Math.max(10, Math.min(left, window.innerWidth - 310));
        top = Math.max(10, top);
        
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
