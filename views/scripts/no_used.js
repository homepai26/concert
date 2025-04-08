
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


// const seats_selector = async(concerts, seats) => {
//     for (i in concerts) {
// 	modal_append.innerHTML +=
// 	    `<div class="modal fade modal-dialog-scrollable" id="concert_${concerts[i].concert_id}" tabindex="-1" aria-labelledby="exampleModalLabelconcert_${concerts[i].concert_id}" aria-hidden="true">` +
// 	    `<div class="modal-dialog modal-lg">` +
// 	    `<div class="modal-content">` +
// 	    `<div class="modal-header">` +
// 	    `<h1 class="modal-title fs-5" id="exampleModalLabelconcert_${concerts[i].concert_id}">` +
// 	    `จองที่นั่งคอนเสิร์ต ${concerts[i].concert_name}` +
// 	    `</h1>` +
// 	    `<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>` +
// 	    `</div>` +
// 	    `<div class="modal-body" id="modal-body-concert-${concerts[i].concert_id}">` +
// 	    `</div>` +
// 	    `<div class="modal-footer">` +
// 	    `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">ปิดหน้านี้</button>` +
// 	    `<button type="button" class="btn btn-primary" id="modal-send-btn-concert-${concerts[i].concert_id}">จองเลย!</button>` +
// 	    `</div>` +
// 	    `</div>` +
// 	    `</div>` +
// 	    `</div>`;

// 	const modal_body = document.getElementById(`modal-body-concert-${concerts[i].concert_id}`);
// 	for (j in seats[i].concert_seat) {
// 	    let type = document.createElement('h4');
// 	    type.innerText = seats[i].concert_seat[j].type + " - ราคา " + seats[i].concert_seat[j].price + "บาท";
// 	    modal_body.appendChild(type);

// 	    for (let k = seats[i].concert_seat[j].seat_start; k <= seats[i].concert_seat[j].seat_end; k++) {
// 		modal_body.innerHTML +=
// 		    `<div class="form-check form-check-inline">` +
// 		    `<input class="form-check-input" name="seat_radio" type="radio" id="seat${k}" value="${k}">` +
// 		    `<label class="form-check-label" for="seat${k}">${k}</label>` +
// 		    `</div>`;
// 	    }
// 	}
//     }

//     // disable if have reserved and button event
//     for (i in concerts) {
// 	seats[i].reserved_seat.forEach((reserved) => {
// 	    let select_seat = document.getElementById(`seat${reserved.seat_no}`);
// 	    select_seat.setAttribute('disabled', '');
// 	});

// 	let send_btn = document.getElementById(`modal-send-btn-concert-${concerts[i].concert_id}`);
// 	send_btn.addEventListener('click', async() => {
// 	    let want_reserved_seat = document.querySelector('input[name="seat_radio"]:checked').value;
// 	    try {
// 		const rawResponse = await fetch('api/reserved_seat', {
// 		    method: 'POST',
// 		    headers: {
// 			"Accept": "application/json",
// 			"Content-Type": "application/json"
// 		    },
// 		    body: JSON.stringify({
// 			"concert_id": concerts[i].concert_id,
// 			"seat_no": want_reserved_seat
// 		    })
// 		});
// 		const content = await rawResponse.json();
// 		console.log(content);
// 	    } catch (error) {
// 		console.error(error.message);
// 	    }
// 	});
//     }
// };
