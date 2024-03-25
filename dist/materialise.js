

// This file ensures that the Materialise UI elements will be initiated upon page load

document.addEventListener('DOMContentLoaded', function() {

  // Modals
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
  
    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);

    //Dropdown menu
    var elems = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(elems);
  
  });


