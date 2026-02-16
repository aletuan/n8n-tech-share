// Application State
let tutorialData = null;
let currentStep = 1;
let totalSteps = 0;

// DOM Elements
const elements = {
    tutorialTitle: null,
    progressBar: null,
    progressText: null,
    stepTitle: null,
    stepContent: null,
    stepNavigation: null,
    prevBtn: null,
    nextBtn: null,
    mobileMenuToggle: null,
    sidebar: null
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    initializeElements();
    await loadContent();
    initializeFromURL();
    setupEventListeners();
    renderStepNavigation();
    renderCurrentStep();
});

// Initialize DOM element references
function initializeElements() {
    elements.tutorialTitle = document.getElementById('tutorial-title');
    elements.progressBar = document.getElementById('progress-bar');
    elements.progressText = document.getElementById('progress-text');
    elements.stepTitle = document.getElementById('step-title');
    elements.stepContent = document.getElementById('step-content');
    elements.stepNavigation = document.getElementById('step-navigation');
    elements.prevBtn = document.getElementById('prev-btn');
    elements.nextBtn = document.getElementById('next-btn');
    elements.mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    elements.sidebar = document.querySelector('.sidebar');
}

// Load content from JSON file
async function loadContent() {
    try {
        const response = await fetch('content.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        tutorialData = await response.json();
        totalSteps = tutorialData.steps.length;

        // Update tutorial title
        elements.tutorialTitle.textContent = tutorialData.title;
        document.title = tutorialData.title;

        // Render step navigation after content is loaded
        renderStepNavigation();
    } catch (error) {
        console.error('Error loading content:', error);
        elements.stepContent.innerHTML = '<p>Error loading tutorial content. Please refresh the page.</p>';
    }
}

// Initialize current step from URL hash
function initializeFromURL() {
    const hash = window.location.hash;
    if (hash) {
        const match = hash.match(/^#step-(\d+)$/);
        if (match) {
            const stepNum = parseInt(match[1], 10);
            if (stepNum >= 1 && stepNum <= totalSteps) {
                currentStep = stepNum;
                return;
            }
        }
    }
    // Default to step 1
    currentStep = 1;
    updateURL();
}

// Setup event listeners
function setupEventListeners() {
    elements.prevBtn.addEventListener('click', goToPreviousStep);
    elements.nextBtn.addEventListener('click', goToNextStep);
    window.addEventListener('hashchange', handleHashChange);

    // Mobile menu toggle
    if (elements.mobileMenuToggle) {
        elements.mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!elements.sidebar.contains(e.target) && !elements.mobileMenuToggle.contains(e.target)) {
                closeMobileMenu();
            }
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentStep > 1) {
            goToPreviousStep();
        } else if (e.key === 'ArrowRight' && currentStep < totalSteps) {
            goToNextStep();
        }
    });
}

// Navigation functions
function goToPreviousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateURL();
        renderCurrentStep();
        scrollToTop();
    }
}

function goToNextStep() {
    if (currentStep < totalSteps) {
        currentStep++;
        updateURL();
        renderCurrentStep();
        scrollToTop();
    }
}

function handleHashChange() {
    initializeFromURL();
    renderCurrentStep();
    scrollToTop();
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Update URL hash
function updateURL() {
    window.history.pushState(null, '', `#step-${currentStep}`);
}

// Render current step
function renderCurrentStep() {
    if (!tutorialData || !tutorialData.steps) {
        return;
    }

    const step = tutorialData.steps.find(s => s.id === currentStep);
    if (!step) {
        elements.stepContent.innerHTML = '<p>Step not found.</p>';
        return;
    }

    // Update step title - removed to avoid redundancy with sidebar
    // elements.stepTitle.textContent = step.title;

    // Render content blocks
    elements.stepContent.innerHTML = '';
    step.content.forEach(block => {
        const blockElement = renderContentBlock(block);
        if (blockElement) {
            elements.stepContent.appendChild(blockElement);
        }
    });

    // Re-run Prism syntax highlighting
    if (window.Prism) {
        Prism.highlightAll();
    }

    // Update progress
    updateProgress();

    // Update navigation buttons
    updateNavigationButtons();

    // Update step navigation
    updateStepNavigation();

    // Close mobile menu after navigation
    closeMobileMenu();
}

// Render individual content block
function renderContentBlock(block) {
    switch (block.type) {
        case 'text':
            return renderTextBlock(block);
        case 'image':
            return renderImageBlock(block);
        case 'code':
            return renderCodeBlock(block);
        case 'tabs':
            return renderTabsBlock(block);
        default:
            console.warn('Unknown content block type:', block.type);
            return null;
    }
}

// Render text block
function renderTextBlock(block) {
    const div = document.createElement('div');
    div.className = 'content-text';
    div.innerHTML = block.value;
    return div;
}

// Render image block
function renderImageBlock(block) {
    const div = document.createElement('div');
    div.className = 'content-image';

    const img = document.createElement('img');
    img.src = block.src;
    img.alt = block.alt || 'Tutorial image';

    // Optional: Add loading error handler
    img.onerror = () => {
        div.innerHTML = `<p><em>Image not found: ${block.src}</em></p>`;
    };

    div.appendChild(img);
    return div;
}

// Render code block
function renderCodeBlock(block) {
    const div = document.createElement('div');
    div.className = 'content-code';

    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.className = `language-${block.language || 'json'}`;
    code.textContent = block.value;

    pre.appendChild(code);
    div.appendChild(pre);
    return div;
}

// Render tabs block
function renderTabsBlock(block) {
    const container = document.createElement('div');
    container.className = 'content-tabs';

    // Create tab buttons container
    const tabButtons = document.createElement('div');
    tabButtons.className = 'tab-buttons';
    tabButtons.setAttribute('role', 'tablist');

    // Create tab panels container
    const tabPanels = document.createElement('div');
    tabPanels.className = 'tab-panels';

    // Generate unique ID for this tab group
    const tabGroupId = `tabs-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    block.tabs.forEach((tab, index) => {
        const isActive = index === 0;

        // Create tab button
        const button = document.createElement('button');
        button.className = `tab-button ${isActive ? 'active' : ''}`;
        button.textContent = tab.label;
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-selected', isActive ? 'true' : 'false');
        button.setAttribute('aria-controls', `${tabGroupId}-panel-${tab.id}`);
        button.setAttribute('id', `${tabGroupId}-tab-${tab.id}`);

        // Create tab panel
        const panel = document.createElement('div');
        panel.className = `tab-panel ${isActive ? 'active' : ''}`;
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', `${tabGroupId}-tab-${tab.id}`);
        panel.setAttribute('id', `${tabGroupId}-panel-${tab.id}`);

        // Render content blocks inside the panel
        tab.content.forEach(contentBlock => {
            const blockElement = renderContentBlock(contentBlock);
            if (blockElement) {
                panel.appendChild(blockElement);
            }
        });

        // Add click handler to switch tabs
        button.addEventListener('click', () => {
            // Deactivate all tabs in this group
            tabButtons.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            tabPanels.querySelectorAll('.tab-panel').forEach(pnl => {
                pnl.classList.remove('active');
            });

            // Activate clicked tab
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
            panel.classList.add('active');

            // Re-highlight code if switching to a code tab
            if (window.Prism) {
                Prism.highlightAllUnder(panel);
            }
        });

        tabButtons.appendChild(button);
        tabPanels.appendChild(panel);
    });

    container.appendChild(tabButtons);
    container.appendChild(tabPanels);

    return container;
}

// Update progress indicators
function updateProgress() {
    const percentage = (currentStep / totalSteps) * 100;
    // Use transform instead of width for better performance (compositor property)
    elements.progressBar.style.transform = `scaleX(${percentage / 100})`;

    const progressText = `Step ${currentStep} of ${totalSteps}`;
    elements.progressText.textContent = progressText;
}

// Update navigation button states
function updateNavigationButtons() {
    // Previous button
    elements.prevBtn.disabled = currentStep === 1;

    // Next button
    if (currentStep === totalSteps) {
        elements.nextBtn.textContent = 'Complete Tutorial';
    } else {
        elements.nextBtn.textContent = 'Next';
    }
    elements.nextBtn.disabled = false;
}

// Render step navigation in sidebar
function renderStepNavigation() {
    if (!tutorialData || !elements.stepNavigation) {
        return;
    }

    elements.stepNavigation.innerHTML = '';

    tutorialData.steps.forEach(step => {
        const navItem = document.createElement('div');
        navItem.className = 'step-nav-item';
        navItem.dataset.stepId = step.id;

        const number = document.createElement('div');
        number.className = 'step-nav-number';
        number.textContent = step.id;

        const title = document.createElement('div');
        title.className = 'step-nav-title';
        title.textContent = step.title;

        navItem.appendChild(number);
        navItem.appendChild(title);

        navItem.addEventListener('click', () => goToStep(step.id));

        elements.stepNavigation.appendChild(navItem);
    });

    updateStepNavigation();
}

// Update step navigation active state
function updateStepNavigation() {
    if (!elements.stepNavigation) {
        return;
    }

    const navItems = elements.stepNavigation.querySelectorAll('.step-nav-item');
    navItems.forEach(item => {
        const stepId = parseInt(item.dataset.stepId, 10);
        item.classList.remove('active', 'completed');

        if (stepId === currentStep) {
            item.classList.add('active');
        } else if (stepId < currentStep) {
            item.classList.add('completed');
        }
    });
}

// Navigate to specific step
function goToStep(stepId) {
    if (stepId >= 1 && stepId <= totalSteps) {
        currentStep = stepId;
        updateURL();
        renderCurrentStep();
        scrollToTop();
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    if (elements.sidebar && elements.mobileMenuToggle) {
        elements.sidebar.classList.toggle('active');
        elements.mobileMenuToggle.classList.toggle('active');
    }
}

// Close mobile menu
function closeMobileMenu() {
    if (window.innerWidth <= 768 && elements.sidebar && elements.mobileMenuToggle) {
        elements.sidebar.classList.remove('active');
        elements.mobileMenuToggle.classList.remove('active');
    }
}

// ============================================
// Developer Features - Copy Buttons & Enhanced Keyboard Nav
// ============================================

// Copy Button for Code Blocks
function addCopyButtons() {
    const codeBlocks = document.querySelectorAll('.content-code');
    
    codeBlocks.forEach(block => {
        // Skip if copy button already exists
        if (block.querySelector('.copy-button')) {
            return;
        }
        
        // Wrap in a container for positioning
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        block.parentNode.insertBefore(wrapper, block);
        wrapper.appendChild(block);
        
        // Create copy button
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.textContent = 'Copy';
        button.setAttribute('aria-label', 'Copy code');
        
        button.addEventListener('click', () => {
            const code = block.querySelector('code').textContent;
            navigator.clipboard.writeText(code).then(() => {
                button.classList.add('copied');
                button.textContent = 'Copied';
                
                setTimeout(() => {
                    button.classList.remove('copied');
                    button.textContent = 'Copy';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy:', err);
            });
        });
        
        wrapper.appendChild(button);
    });
}

// Add copy buttons after rendering step content
const originalRenderCurrentStep = renderCurrentStep;
renderCurrentStep = function() {
    originalRenderCurrentStep.call(this);
    // Add copy buttons after content is rendered
    setTimeout(addCopyButtons, 100);
};

// Enhanced Keyboard Navigation
document.addEventListener('keydown', (e) => {
    // Don't interfere with typing in inputs
    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        return;
    }
    
    // Home key - go to first step
    if (e.key === 'Home') {
        e.preventDefault();
        if (currentStep !== 1) {
            goToStep(1);
        }
    }
    
    // End key - go to last step
    if (e.key === 'End') {
        e.preventDefault();
        if (currentStep !== totalSteps) {
            goToStep(totalSteps);
        }
    }
});

// Log keyboard shortcuts on load
console.log('n8n Training Tutorial - Developer Features Loaded');
console.log('Keyboard Shortcuts:');
console.log('  ← → : Navigate between steps');
console.log('  Home : Go to first step');
console.log('  End : Go to last step');
