const [nav] = document.getElementsByTagName('nav');
const nav_class = 'navbar navbar-expand-lg bg-dark border-bottom border-body';
nav_class.split(' ').forEach(text => {
    nav.classList.add(text);
});

nav.setAttribute('data-bs-theme', 'dark');
nav.innerHTML +=
    `<div class="container-fluid">` +
    `<a class="navbar-brand" href="/">` +
    `<svg class="d-inline-block align-text-top" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-bookshelf" viewBox="0 0 16 16">` +
    `<path d="M2.5 0a.5.5 0 0 1 .5.5V2h10V.5a.5.5 0 0 1 1 0v15a.5.5 0 0 1-1 0V15H3v.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5M3 14h10v-3H3zm0-4h10V7H3zm0-4h10V3H3z"/>` +
    `</svg>` +
    `ทิวโกอินเตอร์ จองบัตร</a>` +
    `<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText"` +
    `aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">` +
    `<span class="navbar-toggler-icon"></span>` +
    `</button>` +
    `<div class="collapse navbar-collapse" id="navbarText">` +
    `<ul class="navbar-nav me-auto mb-2 mb-lg-0">` +
    `<li class="nav-item">` +
    `<a class="nav-link" href="/" id="reserved-seat" name="reserved_seat">จองบัตรคอนเสิร์ต</a>` +
    `</li>` +
    `<li class="nav-item">` +
    `<a class="nav-link" href="/ticket" id="ticket" name="ticket">บัตรของฉัน</a>` +
    `</li>` +
    `<li class="nav-item">` +
    `<a class="nav-link" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#login-modal" id="login" name="login">เข้าสู่ระบบ</a>` +
    `</li>` +
    `<li class="nav-item">` +
    `<a class="nav-link" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#register-modal" id="register" name="register">สมัครเข้าใช้งาน</a>` +
    `</li>` +
    `</ul>` +
    `<div class="d-flex" id="user-component">` +
    `<span class="navbar-text" id="user">` +
    `</span>` +
    `</div>` +
    `</div>` +
    `</div>`;

// current page
const current_path = window.location.pathname;
let nav_link = document.querySelectorAll('.nav-link');
if (current_path != '/') {
    nav_link.forEach((item) => {
	let name = item.getAttribute("name");
	if (current_path.includes(name)) {
	    item.classList.add('active');
	    item.setAttribute('aria-current', 'page');
	}
    });
} else {
    let reserved_seat = document.getElementById('reserved-seat');
    reserved_seat.classList.add('active');
    reserved_seat.setAttribute('aria-current', 'page');
}

const login = document.getElementById('login-modal');
const register = document.getElementById('register-modal');

// handle login event
let submit_login_btn = document.getElementById('login-btn');

submit_login_btn.addEventListener('click', async() => {
    let email = login.querySelector('#email').value;
    let password = login.querySelector('#password').value;
    console.log('wore kefe')
    
    if (email && password) {
	try {
	    let login_result = await fetch('/api/login', {
		method: "POST",
		headers: {
		    "Content-Type": "application/json"
		},
		body: JSON.stringify({
		    email: email,
		    password: password
		}),
	    });
	    
	    let login_json_result = await login_result.json();
	    localStorage.setItem('name', login_json_result.name);
	    location.reload();
	} catch (error) {
	    console.error(error);
	}
    }
});


// lock corresponding interface if login or not login
if (get_cookie()) {
    let login = document.getElementById('login');
    let register = document.getElementById('register');
    login.classList.add('disabled');
    register.classList.add('disabled');
    login.setAttribute('aria-disabled', 'true');
    register.setAttribute('aria-disabled', 'true');
} else {
    let ticket = document.getElementById('ticket');
    ticket.classList.add('disabled');
    ticket.setAttribute('aria-disabled', 'true');
}

// handle username
const username = localStorage.getItem('name');
let nav_name = document.getElementById('user');
let user_component = document.getElementById('user-component');
if (username) {
    nav_name.textContent = `สวัสดีคุณ ${username}`;
    let logout = document.createElement('button');
    logout.classList.add('btn');
    logout.classList.add('btn-outline-primary');
    logout.classList.add('ms-3');
    logout.addEventListener('click', () => {
	localStorage.removeItem('name');
	document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
	location.reload();
    });
    logout.innerText = 'ออกจากระบบ';
    user_component.appendChild(logout);
} else {
    nav_name.textContent = `สวัสดีคุณนิรนาม ผู้ไม่ระบุตัวตน อัศวินแห่งรัตติกาล`;
}

