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
    stepIndicator: null,
    prevBtn: null,
    nextBtn: null
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    initializeElements();
    await loadContent();
    initializeFromURL();
    setupEventListeners();
    renderCurrentStep();
});

// Initialize DOM element references
function initializeElements() {
    elements.tutorialTitle = document.getElementById('tutorial-title');
    elements.progressBar = document.getElementById('progress-bar');
    elements.progressText = document.getElementById('progress-text');
    elements.stepTitle = document.getElementById('step-title');
    elements.stepContent = document.getElementById('step-content');
    elements.stepIndicator = document.getElementById('step-indicator');
    elements.prevBtn = document.getElementById('prev-btn');
    elements.nextBtn = document.getElementById('next-btn');
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

    // Optional: Keyboard navigation
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

    // Update step title
    elements.stepTitle.textContent = step.title;

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

// Update progress indicators
function updateProgress() {
    const percentage = (currentStep / totalSteps) * 100;
    elements.progressBar.style.width = `${percentage}%`;

    const progressText = `Step ${currentStep} of ${totalSteps}`;
    elements.progressText.textContent = progressText;
    elements.stepIndicator.textContent = progressText;
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
