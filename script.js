document.addEventListener('DOMContentLoaded', function() {
    const toggleInstructionsBtn = document.getElementById('toggleInstructions');
    const instructionsDiv = document.getElementById('gameInstructions');
    const gameBoard = document.getElementById('gameBoard');
    const submitGuessBtn = document.getElementById('submitGuessBtn');
    const colorSelection = document.getElementById('colorSelection');

    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'cyan', 'magenta', 'lime', 'pink'];
    let selectedColor = '';
    let currentRow = 0;

    const secretCode = ['yellow', 'orange', 'lime', 'pink', 'red'];

    toggleInstructionsBtn.addEventListener('click', function() {
        instructionsDiv.style.display = instructionsDiv.style.display === 'none' ? 'block' : 'none';
        this.textContent = instructionsDiv.style.display === 'block' ? 'Hide Instructions' : 'Show Instructions';
    });

    setupColorSelection();
    setupGameBoard();

    function setupColorSelection() {
        colors.forEach(color => {
            const colorPeg = document.createElement('div');
            colorPeg.className = `peg ${color}`;
            colorPeg.addEventListener('click', () => selectColor(color));
            colorSelection.appendChild(colorPeg);
        });
    }

    function setupGameBoard() {
        gameBoard.innerHTML = '';
        for (let i = 0; i < 8; i++) {
            const rowWrapper = document.createElement('div');
            rowWrapper.className = 'rowWrapper';

            const row = document.createElement('div');
            row.className = 'row';
            for (let j = 0; j < 5; j++) {
                const pegSlot = document.createElement('div');
                pegSlot.className = 'peg pegSlot';
                row.appendChild(pegSlot);
            }

            rowWrapper.appendChild(row);
            gameBoard.appendChild(rowWrapper);
        }
        // Make only the first row interactive
        makeRowInteractive(currentRow);
    }

    function makeRowInteractive(rowIndex) {
        const rows = document.querySelectorAll('.row');
        rows.forEach((row, index) => {
            const pegSlots = row.children;
            for (let pegSlot of pegSlots) {
                pegSlot.classList.add('pegSlot'); // Ensure class is correct
                pegSlot.removeEventListener('click', handlePegSlotClick); // Remove previous listeners
                if (index === rowIndex) {
                    pegSlot.addEventListener('click', handlePegSlotClick); // Add listener to current row
                }
            }
        });
    }

    function handlePegSlotClick() {
        if (selectedColor) {
            this.className = `peg ${selectedColor}`;
            checkRowCompletion();
        }
    }

    function selectColor(color) {
        selectedColor = color;
    }

    function checkRowCompletion() {
        const row = gameBoard.children[currentRow].querySelector('.row');
        submitGuessBtn.disabled = Array.from(row.children).some(peg => peg.classList.contains('pegSlot'));
    }

    submitGuessBtn.addEventListener('click', function() {
        const row = gameBoard.children[currentRow].querySelector('.row');
        const guess = Array.from(row.children).map(peg => peg.classList[1]);
        const feedback = compareGuessToSecret(guess, secretCode);
        displayFeedback(feedback, currentRow);

        if (feedback.black === 5 || currentRow === 7) {
            setTimeout(() => {
                const message = feedback.black === 5 ? 'Congratulations! You cracked the code!' : 'Game over! Try again.';
                alert(message);
                resetGame();
            }, 100);
        } else {
            currentRow++;
            makeRowInteractive(currentRow); // Activate the next row
        }
    });

    function displayFeedback(feedback, rowIndex) {
        const feedbackContainer = document.createElement('div');
        feedbackContainer.className = 'feedbackContainer';
        for (let i = 0; i < feedback.black; i++) {
            const blackPeg = document.createElement('div');
            blackPeg.className = 'feedbackPeg black';
            feedbackContainer.appendChild(blackPeg);
        }
        for (let i = 0; i < feedback.white; i++) {
            const whitePeg = document.createElement('div');
            whitePeg.className = 'feedbackPeg white';
            feedbackContainer.appendChild(whitePeg);
        }
        gameBoard.children[rowIndex].appendChild(feedbackContainer);
    }

    function compareGuessToSecret(guess, secret) {
        let black = 0;
        let white = 0;
        let secretCopy = [...secret];
        let guessCopy = [...guess];

        guessCopy.forEach((g, i) => {
            if (g === secretCopy[i]) {
                black++;
                secretCopy[i] = guessCopy[i] = null;
            }
        });

        guessCopy.forEach((g, i) => {
            if (g !== null && secretCopy.includes(g)) {
                white++;
                secretCopy[secretCopy.indexOf(g)] = null;
            }
        });

        return { black, white };
    }

    function resetGame() {
        currentRow = 0;
        setupGameBoard(); // Re-setup the game board for a new game
        submitGuessBtn.disabled = true; // Disable the submit button until a guess is made
        selectedColor = ''; // Reset the selected color
    }
});
