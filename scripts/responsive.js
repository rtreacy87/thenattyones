/**
 * Responsive Layout - Adaptive Behavior and Scroll Animations
 * Handles viewport changes, scroll-triggered animations, and mobile optimizations
 */

const ResponsiveLayout = {
    // Configuration
    config: {
        breakpoints: {
            mobile: 480,
            tablet: 768,
            desktop: 1024
        },
        scrollAnimationThreshold: 0.2, // Percentage of element visible to trigger
        debounceDelay: 250,             // ms for resize debouncing
        reducedMotion: false            // Respect user motion preferences
    },

    // Private state
    _isInitialized: false,
    _currentBreakpoint: null,
    _scrollElements: [],
    _resizeTimer: null,
    _intersectionObserver: null,

    /**
     * Initialize responsive layout system
     */
    initialize() {
        if (this._isInitialized) {
            return;
        }

        // Check user motion preferences
        this._checkMotionPreferences();

        // Set initial breakpoint
        this._updateBreakpoint();

        // Setup observers and listeners
        this._setupIntersectionObserver();
        this._setupEventListeners();
        this._setupScrollAnimations();

        // Initial load animations
        this._triggerLoadAnimations();

        this._isInitialized = true;
        console.log('Responsive layout initialized');
    },

    /**
     * Check user motion preferences
     * @private
     */
    _checkMotionPreferences() {
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.config.reducedMotion = true;
            document.body.classList.add('reduced-motion');
        }
    },

    /**
     * Setup event listeners
     * @private
     */
    _setupEventListeners() {
        // Window resize handler
        window.addEventListener('resize', this._handleResize.bind(this));

        // Orientation change handler
        window.addEventListener('orientationchange', this._handleOrientationChange.bind(this));

        // Motion preference changes
        if (window.matchMedia) {
            const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            motionQuery.addEventListener('change', this._handleMotionPreferenceChange.bind(this));
        }

        // Visibility change (tab switching)
        document.addEventListener('visibilitychange', this._handleVisibilityChange.bind(this));
    },

    /**
     * Setup intersection observer for scroll animations
     * @private
     */
    _setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) {
            // Fallback for older browsers
            this._setupFallbackScrollDetection();
            return;
        }

        const options = {
            root: null,
            rootMargin: '0px',
            threshold: [0, this.config.scrollAnimationThreshold, 0.5, 1]
        };

        this._intersectionObserver = new IntersectionObserver(
            this._handleIntersection.bind(this),
            options
        );
    },

    /**
     * Setup scroll animations
     * @private
     */
    _setupScrollAnimations() {
        // Find all elements that should animate on scroll
        const animatableElements = document.querySelectorAll(
            '.letter-paragraph, .letter-signature, .letter-postscript'
        );

        animatableElements.forEach(element => {
            // Add to scroll elements array
            this._scrollElements.push({
                element,
                isVisible: false,
                hasAnimated: false
            });

            // Start observing if IntersectionObserver available
            if (this._intersectionObserver) {
                this._intersectionObserver.observe(element);
            }
        });
    },

    /**
     * Handle intersection observer entries
     * @private
     * @param {Array} entries - Intersection entries
     */
    _handleIntersection(entries) {
        if (this.config.reducedMotion) return;

        entries.forEach(entry => {
            const scrollItem = this._scrollElements.find(item => item.element === entry.target);
            if (!scrollItem) return;

            const isVisible = entry.intersectionRatio >= this.config.scrollAnimationThreshold;

            if (isVisible && !scrollItem.hasAnimated) {
                this._animateElementIn(entry.target);
                scrollItem.hasAnimated = true;
                scrollItem.isVisible = true;
            }

            scrollItem.isVisible = isVisible;
        });
    },

    /**
     * Animate element into view
     * @private
     * @param {Element} element - Element to animate
     */
    _animateElementIn(element) {
        if (this.config.reducedMotion) {
            element.classList.add('visible');
            return;
        }

        // Add visible class with slight delay for staggered effect
        const delay = this._getAnimationDelay(element);
        
        setTimeout(() => {
            element.classList.add('visible');
            
            // Add magical highlight to important elements
            if (this._isImportantElement(element)) {
                this._addMagicalHighlight(element);
            }
        }, delay);
    },

    /**
     * Get animation delay for staggered effects
     * @private
     * @param {Element} element - Target element
     * @returns {number} Delay in milliseconds
     */
    _getAnimationDelay(element) {
        if (element.hasAttribute('data-paragraph')) {
            const paragraphNum = parseInt(element.getAttribute('data-paragraph')) || 0;
            return paragraphNum * 100; // 100ms between paragraphs
        }
        return 0;
    },

    /**
     * Check if element is important for special effects
     * @private
     * @param {Element} element - Element to check
     * @returns {boolean} True if important
     */
    _isImportantElement(element) {
        return element.querySelector('[data-item="netherese_stones"]') ||
               element.querySelector('[data-item="radiant_bracers"]') ||
               element.querySelector('[data-character="illithid"]');
    },

    /**
     * Add magical highlight effect to important elements
     * @private
     * @param {Element} element - Element to highlight
     */
    _addMagicalHighlight(element) {
        const importantElements = element.querySelectorAll('[data-item], [data-character]');
        
        importantElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('magical-highlight');
            }, index * 200);
        });
    },

    /**
     * Handle window resize
     * @private
     */
    _handleResize() {
        // Debounce resize events
        if (this._resizeTimer) {
            clearTimeout(this._resizeTimer);
        }

        this._resizeTimer = setTimeout(() => {
            this._updateBreakpoint();
            this._adjustLayoutForViewport();
            this._updateScrollAnimations();
        }, this.config.debounceDelay);
    },

    /**
     * Handle orientation change
     * @private
     */
    _handleOrientationChange() {
        // Delay to account for viewport changes
        setTimeout(() => {
            this._updateBreakpoint();
            this._adjustLayoutForViewport();
        }, 100);
    },

    /**
     * Handle motion preference changes
     * @private
     * @param {MediaQueryListEvent} event - Motion preference event
     */
    _handleMotionPreferenceChange(event) {
        this.config.reducedMotion = event.matches;
        
        if (event.matches) {
            document.body.classList.add('reduced-motion');
            // Show all elements immediately
            this._showAllElementsImmediately();
        } else {
            document.body.classList.remove('reduced-motion');
        }
    },

    /**
     * Handle visibility change (tab switching)
     * @private
     */
    _handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden - pause animations if needed
            this._pauseAnimations();
        } else {
            // Page is visible - resume animations
            this._resumeAnimations();
        }
    },

    /**
     * Update current breakpoint
     * @private
     */
    _updateBreakpoint() {
        const width = window.innerWidth;
        let newBreakpoint;

        if (width <= this.config.breakpoints.mobile) {
            newBreakpoint = 'mobile';
        } else if (width <= this.config.breakpoints.tablet) {
            newBreakpoint = 'tablet';
        } else {
            newBreakpoint = 'desktop';
        }

        if (newBreakpoint !== this._currentBreakpoint) {
            const oldBreakpoint = this._currentBreakpoint;
            this._currentBreakpoint = newBreakpoint;
            this._onBreakpointChange(oldBreakpoint, newBreakpoint);
        }
    },

    /**
     * Handle breakpoint changes
     * @private
     * @param {string} oldBreakpoint - Previous breakpoint
     * @param {string} newBreakpoint - New breakpoint
     */
    _onBreakpointChange(oldBreakpoint, newBreakpoint) {
        // Update body class
        if (oldBreakpoint) {
            document.body.classList.remove(`breakpoint-${oldBreakpoint}`);
        }
        document.body.classList.add(`breakpoint-${newBreakpoint}`);

        // Adjust specific layout elements
        this._adjustLetterLayout(newBreakpoint);
        
        console.log(`Breakpoint changed: ${oldBreakpoint} → ${newBreakpoint}`);
    },

    /**
     * Adjust letter layout for viewport
     * @private
     */
    _adjustLayoutForViewport() {
        const letterContainer = document.querySelector('.letter-container');
        const vellyneLetter = document.querySelector('.vellynne-letter');
        
        if (!letterContainer || !vellyneLetter) return;

        // Adjust container height for mobile
        if (this._currentBreakpoint === 'mobile') {
            letterContainer.style.minHeight = 'auto';
            vellyneLetter.style.marginTop = '1rem';
            vellyneLetter.style.marginBottom = '1rem';
        } else {
            letterContainer.style.minHeight = '100vh';
            vellyneLetter.style.marginTop = '';
            vellyneLetter.style.marginBottom = '';
        }
    },

    /**
     * Adjust letter-specific layout
     * @private
     * @param {string} breakpoint - Current breakpoint
     */
    _adjustLetterLayout(breakpoint) {
        const letterBody = document.querySelector('.letter-body');
        if (!letterBody) return;

        // Adjust text justification
        if (breakpoint === 'mobile') {
            letterBody.style.textAlign = 'left';
        } else {
            letterBody.style.textAlign = 'justify';
        }

        // Adjust signature positioning
        const signature = document.querySelector('.letter-signature');
        if (signature) {
            if (breakpoint === 'mobile') {
                signature.style.textAlign = 'center';
                signature.style.paddingRight = '0';
            } else {
                signature.style.textAlign = 'right';
                signature.style.paddingRight = '';
            }
        }
    },

    /**
     * Update scroll animations for new viewport
     * @private
     */
    _updateScrollAnimations() {
        // Recalculate which elements are in view
        if (this._intersectionObserver) {
            this._scrollElements.forEach(item => {
                this._intersectionObserver.unobserve(item.element);
                this._intersectionObserver.observe(item.element);
            });
        }
    },

    /**
     * Trigger initial load animations
     * @private
     */
    _triggerLoadAnimations() {
        const letterElement = document.querySelector('.vellynne-letter');
        if (!letterElement) return;

        if (this.config.reducedMotion) {
            letterElement.classList.add('loaded');
            this._showAllElementsImmediately();
            return;
        }

        // Delay to ensure styles are loaded
        setTimeout(() => {
            letterElement.classList.add('letter-reveal');
            
            // Add loaded class after reveal animation
            setTimeout(() => {
                letterElement.classList.add('loaded');
            }, 500);
        }, 100);
    },

    /**
     * Show all elements immediately (for reduced motion)
     * @private
     */
    _showAllElementsImmediately() {
        this._scrollElements.forEach(item => {
            item.element.classList.add('visible');
            item.hasAnimated = true;
        });
    },

    /**
     * Pause animations
     * @private
     */
    _pauseAnimations() {
        document.body.classList.add('animations-paused');
    },

    /**
     * Resume animations
     * @private
     */
    _resumeAnimations() {
        document.body.classList.remove('animations-paused');
    },

    /**
     * Setup fallback scroll detection for older browsers
     * @private
     */
    _setupFallbackScrollDetection() {
        let scrollTimer = null;

        const handleScroll = () => {
            if (scrollTimer) return;

            scrollTimer = setTimeout(() => {
                this._checkElementsInView();
                scrollTimer = null;
            }, 16); // ~60fps
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    },

    /**
     * Check which elements are in view (fallback method)
     * @private
     */
    _checkElementsInView() {
        const viewportHeight = window.innerHeight;

        this._scrollElements.forEach(item => {
            if (item.hasAnimated) return;

            const rect = item.element.getBoundingClientRect();
            const elementVisible = rect.top < viewportHeight * (1 - this.config.scrollAnimationThreshold);

            if (elementVisible) {
                this._animateElementIn(item.element);
                item.hasAnimated = true;
            }
        });
    },

    /**
     * Get current breakpoint
     * @returns {string} Current breakpoint name
     */
    getCurrentBreakpoint() {
        return this._currentBreakpoint;
    },

    /**
     * Check if mobile device
     * @returns {boolean} True if mobile
     */
    isMobile() {
        return this._currentBreakpoint === 'mobile';
    },

    /**
     * Check if motion is reduced
     * @returns {boolean} True if reduced motion
     */
    isReducedMotion() {
        return this.config.reducedMotion;
    },

    /**
     * Force refresh of all animations
     */
    refreshAnimations() {
        this._scrollElements.forEach(item => {
            item.hasAnimated = false;
            item.element.classList.remove('visible');
        });

        this._updateScrollAnimations();
    },

    /**
     * Cleanup and destroy responsive system
     */
    destroy() {
        // Clear timers
        if (this._resizeTimer) {
            clearTimeout(this._resizeTimer);
        }

        // Disconnect observer
        if (this._intersectionObserver) {
            this._intersectionObserver.disconnect();
        }

        // Remove event listeners would go here
        // (omitted for brevity - would need to track listeners)

        this._isInitialized = false;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResponsiveLayout;
}