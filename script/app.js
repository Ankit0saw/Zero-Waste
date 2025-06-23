fetch('../home.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('home-placeholder').innerHTML = data;

    // Now attach the event
    const toggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('navbar-default');
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        nav.classList.toggle('hidden');
      });
    }
  });
