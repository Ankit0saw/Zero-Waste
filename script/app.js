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

        const addButton = document.getElementById('add-btn');
        const textarea = document.getElementById('ingredients');
        const container = document.getElementById('items-container');

        addButton.addEventListener('click', function () {
            const input = textarea.value;
            const items = input.split(',').map(item => item.trim()).filter(item => item !== '');

            container.innerHTML = '';

            items.forEach(item => {
                const p = document.createElement('p');
                p.setAttribute('role', 'button');
                p.className = 'text-slate-800 flex w-full items-center rounded-md p-3 transition-all hover:bg-slate-200';
                p.textContent = item;
                container.appendChild(p);
            });
        });
    })
    .catch(err => console.error('Error loading home.html:', err));

