const [nav] = document.getElementsByTagName('nav');

'navbar navbar-expand-lg bg-dark border-bottom border-body'.split(' ').forEach(text => {
    nav.classList.add(text);
});

nav.setAttribute('data-bs-theme', 'dark');

nav.innerHTML +=
    `<div class="container-fluid">` +
    `<a class="navbar-brand" href="/">ทิวโกอินเตอร์ จองบัตร</a>` +
    `<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">` +
    `<span class="navbar-toggler-icon"></span>` +
    `</button>` +
    `<div class="collapse navbar-collapse" id="navbarText">` +
    `<ul class="navbar-nav me-auto mb-2 mb-lg-0">` +
    `<li class="nav-item">` +
    `<a class="nav-link active" aria-current="page" href="#">จองบัตรคอนเสิร์ต</a>` +
    `</li>` +
    `<li class="nav-item">` +
    `<a class="nav-link" href="#">บัตรของฉัน</a>` +
    `</li>` +
    `<li class="nav-item">` +
    `<a class="nav-link" href="#">เข้าสู่ระบบ</a>` +
    `</li>` +
    `<li class="nav-item">` +
    `<a class="nav-link" href="#">ลงทะเบียน</a>` +
    `</li>` +

    `</ul>` +
    `<span class="navbar-text">` +
    `Navbar text with an inline element` +
    `</span>` +
    `</div>` +
    `</div>`;
