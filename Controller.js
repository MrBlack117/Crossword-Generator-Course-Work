import {Model} from './Model.js';
import {View} from './View.js';


let words = []
let userTheme = ''
let crossWordData = []
let errorInUserWords = false

let model = new Model()
let view = new View()

const startButton = document.getElementById('create_button');
startButton.addEventListener("click", crosswordCreation);



function crosswordCreation() {
    view.cleanCrossword()
    userTheme = getUserTheme()
    if(userTheme === 'Власні слова'){
        words = []
        getUserWords()
        if(errorInUserWords){
            view.showErrorMessage()
        }else{
            crossWordData = model.createCrossword(true, words, 'none')
        }
    }else{
        crossWordData = model.createCrossword(false, words, userTheme)
    }
    view.createGrid(crossWordData[1][0], crossWordData[1][1])
    view.fillGrid(crossWordData[0])
}

function getUserTheme(){
    let userTheme = document.getElementById('user_theme');
    return userTheme.options[userTheme.selectedIndex].text
}

function getUserWords() {
    let userText = document.getElementById('textbox').value
    if (userText !== '') {
        let newWords = userText.split(', ')
        for (let word of newWords) {
            word = word.trim()
            if (word.includes(' ')) {
                errorInUserWords = true
            }
            words.push(word)
        }
    }else{
        words = ["червоний", "синій", "рожевий", "жовтий", "білий", "чорний"]
    }
}