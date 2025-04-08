const concertsFrame = document.getElementById('concerts_frame');
const modal_append = document.getElementById('modal-append');
const concert_list = document.getElementById('concert-list');

const add_concerts = async (concerts, seats) => {
    var count = 0;
    concerts.forEach((concert) => {
        
        concert_list.innerHTML +=
	    `<div class="card col m-3">` +
	    `<img src="/pic/concert_${concert.concert_id}.png" class="card-img-top" alt="picture of concert ${concert.concert_name}">` +
	    `<div class="card-body">` +
	    `<h5 class="card-title fw-bold text-center">${concert.concert_name}</h5>` +
	    `</div>` +
	    `<ul class="list-group list-group-flush" id="metadata-concert-${concert.concert_id}">` +
	    `<li class="list-group-item">${concert.concert_artist}</li>` +
	    `<li class="list-group-item">${concert.concert_venue}</li>` +
	    `<li class="list-group-item">${concert.concert_timeshow}</li>` +
	    `</ul>` +
	    `<div class="card-body text-center">` +
	    `<button type="button" class="btn btn-primary" data-bs-toggle="modal"` +
	    `data-bs-target="#concert-modal-${concert.concert_id}" id="concert-card-reserved-seat-btn-${concert.concert_id}">` +
	    `จองที่นั่ง` +
	    `</button>` +
	    `</div>` +
	    `</div>`;

	let metadata_concert = document.getElementById(`metadata-concert-${concert.concert_id}`);
	let concert_seat = seats[concert.concert_id-1].concert_seat;
	let all_seat_available = 0;
	concert_seat.forEach((seat) => {
	    all_seat_available += seat.seat_available;
	});
	let metadata_child = document.createElement('li');
	metadata_child.classList.add('list-group-item');
	metadata_child.innerText = `Available ${all_seat_available} seat`;
	metadata_concert.appendChild(metadata_child);
	count++;
    });
};

const seats_selector = async(concerts, seats) => {
    for (i in concerts) {
	modal_append.innerHTML +=
	    `<div class="modal fade modal-dialog-scrollable" id="concert-modal-${concerts[i].concert_id}" tabindex="-1" aria-labelledby="concert-title-${concerts[i].concert_id}" aria-hidden="true">` +
	    `<div class="modal-dialog modal-lg">` +
	    `<div class="modal-content">` +
	    `<div class="modal-header">` +
	    `<h1 class="modal-title fs-5" id="concert-title-${concerts[i].concert_id}">` +
	    `จองที่นั่งคอนเสิร์ต ${concerts[i].concert_name}` +
	    `</h1>` +
	    `<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>` +
	    `</div>` +
	    `<div class="modal-body" id="concert-modal-body-${concerts[i].concert_id}">` +
	    `</div>` +
	    `<div class="modal-footer">` +
	    `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">ปิดหน้านี้</button>` +
	    `<button type="button" class="btn btn-primary" id="concert-modal-reserved-seat-btn-${concerts[i].concert_id}" data-bs-toggle="modal"` +
	    `data-bs-target="#payment-modal">จองเลย!</button>` +
	    `</div>` +
	    `</div>` +
	    `</div>` +
	    `</div>`;

	const modal_body = document.getElementById(`concert-modal-body-${concerts[i].concert_id}`);
	for (j in seats[i].concert_seat) {
	    let type = document.createElement('h4');
	    type.innerText = seats[i].concert_seat[j].type + " - ราคา " + seats[i].concert_seat[j].price + "บาท";
	    modal_body.appendChild(type);

	    for (let k = seats[i].concert_seat[j].seat_start; k <= seats[i].concert_seat[j].seat_end; k++) {
		modal_body.innerHTML +=
		    `<div class="form-check form-check-inline">` +
		    `<input class="form-check-input" seat-type="${seats[i].concert_seat[j].type}" price="${seats[i].concert_seat[j].price}" name="seat_radio" type="radio" id="seat${k}" value="${k}">` +
		    `<label class="form-check-label" for="seat${k}">${k}</label>` +
		    `</div>`;
	    }
	}
    }

    // disable if have reserved and button event
    for (i in concerts) {
	seats[i].reserved_seat.forEach((reserved) => {
	    let select_seat = document.getElementById(`seat${reserved.seat_no}`);
	    select_seat.setAttribute('disabled', '');
	});

	let concert_modal_reserved_seat_btn = document.getElementById(`concert-modal-reserved-seat-btn-${concerts[i].concert_id}`);
	// build payment modal
	concert_modal_reserved_seat_btn.addEventListener('click', () => {
	    let payment_title = document.getElementById('payment-title');
	    let payment_modal_body = document.getElementById('payment-modal-body');

	    // little cleanup
	    payment_title.textContent = "";
	    payment_modal_body.innerHTML = "";
	    
	    let want_reserved_seat = document.querySelector('input[name="seat_radio"]:checked');
	    payment_title.textContent = `ชำระค่าบัตรคอนเสิร์ต ${concerts[i].concert_name}`;
	    let payment_seat_type = document.createElement('p');
	    payment_seat_type.textContent = `ที่นั่ง: ${want_reserved_seat.getAttribute('seat-type')}`;
	    let payment_seat_price = document.createElement('p');
	    payment_seat_price.textContent = `ราคา: ${want_reserved_seat.getAttribute('price')}`;
	    payment_modal_body.appendChild(payment_seat_type);
	    payment_modal_body.appendChild(payment_seat_price);

	    payment_modal_body.innerHTML +=
		`<img src="/pic/qr.jpeg">` +
		`<div class="mb-3">` +
		`<label for="slip-pic" class="form-label">แนบไฟล์สลิป</label>` +
		`<input class="form-control" type="file" id="slip-pic">` +
		`</div>` +
		`<div class="mb-3">` +
		`<label for="slip-time" class="form-label" >เวลาที่โอนเงิน</label>` +
		`<input type="datetime-local" class="form-control" name="slip-time" id="slip-time">` +
		`</div>`;

	    let payment_modal_btn = document.getElementById(`payment-modal-btn`);
	    payment_modal_btn.addEventListener('click', async() => {
		let want_reserved_seat = document.querySelector('input[name="seat_radio"]:checked').value;
		try {
		    let rawRespone, content;
		    let slip_time = document.getElementById('slip-time').value;
		    let gnu_slip_time = get_gnu_datetime(slip_time);

		    rawResponse = await fetch('api/payment', {
			method: 'POST',
			headers: {
			    "Accept": "application/json",
			    "Content-Type": "application/json"
			},
			body: JSON.stringify({
			    "concert_id": concerts[i].concert_id,
			    "seat_no": want_reserved_seat,
			    "datetime": gnu_slip_time
			})
		    });
		    content = await rawResponse.json();
		    console.log(content);
		    
		    rawResponse = await fetch('api/reserved_seat', {
			method: 'POST',
			headers: {
			    "Accept": "application/json",
			    "Content-Type": "application/json"
			},
			body: JSON.stringify({
			    "concert_id": concerts[i].concert_id,
			    "seat_no": want_reserved_seat
			})
		    });
		    content = await rawResponse.json();
		    console.log(content);
		} catch (error) {
		    console.error(error.message);
		}
	    }); 
	});
    }
};

const lock_login = async(concerts) => {
    if (!get_cookie('token')) {
	let login_alert = document.getElementById('login-alart');
	login_alert.classList.replace('d-none', 'd-block');
	
	concerts.forEach((concert) => {
	    console.log(`concert-card-reserved-seat-btn-${concerts[i].concert_id}`);
	    let reserved_btn_concert = document.getElementById(`concert-card-reserved-seat-btn-${concerts[i].concert_id}`);
	    reserved_btn_concert.setAttribute('disabled', '');
	});
	
    }
};

const main = async() => {
    let concerts = await get('api/concert');
    let seats = [];
    for (i in concerts) {
	let concert_seat = await get(`api/concert_seat/${concerts[i].concert_id}`);
	let reserved_seat = await get(`api/reserved_seat/${concerts[i].concert_id}`);
	seats.push({"concert_seat": concert_seat, "reserved_seat": reserved_seat});
    }

    console.log(seats);
    await add_concerts(concerts, seats);
    await seats_selector(concerts, seats);
    lock_login(concerts, seats);
};

main();

let no_work_btn = document.querySelector('#nowork');
no_work_btn.addEventListener('click', () => {
    console.log('test');
});
