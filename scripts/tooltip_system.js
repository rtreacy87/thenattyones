/**
 * Tooltip System - Interactive Campaign Element Tooltips
 * Manages hover/focus tooltips for characters, locations, items, and events
 */

const TooltipSystem = {
    // Configuration
    config: {
        showDelay: 500,           // ms to wait before showing tooltip
        hideDelay: 100,           // ms to wait before hiding tooltip
        positionOffset: 10,       // px offset from cursor/element
        maxWidth: 320,            // max tooltip width
        animationDuration: 300,   // CSS transition duration
        touchHoldDuration: 800    // ms for mobile long-press
    },

    // Private state
    _isInitialized: false,
    _activeTooltip: null,
    _showTimer: null,
    _hideTimer: null,
    _isTouchDevice: false,
    _touchTimer: null,
    _lastTouchTarget: null,

    /**
     * Initialize the tooltip system
     */
    initialize() {
        if (this._isInitialized) {
            return;
        }

        // Detect touch device
        this._isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        // Setup event listeners
        this._setupEventListeners();

        // Create tooltip container if it doesn't exist
        this._ensureTooltipContainer();

        this._isInitialized = true;
        console.log('Tooltip system initialized');
    },

    /**
     * Setup all required event listeners
     * @private
     */
    _setupEventListeners() {
        const letterBody = document.querySelector('.letter-body');
        if (!letterBody) {
            console.warn('Letter body not found for tooltip initialization');
            return;
        }

        // Mouse events for desktop
        if (!this._isTouchDevice) {
            letterBody.addEventListener('mouseover', this._handleMouseOver.bind(this));
            letterBody.addEventListener('mouseout', this._handleMouseOut.bind(this));
            letterBody.addEventListener('mousemove', this._handleMouseMove.bind(this));
        }

        // Touch events for mobile
        if (this._isTouchDevice) {
            letterBody.addEventListener('touchstart', this._handleTouchStart.bind(this));
            letterBody.addEventListener('touchend', this._handleTouchEnd.bind(this));
        }

        // Keyboard events for accessibility
        letterBody.addEventListener('focusin', this._handleFocusIn.bind(this));
        letterBody.addEventListener('focusout', this._handleFocusOut.bind(this));

        // Global events
        document.addEventListener('scroll', this._handleScroll.bind(this));
        window.addEventListener('resize', this._handleResize.bind(this));

        // Hide tooltip when clicking elsewhere
        document.addEventListener('click', this._handleDocumentClick.bind(this));
    },

    /**
     * Handle mouse over events
     * @private
     */
    _handleMouseOver(event) {
        const target = this._findTooltipTarget(event.target);
        if (!target) return;

        this._clearTimers();
        this._showTimer = setTimeout(() => {
            this._showTooltip(target, event);
        }, this.config.showDelay);
    },

    /**
     * Handle mouse out events
     * @private
     */
    _handleMouseOut(event) {
        const target = this._findTooltipTarget(event.target);
        if (!target) return;

        this._clearTimers();
        this._hideTimer = setTimeout(() => {
            this._hideTooltip();
        }, this.config.hideDelay);
    },

    /**
     * Handle mouse move for tooltip positioning
     * @private
     */
    _handleMouseMove(event) {
        if (this._activeTooltip) {
            this._updateTooltipPosition(event.clientX, event.clientY);
        }
    },

    /**
     * Handle touch start for mobile tooltips
     * @private
     */
    _handleTouchStart(event) {
        const target = this._findTooltipTarget(event.target);
        if (!target) return;

        this._lastTouchTarget = target;
        this._touchTimer = setTimeout(() => {
            const touch = event.touches[0];
            this._showTooltip(target, {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
        }, this.config.touchHoldDuration);
    },

    /**
     * Handle touch end
     * @private
     */
    _handleTouchEnd(event) {
        if (this._touchTimer) {
            clearTimeout(this._touchTimer);
            this._touchTimer = null;
        }

        // Hide tooltip after a delay on touch end
        setTimeout(() => {
            this._hideTooltip();
        }, 2000);
    },

    /**
     * Handle focus events for keyboard navigation
     * @private
     */
    _handleFocusIn(event) {
        const target = this._findTooltipTarget(event.target);
        if (!target) return;

        this._showTooltip(target, this._getElementPosition(target));
    },

    /**
     * Handle focus out events
     * @private
     */
    _handleFocusOut(event) {
        this._hideTimer = setTimeout(() => {
            this._hideTooltip();
        }, this.config.hideDelay);
    },

    /**
     * Handle scroll events
     * @private
     */
    _handleScroll() {
        if (this._activeTooltip) {
            this._hideTooltip();
        }
    },

    /**
     * Handle window resize
     * @private
     */
    _handleResize() {
        if (this._activeTooltip) {
            this._hideTooltip();
        }
    },

    /**
     * Handle document click
     * @private
     */
    _handleDocumentClick(event) {
        if (this._activeTooltip && !this._activeTooltip.contains(event.target)) {
            this._hideTooltip();
        }
    },

    /**
     * Find tooltip target element
     * @private
     * @param {Element} element - Starting element
     * @returns {Element|null} Tooltip target or null
     */
    _findTooltipTarget(element) {
        // Check if element or parent has tooltip data
        let current = element;
        while (current && current !== document.body) {
            if (this._hasTooltipData(current)) {
                return current;
            }
            current = current.parentElement;
        }
        return null;
    },

    /**
     * Check if element has tooltip data
     * @private
     * @param {Element} element - Element to check
     * @returns {boolean} True if has tooltip data
     */
    _hasTooltipData(element) {
        return element.hasAttribute('data-character') ||
               element.hasAttribute('data-location') ||
               element.hasAttribute('data-item') ||
               element.hasAttribute('data-event') ||
               element.hasAttribute('data-tooltip');
    },

    /**
     * Show tooltip for target element
     * @private
     * @param {Element} target - Target element
     * @param {Object} position - Position object with clientX, clientY
     */
    async _showTooltip(target, position) {
        // Hide any existing tooltip
        this._hideTooltip();

        // Get tooltip data
        const tooltipData = await this._getTooltipData(target);
        if (!tooltipData) return;

        // Create tooltip element
        const tooltip = this._createTooltipElement(tooltipData);
        
        // Position tooltip
        this._positionTooltip(tooltip, position);

        // Show tooltip
        this._activeTooltip = tooltip;
        tooltip.classList.add('visible');

        // Add accessibility attributes
        target.setAttribute('aria-describedby', 'tooltip-container');
        tooltip.setAttribute('aria-hidden', 'false');
    },

    /**
     * Hide active tooltip
     * @private
     */
    _hideTooltip() {
        if (!this._activeTooltip) return;

        // Remove accessibility attributes
        const describedElement = document.querySelector('[aria-describedby="tooltip-container"]');
        if (describedElement) {
            describedElement.removeAttribute('aria-describedby');
        }

        // Hide tooltip
        this._activeTooltip.classList.remove('visible');
        this._activeTooltip.setAttribute('aria-hidden', 'true');
        
        // Clean up after animation
        setTimeout(() => {
            if (this._activeTooltip && !this._activeTooltip.classList.contains('visible')) {
                this._clearTooltipContent();
            }
        }, this.config.animationDuration);

        this._activeTooltip = null;
    },

    /**
     * Get tooltip data for element
     * @private
     * @param {Element} element - Target element
     * @returns {Object|null} Tooltip data or null
     */
    async _getTooltipData(element) {
        // Ensure ContentLoader is available
        if (typeof ContentLoader === 'undefined' || !ContentLoader.isInitialized()) {
            console.warn('ContentLoader not available for tooltip data');
            return this._getFallbackTooltipData(element);
        }

        let data = null;
        let type = null;

        // Determine data type and get data
        if (element.hasAttribute('data-character')) {
            type = 'character';
            data = ContentLoader.getCharacter(element.getAttribute('data-character'));
        } else if (element.hasAttribute('data-location')) {
            type = 'location';
            data = ContentLoader.getLocation(element.getAttribute('data-location'));
        } else if (element.hasAttribute('data-item')) {
            type = 'item';
            data = ContentLoader.getItem(element.getAttribute('data-item'));
        } else if (element.hasAttribute('data-event')) {
            type = 'event';
            data = ContentLoader.getEvent(element.getAttribute('data-event'));
        }

        // Fallback to data-tooltip attribute
        if (!data && element.hasAttribute('data-tooltip')) {
            return {
                type: 'general',
                title: element.textContent || 'Information',
                description: element.getAttribute('data-tooltip')
            };
        }

        if (!data) return null;

        return {
            type,
            title: data.displayName || data.name,
            description: data.description,
            details: this._formatDetails(data, type)
        };
    },

    /**
     * Format additional details for tooltip
     * @private
     * @param {Object} data - Data object
     * @param {string} type - Data type
     * @returns {string} Formatted details
     */
    _formatDetails(data, type) {
        const details = [];

        switch (type) {
            case 'character':
                if (data.type) details.push(`Type: ${data.type}`);
                if (data.relationship) details.push(`Relationship: ${data.relationship}`);
                if (data.location) details.push(`Location: ${data.location}`);
                break;

            case 'location':
                if (data.type) details.push(`Type: ${data.type}`);
                if (data.status) details.push(`Status: ${data.status}`);
                if (data.population) details.push(`Population: ${data.population}`);
                break;

            case 'item':
                if (data.type) details.push(`Type: ${data.type}`);
                if (data.effects) details.push(`Effects: ${data.effects}`);
                if (data.abilities) details.push(`Abilities: ${data.abilities}`);
                break;

            case 'event':
                if (data.session) details.push(`Session: ${data.session}`);
                if (data.outcome) details.push(`Outcome: ${data.outcome}`);
                break;
        }

        return details.join(' • ');
    },

    /**
     * Create tooltip element
     * @private
     * @param {Object} tooltipData - Tooltip data
     * @returns {Element} Tooltip element
     */
    _createTooltipElement(tooltipData) {
        const container = this._getTooltipContainer();
        
        // Set tooltip type class
        container.className = `tooltip-container ${tooltipData.type}`;
        
        // Set content
        const titleElement = container.querySelector('.tooltip-title');
        const typeElement = container.querySelector('.tooltip-type');
        const descriptionElement = container.querySelector('.tooltip-description');
        const detailsElement = container.querySelector('.tooltip-details');

        titleElement.textContent = tooltipData.title || '';
        typeElement.textContent = tooltipData.type || '';
        descriptionElement.textContent = tooltipData.description || '';
        detailsElement.textContent = tooltipData.details || '';

        return container;
    },

    /**
     * Position tooltip relative to cursor or element
     * @private
     * @param {Element} tooltip - Tooltip element
     * @param {Object} position - Position coordinates
     */
    _positionTooltip(tooltip, position) {
        const { clientX = 0, clientY = 0 } = position;
        const offset = this.config.positionOffset;
        
        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Get tooltip dimensions
        tooltip.style.left = '0px';
        tooltip.style.top = '0px';
        const tooltipRect = tooltip.getBoundingClientRect();
        
        // Calculate position
        let left = clientX + offset;
        let top = clientY + offset;
        
        // Adjust if tooltip goes off screen
        if (left + tooltipRect.width > viewportWidth) {
            left = clientX - tooltipRect.width - offset;
        }
        
        if (top + tooltipRect.height > viewportHeight) {
            top = clientY - tooltipRect.height - offset;
        }
        
        // Ensure tooltip stays within viewport
        left = Math.max(offset, Math.min(left, viewportWidth - tooltipRect.width - offset));
        top = Math.max(offset, Math.min(top, viewportHeight - tooltipRect.height - offset));
        
        // Apply position
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
        
        // Update arrow position
        this._updateArrowPosition(tooltip, clientX, clientY, left, top);
    },

    /**
     * Update arrow position based on tooltip placement
     * @private
     */
    _updateArrowPosition(tooltip, cursorX, cursorY, tooltipLeft, tooltipTop) {
        tooltip.classList.remove('top', 'bottom', 'left', 'right');
        
        // Determine arrow position based on tooltip placement
        if (tooltipTop > cursorY) {
            tooltip.classList.add('top');
        } else {
            tooltip.classList.add('bottom');
        }
    },

    /**
     * Get or create tooltip container
     * @private
     * @returns {Element} Tooltip container
     */
    _getTooltipContainer() {
        let container = document.getElementById('tooltip-container');
        if (!container) {
            container = this._createTooltipContainer();
        }
        return container;
    },

    /**
     * Ensure tooltip container exists
     * @private
     */
    _ensureTooltipContainer() {
        if (!document.getElementById('tooltip-container')) {
            this._createTooltipContainer();
        }
    },

    /**
     * Create tooltip container element
     * @private
     * @returns {Element} Created container
     */
    _createTooltipContainer() {
        const container = document.createElement('div');
        container.id = 'tooltip-container';
        container.className = 'tooltip-container';
        container.setAttribute('role', 'tooltip');
        container.setAttribute('aria-hidden', 'true');
        
        container.innerHTML = `
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
        
        document.body.appendChild(container);
        return container;
    },

    /**
     * Clear tooltip content
     * @private
     */
    _clearTooltipContent() {
        const container = this._getTooltipContainer();
        container.querySelector('.tooltip-title').textContent = '';
        container.querySelector('.tooltip-type').textContent = '';
        container.querySelector('.tooltip-description').textContent = '';
        container.querySelector('.tooltip-details').textContent = '';
    },

    /**
     * Get element position for focus events
     * @private
     * @param {Element} element - Target element
     * @returns {Object} Position object
     */
    _getElementPosition(element) {
        const rect = element.getBoundingClientRect();
        return {
            clientX: rect.left + rect.width / 2,
            clientY: rect.top
        };
    },

    /**
     * Get fallback tooltip data when ContentLoader unavailable
     * @private
     * @param {Element} element - Target element
     * @returns {Object|null} Fallback data
     */
    _getFallbackTooltipData(element) {
        const tooltip = element.getAttribute('data-tooltip');
        if (tooltip) {
            return {
                type: 'general',
                title: element.textContent || 'Information',
                description: tooltip
            };
        }
        return null;
    },

    /**
     * Clear all timers
     * @private
     */
    _clearTimers() {
        if (this._showTimer) {
            clearTimeout(this._showTimer);
            this._showTimer = null;
        }
        if (this._hideTimer) {
            clearTimeout(this._hideTimer);
            this._hideTimer = null;
        }
        if (this._touchTimer) {
            clearTimeout(this._touchTimer);
            this._touchTimer = null;
        }
    },

    /**
     * Cleanup and destroy tooltip system
     */
    destroy() {
        this._clearTimers();
        this._hideTooltip();
        
        // Remove event listeners would go here
        // (omitted for brevity - would need to track listeners)
        
        this._isInitialized = false;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TooltipSystem;
}