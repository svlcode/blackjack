// DOM variables
let textArea = document.getElementById('text-area');
let newGameBtn = document.getElementById('new-game-btn');
let hitBtn = document.getElementById('hit-btn');
let stayBtn = document.getElementById('stay-btn');

// Game variables
let gameStarted = false,
    gameOver = false,
    playerWon = false,
    draw = false,
    dealer = {},
    player = {},
    deck = [];

hitBtn.style.display = 'none';
stayBtn.style.display = 'none';

newGameBtn.addEventListener('click', function(){
    gameStarted = true;
    gameOver = false;
    playerWon = false;
    draw = false;
    
    deck = new Deck();

    dealer = new Player();
    dealer.addCard(deck.getNextCard());
    dealer.addCard(deck.getNextCard());
    
    player = new Player();
    player.addCard(deck.getNextCard());
    player.addCard(deck.getNextCard());

    newGameBtn.style.display = 'none';
    hitBtn.style.display = 'inline';
    stayBtn.style.display = 'inline';
    showStatus();
});

hitBtn.addEventListener('click' , function(){
    player.addCard(deck.getNextCard());
    checkDealerDrawsCard();
    checkScore();
    showStatus();
});

stayBtn.addEventListener('click', function(){
    gameOver = true;
    checkDealerDrawsCard();
    checkScore();
    showStatus();
});

function checkDealerDrawsCard(){
    while(dealer.getScore() <  player.getScore() && dealer.getScore() <= 21 && player.getScore() <= 21){
        takeDealerCard();
    }
}

function checkScore(){
    let playerScore = player.getScore();
    let dealerScore = dealer.getScore();
    if(playerScore > 21 || dealerScore > 21){
        gameOver = true;
        if(playerScore > 21 && dealerScore > 21){
            if(playerScore < dealerScore){
                playerWon = true;
            }
            else{
                playerWon = false;    
            }
        }
        else if (playerScore < dealerScore){
            playerWon = true;
        }
        else{
            playerWon = false;
        }
    }
    else  if(playerScore === 21 && dealerScore === 21){
        gameOver = true;
        draw = true;
    }
    else if(gameOver){
        if(playerScore > dealerScore){
            playerWon = true;
        }
        else if (playerScore === dealerScore){
            draw = true;
        }
        else{
            playerWon = false;
        }
    }
}



function takeDealerCard(){
    if(dealer.getScore() < 21){
        dealer.addCard(deck.getNextCard());
    }
}

function Player(){
    this.cards = [];

    this.addCard = function(card){
        this.cards.push(card);
    }

    this.getPlayerCardString = function(){
        let playerCardString = '';
        for (let i = 0; i < this.cards.length; i++) {
            playerCardString += this.cards[i].getCardString() + '\n';
        }
        return playerCardString;
    }

    this.getScore = function(){
        let score = 0;
            let hasAce = false;
            for (let i = 0; i < this.cards.length; i++) {
                let card = this.cards[i];
                score += card.getNumericValue();
                if(card.value === 'Ace'){
                    hasAce = true;
                }
            }
            if(hasAce && score + 10 <= 21) {
                return score + 10;
            }
            return score;
    }
}

function Card(suit, value){
    this.suit = suit;
    this.value = value;
    
    this.getCardString = function(){
        return this.value + ' of ' + this.suit;
    }
    
    this.getNumericValue = function(){
        switch (this.value) {
            case 'Ace':
                return 1;
            case 'Two':
                return 2;
            case 'Three':
                return 3;
            case 'Four':
                return 4;
            case 'Five':
                return 5;
            case 'Six':
                return 6;
            case 'Seven':
                return 7;
            case 'Eight':
                return 8;
            case 'Nine':
                return 9;
            default:
                return 10;
        }
    }
}

function Deck(){
    let cards = getCards();

    function getCards() {
        let cards = [];
        let suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'];
        
        let values = ['Ace', 'King', 'Queen', 'Jack', 'Ten', 'Nine', 'Eight', 'Seven', 'Six', 'Five', 'Four', 'Three', 'Two'];
        for (let suitIdx = 0; suitIdx < suits.length; suitIdx++) {
            for (let valueIdx = 0; valueIdx < values.length; valueIdx++) {

                let card = new Card(suits[suitIdx], values[valueIdx]);
                cards.push(card);
            }
         }

         for (let i = 0; i < cards.length; i++) {
            
            let swapIdx = Math.trunc(Math.random() * cards.length);
            let tmp = cards[swapIdx];
            cards[swapIdx] = cards[i];
            cards[i] = tmp;
        }
         return cards;
    }

    for (let i = 0; i < cards.length; i++) {
        console.log(cards[i].getCardString())    
    }

    this.getNextCard = function(){
        return cards.shift();
    }
}

function showStatus(){
    if(!gameStarted){
        textArea.innerText = 'Welcome to Blackjack!';
        return;
    }

    textArea.innerText = `Dealer has:\n${dealer.getPlayerCardString()}(score: ${dealer.getScore()})\n\n ` + 
    `You have:\n${player.getPlayerCardString()}(score: ${player.getScore()})\n\n `;

    if(gameOver){
        if(playerWon) {
            textArea.innerText += 'You Win!'
        }
        else if (draw){
            textArea.innerText += 'Draw!'
        }
        else{
            textArea.innerText += 'Dealer Wins!'
        }
        newGameBtn.style.display = 'inline';
        hitBtn.style.display = 'none';
        stayBtn.style.display = 'none';
    }

}

