const form = document.querySelector('#add-concert-form');

const add_seat_btn = form.querySelector('#add-seat-btn');
var seat_count = 0;
add_seat_btn.addEventListener('click', () => {
    let seat_list = form.querySelector('#seat-list');
    seat_list.innerHTML +=
	`		    <div class ="mb-3">
			<div class="mb-3">
			    <label for="seat-type-${seat_count}" class="form-label">ประเภท</label>
			    <input type="text" class="form-control" id="seat-type-${seat_count}">
			</div>
			<div class="mb-3">
			    <label for="seat-price-${seat_count}" class="form-label">ราคา</label>
			    <input type="text" class="form-control" id="seat-price-${seat_count}">
			</div>
			<div class="mb-3">
			    <label for="seat-start-${seat_count}" class="form-label">ที่นั่งเริ่มต้น</label>
			    <input type="text" class="form-control" id="seat-start-${seat_count}">
			</div>
			<div class="mb-3">
			    <label for="seat-end-${seat_count}" class="form-label">ที่นั่งสุดท้าย</label>
			    <input type="text" class="form-control" id="seat-end-${seat_count}">
			</div>
			<div class="mb-3">
			    <label for="seat-available-${seat_count}" class="form-label">จำนวนที่นั่ง</label>
			    <input type="text" class="form-control" id="seat-available-${seat_count}">
			</div>
		    </div>`;

    seat_count++;
});

const submit_btn = form.querySelector('.submit');
submit_btn.addEventListener('click', async() => {
    let concert_name = form.querySelector('#concert-name');
    let concert_artist = form.querySelector('#concert-artist');
    let concert_venue = form.querySelector('#concert-venue');
    let concert_timeshow = form.querySelector('#concert-timeshow');
    let secret = form.querySelector('#secret-key');

    let concert_object = {
	"concert_name": concert_name.value,
	"concert_artist": concert_artist.value,
	"concert_venue": concert_venue.value,
	"concert_timeshow": get_gnu_datetime(concert_timeshow.value),
	"secret": secret.value,
	"seats": []
    };
    
    for (i = 0; i < seat_count; i++) {
	let seat_type = form.querySelector(`#seat-type-${i}`);
	let seat_price = form.querySelector(`#seat-price-${i}`);
	let seat_start = form.querySelector(`#seat-start-${i}`);
	let seat_end = form.querySelector(`#seat-end-${i}`);
	let seat_available = form.querySelector(`#seat-available-${i}`);

	let seat_object = {
	    "type": seat_type.value,
	    "price": seat_price.value,
	    "seat_start": seat_start.value,
	    "seat_end": seat_end.value,
	    "seat_available": seat_available.value
	};

	concert_object['seats'].push(seat_object);
    }

    console.log(concert_object);
    
    try {
	let submit_result = await fetch('/api/concert', {
	    method: "POST",
	    headers: {
		"Content-Type": "application/json"
	    },
	    body: JSON.stringify(concert_object)
	});
	
	if (submit_result.ok) {
	    let submit_json_result = await submit_result.json();
	    console.log(submit_json_result);

	    let concert_id_input = document.getElementById('concert-id');
	    concert_id_input.value = submit_json_result.data.concert_id;
	    appendAlert('คอนเสิร์ตถูกเพิ่มแล้ว!', 'success');
	} else {
	    let submit_json_result = await submit_result.json();
	    console.error(submit_json_result);
	    appendAlert('เกิดข้อผิดพลาด ' + submit_json_result.message, 'warning');
	}
    } catch(error) {
	appendAlert('เกิดข้อผิดพลาด ' + error.message, 'warning');
	console.error(error.message);
    }
});

const form_pic = document.getElementById('form-pic');
const secret = form.querySelector('#secret-key');
secret.addEventListener('input', () => {
    const secret_2 = form_pic.querySelector('#secret-key-2');
    secret_2.value = secret.value;
});

form_pic.addEventListener('submit', async(e) => {
    e.preventDefault();
    
    let concert_id = form_pic.querySelector('#concert-id');
    form_pic.setAttribute('action', `/api/concert_pic/${concert_id.value}`);

    const form = e.currentTarget;
    const url = form.action;

    try {
	const formData = new FormData(form);
	const response = await fetch(url, {
            method: 'POST',
            body: formData
	});

	if (response.ok) {
	    appendAlert('รูปภาพถูกเปลี่ยนแล้ว', 'success');
	} else {
	    let response_json = await response.json();
	    appendAlert('เกิดข้อผิดพลาด' + response_json.message, 'warning');
	}
    } catch (error) {
	appendAlert('เกิดข้อผิดพลาด' + error.message, 'warning');
	console.error(error.message);
    }
});
