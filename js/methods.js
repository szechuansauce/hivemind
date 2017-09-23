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

   //send each bee's data to the DOM
   //takes input of a bee object, maps to the appropriate data-ids on a dom element
   function mapBeeDataToDOM(bee) {
      var $DOMReference = bee.DOMReference,
      $DOMTarget = $(".actions").find("[data-beetype='" + $DOMReference + "']"),
      $cost = bee.cost + '';
      $exp = bee.experienceValue;
      $DOMTarget.append('<span class="bee-cost">(' + $cost + ')</span>');
      $DOMTarget.attr('data-beecost', $cost);
      $DOMTarget.attr('data-exp', $exp);
      console.log($cost);
      console.log($DOMTarget);
   }
   mapBeeDataToDOM($queenBee);
   mapBeeDataToDOM($droneBee);
   mapBeeDataToDOM($workerBee);

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
         $('body').removeClass('paused');
         setTimeout(pauseButton_pauseHTML, 1000);
      //if time running, pause and don't run timer
      } else {
         $game.isPaused = true;
         updateMessage('Paused');
         $('body').addClass('paused');
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
   //utility function to round down to nearest whole number
   function roundDown(number) {
      return Math.floor(number);
   }
   function roundToFirstDecimalPlace(number) {
      var $number = (number * 10);
      Math.floor($number);
      $number = ($number / 10);
      return $number;
   }
   //update the counters (bee/resource counts next to bee/resource types)
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
          $levelCount = $('#levelCount .count')
      //methods
      calculateTotalPopulation();
      $queenCount.html(roundDown($hive.queenCount));
      $droneCount.html(roundDown($hive.droneCount));
      $workerCount.html(roundDown($hive.workerCount));
      $eggCount.html(roundDown($hive.eggCount) + ' (+' + roundToFirstDecimalPlace($hive.eggRate) + ')');
      $populationCount.html(roundDown($hive.population));
      $honeyCount.html(roundDown($hive.honey) + ' (+' + roundToFirstDecimalPlace($hive.honeyRate) + ')');
      $territoryCount.html(roundDown($hive.territory) + ' (+' + roundToFirstDecimalPlace($hive.territoryRate) + ')');
      $healthCount.html(roundDown($hive.health) + ' (+' + roundToFirstDecimalPlace($hive.healthRate) + ')');
      $seasonCount.html($game.season);
      $experienceCount.html(roundDown($hive.experience));
      $levelCount.html(roundDown($hive.level));
   }
   //check hive exp progress, level the hive up if required and reset progress to 0
   function checkHiveExp() {
      var $exp = $hive.experience,
      $expReq = $hive.experienceRequirement;
      if ($exp >= $expReq) {
         $hive.level += 1;
         $hive.experience = 0;
         $hive.experienceRequirement = ($expReq * 1.35);
         updateMessage('Your hive has hit level ' + $hive.level + '!');
      }
   }
   //util function to add experience for any rate addition - takes amount and cuts it down
   function addExperience(source, multiplier) {
      if (multiplier) {
         var $expValue = ((source / 10) * multiplier);
         $hive.experience += $expValue;
      } else {
         var $expValue = (source / 10);
         $hive.experience += $expValue;
      }
   }
   //update the hive's finances - function for each type then called together
   //multiplier = factor based upon number of workers currently influencing the type
   function updateHoney(amount) {
      $hive.honey += amount;
      addExperience(amount);
   }
   function updateTerritory(amount) {
      $hive.territory += amount;
      addExperience(amount);
   }
   function updateHealth(amount) {
      //if health less than 100, and adding amount still less, add amount
      if (($hive.health + amount) <= 100) {
         $hive.health += amount;
         addExperience(amount);
      }
      //if amount will send health over 100, force to 100
      else if (($hive.health + amount) > 100) {
         $hive.health = 100;
      //shouldn't reach here, but otherwise force 100
      } else {
         $hive.health = 100;
      }
   }
   function updateEggs(amount) {
      $hive.eggCount += amount;
      addExperience(amount, 5);
   }
   //this function used to update all finances based on bee activity per second
   function updateAllFinances() {
      $hive.honeyRate = ($hive.workerCount * $workerBee.honeyRate);
      $hive.territoryRate = ($hive.workerCount * $workerBee.territoryRate);
      $hive.healthRate = ($hive.workerCount * $workerBee.healthRate);
      $hive.eggRate = ($hive.droneCount * $droneBee.eggRate);
      updateHoney($hive.honeyRate);
      updateTerritory($hive.territoryRate);
      updateHealth($hive.healthRate);
      updateEggs($hive.eggRate);
   }
   //create a new bee on button click. take html id as a parameter. the element should have data-beetype, data-beeamount, data-beecost attributes to use.
   function createBee(button) {
      $this = button;
      $type = $this.data('beetype');
      $amount = $this.data('beeamount');
      $cost = $this.data('beecost');
      $message = $amount + ' ' + $type + ' created.';
      if ($cost && $amount && $type) {
         if ($hive.eggCount >= 1) {
            if ($cost < $hive.honey) {
               //subtract cost from honey
               $hive.honey = ($hive.honey - $cost);
               $hive.experience += $this.data('exp');
               //check bee type and add appropriately
               if ($type == 'worker') {
                  $hive.workerCount += $amount;
               } else if ($type == 'drone') {
                  $hive.droneCount += $amount;
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

   //compare a progress to a max, calc the percentage progress, add max-width to bar
   var $experienceBarInner = $('#experienceCount .progress-bar-inner');
   function generatePercentage(progress, maximum, target) {
      var $percentage = ((progress / maximum) * 100);
      var $percentageString = ($percentage + '%');
      //target.css('max-width', '50%');
      target.css('max-width', $percentageString);
   }
   generatePercentage($hive.experience, $hive.experienceRequirement, $experienceBarInner);

   //monitor the seasons - watch and update game.season, controlled by game.seasonProgress
   function refreshSeasons() {
      //push the season progress forward
      $game.seasonProgress += 1;
      //check if season has finished (against arbitrary amount, change this to lengthen or shorten)
      if ($game.seasonProgress > 30) {
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
   refreshSeasons();
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
        checkHiveExp();
        generatePercentage($hive.experience, $hive.experienceRequirement, $experienceBarInner);
     }
   }


   //create a bee on button click
   $('.actions .button').on( "click", function() {
      $this = $(this);
      createBee($this);
   });


});
