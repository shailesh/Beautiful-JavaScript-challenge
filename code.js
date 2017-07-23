function secretArchivesLock(lock, actions) {
    
    const isEmptyCell = cell => (cell === '.');
    const isOccupiedCell = cell => !isEmptyCell(cell);
    
    const moveLeft = row => [...row.filter(isOccupiedCell), ...row.filter(isEmptyCell)];
    const moveRight = row => [...row.filter(isEmptyCell), ...row.filter(isOccupiedCell)];
    
    const getColumn = matrix => columnIndex => matrix.map(row => row[columnIndex]);
    const setColumn = matrix => columnIndex => newColumn => matrix.map(row => {
        row[columnIndex] = newColumn.shift();
        return row;
    })
    const byColumn = matrix => moveFn => matrix[0].reduce((matrix, _, columnIndex) => {
        const movedColumn = moveFn(getColumn(matrix)(columnIndex))
        return setColumn(matrix)(columnIndex)(movedColumn)
    }, matrix);
    
    const actionMap = {
        'L': matrix => matrix.map(moveLeft),
        'R': matrix => matrix.map(moveRight),
        'U': matrix => byColumn(matrix)(moveLeft),
        'D': matrix => byColumn(matrix)(moveRight)
    }
    const isRedundantAct = actionPair => actionPair[0] === actionPair[1] || [ 'LR', 'RL', 'UD', 'DU' ].includes(actionPair.join(''));
    const optimizeActions = (actions, nextAction) => {
        const prevAction = actions.pop();
        prevAction && !isRedundantAct([prevAction, nextAction]) && actions.push(prevAction);
        actions.push(nextAction);
        return actions;
    };
    const performActions = (matrix, action) => actionMap[action](matrix);
    
    return actions
        .split('')
        .reduce(optimizeActions, [])
        .reduce(performActions, lock.map(row => row.split('')))
        .map(row => row.join(''));
}

const pickFrom = haystack => haystack.charAt(Math.floor(Math.random() * haystack.length));
const LOCK_SIZE = 300;
const NUM_ACTIONS = 50;

const row = (() => {
  let ret = '';
  while (ret.length < LOCK_SIZE) {
    ret += pickFrom('...AB')
  }
  return ret;
});

const lock = (() => {
  let ret = [];
  while (ret.length < LOCK_SIZE) {
    ret.push(row());
  }
  return ret;
})()

const actions = (() => {
  let ret = '';
  while (ret.length < NUM_ACTIONS) {
    ret += pickFrom('LRUD');
  }
  return ret;
})()

console.log('');
console.log('Lock Size: ' + lock[0].length);
console.log('Action Size: ' + actions.length);
console.log('Actions: ' + actions);
console.time('secretArchivesLock');
secretArchivesLock(lock, actions);
console.timeEnd('secretArchivesLock');
