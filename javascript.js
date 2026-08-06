document.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.button-grid .key');
    const operators = ['+', '-', '*', '/'];

    let expression = '';
    let lastInput = '';

    function updateDisplay(value) {
        display.textContent = value;
    }

    function isOperator(value) {
        return operators.includes(value);
    }

    function appendInput(value) {
        if (value === '.') {
            const parts = expression.split(/[\+\-\*\/]/);
            const currentNumber = parts[parts.length - 1];
            if (currentNumber.includes('.')) {
                return;
            }
            if (currentNumber === '') {
                value = '0.';
            }
        }

        if (isOperator(value)) {
            if (expression === '' && value !== '-') {
                return;
            }
            if (isOperator(lastInput)) {
                expression = expression.slice(0, -1) + value;
            } else {
                expression += value;
            }
        } else {
            expression += value;
        }

        lastInput = value;
        updateDisplay(expression || '0');
    }

    function calculate() {
        try {
            let expr = expression;
            if (isOperator(expr.slice(-1))) {
                expr = expr.slice(0, -1);
            }
            if (!expr) {
                return;
            }
            const result = Function(`"use strict"; return (${expr})`)();
            expression = String(result);
            lastInput = '';
            updateDisplay(expression);
        } catch (error) {
            expression = '';
            lastInput = '';
            updateDisplay('Error');
        }
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent.trim();

            if (value === 'C' || value.toUpperCase() === 'AC' || value.toLowerCase() === 'clear') {
                expression = '';
                lastInput = '';
                updateDisplay('0');
                return;
            }

            if (value.toUpperCase() === 'DEL' || value.toLowerCase() === 'cancel') {
                expression = expression.slice(0, -1);
                lastInput = expression.slice(-1);
                updateDisplay(expression || '0');
                return;
            }

            if (value === '=') {
                calculate();
                return;
            }

            appendInput(value);
        });
    });
});