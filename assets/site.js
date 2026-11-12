(function(){
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Mobile navigation toggle
  var toggle = document.getElementById('nav-toggle');
  var panel = document.getElementById('mobile-nav');
  if (toggle && panel){
    toggle.addEventListener('click', function(){
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      panel.classList.toggle('hidden', open);
    });
    panel.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        toggle.setAttribute('aria-expanded', 'false');
        panel.classList.add('hidden');
      });
    });
  }

  // Buttons/links that jump to a form
  document.querySelectorAll('[data-open-form]').forEach(function(btn){
    btn.addEventListener('click', function(e){
      var target = btn.getAttribute('data-open-form') === 'machines' ? 'quote-form' : 'project-form';
      var el = document.getElementById(target);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({behavior:'smooth', block:'start'});
      var firstField = el.querySelector('input');
      if (firstField) setTimeout(function(){ firstField.focus({preventScroll:true}); }, 500);
    });
  });

  function wireForm(formId, endpoint){
    var form = document.getElementById(formId);
    if (!form) return;
    var fieldsWrap = form.querySelector('.form-fields');
    var submitBtn = form.querySelector('button[type="submit"]');
    var errorMsg = form.querySelector('.submit-error');
    var successBox = form.querySelector('.success-box');
    var btnDefaultText = submitBtn.textContent;

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var valid = true;
      var firstInvalid = null;
      form.querySelectorAll('input[required]').forEach(function(input){
        var ok = input.checkValidity();
        input.classList.toggle('field-error', !ok);
        if (!ok){
          valid = false;
          if (!firstInvalid) firstInvalid = input;
        }
      });
      if (!valid){
        firstInvalid.focus();
        return;
      }

      errorMsg.classList.remove('show');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      var data = new FormData(form);
      var payload = {};
      data.forEach(function(value, key){ payload[key] = value; });

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function(response){
        if (!response.ok) throw new Error('Request failed');
        fieldsWrap.style.display = 'none';
        successBox.classList.add('show');
      }).catch(function(){
        errorMsg.classList.add('show');
        submitBtn.disabled = false;
        submitBtn.textContent = btnDefaultText;
      });
    });
  }
  // Original Formspree endpoints, unchanged
  wireForm('form-machines', 'https://formspree.io/f/mwvgebvr');
  wireForm('form-services', 'https://formspree.io/f/xojgawjw');
})();
