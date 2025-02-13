// // import { Controller } from "@hotwired/stimulus"

// // // Connects to data-controller="timeline-events"
// // export default class extends Controller {
// //   connect() {
// //   }
// // }

// import { Controller } from "@hotwired/stimulus";

// export default class extends Controller {
//   static targets = ["description", "dateTime", "eventsList", "eventsForm"];

//   connect() {
//     this.events = {};
//   }

//   addEvent(event) {
//     event.preventDefault();

//     const description = this.descriptionTarget.value;
//     const dateTime = this.dateTimeTarget.value;

//     if (!description || !dateTime) return;

//     this.events[description] = dateTime;
//     this.renderEvents();
//     this.clearForm();
//   }

//   removeEvent(event) {
//     const description = event.target.dataset.description;
//     delete this.events[description];
//     this.renderEvents();
//   }

//   renderEvents() {
//     this.eventsListTarget.innerHTML = "";

//     Object.entries(this.events).forEach(([description, dateTime]) => {
//       const eventDiv = document.createElement("div");
//       eventDiv.classList.add("event-item");
//       eventDiv.innerHTML = `
//         <p>${description} - ${new Date(dateTime).toLocaleString()}</p>
//         <button type="button" data-description="${description}"
//                 data-action="click->timeline-events#removeEvent">
//           Remove
//         </button>
//       `;
//       this.eventsListTarget.appendChild(eventDiv);
//     });

//     // Add hidden field with events data
//     const eventsInput = document.createElement("input");
//     eventsInput.type = "hidden";
//     eventsInput.name = "events";
//     eventsInput.value = JSON.stringify(this.events);
//     this.element.appendChild(eventsInput);
//   }

//   clearForm() {
//     this.descriptionTarget.value = "";
//     this.dateTimeTarget.value = "";
//   }
// }

// app/javascript/controllers/timeline_events_controller.js
import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = [
    "description",
    "fromDateTime",
    "untilDateTime",
    "eventsList",
    "eventsForm",
    "errorMessage",
  ];

  connect() {
    this.events = {};
  }

  addEvent(event) {
    event.preventDefault();

    const description = this.descriptionTarget.value;
    const fromDateTime = this.fromDateTimeTarget.value;
    const untilDateTime = this.untilDateTimeTarget.value;

    if (!description || !fromDateTime) {
      this.errorMessageTarget.textContent =
        "Description and From date are required";
      this.errorMessageTarget.classList.remove("hidden");
      return;
    }

    this.errorMessageTarget.classList.add("hidden");

    this.events[description] = {
      from: fromDateTime,
      until: untilDateTime || "",
    };

    this.renderEvents();
    this.clearForm();
  }

  removeEvent(event) {
    const description = event.target.dataset.description;
    delete this.events[description];
    this.renderEvents();
  }

  renderEvents() {
    this.eventsListTarget.innerHTML = "";

    Object.entries(this.events).forEach(([description, dates]) => {
      const eventDiv = document.createElement("div");
      eventDiv.classList.add("event-item");

      const dateDisplay = dates.until
        ? `${new Date(dates.from).toLocaleString()} - ${new Date(
            dates.until
          ).toLocaleString()}`
        : new Date(dates.from).toLocaleString();

      eventDiv.innerHTML = `
        <div class="event-details">
          <p class="event-description">${description}</p>
          <p class="event-dates">${dateDisplay}</p>
        </div>
        <button type="button" data-description="${description}" 
                data-action="click->timeline-events#removeEvent">
          Remove
        </button>
      `;
      this.eventsListTarget.appendChild(eventDiv);
    });

    // Add hidden field with events data
    const eventsInput = document.createElement("input");
    eventsInput.type = "hidden";
    eventsInput.name = "events";
    eventsInput.value = JSON.stringify(this.events);
    this.element.appendChild(eventsInput);
  }

  clearForm() {
    this.descriptionTarget.value = "";
    this.fromDateTimeTarget.value = "";
    this.untilDateTimeTarget.value = "";
  }
}
