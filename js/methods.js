//this file to define and enact the methods that power the game

//hive reference
/* $hive {
   this.name = 'Hive';
   this.cost = 10000;
   this.population = 0;
   this.populationMax = 10000;
   this.honey = 1000;
   this.territory = 0;
   this.health = 0;
   this.queenCount = 0;
   this.droneCount = 0;
   this.workerCount = 0;
} */

$( document ).ready(function() {

   //update the game's current message (chains to existing, similar to chrome console)
   var $lastMessage,
       $repeatCount = 0;
   function updateMessage(message) {
      var $previous = $('.message span').first(),
          $messageWrapper = $('.message');
      if ($messageWrapper.hasClass('empty')) {
         $messageWrapper.removeClass('empty');
         $lastMessage = (message + '');
         $repeatCount = 0;
         $('.message').prepend('<span>' + message + '</span>');
      }
      else if (message == $lastMessage) {
         $previous.children().remove();
         $repeatCount += 1;
         $previous.append('<div class="repeated">' + ' ' + '[' + $repeatCount + ']' + '</div>');
         $lastMessage = message;
      } else {
         $repeatCount = 0;
         $lastMessage = (message + '');
         $('.message').prepend('<span>' + message + '</span>');
      } return false;
   }
   //pause and unpause the game when clicking play/pause
   $('#pauseMe').on( "click", function() {
      pauseUnpause();
   });
   $(window).keypress(function (e) {
     if (e.keyCode === 0 || e.keyCode === 32) {
       e.preventDefault()
       pauseUnpause();
     }
   })
   function pauseUnpause() {
      //var
      var $button = $('#pauseMe');
      disablePauseButton();
      setTimeout(enablePauseButton, 1001);
      //methods
      //if time paused, unpause and run timer
      if ($game.isPaused) {
         $game.isPaused = false;
         updateMessage('Unpaused');
         masterTimer();
         setTimeout(pauseButton_pauseHTML, 1000);
      //if time running, pause and don't run timer
      } else {
         $game.isPaused = true;
         updateMessage('Paused');
         setTimeout(pauseButton_playHTML, 1000);
      }
   }
   //function to disable the pause button while changes are made
   function disablePauseButton() {
      var $button = $('#pauseMe');
      $button.addClass('disabled');
   }
   function enablePauseButton() {
      var $button = $('#pauseMe');
      $button.removeClass('disabled');
   }
   function pauseButton_pauseHTML() {
      var $button = $('#pauseMe'),
      $pausehtml = '<i class="fa fa-pause" aria-hidden="true"></i>';
      $button.html($pausehtml);
   }
   function pauseButton_playHTML() {
      var $button = $('#pauseMe'),
      $playhtml = '<i class="fa fa-play" aria-hidden="true"></i>';
      $button.html($playhtml);
   }
   //calculate total population of bees
   function calculateTotalPopulation() {
      $total = ($hive.queenCount + $hive.droneCount + $hive.workerCount);
      $hive.population = $total;
   }
   //update the counters (bee counts next to bee types)
   function updateBeeCounters() {
      var $queenCount = $('#queenCount .count'),
          $droneCount = $('#droneCount .count'),
          $workerCount = $('#workerCount .count'),
          $eggCount = $('#eggCount .count'),
          $populationCount = $('#populationCount .count'),
          $seasonCount = $('#seasonCount .count'),
          $honeyCount = $('#honeyCount .count'),
          $territoryCount = $('#territoryCount .count'),
          $healthCount = $('#healthCount .count'),
          $experienceCount = $('#experienceCount .count'),
          $experienceLevelCount = $('#experienceLevelCount .count')
      //methods
      calculateTotalPopulation();
      $queenCount.html($hive.queenCount);
      $droneCount.html($hive.droneCount);
      $workerCount.html($hive.workerCount);
      $eggCount.html($hive.eggCount);
      $populationCount.html($hive.population);
      $honeyCount.html($hive.honey);
      $territoryCount.html($hive.territory);
      $healthCount.html($hive.health);
      $seasonCount.html($game.season);
      $experienceCount.html($hive.experience);
      $experienceLevelCount.html($hive.experienceLevel);
   }
   //update the hive's finances - function for each type then called together
   //multiplier = factor based upon number of workers currently influencing the type
   function updateHoney(amount) {
      $hive.honey += amount;
   }
   function updateTerritory(amount) {
      $hive.territory += amount;
   }
   function updateHealth(amount) {
      //if health less than 100, and adding amount still less, add amount
      if (($hive.health + amount) <= 100) {
         $hive.health += amount;
      }
      //if amount will send health over 100, force to 100
      else if (($hive.health + amount) > 100) {
         $hive.health = 100;
      //shouldn't reach here, but otherwise force 100
      } else {
         $hive.health = 100;
      }
   }
   //this function used to update all finances based on bee activity per second
   function updateAllFinances() {
      $honeyRate = (($hive.workerCount) * 0.25);
      $territoryRate = (($hive.workerCount) * 0.25);
      $healthRate = (($hive.workerCount) * 0.25);
      updateHoney($honeyRate);
      updateTerritory($territoryRate);
      updateHealth($healthRate);
   }
   //create a new bee on button click. take html id as a parameter. the element should have data-beetype, data-beeamount, data-beecost attributes to use.
   function createBee(button) {
      $this = button;
      $type = $this.data('beetype');
      $amount = $this.data('beeamount');
      $cost = $this.data('beecost');
      $message = $amount + ' ' + $type + ' created.';
      if ($cost && $amount && $type) {
         if ($hive.eggCount > 0) {
            if ($cost < $hive.honey) {
               //subtract cost from honey
               $hive.honey = ($hive.honey - $cost);
               //check bee type and add appropriately
               if ($type == 'worker') {
                  $hive.workerCount += $amount;
               } else if ($type == 'drone') {
                  $hive.droneCount += $amount;
                  updateMessage('drone type');
               } else if ($type == 'queen') {
                  $hive.queenCount += $amount;
               } else {return false;}
               //send message informing of successful creation
               updateMessage($message);
               //spend an egg
               $hive.eggCount -= 1;
               updateBeeCounters();
            } else {
               updateMessage('Not enough honey!');
            }
         } else {
            updateMessage('Not enough eggs!');
         }
      } else {
         updateMessage('Button data attribute(s) missing! Someone done goofed.')
         return false;
      }
   }
   //monitor the seasons - watch and update game.season, controlled by game.seasonProgress
   function refreshSeasons() {
      //push the season progress forward
      $game.seasonProgress += 1;
      //check if season has finished (against arbitrary amount, change this to lengthen or shorten)
      if ($game.seasonProgress > 5) {
         $game.seasonProgress = 0;
         $body = $('body');
         switch($game.season) {
            case 'Summer':
               $game.season = 'Autumn';
               $body.removeClass();
               $body.addClass('autumn');
               break;
            case 'Autumn':
               $game.season = 'Winter';
               $body.removeClass();
               $body.addClass('winter');
               break;
            case 'Winter':
               $game.season = 'Spring';
               $body.removeClass();
               $body.addClass('spring');
               break;
            case 'Spring':
               $game.season = 'Summer';
               $body.removeClass();
               $body.addClass('summer');
               break;
         }
      }
   }


   /////////////////////////////////////////////////////////////////////////


   //------master method use starts here
   //update all counters and finances on start
   updateBeeCounters();
   updateAllFinances();
   //pause the game initially
   pauseUnpause();
   //the update master method
   setInterval(function() {
   }, 1000);
   function masterTimer(){
     //update the counters
     if ($game.isPaused) {
        return false;
     } else {
        console.log('Counters updated.');
        updateBeeCounters();
        updateAllFinances();
        setTimeout(masterTimer, 1000);
        refreshSeasons();
        calculateTotalPopulation();
     }
   }


   //create a bee on button click
   $('.actions .button').on( "click", function() {
      $this = $(this);
      createBee($this);
   });


});
