//this file to handle ui active states, show/hide, etc


$( document ).ready(function() {

   //init particles.js
   /* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
   particlesJS.load('particles-js', 'https://raw.githubusercontent.com/szechuansauce/hivemind/master/assets/particles.json', function() {
      console.log('callback - particles.js config loaded');
   });

   // pJSDom[0].pJS.particles.number.value = 60;
   // pJSDom[0].pJS.fn.particlesRefresh();

   //remove the loading wrapper when document has loaded. delay slightly to guarantee safe to start game
   function removeLoadingWrapper() {
      $('#loadingWrapper').remove();
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
