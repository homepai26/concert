const concertsFrame = document.getElementById('concerts_frame');
const modals = document.getElementById('modals');

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

function htmlToNodes(html) {
    const template = document.createElement('template');
    template.innerHTML = html;
    return template.content.childNodes;
}

const add_to_concerts_frame = async () => {
    var concerts = await (get('api/concert'));
    var row_count = 0;
    await concerts.forEach((concert) => {
        if (row_count % 5 == 0) {
            row = document.createElement('div');
            row.classList.add('row');
            concertsFrame.appendChild(row);
        }

        row.innerHTML +=
	    `<div class="card" style="width: 20%; margin: 20px ">` +
	    `<img src="..." class="card-img-top" alt="...">` +
	    `<div class="card-body">` +
	    `<h5 class="card-title">${concert.concert_name}</h5>` +
	    //`<p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>` +
	`</div>` +
	    `<ul class="list-group list-group-flush">` +
	    `<li class="list-group-item">${concert.concert_artist}</li>` +
	    `<li class="list-group-item">${concert.concert_venue}</li>` +
	    `<li class="list-group-item">${concert.concert_timeshow}</li>` +
	    `</ul>` +
	    `<div class="card-body">` +
	    `<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal${row_count}">` +
	    `จองที่นั่ง` +
	    `</button>` +
	    `</div>` +
	    `</div>`;
        

	modals.innerHTML +=
            `<div class="modal fade" id="modal${row_count}" tabindex="-1" aria-labelledby="exampleModalLabel${row_count}" aria-hidden="true">` +
            `<div class="modal-dialog">` +
            `<div class="modal-content">` +
            `<div class="modal-header">` +
            `<h1 class="modal-title fs-5" id="exampleModalLabel${row_count}">Modal title</h1>` +
            `<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>` +
            `</div>` +
            `<div class="modal-body">` +
            `...` +
            `</div>` +
            `<div class="modal-footer">` +
            `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>` +
            `<button type="button" class="btn btn-primary">Save changes</button>` +
            `</div>` +
            `</div>` +
            `</div>` +
            `</div>`;
	
	row_count++;
    });
};

add_to_concerts_frame();


const myModal = document.getElementById('myModal');
const myInput = document.getElementById('myInput');

async function viewSeats(concertId) {
    try {
        const response = await fetch(`${API_BASE_URL}/concert_seat/${concertId}`);
        const seats = await response.json();

        // สร้าง modal สำหรับแสดงที่นั่ง
        const seatModal = document.createElement('div');
        seatModal.className = 'modal';
        seatModal.id = 'seat-modal';

        let seatHtml = `
            <div class="modal-content">
                <h2>เลือกที่นั่ง</h2>
                <div class="seat-container">
        `;

        // จัดกลุ่มที่นั่งตามประเภท
        const seatTypes = {};
        seats.forEach(seat => {
            if (!seatTypes[seat.type]) {
                seatTypes[seat.type] = {
                    price: seat.price,
                    seats: []
                };
            }
            seatTypes[seat.type].seats.push(seat);
        });

        // แสดงที่นั่งแต่ละประเภท
        for (const [type, data] of Object.entries(seatTypes)) {
            seatHtml += `
                <div class="seat-type">
                    <h3>${type} - ${data.price} บาท</h3>
                    <div class="seat-grid">
            `;

            for (let i = data.seats[0].seat_start; i <= data.seats[0].seat_end; i++) {
                const isAvailable = data.seats[0].seat_available > 0;
                seatHtml += `
                    <button 
                        class="seat-button ${isAvailable ? 'available' : 'unavailable'}"
                        onclick="bookSeat(${concertId}, ${i}, '${type}', ${data.price})"
                        ${!isAvailable ? 'disabled' : ''}
                    >
                        ${i}
                    </button>
                `;
            }

            seatHtml += `
                    </div>
                </div>
            `;
        }

        seatHtml += `
                </div>
                <button onclick="closeSeatModal()" class="close-button">ปิด</button>
            </div>
        `;

        seatModal.innerHTML = seatHtml;
        document.body.appendChild(seatModal);
        seatModal.style.display = 'block';
    } catch (error) {
        console.error('Error loading seats:', error);
    }
}
