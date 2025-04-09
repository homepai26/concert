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

// login modal handler
const login_modal = document.getElementById('login-modal');
const register_modal = document.getElementById('register-modal');

let login_btn = login_modal.querySelector('.submit');
login_btn.addEventListener('click', async() => {
    let email = login_modal.querySelector('#login-email').value;
    let password = login_modal.querySelector('#login-password').value;

    try {
	let login_result = await fetch('/api/login', {
	    method: "POST",
	    headers: {
		"Content-Type": "application/json",
	    },
	    body: JSON.stringify({
		"email": email,
		"password": password
	    }),
	});

	let login_json_result = await login_result.json();
	if (!login_result.ok) {
	    appendAlertTo('เกิดข้อผิดพลาด' + login_json_result.message, 'warning', 'alert-login');
	    console.error(login_json_result.message);
	} else {
	    // here we get cookie and name to localStorage
	    console.log(login_json_result);
	    localStorage.setItem('name', login_json_result.name);
	    appendAlertTo('ล็อกอินสำเร็จ', 'success', 'alert-login');
	    location.reload();
	}
    } catch (error) {
	appendAlertTo('เกิดข้อผิดพลาด' + error.message, 'warning', 'alert-login');
	console.error(error.message);
    }
});

// now with register
let register_foreign_checkbox = register_modal.querySelector('#register-foreign-checkbox');
register_foreign_checkbox.checked = false;
register_foreign_checkbox.addEventListener('change', (e) => {
    let id = register_modal.querySelector('#register-id-div');
    let passport = register_modal.querySelector('#register-passport-div');
    
    console.log(id);
    console.log(passport);
    
    if (e.target.checked) {
	id.classList.replace('d-block', 'd-none');
	passport.classList.replace('d-none', 'd-block');
    } else {
	passport.classList.replace('d-block', 'd-none');
	id.classList.replace('d-none', 'd-block');
    }
});

let register_btn = register_modal.querySelector('.submit');
register_btn.addEventListener('click', async() => {
    let name = register_modal.querySelector('#register-name').value;
    let email = register_modal.querySelector('#register-email').value;
    let password = register_modal.querySelector('#register-password').value;
    let id = register_modal.querySelector('#register-id').value;
    let passport = register_modal.querySelector('#register-passport').value;
    let birthdate = register_modal.querySelector('#register-birthdate').value;

    try {
	let register_result = await fetch('/api/register', {
	    method: "POST",
	    headers: {
		"Content-Type": "application/json",
	    },
	    body: JSON.stringify({
		"name": name,
		"email": email,
		"password": password,
		"id": id,
		"passport": passport,
		"birthdate": birthdate
	    }),
	});

	let register_json_result = await register_result.json();
	if (!register_result.ok) {
	    console.error(register_json_result.message);
	    appendAlertTo('เกิดข้อผิดพลาด' + register_json_result.message, 'warning', 'alert-register');
	} else {
	    appendAlertTo('ลงทะเบียนสำเร็จ โปรดล็อกอินอีกครั้งด้วยบัญชีที่สมัคร' + register_json_result.message, 'success', 'alert-register');
	    console.log(register_json_result);
	}
    } catch (error) {
	console.error(error.message);
	appendAlertTo('เกิดข้อผิดพลาด' + error.message, 'warning', 'alert-register');
    }
});

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

