(function () {
  let equipmentListBtns = Array.prototype.slice.call (
    document.querySelectorAll ('.equipment__btn')
  );

  function toggleEquipment (e) {
    this.classList.toggle ('equipment__btn--is-active');
    console.log (this.parentNode.parentNode.nextElementSibling);
    this.parentNode.parentNode.nextElementSibling.classList.toggle (
      'equipment__bottom--is-show'
    );
  }

  equipmentListBtns.forEach (function (equipmentBtn) {
    equipmentBtn.addEventListener ('click', toggleEquipment);
  });
}) ();
