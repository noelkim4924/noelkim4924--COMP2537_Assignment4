async function getRandomPokemon(numPokemonPairs) {
    const randomPokemon = new Set();
    const shuffledPokemon = [];
  
    //Generate Pokemon pairs based on difficulty
    while (randomPokemon.size < numPokemonPairs) {
      const randomPokemonID = Math.floor(Math.random() * 810) + 1;
      randomPokemon.add(randomPokemonID);
      shuffledPokemon.push(randomPokemonID, randomPokemonID);
    }
    shuffledPokemon.sort(() => Math.random() - 0.5);
  
    // Create pokemon cards 
    for (let i = 0; i < shuffledPokemon.length; i++) {
      const pokemonID = shuffledPokemon[i];
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonID}`);
      $("#gameGrid").append(`
        <div class="pokeCard">
          <img id="img${i}" class="front_face" src=${res.data.sprites.other["official-artwork"].front_default} alt="">
          <img class="back_face" src="Cardback.jpg" alt="">
        </div>
      `);
    }
  }
  
  const setup = () => {
  
    // Reset Button
    $("#reset").click(function () {
      location.reload();
    });
  
    // Dark and light mode
    $("#darkMode").click(function () {
      $("body").css("background-color", "#201E1D");
      $(".stats").css("color", "white");
    });
    $("#lightMode").click(function () {
      $("body").css("background-color", "white");
      $(".stats").css("color", "black");
    });
  
    //Difficulty
    var difficulty = '';
  
    $("#easy").click(function () {
      difficulty = "easy";
    });
    $("#normal").click(function () {
      difficulty = "normal";
    });
    $("#hard").click(function () {
      difficulty = "hard";
    });
  
    // Starts game button and function
    function startGame() {
      $("#start").css("display", "none");
  
      var firstCard = undefined;
      var secondCard = undefined;
      var totalPairs = 0;
      var matches = 0;
      var clicks = 0;
      var moves = 0;
      var matchesLeft = totalPairs;
      var timer = 0;
      var finalTime = 0;
  
      switch (difficulty) {
        case "easy":
          totalPairs = 4;
          timer = 30;
          $("#gameGrid").css("width", "410px");
          $("#gameGrid").css("height", "200px");
          break;
        case "normal":
          totalPairs = 8;
          timer = 120;
          $("#gameGrid").css("width", "410px");
          $("#gameGrid").css("height", "300px");
          break;
        default:
          totalPairs = 16;
          timer = 180;
          $("#gameGrid").css("width", "820px");
          $("#gameGrid").css("height", "412px");
      }
      matchesLeft = totalPairs;
  
      // stats
      $("#moves").text(moves);
      $("#total").text(totalPairs);
      $("#matches").text(matches);
      $("#left").text(matchesLeft - matches);
      $("#timer").text(timer);
      $("#time").text(timer);
  
      // Game timer 
      let timerInterval = setInterval(() => {
        timer--;
        finalTime++;
        $("#time").text(timer);
  
        if (timer === 0) {
          clearInterval(timerInterval);
          $(".modal-timeout").show();
          return;
        }
      }, 1000);
  
  
      // Generates random pairs of Pokémon for the card game
      getRandomPokemon(totalPairs).then(() => {
        $("#powerUp").one("click", function () {
          $(this).prop("disabled", true);
          $(".pokeCard").addClass("flip disabled");
          setTimeout(() => {
            $(".pokeCard").each(function () {
              if (!$(this).hasClass("matched")) {
  
                $(this).removeClass("flip disabled");
              }
            });
          }, 1500);
        });
        $(".pokeCard").on("click", function () {
          if (!firstCard) {
            firstCard = $(this).find(".front_face")[0];
            $(this).toggleClass("flip");
            $(this).toggleClass("disabled"); 
            clicks++;
            $("#clicks").text(clicks);
          } else {
            if ($(this).find(".front_face")[0] === firstCard) {
              return;
            }
            if (!secondCard) {
              secondCard = $(this).find(".front_face")[0];
              $(this).toggleClass("flip");
              $(this).toggleClass("disabled"); 
              clicks++;
              $("#clicks").text(clicks);
              moves++;
              $("#moves").text(moves);
            } else {
              return;
            }
            
            if (firstCard.src == secondCard.src) {
              matches++;
              $("#matches").text(matches);
              $("#left").text(matchesLeft - matches);
  
  
              $(`#${firstCard.id}`).parent().addClass("matched");
              $(`#${secondCard.id}`).parent().addClass("matched");
  
  
              $(`#${firstCard.id}`).parent().off("click");
              $(`#${secondCard.id}`).parent().off("click");
  
  
              firstCard = undefined;
              secondCard = undefined;
            } else {
              setTimeout(() => {
                $(`#${firstCard.id}`).parent().toggleClass("flip");
                $(`#${firstCard.id}`).parent().toggleClass("disabled");
                $(`#${secondCard.id}`).parent().toggleClass("flip");
                $(`#${secondCard.id}`).parent().toggleClass("disabled");
  
                firstCard = undefined;
                secondCard = undefined;
              }, 1000);
            }
          }
  
  
          if (matches === totalPairs) {
            setTimeout(() => {
              $("#final-moves").text(moves);
              $("#final-time").text(finalTime);
              $(".modal").show(); 
              clearInterval(timerInterval);
            }, 1000);
          }
        });
      });
    }
    $("#start").click(function () {
      startGame();
    });
  };
  
  $(document).ready(setup);