(function() {
  //show hide equipment description feature
  let equipmentListBtns = Array.prototype.slice.call(
    document.querySelectorAll('.equipment__btn')
  );

  function toggleEquipment(e) {
    this.classList.toggle('equipment__btn--is-active');
    this.parentNode.parentNode.nextElementSibling.classList.toggle(
      'equipment__bottom--is-show'
    );
  }

  equipmentListBtns.forEach(function(equipmentBtn) {
    equipmentBtn.addEventListener('click', toggleEquipment);
  });

  //modal window feature
  function openModal() {
    var modalLink = document.querySelector('.download-link');
    modalLink.addEventListener('click', function(event) {
      // remove "#" from #modal
      var target = this.getAttribute('href').substr(1);

      // use dynamic target to reference given modal
      var modalWindow = document.getElementById(target);

      if (modalWindow.classList) {
        modalWindow.classList.add('open');
      }

      event.preventDefault();
    });
  }

  function closeModal() {
    var modalOverlay = document.querySelector('.modal__overlay');
    modalOverlay.addEventListener('click', function(event) {
      // target the whole modal
      var modalWindow = this.parentNode;
      modalWindow.classList.remove('open');
    });
  }

  openModal();
  closeModal();
})();
