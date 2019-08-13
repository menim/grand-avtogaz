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

  //form validation feature

  var regEx = {
    telephone: /^\+?3?8?(0[5-9][0-9]\d{7})$/,
    name: /^[A-Za-zА-Яа-я]{3,10}$/,
  };

  var isEmpty = function(value) {
    return value.trim().length === 0;
  };

  var isNameValid = function(value) {
    return regEx.name.test(value);
  };

  var isTelephoneValid = function(value) {
    return regEx.telephone.test(value);
  };

  var checkName = function(input) {
    return !isEmpty(input.value) && isNameValid(input.value);
  };

  var checkTelephone = function(input) {
    return !isEmpty(input.value) && isTelephoneValid(input.value);
  };

  function formValidate(formClass) {
    var errorMessages = [];
    var targetForm = document.querySelector(formClass);
    var formSubmit = targetForm.querySelector('button');
    var formInputs = targetForm.querySelector(formClass + '__input');

    formSubmit.addEventListener('submit', function() {});
  }
  formValidate('.form');

  function validateTelephoneForm() {
    var formTarget = document.querySelector('.form-secondary');
    var formBtn = formTarget.querySelector('.form-secondary__btn');
    var formInput = formTarget.querySelector('.form-secondary__input');

    formTarget.addEventListener('submit', function(e) {
      e.preventDefault();
    });

    formInput.addEventListener('input', function(e) {
      if (checkTelephone(formInput)) {
        formBtn.classList.remove('form-secondary__btn--disabled');
        formBtn.classList.add('form-secondary__btn--enabled');
        formBtn.href = 'perf.pdf';
        formBtn.download = 'perf.pdf';
      } else {
        formBtn.classList.remove('form-secondary__btn--enabled');
        formBtn.classList.add('form-secondary__btn--disabled');
        formBtn.href = '';
        formBtn.removeAttribute('download');
      }
    });

    formBtn.addEventListener('click', function(e) {
      if (checkTelephone(formInput)) {
        formBtn.classList.remove('form-secondary__btn--enabled');
        formBtn.classList.add('form-secondary__btn--disabled');
        formInput.value = '';

        setTimeout(function() {
          formBtn.href = '';
          formBtn.removeAttribute('download');
        }, 500);
      } else {
        e.preventDefault();
      }
    });
  }

  validateTelephoneForm();
})();
