var Game = function() {
  this.playersGuess = null;
  this.winningNumber = generateWinningNumber();
  this.pastGuesses = [];
}

function generateWinningNumber() {
  return Math.ceil(Math.random() * 100);
}

function newGame() {
  return new Game(); //check that old game !== new game
}

Game.prototype.difference = function() {
  return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function() {
  return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(guess) {
  if (typeof guess !== 'number' || guess < 1 || guess > 100) {
    throw "That is an invalid guess.";
  }
  this.playersGuess = guess;
  return this.checkGuess();
}

Game.prototype.checkGuess = function() {
  if (this.playersGuess === this.winningNumber) {
    return 'You Win!'
  } else {
    if (this.pastGuesses.indexOf(this.playersGuess) > -1) {
      return 'You have already guessed that number.';
    } else {
      this.pastGuesses.push(this.playersGuess);
      if (this.pastGuesses.length === 5) {
        return 'You Lose.';
      } else {
        var diff = this.difference();
        if (diff < 10) return 'You\'re burning up!';
        else if (diff < 25) return 'You\'re lukewarm.';
        else if (diff < 50) return 'You\'re a bit chilly.';
        else return 'You\'re ice cold!';
      }
    }
  }
}

Game.prototype.provideHint = function() {
  var hintArray = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
  return shuffle(hintArray);
}

function shuffle(arr) { //Fisher-Yates - https://bost.ocks.org/mike/shuffle/
  for (var i = arr.length - 1; i > 0; i--) {
    var randomIndex = Math.floor(Math.random() * (i + 1));
    var temp = arr[i];
    arr[i] = arr[randomIndex];
    arr[randomIndex] = temp;
  }
  return arr;
}

/* Event hanlders will occur here to manage game state. */
$(document).ready(function() {
  var guessingGame = new Game();

  $('#submit').click(function() {
    let guess = $('#player-input').val();

    if (guessingGame.pastGuesses.length <= 5 && guess !== '') {
      let status = guessingGame.playersGuessSubmission(Number.parseInt(guess)),
        miniHint = (guessingGame.isLower()) ? "Guess higher." : "Guess lower. ";
      console.log(status);

      $('#title').text(status + " " + miniHint);

      if (status != "You have already guessed that number.") {
        let target = "#ele" + guessingGame.pastGuesses.length;
        $(target).text(guess);
      }
      if (status == "You Win!" || status == "You Lose.") {
        $('#title').text(status);
        $('#submit').prop("disabled", true);
        $('#hint').prop("disabled", true);
      }

      $('#player-input').val('');
    }
  });

  $('#hint').click(function() {
    $('#subtitle').text("Here are the possible choices: " + JSON.stringify(guessingGame.provideHint()));
  });

  $('#reset').click(function() {
    guessingGame = newGame();
    $('#submit').prop("disabled", false);
    $('#hint').prop("disabled", false);
    $('#subtitle').text("Guess a number between 1-100!");

    for (var i = 1; i < 6; i++) {
      $('#ele' + i).text("-");
    }
  });
});
