/**
 * 가위바위보 승부를 결정하는 함수
 * @param {Array} inputList 
 * @return {String} result
 */
 const judgeGame = (inputList) => {
    /**
     * 중복 제거를 위해 List를 Set으로 변환
     */
    const inputSet = new Set(inputList);

    /**
     * 가위바위보 input의 길이가 2가 아닌경우는 무승부인 케이스이다.
     */
    if(inputSet.size !== 2) {
        return DRAW_STR;
    }

    /**
     * 승부 결정
     */
    if(inputSet.has(ROCK_STR) && inputSet.has(SCISSORS_STR)) {
        return ROCK_STR;
    } else if(inputSet.has(ROCK_STR) && inputSet.has(PAPER_STR)) {
        return PAPER_STR;
    } else if(inputSet.has(PAPER_STR) && inputSet.has(SCISSORS_STR)) {
        return SCISSORS_STR;
    }
}

module.exports = {
    judgeGame
};