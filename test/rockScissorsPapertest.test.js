const ROCK_STR = 'rock';
const SCISSORS_STR = 'scissors';
const PAPER_STR = 'paper';
const DRAW_STR = 'draw' //=> 승부가 안남

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

test('가위바위보 테스트1', () => {
    //given
    const inputList1 = [ROCK_STR, ROCK_STR, ROCK_STR, ROCK_STR];
    const inputList2 = [PAPER_STR,PAPER_STR];
    const inputList3 = [SCISSORS_STR,SCISSORS_STR,SCISSORS_STR];
    
    //when
    const result1 = judgeGame(inputList1);
    const result2 = judgeGame(inputList2);
    const result3 = judgeGame(inputList3);
    
    //then
    expect(result1).toBe(DRAW_STR);
    expect(result2).toBe(DRAW_STR);
    expect(result3).toBe(DRAW_STR);
});

test('가위바위보 테스트2', () => {
    //given
    const inputList1 = [ROCK_STR, PAPER_STR, SCISSORS_STR, ROCK_STR];
    const inputList2 = [PAPER_STR, SCISSORS_STR, SCISSORS_STR, ROCK_STR];
    
    //when
    const result1 = judgeGame(inputList1);
    const result2 = judgeGame(inputList2);
    
    //then
    expect(result1).toBe(DRAW_STR);
    expect(result2).toBe(DRAW_STR);
});

test('가위바위보 테스트3', () => {
    //given
    const inputList1 = [ROCK_STR, PAPER_STR];
    const inputList2 = [PAPER_STR, SCISSORS_STR, SCISSORS_STR, SCISSORS_STR];
    const inputList3 = [SCISSORS_STR, SCISSORS_STR, ROCK_STR, ROCK_STR];

    //when
    const result1 = judgeGame(inputList1);
    const result2 = judgeGame(inputList2);
    const result3 = judgeGame(inputList3);
    
    //then
    expect(result1).toBe(PAPER_STR);
    expect(result2).toBe(SCISSORS_STR);
    expect(result3).toBe(ROCK_STR);
});