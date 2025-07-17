function getEmptyCells(board) {
    const emptyCells = []
    for(let i = 0; i < 9; i++) {
        if (board[i] == "not played") {
            emptyCells.push(i)
        }
    }
    return emptyCells
}

function returnWin(board, playerForWin) {
    const winPatters = [
        //rows
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        //columns
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        //rows
        [0, 4, 8],
        [6, 4, 2]
    ]

    for (let i = 0; i < 8; i++) {
        if (board[winPatters[i][0]] == playerForWin && board[winPatters[i][1]] == playerForWin && board[winPatters[i][2]] == "not played")
            return winPatters[i][2]
        if (board[winPatters[i][0]] == playerForWin && board[winPatters[i][1]] == "not played" && board[winPatters[i][2]] == playerForWin)
            return winPatters[i][1]
        if (board[winPatters[i][0]] == "not played" && board[winPatters[i][1]] == playerForWin && board[winPatters[i][2]] == playerForWin)
            return winPatters[i][0]
    }
    return false
}


export function easyAI(board) {
    const empty = getEmptyCells(board)
    return empty[Math.floor(Math.random() * empty.length)];
}

export function mediumAI(board) {
    //check if he can win
    if (returnWin(board, "first") != false) {
        return returnWin(board, "first")
    }
    
    //check if he can block
    if (returnWin(board, "second") != false) {
        return returnWin(board, "second")
    }
    //pick random (can use easy AI)
    return (easyAI(board))
}

function checkEval(board) {
    const winPatters = [
        //rows
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        //columns
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        //rows
        [0, 4, 8],
        [6, 4, 2]
    ]

    for (let i = 0; i < 8; i++) {
        if (board[winPatters[i][0]] == "first" && board[winPatters[i][1]] == "first" && board[winPatters[i][2]] == "first")
            return "first";
        else if (board[winPatters[i][0]] == "second" && board[winPatters[i][1]] == "second" && board[winPatters[i][2]] == "second")
            return "second";
    }
    return null;
}

function minimax(board, ismaxing) {
    const winner = checkEval(board);
    if (winner == "second") return -1;
    if (winner == "first") return +1;
    if(!board.includes("not played")) return 0;

    const emptyCells = getEmptyCells(board);
    let bestScore = ismaxing ? -Infinity : Infinity;

    for(let i = 0; i < emptyCells.length; i++)
    {
        board[emptyCells[i]] = ismaxing ? "first" : "second";
        let score = minimax(board, !ismaxing);
        board[emptyCells[i]] = "not played";

        bestScore = ismaxing ? Math.max(score, bestScore) : Math.min(score, bestScore);
    }
    return bestScore
}

export function hardAI(board) {
    if (returnWin(board, "first") != false) {
        return returnWin(board, "first")
    }
    
    //check if he can block
    if (returnWin(board, "second") != false) {
        return returnWin(board, "second")
    }
    

    let bestScore = -Infinity;
    let bestMove;

    const emptyCells = getEmptyCells(board);

    for (let i = 0; i < emptyCells.length; i++)
    {
        board[emptyCells[i]] = "first";
        let score = minimax(board, false);
        board[emptyCells[i]] = "not played";

        if (score > bestScore){
            bestScore = score;
            bestMove = emptyCells[i];
        }
    }

    return bestMove;
}