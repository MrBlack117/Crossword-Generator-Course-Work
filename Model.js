export class Model {
    words = [];
    auto = ["Ford", "Ferrari", "Porsche", "Jeep", "Bentley", "Lamborghini", "Cadillac", "Mercedes"]
    subjects = ["Фізика", "Інформатика", "Хімія", "Математика", "Історія", "Біологія", "Труди", "Фізкультура"]
    technology = ["Apple", "Samsung", "Huawei", "Lenovo", "Motorola", "LG", "Phillips", "HP"]
    countries = ["Україна", "Великобританія", "Китай", "Японія", "Іспанія", "Італія", "Кенія", "Бразилія"]
    capitals = ["Київ", "Лондон", "Пхенья", "Токіо", "Мадрид", "Рим", "Найробі", "Бразиліа"]
    animals = ["Тигр", "Жираф", "Слон", "Кіт", "Пес", "Бегемот", "Лемур", "Кажан"]
    plants = ["Вишня", "Банан", "Персик", "Ожина", "Кавун", "Яблуко", "Груша", "Ананас"]
    birds = ["Горобець", "Фламінго", "Лебідь", "Качка", "Орел", "Беркут", "Цапля", "Гриф"]
    closedCells = []
    closedCellsForRow = []
    closedCellsForColumn = []

    constructor() {
    }


    createCrossword(userUseOwnWords, userWords, theme) {
        this.closedCells = []
        this.closedCellsForRow = []
        this.closedCellsForColumn = []

        if (userUseOwnWords) {
            this.words = userWords
        } else {
            this.setSelectedTheme(theme)
        }
        let wordsList = this.createWordsObjects(this.words)
        let crosswordWords = this.setAbstractCoordinates(wordsList)
        let gridInfo = this.getGridInfo(this.closedCells, crosswordWords)
        this.convertCoordinates(gridInfo[2], gridInfo[3], crosswordWords)

        return [crosswordWords, gridInfo]
    }

    setSelectedTheme(selectedTheme) {
        if (selectedTheme === 'Виробники авто') {
            this.words = this.auto
        }
        if (selectedTheme === 'Технологічні компанії') {
            this.words = this.technology
        }
        if (selectedTheme === 'Шкільні предмети') {
            this.words = this.subjects
        }
        if (selectedTheme === 'Країни') {
            this.words = this.countries
        }
        if (selectedTheme === 'Столиці') {
            this.words = this.capitals
        }
        if (selectedTheme === 'Тварини') {
            this.words = this.animals
        }
        if (selectedTheme === 'Фрукти') {
            this.words = this.plants
        }
        if (selectedTheme === 'Птахи') {
            this.words = this.birds
        }
    }

    createWordsObjects(wordsList) {
        let prepared = []
        wordsList = wordsList.sort(function (a, b) {
            return b.length - a.length;
        })
        for (let word of wordsList) {
            let a = new CrosswordWord(word.toLowerCase())
            prepared.push(a)
        }
        return prepared
    }

    setAbstractCoordinates(wordsList) {
        let crosswordFormed = false
        let firstWordAdded = false
        let addedWords = []
        let iterations = 0
        while (crosswordFormed !== true) {
            let word = wordsList.shift()
            iterations++
            if (firstWordAdded === false) {
                for (let i = 0; i < word.letters.length; i++) {
                    let curLetter = word.letters[i]
                    word.lettersCoordinates.push([curLetter, i, 0])
                    this.closedCells.push([i, 0])
                    this.closedCellsForRow.push([i, 1])
                    this.closedCellsForRow.push([i, -1])
                }
                word.direction = 'row'
                firstWordAdded = true
                addedWords.push(word)
            } else {
                this.findConnectionsBetween(addedWords, word)
                let wordPlaced = false
                let bestVariant = []
                varLoop:
                    while (word.connectsWith.length !== 0) {
                        let variant = word.connectsWith.splice(this.randomVariant(word.connectsWith.length), 1)[0]
                        let connectionWord = variant[0]
                        let connectionLetter = variant[1]
                        let connectionLetterInfo = connectionWord.lettersCoordinates[connectionWord.letters.indexOf(connectionLetter)]
                        let connectionCoords = [connectionLetterInfo[1], connectionLetterInfo[2]]
                        if (connectionWord.direction === 'row') {
                            word.direction = 'column'
                            let connectionLetterPosition = word.letters.indexOf(connectionLetter)
                            for (let j = 0; j < word.letters.length; j++) {
                                if (j === connectionLetterPosition) {
                                    word.lettersCoordinates.push([connectionLetter, connectionLetterInfo[1], connectionLetterInfo[2]])
                                    continue
                                }
                                let curLetter = word.letters[j]
                                let curLetterCoords = [connectionCoords[0], connectionCoords[1] + connectionLetterPosition - j]
                                if (this.cantPlaceCharAt(curLetterCoords, 'column')) {
                                    word.lettersCoordinates = []
                                    bestVariant = []
                                    continue varLoop
                                }
                                word.lettersCoordinates.push([curLetter, curLetterCoords[0], curLetterCoords[1]])
                                bestVariant.push(curLetterCoords)
                            }

                        } else if (connectionWord.direction === 'column') {
                            word.direction = 'row'
                            let connectionLetterPosition = word.letters.indexOf(connectionLetter)
                            for (let j = 0; j < word.letters.length; j++) {
                                if (j === connectionLetterPosition) {
                                    word.lettersCoordinates.push([connectionLetter, connectionLetterInfo[1], connectionLetterInfo[2]])
                                    continue
                                }
                                let curLetter = word.letters[j]
                                let curLetterCoords = [connectionCoords[0] - connectionLetterPosition + j, connectionCoords[1]]
                                if (this.cantPlaceCharAt(curLetterCoords, 'row')) {
                                    word.lettersCoordinates = []
                                    bestVariant = []
                                    continue varLoop
                                }
                                word.lettersCoordinates.push([curLetter, curLetterCoords[0], curLetterCoords[1]])
                                bestVariant.push(curLetterCoords)
                            }
                        }
                        for (let coord of bestVariant) {
                            this.closedCells.push(coord)
                            if (word.direction === 'row') {
                                this.closedCellsForRow.push([coord[0], coord[1] + 1])
                                this.closedCellsForRow.push([coord[0], coord[1] - 1])
                            }
                            if (word.direction === 'column') {
                                this.closedCellsForColumn.push([coord[0] + 1, coord[1]])
                                this.closedCellsForColumn.push([coord[0] - 1, coord[1]])
                            }
                        }
                        addedWords.push(word)
                        wordPlaced = true
                        break varLoop
                    }

                if (wordPlaced === false) {
                    if (wordsList.length !== 0) {
                        wordsList.push(word)
                    }
                }
                if (wordsList.length === 0 || iterations === 50) {
                    crosswordFormed = true
                }
            }
        }
        return addedWords
    }

    findConnectionsBetween(placedWords, word) {
        word.connectsWith = []
        for (let crosswordWord of placedWords) {
            for (let i = 0; i < crosswordWord.letters.length; i++) {
                if (word.letters.includes(crosswordWord.letters[i])) {
                    word.connectsWith.push([crosswordWord, crosswordWord.letters[i], i])
                }
            }
        }
    }

    randomVariant(max) {
        return Math.random() * max;
    }

    cantPlaceCharAt(wantedPosition, direction) {
        let wantedCoordinate = this.reformatCoordinate(wantedPosition)
        for (let coordinates of this.closedCells) {
            let closedCoordinate = this.reformatCoordinate(coordinates)
            if (wantedCoordinate === closedCoordinate) {
                return true
            }
        }
        if (direction === 'row') {
            for (let coordinates of this.closedCellsForRow) {
                let closedCoordinate = this.reformatCoordinate(coordinates)
                if (wantedCoordinate === closedCoordinate) {
                    return true
                }
            }
        }
        if (direction === 'column') {
            for (let coordinates of this.closedCellsForColumn) {
                let closedCoordinate = this.reformatCoordinate(coordinates)
                if (wantedCoordinate === closedCoordinate) {
                    return true
                }
            }
        }
        return false
    }

    reformatCoordinate(coordinate) {
        let x = coordinate[0]
        let y = coordinate[1]
        return x.toString() + y.toString()
    }

    convertCoordinates(xModifier, yModifier, wordList) {
        for (let word of wordList) {
            for (let letter of word.lettersCoordinates) {
                letter[1] -= xModifier
                letter[2] = Math.abs(letter[2] - yModifier)
            }
        }
    }

    getGridInfo(closedCoordinates) {
        let xMax = Number.NEGATIVE_INFINITY
        let xMin = Number.POSITIVE_INFINITY
        let yMax = Number.NEGATIVE_INFINITY
        let yMin = Number.POSITIVE_INFINITY
        for (let coordinate of closedCoordinates) {
            coordinate[0] > xMax ? xMax = coordinate[0] : xMax = xMax
            coordinate[0] < xMin ? xMin = coordinate[0] : xMin = xMin
            coordinate[1] > yMax ? yMax = coordinate[1] : yMax = yMax
            coordinate[1] < yMin ? yMin = coordinate[1] : yMin = yMin
        }
        let gridWidth = xMax - xMin + 1
        let gridHeight = yMax - yMin + 1

        return [gridWidth, gridHeight, xMin, yMax]
    }
}

class CrosswordWord {
    word;
    letters;
    lettersCoordinates = []
    direction;
    connectsWith = [];

    constructor(word) {
        this.word = word
        this.letters = word.split('')
    }
}