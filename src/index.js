import _ from 'lodash';
import './style.css';

//Create a board of 64 vertices holding coordinates for a 8 x 8 board
function buildBoard(){
    let board = [];

    for (let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            board.push([i,j])
        }
    }

    return board
}

//Return 'vertex' of a target spot within array
function findIndex(arr, target){
    for(let i = 0; i < arr.length; i ++){
        if(arr[i][0] === target[0] && arr[i][1] === target[1]){
            return i;
        }
    }
}

//Checks if coordinates exist on board
function containsSpot(board, position){
    for(let i = 0; i < board.length; i++){
        if(board[i][0] === position[0] && board[i][1] === position[1]){
            return true;
        }
    }
}

//Mirror the board to hold objects that have distance and predecessor values all set to null 
function buildBoardInfo(board, start){
    let newBoard = [];
    for(let i = 0; i < board.length; i++){
        newBoard[i] = {
            distance: null,
            predecessor: null
        }
    }

    newBoard[start].distance = 0;

    return newBoard;
}

//Find next Move 
function findNextMove(index, x, y){
    if (index === 0) return [ x+2, y+1 ];
    if (index === 1) return [ x+2, y-1 ];
    if (index === 2) return [ x-2, y+1 ];
    if (index === 3) return [ x-2, y-1 ];
    if (index === 4) return [ x+1, y-2 ];
    if (index === 5) return [ x+1, y+2 ];
    if (index === 6) return [ x-1, y+2 ];
    if (index === 7) return [ x-1, y-2 ];
}

//Build list of neighboring moves for the Knight to take
function buildAdjList(board){
    let adjList = [];
    
    //i is the index (0 - 63)
    for (let i = 0; i < board.length; i++){
        let neighbors = [];
        //j is the number of possible moves
        for(let j = 0; j < 8; j++){
            let neighbor = findNextMove(j, board[i][0], board[i][1]);
            if(containsSpot(board, neighbor)){
                neighbors.push(findIndex(board, neighbor))
            }
        }
        adjList[i] = neighbors;
    }

    return adjList;
}

//Construct a path by tracing predecessor of each object
function constructPath(board, boardInfo, object, index, newArr){
    if (object.predecessor === null) {
        return newArr
    };
    if (object.predecessor != null){
        newArr.push(board[index]);
        constructPath(board, boardInfo, boardInfo[object.predecessor], object.predecessor, newArr);
    }
}

//Finds the shortest path between start and end on a chess board using a knight piece
function knightMoves(start, end){
    const board = buildBoard();
    const startIndex = findIndex(board, start);
    const endIndex = findIndex(board, end);
    const boardInfo = buildBoardInfo(board, startIndex);
    const adjList = buildAdjList(board);
    const queue = [startIndex];
    let current;

    while (current != endIndex){
        current = queue.shift();
        //Iterate through each neighbor of current
        for (let i = 0; i < adjList[current].length; i++){
            let nIndex = adjList[current][i];
            // let nIndex = findIndex(board, neighborIndex)
            if (nIndex === endIndex){
                boardInfo[nIndex].predecessor = current;
                let path = [];
                constructPath(board, boardInfo, boardInfo[nIndex], nIndex, path);
                let result = path.reverse();
                result.splice(0, 0, start)
                console.log(`You made it in ${path.length - 1} moves! Here's your path:`);
                console.log(result)
                return result;
            } else {
                if(boardInfo[nIndex].distance === null){
                    boardInfo[nIndex].distance = boardInfo[current].distance + 1;
                    boardInfo[nIndex].predecessor = current;
                    queue.push(nIndex);
                }
            }
        }
    }
}

knightMoves([0, 0], [7, 7])