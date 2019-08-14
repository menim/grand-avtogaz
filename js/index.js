(function() {
  'use strict';

  //show hide equipment item info
  function showEquipmentInfo() {
    var equipmentListBtns = Array.prototype.slice.call(
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
  }

  // toggle modal with form
  function toggleModal() {
    var modalLink = document.querySelector('.download-link');
    var modalOverlay = document.querySelector('.modal__overlay');
    var wrapperHtml = document.getElementsByTagName('html');
    var wrapperBody = document.body;

    modalLink.addEventListener('click', function(e) {
      // remove "#" from #modal
      var target = this.getAttribute('href').substr(1);

      // use dynamic target to reference given modal
      var modalWindow = document.getElementById(target);

      if (modalWindow.classList) {
        modalWindow.classList.add('open');
        wrapperBody.style.overflow = 'hidden';
        wrapperBody.style.height = '100%';
      }
      e.preventDefault();
    });

    modalOverlay.addEventListener('click', function(e) {
      // target the whole modal
      var modalWindow = this.parentNode;
      modalWindow.classList.remove('open');
      wrapperBody.style.overflow = 'auto';
    });
  }

  //form validation
  var regEx = {
    telephone: /^\+?3?8?(0[5-9][0-9]\d{7})$/,
    name: /^[A-Za-zА-Яа-я]{3,10}$/,
  };

  var errorsMsg = {
    invalidTelephone: 'Вы ввели неправильный телефон',
    invalidName: 'Вы ввели неправильное имя',
    emptyField: 'Заполните пожалуйтса поле',
    exceedMax: 'Очень длинное имя',
    exceedMin: 'Очень короткое имя',
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

  function validateForm(formClass) {
    var targetForm = document.querySelector(formClass);
    var formSubmit = targetForm.querySelector('button');
    var formInputs = targetForm.querySelector(formClass + '__input');

    formSubmit.addEventListener('submit', function() {});
  }
  validateForm('.form');

  showEquipmentInfo();
  toggleModal();
  validateTelephoneForm();
})();
