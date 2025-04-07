const ticket_list = document.getElementById('ticket-list');

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

  // <li class="list-group-item d-flex justify-content-between align-items-start">
  //   <div class="ms-2 me-auto">
  //     <div class="fw-bold">Subheading</div>
  //     Content for list item
  //   </div>
  //   <span class="badge text-bg-primary rounded-pill">14</span>
  // </li>

const main = async() => {
    let my_ticket_list = await get('/api/ticket');
    my_ticket_list.forEach((ticket) => {
	ticket_list.innerHTML +=
	    `<li class="list-group-item d-flex justify-content-between align-items-start mt-5">` +
	    `<div class="ms-2 me-auto">` +
	    `<div class="fw-bold fs-2">${ticket.concert_name}</div>` +
	    `<dl class="row">` +
	    `<dt class="col-3">เจ้าของบัตร</dt>` +
	    `<dd class="col-9">${ticket.name}</dd>` +
	    `<dt class="col-3">สถานที่จัด</dt>` +
	    `<dd class="col-9">${ticket.venue}</dd>` +
	    `<dt class="col-3">ที่นั่ง</dt>` +
	    `<dd class="col-9">${ticket.seat}</dd>` +
	    `<dt class="col-3">เวลาจัดแสดง</dt>` +
	    `<dd class="col-9">${ticket.timeshow}</dd>` +
	    `</dl>` +
	    `</div>` +
	    `<span class="badge text-bg-primary rounded-pill">1 ใบ</span>` +
	    `</li>`;
    });
};

main();

