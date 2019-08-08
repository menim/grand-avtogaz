(function () {
  let equipmentListBtns = Array.prototype.slice.call (
    document.querySelectorAll ('.equipment__btn')
  );

  equipmentListBtns.forEach (function (equipmentBtn) {
    equipmentBtn.addEventListener ('click', function () {
      equipmentBtn.classList.toggle ('equipment__btn--is-active');
      equipmentBtn.parentNode.parentNode.nextSibling.nextSibling.classList.toggle (
        'equipment__bottom--is-show'
      );
    });
  });
}) ();
