document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score');
    const movesLeftDisplay = document.getElementById('moves-left');
    const startLevelButton = document.getElementById('start-level');
    const resetGameButton = document.getElementById('reset-game');
    const levelDisplay = document.getElementById('level');

    const levels = [
        { scoreLimit: 250, moves: 25 },
        { scoreLimit: 300, moves: 30 },
        { scoreLimit: 350, moves: 35 },
        { scoreLimit: 400, moves: 40 },
        { scoreLimit: 450, moves: 45 }
    ];

    const gridSize = 5;
    let tiles = [];
    let score = 0;
    let movesLeft = 0;
    let currentLevel = 0;
    let firstTile = null;
    let secondTile = null;

    startLevelButton.addEventListener('click', startLevel);
    resetGameButton.addEventListener('click', resetGame);

    function startLevel() {
        if(currentLevel < levels.length){
            currentLevel++;
        } else {
            swal('Congratulations!', 'You have completed all levels!', 'success');
            resetGame();
            return;
        }
        const level = levels[currentLevel-1];
        score = 0;
        movesLeft = level.moves;
        updateDisplays();
        createTiles();
        render();
    }

    function resetGame() {
        currentLevel = 0;
        score = 0;
        movesLeft = 0;
        tiles = [];
        gameBoard.innerHTML = '';
        updateDisplays();
    }

    function createTiles() {
        const tileTypes = ['tile1','tile2','tile3','tile4','tile5'];
        tiles = [];
        for(let i=0; i<gridSize*gridSize; i++){
            const tile = document.createElement('div');
            tile.classList.add('tile', tileTypes[Math.floor(Math.random()*tileTypes.length)]);
            tile.dataset.index = i;
            tile.addEventListener('click', handleTileClick);
            tiles.push(tile);
        }
    }

    function render() {
        gameBoard.innerHTML = '';
        tiles.forEach(tile => gameBoard.appendChild(tile));
    }

    function handleTileClick(event) {
        const tile = event.target;
        if(!firstTile){
            firstTile = tile;
            tile.classList.add('selected');
        } else if(!secondTile && tile!==firstTile){
            secondTile = tile;
            if(areAdjacent(firstTile, secondTile)){
                swapTiles(firstTile, secondTile);
                setTimeout(() => {
                    const matches = checkMatches();
                    if(matches.length>0){
                        updateScore(matches);
                        clearMatches(matches);
                        dropTiles();
                    } else {
                        swapTiles(firstTile, secondTile); // swap back
                    }
                    movesLeft--;
                    updateDisplays();
                    resetSelection();
                }, 350);
            } else {
                resetSelection();
            }
        }
    }

    function areAdjacent(tile1,tile2){
        const i1 = parseInt(tile1.dataset.index);
        const i2 = parseInt(tile2.dataset.index);
        const r1 = Math.floor(i1/gridSize), c1 = i1%gridSize;
        const r2 = Math.floor(i2/gridSize), c2 = i2%gridSize;
        return (r1===r2 && Math.abs(c1-c2)===1) || (c1===c2 && Math.abs(r1-r2)===1);
    }

    function swapTiles(tile1,tile2){
        const i1 = parseInt(tile1.dataset.index);
        const i2 = parseInt(tile2.dataset.index);
        [tiles[i1], tiles[i2]] = [tiles[i2], tiles[i1]];
        tiles[i1].dataset.index = i1;
        tiles[i2].dataset.index = i2;
        render();
    }

    function resetSelection(){
        firstTile=null;
        secondTile=null;
        tiles.forEach(t => t.classList.remove('selected'));
    }

    function checkMatches(){
        const matches = [];
        for(let row=0; row<gridSize; row++){
            for(let col=0; col<gridSize; col++){
                const idx = row*gridSize+col;
                const horizontal = checkDirection(row,col,0,1).concat(checkDirection(row,col,0,-1));
                if(horizontal.length>=2) matches.push(idx,...horizontal);
                const vertical = checkDirection(row,col,1,0).concat(checkDirection(row,col,-1,0));
                if(vertical.length>=2) matches.push(idx,...vertical);
            }
        }
        return [...new Set(matches)];
    }

    function checkDirection(row,col,rStep,cStep){
        const match = [];
        const idx = row*gridSize+col;
        const cls = tiles[idx].className;
        for(let i=1; i<gridSize; i++){
            const newRow = row+i*rStep;
            const newCol = col+i*cStep;
            if(newRow>=0 && newRow<gridSize && newCol>=0 && newCol<gridSize){
                const nIdx = newRow*gridSize+newCol;
                if(tiles[nIdx].className === cls) match.push(nIdx);
                else break;
            } else break;
        }
        return match;
    }

    function updateScore(matches){
        if(matches.length>=3){
            const combo = matches.length-2;
            score += matches.length*5*combo;
        }
    }

    function clearMatches(matches){
        matches.forEach(idx => tiles[idx].classList.add('highlight'));
        setTimeout(() => {
            matches.forEach(idx => tiles[idx].className='tile empty');
            render();
        }, 300);
    }

    function dropTiles(){
        for(let col=0; col<gridSize; col++){
            for(let row=gridSize-1; row>=0; row--){
                const idx = row*gridSize+col;
                if(tiles[idx].classList.contains('empty')){
                    for(let r=row-1; r>=0; r--){
                        const aboveIdx = r*gridSize+col;
                        if(!tiles[aboveIdx].classList.contains('empty')){
                            swapTiles(tiles[idx], tiles[aboveIdx]);
                            break;
                        }
                    }
                }
            }
        }
        refillBoard();
    }

    function refillBoard(){
        const types = ['tile1','tile2','tile3','tile4','tile5'];
        tiles.forEach(tile => {
            if(tile.classList.contains('empty')){
                tile.className = 'tile ' + types[Math.floor(Math.random()*types.length)];
            }
        });
        render();
    }

    function celebrateLevel(){
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }

    function updateDisplays(){
        scoreDisplay.textContent = `Score: ${score}`;
        movesLeftDisplay.textContent = `Moves Left: ${movesLeft}`;
        levelDisplay.textContent = `Level: ${currentLevel}`;
        const levelInfo = levels[currentLevel-1];
        if(movesLeft<=0 && score<levelInfo.scoreLimit){
            swal('Game Over','You did not reach the score limit.','error');
            resetGame();
        } else if(score>=levelInfo.scoreLimit){
            celebrateLevel();
            swal('Level Complete','Click Start Level to continue','success');
        }
    }
});
