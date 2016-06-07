$(document).ready(function () {
    // tab design
    $('ul.tabs').tabs();
    //active toast on clic
    $('a#toast').on('click', activetoast); 
    // collapsible
    $('.collapsible').collapsible({
        accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
    //Slides
    $('.slider').slider();
    
});

function activetoast(){
    Materialize.toast('TEST', 4000);
}