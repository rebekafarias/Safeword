document.addEventListener('DOMContentLoaded', function () {
  var generateButton = document.getElementById('generate-button');
  var passwordOutput = document.getElementById('password-output');
  var passwordInput = document.getElementById('password');
  var copyButton = document.getElementById('copy-button');
  var saveButton = document.getElementById('save-button');
  var showSavedButton = document.getElementById('show-saved-button');
  var savedPasswordsDiv = document.getElementById('saved-passwords');
  var savedPasswordsContainer = document.getElementById('saved-passwords-container');
  var backButton = document.getElementById('back-button');
  var passwordNameInput = document.getElementById('password-name');
  var showButton = document.getElementById('show-button');

  generateButton.addEventListener('click', function () {
    var password = generatePassword(12); 
    passwordInput.value = password;
    passwordOutput.style.display = 'block';
  });

  copyButton.addEventListener('click', function () {
    passwordInput.select();
    document.execCommand('copy');
  });

  saveButton.addEventListener('click', function () {
    var name = passwordNameInput.value.trim();
    var password = passwordInput.value.trim();
    if (name && password) {
      savePassword(name, password); 
      passwordNameInput.value = '';
      passwordInput.value = '';
      passwordOutput.style.display = 'none';
    } else {
      alert('Please, type a name before saving the password');
    }
  });

  showSavedButton.addEventListener('click', function () {
    showSavedPasswords();
  });

  backButton.addEventListener('click', function () {
    hideSavedPasswords();
  });

  showButton.addEventListener('click', function () {
    var passwordInputType = passwordInput.getAttribute('type');
    if (passwordInputType === 'password') {
      passwordInput.setAttribute('type', 'text');
      showButton.innerHTML = '<i class="far fa-eye-slash"></i>';
    } else {
      passwordInput.setAttribute('type', 'password');
      showButton.innerHTML = '<i class="far fa-eye"></i>';
    }
  });

  function generatePassword(length) {
    var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    var password = "";
    for (var i = 0; i < length; ++i) {
      var randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }

  function savePassword(name, password) {
    var savedPasswords = JSON.parse(localStorage.getItem('savedPasswords')) || {};
    savedPasswords[name] = password; 
    localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords));
  }  

  function showSavedPasswords() {
    savedPasswordsDiv.innerHTML = '';
    var savedPasswords = JSON.parse(localStorage.getItem('savedPasswords')) || {};
    for (var name in savedPasswords) {
      var password = savedPasswords[name];
      var passwordEntry = document.createElement('div');
      passwordEntry.innerHTML = '<strong style="font-size: 20px;">' + name + ':</strong> <span class="saved-password" data-type="password">' + '*'.repeat(password.length) + '</span> <button class="copy-password-button circular-button"><i class="far fa-copy"></i></button> <button class="show-hide-password-button circular-button"><i class="far fa-eye"></i></button> <button class="delete-password-button circular-button"><i class="far fa-trash-alt"></i></button>';
      savedPasswordsDiv.appendChild(passwordEntry);
    }
    savedPasswordsContainer.style.display = 'block';
    document.getElementById('main-container').style.display = 'none';

    var copyButtons = document.getElementsByClassName('copy-password-button');
    for (var i = 0; i < copyButtons.length; i++) {
      copyButtons[i].addEventListener('click', function () {
        var passwordText = this.parentNode.querySelector('.saved-password').innerText;
        copyToClipboard(passwordText);
      });
    }

    var showHideButtons = document.getElementsByClassName('show-hide-password-button');
    for (var j = 0; j < showHideButtons.length; j++) {
      showHideButtons[j].addEventListener('click', function () {
        var passwordSpan = this.parentNode.querySelector('.saved-password');
        var passwordInputType = passwordSpan.getAttribute('data-type');
        if (passwordInputType === 'password') {
          passwordSpan.setAttribute('data-type', 'text');
          passwordSpan.innerHTML = savedPasswords[name];
          this.innerHTML = '<i class="far fa-eye-slash"></i>';
        } else {
          passwordSpan.setAttribute('data-type', 'password');
          passwordSpan.innerHTML = '*'.repeat(savedPasswords[name].length);
          this.innerHTML = '<i class="far fa-eye"></i>';
        }
      });
    }

    var deleteButtons = document.getElementsByClassName('delete-password-button');
    for (var k = 0; k < deleteButtons.length; k++) {
      deleteButtons[k].addEventListener('click', function () {
        var passwordName = this.parentNode.querySelector('strong').innerText.replace(':', '');
        deleteSavedPassword(passwordName);
        showSavedPasswords(); 
      });
    }
  }

  function deleteSavedPassword(name) {
    var savedPasswords = JSON.parse(localStorage.getItem('savedPasswords')) || {};
    delete savedPasswords[name];
    localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords));
  }

  function hideSavedPasswords() {
    savedPasswordsContainer.style.display = 'none';
    document.getElementById('main-container').style.display = 'block';
  }

  function copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  }
});
