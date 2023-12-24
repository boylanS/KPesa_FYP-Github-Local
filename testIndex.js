// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

    //grabs anything with a close of modal, initialises 
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);


    // anything collapsible is collapsed
    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);
  
  });
