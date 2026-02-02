// Calculator State
let currentMode = 'basic';
let history = JSON.parse(localStorage.getItem('calculatorHistory')) || [];
let theme = localStorage.getItem('calculatorTheme') || 'dark';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    loadHistory();
    setupEventListeners();
    setupKeyboardSupport();
});

// Theme Management
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (theme === 'light') {
        document.body.classList.add('light-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const themeToggle = document.getElementById('themeToggle');
    
    if (document.body.classList.contains('light-theme')) {
        theme = 'light';
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        theme = 'dark';
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    localStorage.setItem('calculatorTheme', theme);
}

// Event Listeners
function setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Mode toggle buttons
    const modeButtons = document.querySelectorAll('.mode-btn');
    modeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            switchMode(this.dataset.mode);
        });
    });
}

// Mode Switching
function switchMode(mode) {
    currentMode = mode;
    
    // Update active button
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    
    // Toggle button containers
    const basicButtons = document.getElementById('buttonContainer');
    const scientificButtons = document.getElementById('scientificButtons');
    
    if (mode === 'scientific') {
        basicButtons.classList.add('hidden');
        scientificButtons.classList.remove('hidden');
    } else {
        basicButtons.classList.remove('hidden');
        scientificButtons.classList.add('hidden');
    }
    
    clearResult();
}

// Calculator Functions
function appendValue(value) {
    const result = document.getElementById('result');
    
    // Prevent multiple decimal points in the same number
    if (value === '.') {
        const currentValue = result.value;
        const lastNumber = currentValue.split(/[\+\-\*\/\(\)]/).pop();
        if (lastNumber.includes('.')) return;
    }
    
    result.value += value;
    updateHistoryDisplay();
}

function clearResult() {
    document.getElementById('result').value = '';
    document.getElementById('historyDisplay').textContent = '';
}

function deleteLast() {
    const result = document.getElementById('result');
    result.value = result.value.slice(0, -1);
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyDisplay = document.getElementById('historyDisplay');
    const currentExpression = document.getElementById('result').value;
    historyDisplay.textContent = currentExpression;
}

function calculateResult() {
    const result = document.getElementById('result');
    const expression = result.value;
    
    if (!expression) return;
    
    try {
        // Add visual feedback
        result.parentElement.parentElement.classList.add('calculating');
        setTimeout(() => {
            result.parentElement.parentElement.classList.remove('calculating');
        }, 300);
        
        // Safe evaluation
        const calculatedResult = safeEval(expression);
        
        // Add to history
        addToHistory(expression, calculatedResult);
        
        // Update display
        result.value = calculatedResult;
        document.getElementById('historyDisplay').textContent = expression + ' =';
        
    } catch (error) {
        result.value = 'Error';
        setTimeout(() => {
            result.value = '';
        }, 1500);
    }
}

// Safe Expression Evaluator (replacing eval)
function safeEval(expression) {
    // Replace × with * for evaluation
    expression = expression.replace(/×/g, '*');
    
    // Validate expression (only allow numbers, operators, parentheses, and decimal points)
    if (!/^[0-9+\-*/.() ]+$/.test(expression)) {
        throw new Error('Invalid expression');
    }
    
    // Check for balanced parentheses
    let parenthesesCount = 0;
    for (let char of expression) {
        if (char === '(') parenthesesCount++;
        if (char === ')') parenthesesCount--;
        if (parenthesesCount < 0) throw new Error('Invalid parentheses');
    }
    if (parenthesesCount !== 0) throw new Error('Unbalanced parentheses');
    
    // Use Function constructor as a safer alternative to eval
    try {
        const result = new Function('return ' + expression)();
        
        // Round to avoid floating point errors
        return Math.round(result * 100000000) / 100000000;
    } catch (e) {
        throw new Error('Calculation error');
    }
}

// Scientific Functions
function calculateFunction(func) {
    const result = document.getElementById('result');
    const value = parseFloat(result.value);
    
    if (isNaN(value)) {
        result.value = 'Error';
        setTimeout(() => result.value = '', 1500);
        return;
    }
    
    let calculatedResult;
    const expression = `${func}(${value})`;
    
    try {
        switch(func) {
            case 'sin':
                calculatedResult = Math.sin(value * Math.PI / 180); // Convert to radians
                break;
            case 'cos':
                calculatedResult = Math.cos(value * Math.PI / 180);
                break;
            case 'tan':
                calculatedResult = Math.tan(value * Math.PI / 180);
                break;
            case 'sqrt':
                calculatedResult = Math.sqrt(value);
                break;
            case 'pow':
                calculatedResult = Math.pow(value, 2);
                break;
            default:
                throw new Error('Unknown function');
        }
        
        // Round to avoid floating point errors
        calculatedResult = Math.round(calculatedResult * 100000000) / 100000000;
        
        // Add to history
        addToHistory(expression, calculatedResult);
        
        // Update display
        result.value = calculatedResult;
        
    } catch (error) {
        result.value = 'Error';
        setTimeout(() => result.value = '', 1500);
    }
}

// History Management
function addToHistory(expression, result) {
    const historyItem = {
        expression: expression,
        result: result,
        timestamp: new Date().toISOString()
    };
    
    history.unshift(historyItem);
    
    // Keep only last 10 items
    if (history.length > 10) {
        history = history.slice(0, 10);
    }
    
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
    renderHistory();
}

function loadHistory() {
    renderHistory();
}

function renderHistory() {
    const historyList = document.getElementById('historyList');
    
    if (history.length === 0) {
        historyList.innerHTML = '<p class="no-history">No calculations yet</p>';
        return;
    }
    
    historyList.innerHTML = history.map((item, index) => `
        <div class="history-item" onclick="loadFromHistory(${index})">
            <div class="history-expression">${item.expression}</div>
            <div class="history-result">= ${item.result}</div>
        </div>
    `).join('');
}

function loadFromHistory(index) {
    const item = history[index];
    document.getElementById('result').value = item.result;
}

function clearHistory() {
    if (confirm('Clear all calculation history?')) {
        history = [];
        localStorage.removeItem('calculatorHistory');
        renderHistory();
    }
}

// Keyboard Support
function setupKeyboardSupport() {
    document.addEventListener('keydown', function(event) {
        const key = event.key;
        const result = document.getElementById('result');
        
        // Numbers and operators
        if (/^[0-9+\-*/.]$/.test(key)) {
            event.preventDefault();
            appendValue(key === '*' ? '×' : key);
        }
        
        // Enter for equals
        if (key === 'Enter') {
            event.preventDefault();
            calculateResult();
        }
        
        // Escape for clear
        if (key === 'Escape') {
            event.preventDefault();
            clearResult();
        }
        
        // Backspace for delete
        if (key === 'Backspace') {
            event.preventDefault();
            deleteLast();
        }
        
        // Parentheses
        if (key === '(' || key === ')') {
            event.preventDefault();
            appendValue(key);
        }
    });
}
