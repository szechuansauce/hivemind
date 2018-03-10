//this file to handle ui active states, show/hide, etc


$( document ).ready(function() {

   //INTERFACE
   //init particles.js
   particlesJS('particles-js',
   {
     "particles": {
       "number": {
         "value": 0,
         "density": {
           "enable": true,
           "value_area": 800
         }
       },
       "color": {
         "value": "#000000"
       },
       "shape": {
         "type": "polygon",
         "stroke": {
           "width": 1,
           "color": "#000000"
         },
         "polygon": {
           "nb_sides": 6
         }
       },
       "opacity": {
         "value": 0.44867121213335115,
         "random": false,
         "anim": {
           "enable": false,
           "speed": 4.13877054169203,
           "opacity_min": 0.1,
           "sync": false
         }
       },
       "size": {
         "value": 2,
         "random": true,
         "anim": {
           "enable": true,
           "speed": 1,
           "size_min": 0.1,
           "sync": false
         }
       },
       "line_linked": {
         "enable": false
       },
       "move": {
         "enable": true,
         "speed": 2,
         "direction": "right",
         "random": true,
         "straight": false,
         "out_mode": "bounce",
         "bounce": true,
         "attract": {
           "enable": false
         }
       }
     },
     "interactivity": {
       "detect_on": "canvas",
       "events": {
         "onhover": {
           "enable": false,
         },
         "onclick": {
           "enable": false,
         },
         "resize": true
       },
       "modes": {
         "grab": {
           "distance": 400,
           "line_linked": {
             "opacity": 1
           }
         },
         "bubble": {
           "distance": 400,
           "size": 40,
           "duration": 2,
           "opacity": 8,
           "speed": 3
         },
         "repulse": {
           "distance": 200,
           "duration": 0.4
         },
         "push": {
           "particles_nb": 4
         },
         "remove": {
           "particles_nb": 2
         }
       }
     },
     "retina_detect": false
   }

   );


   //remove the loading wrapper when document has loaded. delay slightly to guarantee safe to start game
   function removeLoadingWrapper() {
      $('#loadingWrapper').remove();
      // pJS.particles.number.value = 30;
   }
   setTimeout(removeLoadingWrapper, 1000);

   //show/hide help section on #helpMe button click
   $('#helpMe').on( "click", function() {
      $this = $(this);
      $target = $('.help-wrapper');
      $helphtml = '<i class="fa fa-question" aria-hidden="true"></i>';
      $closehtml = '<i class="fa fa-times" aria-hidden="true"></i>';
     if ($target.hasClass('active')) {
        $target.removeClass('active');
        $this.html($helphtml);
     } else {
        $target.addClass('active');
        $this.html($closehtml);
     }
   });

   //close help when clicking escape key
   $(document).keyup(function(e) {
      if (e.keyCode == 27) {
         e.preventDefault();
         $button = $('#helpMe');
         $target = $('.help-wrapper');
         $helphtml = '<i class="fa fa-question" aria-hidden="true"></i>';
        if ($target.hasClass('active')) {
           $target.removeClass('active');
           $button.html($helphtml);
        }
        return false;
      }
   });

});
