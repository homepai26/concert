
const get_cookie = () => {
    return document.cookie.match(/^(.*;)?\s*token\s*=\s*[^;]+(.*)?$/);
};

const get = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error.message);
    }
    return null;
};

const concertsFrame = document.getElementById('concerts_frame');
const modals = document.getElementById('modals');
const concert_list = document.getElementById('concert-list');

const add_concerts = async (concerts, seats) => {
    var count = 0;
    concerts.forEach((concert) => {
        
        concert_list.innerHTML +=
	    `<div class="card col m-3">` +
	    `<img src="/pic/concert_${concert.concert_id}.png" class="card-img-top" alt="picture of concert ${concert.concert_name}">` +
	    `<div class="card-body">` +
	    `<h5 class="card-title">${concert.concert_name}</h5>` +
	    //`<p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>` +
	`</div>` +
	    `<ul class="list-group list-group-flush" id="metadata-concert-${concert.concert_id}">` +
	    `<li class="list-group-item">${concert.concert_artist}</li>` +
	    `<li class="list-group-item">${concert.concert_venue}</li>` +
	    `<li class="list-group-item">${concert.concert_timeshow}</li>` +
	    `</ul>` +
	    `<div class="card-body">` +
	    `<button type="button" class="btn btn-primary" data-bs-toggle="modal"` +
	    `data-bs-target="#concert_${concert.concert_id}" id="reserved-btn-concert-${concert.concert_id}">` +
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
	modals.innerHTML +=
	    `<div class="modal fade modal-dialog-scrollable" id="concert_${concerts[i].concert_id}" ` +
	    `tabindex="-1" aria-labelledby="exampleModalLabelconcert_${concerts[i].concert_id}" aria-hidden="true">` +
	    `<div class="modal-dialog">` +
	    `<div class="modal-content">` +
	    `<div class="modal-header">` +
	    `<h1 class="modal-title fs-5" id="exampleModalLabelconcert_${concerts[i].concert_id}">` +
	    `จองที่นั่งคอนเสิร์ต ${concerts[i].concert_name}` +
	    `</h1>` +
	    `<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>` +
	    `</div>` +
	    `<div class="modal-body" id="modal-body-concert-${concerts[i].concert_id}">` +
	    `</div>` +
	    `<div class="modal-footer">` +
	    `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">ปิดหน้านี้</button>` +
	    `<button type="button" class="btn btn-primary" id="modal-send-btn-concert-${concerts[i].concert_id}">จองเลย!</button>` +
	    `</div>` +
	    `</div>` +
	    `</div>` +
	    `</div>`;

	const modal_body = document.getElementById(`modal-body-concert-${concerts[i].concert_id}`);
	for (j in seats[i].concert_seat) {
	    let type = document.createElement('h4');
	    type.innerText = seats[i].concert_seat[j].type + " - ราคา " + seats[i].concert_seat[j].price + "บาท";
	    modal_body.appendChild(type);

	    for (let k = seats[i].concert_seat[j].seat_start; k <= seats[i].concert_seat[j].seat_end; k++) {
		modal_body.innerHTML +=
		    `<div class="form-check form-check-inline">` +
		    `<input class="form-check-input" name="seat_radio" type="radio" id="seat${k}" value="${k}">` +
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

	let send_btn = document.getElementById(`modal-send-btn-concert-${concerts[i].concert_id}`);
	send_btn.addEventListener('click', async() => {
	    let want_reserved_seat = document.querySelector('input[name="seat_radio"]:checked').value;
	    try {
		const rawResponse = await fetch('api/reserved_seat', {
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
		const content = await rawResponse.json();
		console.log(content);
	    } catch (error) {
		console.error(error.message);
	    }
	});
    }
};

const lock_login = async(concerts) => {
    if (!get_cookie('token')) {
	let login_alert = document.getElementById('login-alart');
	login_alert.style.display = 'block';
	
	concerts.forEach((concert) => {
	    console.log(`modal-send-btn-concert-${concert.concert_id}`);
	    let reserved_btn_concert = document.getElementById(`reserved-btn-concert-${concert.concert_id}`);
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

// async function viewSeats(concertId) {
//     try {
//         const response = await fetch(`${API_BASE_URL}/concert_seat/${concertId}`);
//         const seats = await response.json();

//         // สร้าง modal สำหรับแสดงที่นั่ง
//         const seatModal = document.createElement('div');
//         seatModal.className = 'modal';
//         seatModal.id = 'seat-modal';

//         let seatHtml = `
//             <div class="modal-content">
//                 <h2>เลือกที่นั่ง</h2>
//                 <div class="seat-container">
//         `;

//         // จัดกลุ่มที่นั่งตามประเภท
//         const seatTypes = {};
//         seats.forEach(seat => {
//             if (!seatTypes[seat.type]) {
//                 seatTypes[seat.type] = {
//                     price: seat.price,
//                     seats: []
//                 };
//             }
//             seatTypes[seat.type].seats.push(seat);
//         });

//         // แสดงที่นั่งแต่ละประเภท
//         for (const [type, data] of Object.entries(seatTypes)) {
//             seatHtml += `
//                 <div class="seat-type">
//                     <h3>${type} - ${data.price} บาท</h3>
//                     <div class="seat-grid">
//             `;

//             for (let i = data.seats[0].seat_start; i <= data.seats[0].seat_end; i++) {
//                 const isAvailable = data.seats[0].seat_available > 0;
//                 seatHtml += `
//                     <button 
//                         class="seat-button ${isAvailable ? 'available' : 'unavailable'}"
//                         onclick="bookSeat(${concertId}, ${i}, '${type}', ${data.price})"
//                         ${!isAvailable ? 'disabled' : ''}
//                     >
//                         ${i}
//                     </button>
//                 `;
//             }

//             seatHtml += `
//                     </div>
//                 </div>
//             `;
//         }

//         seatHtml += `
//                 </div>
//                 <button onclick="closeSeatModal()" class="close-button">ปิด</button>
//             </div>
//         `;

//         seatModal.innerHTML = seatHtml;
//         document.body.appendChild(seatModal);
//         seatModal.style.display = 'block';
//     } catch (error) {
//         console.error('Error loading seats:', error);
//     }
// }

