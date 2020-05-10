module.exports = {
    rating: function (move, rated, answer){
        let black = 0, white = 0;
        //rated and move rated are arrays of boolean type
        let moveRated = [];
        let moveLength = move.length;
        let answerLength = answer.length;
        // ^ to avoid repeating operations
        for (let i = 0; i < moveLength; i++) {
            moveRated[i] = false;
        }
        for(let i = 0; i < moveLength; i++) {
            if (!rated[i]){
                if(move[i] === answer[i]){
                    moveRated[i] = true;
                    rated[i] = true;
                    black += 1;
                }
            }
        }
        for (let i = 0; i < moveLength; i++){
            if (!moveRated[i]){
                for (let j = 0; j < answerLength; j++) {
                    if (!rated[j]){
                        if (move[i] === answer[j]) {
                            moveRated[i] = true;
                            rated[j] = true;
                            white += 1;
                        }
                    }
                }
            }
            return [rated, black, white];
        }
    },
};