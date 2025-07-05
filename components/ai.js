function getEmptyCells(board) {
    const emptyCells = []
    for(let i = 0; i < 9; i++) {
        if (board[i] == "not played") {
            emptyCells.push(i)
        }
    }
    return emptyCells
}


export function easyAI(board) {
    const empty = getEmptyCells(board)
    return empty[Math.floor(Math.random() * empty.length)];
}

export function mediumAI(board) {
    //check if he can win
    //check if he can block
    //pick random (can use easy AI)
    
}