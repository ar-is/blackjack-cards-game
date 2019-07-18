// Cards
let suits = [ 'Hearts', 'Spades', 'Clubs', 'Diamonds'];
let values = [ 'Ace', 'King', 'Queen', 'Jack',
            'Ten', 'Nine', 'Eight', 'Seven',
            'Six', 'Five', 'Four', 'Three', 'Two'
];

// HTML Variables
let dealer = document.getElementById('dealer');
let dealerTotalWins = document.getElementById('dealer-wins');
let dealerImgCards = document.getElementById('dealer-cards');
let dealerWallet = document.getElementById('dealer-wallet');
let dealerPoints = document.getElementById('dealer-score');
let winsboard = document.getElementById('wins-board');
let scoreTitle = document.getElementById('score-title');
let playerTotalWins = document.getElementById('player-wins');
let playerImgCards = document.getElementById('player-cards');
let playerWallet = document.getElementById('player-wallet');
let playerPoints = document.getElementById('player-score');
let player = document.getElementById('player');
let centerMoney = document.getElementById('moneybank');
let newGameButton = document.getElementById('new-game-button');
let hitButton = document.getElementById('hit-button');
let betMoreButton = document.getElementById('bet-more-button');
let stayButton = document.getElementById('stay-button');
let exitButton = document.getElementById('exit');
let refreshButton = document.getElementById('refresh-button');

// Game Variables
let gameStarted = false,
    gameOver = false,
    playerWon = false,
    gameExited = false,
    dealerCards = [],
    playerCards = [],
    playerMoney = 200,
    dealerMoney = 200,
    moneyBank = 0,
    dealerScore = 0,
    playerScore = 0,
    playerWinsNumber = 0,
    dealerWinsNumber = 0,
    deck = [];


// Initial Menu
let img = document.createElement("img");
img.src = 'images/blackjack2.png'
centerMoney.appendChild(img);

dealer.innerText = 'Welcome to BlackJack Game';
player.innerText = '';
winsboard.innerText = '';
scoreTitle.innerText = '';
playerWallet.style.display = 'none';
dealerWallet.style.display = 'none';
hitButton.style.display = 'none';
betMoreButton.style.display = 'none';
stayButton.style.display = 'none';
exitButton.style.display = 'none';
refreshButton.style.display = 'none';

// New Game Submit
newGameButton.addEventListener('click', function() {
    gameStarted = true;
    gameOver = false;
    playerWon = false;
    gameExited = false;

    dealerImgCards.innerHTML = '';
    playerImgCards.innerHTML = '';

    deck = createDeck();
    shuffleDeck(deck);
    dealerCards = [ getNextCard(), getNextCard() ];
    setCardImage(dealerCards[0], dealerImgCards);
    setCardImage(dealerCards[1], dealerImgCards);
    playerCards = [ getNextCard(), getNextCard() ];
    setCardImage(playerCards[0], playerImgCards);
    setCardImage(playerCards[1], playerImgCards);
    dealerMoney -= 20;
    playerMoney -= 20;
    moneyBank = 40;

    dealer.innerText = 'DEALER';
    player.innerText = 'PLAYER';
    winsboard.innerText = 'TOTAL WINS';
    scoreTitle.innerText = 'SCORE POINTS';
    playerWallet.style.display = 'inline';
    dealerWallet.style.display = 'inline';
    newGameButton.style.display = 'none';
    hitButton.style.display = 'inline';
    betMoreButton.style.display = 'inline';
    stayButton.style.display = 'inline';
    exitButton.style.display = 'none';
    refreshButton.style.display = 'none';
    showStatus();
});

// Game Status
function showStatus() {
    if (!gameStarted) {
        dealer.innerText = 'Welcome to BlackJack';
        return;
    }

    if (gameExited) {
        newGameButton.style.display = 'none';
        hitButton.style.display = 'none';
        betMoreButton.style.display = 'none';
        stayButton.style.display = 'none';
        exitButton.style.display = 'none';
        dealer.innerText = '';
        player.innerText = '';
        winsboard.innerText = '';
        dealerTotalWins.innerText = '';
        playerTotalWins.innerText = '';
        dealerPoints.innerText = '';
        playerPoints.innerText = '';
        scoreTitle.innerText = '';
        playerWallet.style.display = 'none';
        dealerWallet.style.display = 'none';
        centerMoney.innerText = 'Thank you for playing BlackJack';
        centerMoney.style.fontSize = "40px";
        dealerImgCards.innerHTML = '';
        playerImgCards.innerHTML = '';
        refreshButton.style.display = 'inline';
        return;
    }

    updateScores();

    if (playerMoney <= 50 && dealerMoney > 50) {
        betMoreButton.innerText = `Bet ${playerMoney - 1}$`;
    }
    else if (playerMoney > 50 && dealerMoney <= 50) {
        betMoreButton.innerText = `Bet ${dealerMoney - 1}$`;
    }
    else {
        betMoreButton.innerText = `Bet 50$`;
    }

    if (playerMoney > 0 && dealerMoney > 0) {
        dealerPoints.innerText = dealerScore;
        dealerWallet.innerText = `${dealerMoney}€`;
        centerMoney.innerText = `${moneyBank}€`;
        playerPoints.innerText = playerScore;
        playerWallet.innerText = `${playerMoney}€`;
    }
    else {
        newGameButton.style.display = 'none';
        hitButton.style.display = 'none';
        betMoreButton.style.display = 'none';
        stayButton.style.display = 'none';
        exitButton.style.display = 'none';
        refreshButton.style.display = 'inline';

        if (playerMoney > 0 && dealerMoney <= 0)
            player.innerText = 'Dealer bankrupted. Player WINS!';
        else
            dealer.innerText = 'Player bankrupted. Dealer WINS!';
    }

    if (gameOver) {
        if (playerWon) {
            dealer.innerText = '';
            player.innerText = 'YOU WIN!';
            playerWinsNumber += 1;
            playerMoney += moneyBank;
        }
        else {
            dealer.innerText = 'DEALER WINS!';
            player.innerText = '';
            dealerWinsNumber += 1;
            dealerMoney += moneyBank;
        }

        dealerTotalWins.innerText = dealerWinsNumber;
        playerTotalWins.innerText = playerWinsNumber;

        newGameButton.style.display = 'inline';
        hitButton.style.display = 'none';
        betMoreButton.style.display = 'none';
        stayButton.style.display = 'none';
        exitButton.style.display = 'inline';
    }
}

// Score Function
function getScore(cardArray) {
    let score = 0;
    let hasAce = false;

    for (let i = 0; i < cardArray.length; i++) {
        let card = cardArray[i];
        score += getCardNumericValue(card);
        if (card.value === 'Ace') {
            hasAce = true;
        }
    }

    if (hasAce && score + 10 <= 21) {
        return score + 10;
    }
    return score;
}

// Card Score Value Function
function getCardNumericValue(card) {
    switch(card.value) {
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

// Hit Button Submit
hitButton.addEventListener('click', function() {
    playerCards.push(getNextCard());
    setCardImage(playerCards[playerCards.length - 1], playerImgCards);
    checkForEndGame();
    checkForExitGame();
    showStatus();
});

// Bet More Button Submit
betMoreButton.addEventListener('click', function() {
    if (playerMoney > 50 && dealerMoney > 50) {
        moneyBank += 100;
        playerMoney -= 50;
        dealerMoney -= 50;
    }
    else if (playerMoney <= 50 && dealerMoney > 50) {
        moneyBank += (playerMoney * 2) - 2;
        playerMoney -= playerMoney - 1;
        dealerMoney -= playerMoney - 1;
    }
    else if (playerMoney > 50 && dealerMoney <= 50) {
        moneyBank += (dealerMoney * 2) - 2;
        playerMoney -= dealerMoney - 1;
        dealerMoney -= dealerMoney - 1;
    }
    
    betMoreButton.style.display = 'none';
    showStatus();
});

// Stay Button Submit
stayButton.addEventListener('click', function() {
    gameOver = true;
    checkForEndGame();
    checkForExitGame();
    showStatus();
});

// Exit Button Submit
exitButton.addEventListener('click', function() {
    gameExited = true;
    showStatus();
});

// Refresh Button Submit
refreshButton.addEventListener('click', function() {
    window.location.reload();
});

// EndGame Check
function checkForEndGame() {
    updateScores();
    if (gameOver) {
        while (dealerScore < playerScore && playerScore <= 21 && dealerScore <= 21) {
            dealerCards.push(getNextCard());
            setCardImage(dealerCards[dealerCards.length - 1], dealerImgCards);
            updateScores();
        }
    }

    if (playerScore > 21) {
        playerWon = false;
        gameOver = true;
    }
    else if (dealerScore > 21) {
        playerWon = true;
        gameOver = true;
    }
    else if (gameOver) {
        if (playerScore > dealerScore) {
            playerWon = true;
        }
        else {
            playerWon = false;
        }
    }
}

// ExitGame Check
function checkForExitGame() {
    if (playerMoney <= 0) {
        playerWon = false;
        gameExited = true;
    }
    else if (dealerMoney <= 0) {
        playerWon = true;
        gameExited = true;
    }
}

// Update Scores
function updateScores() {
    dealerScore = getScore(dealerCards);
    playerScore = getScore(playerCards);
}

// Deck Creation
function createDeck() {
    let deck = [];
    for (let suitIdx = 0; suitIdx < suits.length; suitIdx++) {
        for (let valueIdx = 0; valueIdx < values.length; valueIdx++) {
            let card = {
                suit: suits[suitIdx],
                value: values[valueIdx]
            }
            deck.push( card );
        }
    }
    return deck;
}

// Deck Shuffling
function shuffleDeck(deck) {
    for (let i = 0; i < deck.length; i++) {
        let swapIdx = Math.trunc(Math.random() * deck.length);
        let tmp = deck[swapIdx];
        deck[swapIdx] = deck[i];
        deck[i] = tmp;
        
    }
}

// Next Card
function getNextCard () {
    return deck.shift();
}

// Set Card Image on selected Div
function setCardImage(card, cardDiv) {
    let img = document.createElement("img");
    img.src = '';

    switch (card.value + ' of ' + card.suit) {
        case 'Ace of Spades':
            img.src = 'images/png/ace_of_spades.png'
            break;
        case 'King of Spades':
            img.src = 'images/png/king_of_spades.png'
            break;
        case 'Queen of Spades':
            img.src = 'images/png/queen_of_spades.png'
            break;
        case 'Jack of Spades':
            img.src = 'images/png/jack_of_spades.png'
            break;
        case 'Ten of Spades':
            img.src = 'images/png/10_of_spades.png'
            break;
        case 'Nine of Spades':
            img.src = 'images/png/9_of_spades.png'
            break;
        case 'Eight of Spades':
            img.src = 'images/png/8_of_spades.png'
            break;
         case 'Seven of Spades':
            img.src = 'images/png/7_of_spades.png'
            break;
        case 'Six of Spades':
            img.src = 'images/png/6_of_spades.png'
            break;
        case 'Five of Spades':
            img.src = 'images/png/5_of_spades.png'
            break;
        case 'Four of Spades':
            img.src = 'images/png/4_of_spades.png'
            break;
        case 'Three of Spades':
            img.src = 'images/png/3_of_spades.png'
            break;
        case 'Two of Spades':
            img.src = 'images/png/2_of_spades.png'
            break;
        case 'Ace of Hearts':
            img.src = 'images/png/ace_of_hearts.png'
            break;
        case 'Ace of Hearts':
            img.src = 'images/png/ace_of_hearts.png'
            break;
        case 'King of Hearts':
            img.src = 'images/png/king_of_hearts.png'
            break;
        case 'Queen of Hearts':
            img.src = 'images/png/queen_of_hearts.png'
            break;
        case 'Jack of Hearts':
            img.src = 'images/png/jack_of_hearts.png'
            break;
        case 'Ace of Hearts':
            img.src = 'images/png/ace_of_hearts.png'
            break;
        case 'Ten of Hearts':
            img.src = 'images/png/10_of_hearts.png'
            break;
        case 'Nine of Hearts':
            img.src = 'images/png/9_of_hearts.png'
            break;
        case 'Eight of Hearts':
            img.src = 'images/png/8_of_hearts.png'
            break;
        case 'Seven of Hearts':
            img.src = 'images/png/7_of_hearts.png'
            break;
        case 'Six of Hearts':
            img.src = 'images/png/6_of_hearts.png'
            break;
        case 'Five of Hearts':
            img.src = 'images/png/5_of_hearts.png'
            break;
        case 'Four of Hearts':
            img.src = 'images/png/4_of_hearts.png'
            break;
        case 'Three of Hearts':
            img.src = 'images/png/3_of_hearts.png'
            break;
        case 'Two of Hearts':
            img.src = 'images/png/2_of_hearts.png'
            break;
        case 'Ace of Clubs':
            img.src = 'images/png/ace_of_clubs.png'
            break;
        case 'King of Clubs':
            img.src = 'images/png/king_of_clubs.png'
            break;
        case 'Queen of Clubs':
            img.src = 'images/png/queen_of_clubs.png'
            break;
        case 'Jack of Clubs':
            img.src = 'images/png/jack_of_clubs.png'
            break;
        case 'Ten of Clubs':
            img.src = 'images/png/10_of_clubs.png'
            break;
        case 'Nine of Clubs':
            img.src = 'images/png/9_of_clubs.png'
            break;
        case 'Eight of Clubs':
            img.src = 'images/png/8_of_clubs.png'
            break;
        case 'Seven of Clubs':
            img.src = 'images/png/7_of_clubs.png'
            break;
        case 'Six of Clubs':
            img.src = 'images/png/6_of_clubs.png'
            break;
        case 'Five of Clubs':
            img.src = 'images/png/5_of_clubs.png'
            break;
        case 'Four of Clubs':
            img.src = 'images/png/4_of_clubs.png'
            break;
        case 'Three of Clubs':
            img.src = 'images/png/3_of_clubs.png'
            break;
        case 'Two of Clubs':
            img.src = 'images/png/2_of_clubs.png'
            break;
        case 'Ace of Diamonds':
            img.src = 'images/png/ace_of_diamonds.png'
            break;
        case 'King of Diamonds':
            img.src = 'images/png/king_of_diamonds.png'
            break;
        case 'Queen of Diamonds':
            img.src = 'images/png/queen_of_diamonds.png'
            break;
        case 'Jack of Diamonds':
            img.src = 'images/png/jack_of_diamonds.png'
            break;
        case 'Ten of Diamonds':
            img.src = 'images/png/10_of_diamonds.png'
            break;
        case 'Nine of Diamonds':
            img.src = 'images/png/9_of_diamonds.png'
            break;
        case 'Eight of Diamonds':
            img.src = 'images/png/8_of_diamonds.png'
            break;
        case 'Seven of Diamonds':
            img.src = 'images/png/7_of_diamonds.png'
            break;
        case 'Six of Diamonds':
            img.src = 'images/png/6_of_diamonds.png'
            break;
        case 'Five of Diamonds':
            img.src = 'images/png/5_of_diamonds.png'
            break;
        case 'Four of Diamonds':
            img.src = 'images/png/4_of_diamonds.png'
            break;
        case 'Three of Diamonds':
            img.src = 'images/png/3_of_diamonds.png'
            break;
        case 'Two of Diamonds':
            img.src = 'images/png/2_of_diamonds.png'
            break;
    }
 
    cardDiv.appendChild(img);
}

