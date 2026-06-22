// Get the display element
const display = document.getElementById('display');

// Variable to store the expression
let expression = '';

/**
 * Append number to the display
 * @param {string} number - The number to append (0-9 or .)
 */
function appendNumber(number) {
    // Prevent multiple decimal points
    if (number === '.' && expression.includes('.')) {
        return;
    }
    
    // Prevent leading zeros (except for decimal numbers)
    if (expression === '0' && number !== '.') {
        expression = number;
    } else {
        expression += number;
    }
    
    updateDisplay();
}

/**
 * Append operator to the expression
 * @param {string} operator - The operator (+, -, *, /)
 */
function appendOperator(operator) {
    // Prevent operator at the start
    if (expression === '') {
        return;
    }
    
    // Prevent multiple operators in a row
    if (isLastCharOperator()) {
        expression = expression.slice(0, -1) + operator;
    } else {
        expression += operator;
    }
    
    updateDisplay();
}

/**
 * Check if the last character is an operator
 * @returns {boolean} True if last character is an operator
 */
function isLastCharOperator() {
    const lastChar = expression[expression.length - 1];
    return ['+', '-', '*', '/'].includes(lastChar);
}

/**
 * Delete the last character from the expression
 */
function deleteLast() {
    if (expression.length > 0) {
        expression = expression.slice(0, -1);
        updateDisplay();
    }
}

/**
 * Clear the entire display and expression
 */
function clearDisplay() {
    expression = '';
    updateDisplay();
}

/**
 * Update the display with current expression
 */
function updateDisplay() {
    display.value = expression || '0';
}

/**
 * Calculate the result of the expression
 */
function calculate() {
    // Prevent calculation if expression is empty
    if (expression === '') {
        return;
    }
    
    // Prevent calculation if expression ends with an operator
    if (isLastCharOperator()) {
        return;
    }
    
    try {
        // Use Function constructor for safer evaluation
        // (safer alternative to eval)
        const result = Function('"use strict"; return (' + expression + ')')();
        
        // Check if result is a valid number
        if (typeof result === 'number' && isFinite(result)) {
            // Round to 10 decimal places to avoid floating point errors
            expression = Math.round(result * 10000000000) / 10000000000;
            updateDisplay();
        } else {
            display.value = 'Error';
            expression = '';
        }
    } catch (error) {
        // Handle calculation errors
        display.value = 'Error';
        expression = '';
        console.error('Calculation error:', error);
    }
}

// Initialize display
updateDisplay();

// Add keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Numbers and decimal point
    if (/[0-9.]/.test(key)) {
        appendNumber(key);
        event.preventDefault();
    }
    
    // Operators
    if (['+', '-', '*', '/'].includes(key)) {
        appendOperator(key);
        event.preventDefault();
    }
    
    // Enter key for calculation
    if (key === 'Enter') {
        calculate();
        event.preventDefault();
    }
    
    // Backspace for delete
    if (key === 'Backspace') {
        deleteLast();
        event.preventDefault();
    }
    
    // Escape for clear
    if (key === 'Escape') {
        clearDisplay();
        event.preventDefault();
    }
});
