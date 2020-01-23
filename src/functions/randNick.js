/**
 * Crude Implementation of Random Nickname from a Dictionary
 * Description: Returns a string of 3 paired up words from a "Dictionary"
 * Usage: retNick();
 * Refactor Idea: Use an online Dict?
 */
const Dictionary = [
    "Elephant", "Tortoise", "Cat", "Dog", "Japan", "Star", "Square", "Triangle", "Fish", "Duck", "Rabbit", "Alpaca", "Camel", "Newt", "Beetle",
]

module.exports = {
    retNick: () => {
        return Dictionary[Math.floor(Math.random() * Dictionary.length)] + Dictionary[Math.floor(Math.random() * Dictionary.length)] + Dictionary[Math.floor(Math.random() * Dictionary.length)];
    }
}