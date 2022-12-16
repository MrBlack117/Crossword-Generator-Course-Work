export class View {
    constructor() {
    }

    cleanCrossword() {
        const table = document.getElementById('crossword');
        table.innerHTML = ''
    }

    createGrid(width, height) {
        const table = document.getElementById('crossword');
        table.style.width = `${width * 40}px`;
        table.style.height = `${height * 40}px`;
        //table.style.border = '1px solid black';

        for (let i = 0; i < height; i++) {
            const tr = table.insertRow();
            tr.style.border = '1px solid darkslategrey'
            for (let j = 0; j < width; j++) {
                const td = tr.insertCell();
                td.appendChild(document.createTextNode(` `));
                td.id = `${j}:${i}`
            }
        }
    }

    fillGrid(wordsList) {

        for (let word of wordsList) {
            for (let letter of word.lettersCoordinates) {
                let x = letter[1]
                let y = letter[2]
                let coordinates = x.toString() + ':' + y.toString()
                let cell = document.getElementById(coordinates)
                cell.innerHTML = letter[0]
                cell.style.border = '1px solid black';
                cell.style.background = 'white'
            }
        }
    }

    showErrorMessage() {
        const table = document.getElementById('error_log');
        table.innerHTML = 'Помилка. Неправильно введені дані.'
    }
}