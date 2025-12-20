import { Controller } from "@hotwired/stimulus"
import { validateTimelineData, formatValidationResult } from "thymeline"

export default class extends Controller {
  static targets = [
    "jsonField",
    "periodsList",
    "eventsList",
    "connectorsList",
    "connectorsSection",
    "endTime",
    "validationMessages"
  ]

  connect() {
    this.periods = []
    this.events = []
    this.connectors = []
    this.loadExistingData()
    this.updateJSON()
  }

  onUnitCheckboxChange(event) {
    const checkbox = event.target
    const name = checkbox.name

    // If this checkbox was just checked, uncheck all other checkboxes with the same name
    if (checkbox.checked) {
      const allCheckboxes = this.element.querySelectorAll(`[name="${name}"]`)
      allCheckboxes.forEach(cb => {
        if (cb !== checkbox) {
          cb.checked = false
        }
      })
    }
  }

  loadExistingData() {
    if (!this.hasJsonFieldTarget) return

    try {
      const data = JSON.parse(this.jsonFieldTarget.value)
      this.periods = data.periods || []
      this.events = data.events || []
      this.connectors = data.connectors || []
      this.renderPeriods()
      this.renderEvents()
      this.renderConnectors()
      this.toggleConnectorsSection()
    } catch (error) {
      // Start fresh if JSON is invalid
      this.periods = []
      this.events = []
      this.connectors = []
    }
  }

  generateId(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  addPeriod(event) {
    event.preventDefault()
    const container = event.target.closest('[class*="space-y-4"]')

    const nameInput = container.querySelector('[name="period_name"]')
    const startTimeValueInput = container.querySelector('[name="period_start_time_value"]')
    const endTimeValueInput = container.querySelector('[name="period_end_time_value"]')
    const ongoingCheckbox = container.querySelector('[name="period_ongoing"]')

    const name = nameInput.value
    const startTimeValue = startTimeValueInput.value
    const endTimeValue = endTimeValueInput.value
    const ongoing = ongoingCheckbox.checked

    // Get selected unit checkboxes
    const startTimeUnitCheckbox = container.querySelector('[name="period_start_time_unit"]:checked')
    const endTimeUnitCheckbox = container.querySelector('[name="period_end_time_unit"]:checked')

    if (!name || !startTimeValue) return

    // Build startTime object
    const startTime = startTimeUnitCheckbox
      ? { value: parseFloat(startTimeValue), unit: startTimeUnitCheckbox.value }
      : startTimeValue

    // Build endTime object
    let endTime
    if (ongoing) {
      endTime = new Date().toISOString()
    } else if (endTimeValue) {
      endTime = endTimeUnitCheckbox
        ? { value: parseFloat(endTimeValue), unit: endTimeUnitCheckbox.value }
        : endTimeValue
    }

    const period = {
      id: this.generateId(name),
      name: name,
      startTime: startTime,
      endTime: endTime
    }

    this.periods.push(period)
    this.renderPeriods()
    this.updateJSON()
    this.toggleConnectorsSection()

    // Clear inputs
    nameInput.value = ""
    startTimeValueInput.value = ""
    endTimeValueInput.value = ""
    ongoingCheckbox.checked = false
    endTimeValueInput.disabled = false

    // Uncheck all unit checkboxes
    container.querySelectorAll('[name="period_start_time_unit"], [name="period_end_time_unit"]').forEach(cb => {
      cb.checked = false
    })
  }

  removePeriod(event) {
    const index = parseInt(event.params.index)
    const periodId = this.periods[index].id

    // Remove any connectors that reference this period
    this.connectors = this.connectors.filter(
      c => c.fromId !== periodId && c.toId !== periodId
    )

    this.periods.splice(index, 1)
    this.renderPeriods()
    this.renderConnectors()
    this.updateJSON()
    this.toggleConnectorsSection()
  }

  addEvent(event) {
    event.preventDefault()
    const container = event.target.closest('[class*="space-y-4"]')

    const nameInput = container.querySelector('[name="event_name"]')
    const timeValueInput = container.querySelector('[name="event_time_value"]')

    const name = nameInput.value
    const timeValue = timeValueInput.value

    // Get selected unit checkbox
    const timeUnitCheckbox = container.querySelector('[name="event_time_unit"]:checked')

    if (!name || !timeValue) return

    // Build time object
    const time = timeUnitCheckbox
      ? { value: parseFloat(timeValue), unit: timeUnitCheckbox.value }
      : timeValue

    const eventData = {
      id: this.generateId(name),
      name: name,
      time: time
    }

    this.events.push(eventData)
    this.renderEvents()
    this.updateJSON()

    // Clear inputs
    nameInput.value = ""
    timeValueInput.value = ""

    // Uncheck all unit checkboxes
    container.querySelectorAll('[name="event_time_unit"]').forEach(cb => {
      cb.checked = false
    })
  }

  removeEvent(event) {
    const index = parseInt(event.params.index)
    this.events.splice(index, 1)
    this.renderEvents()
    this.updateJSON()
  }

  addConnector(event) {
    event.preventDefault()
    const container = event.target.closest('[class*="space-y-4"]')

    const fromSelect = container.querySelector('[name="connector_from"]')
    const toSelect = container.querySelector('[name="connector_to"]')
    const indirectCheckbox = container.querySelector('[name="connector_indirect"]')

    const fromId = fromSelect.value
    const toId = toSelect.value
    const indirect = indirectCheckbox.checked

    if (!fromId || !toId) return

    const connector = {
      id: this.generateId(`${fromId}-to-${toId}`),
      fromId: fromId,
      toId: toId,
      type: indirect ? "undefined" : "defined"
    }

    this.connectors.push(connector)
    this.renderConnectors()
    this.updateJSON()

    // Reset selections
    fromSelect.value = ""
    toSelect.value = ""
    indirectCheckbox.checked = false
  }

  removeConnector(event) {
    const index = parseInt(event.params.index)
    this.connectors.splice(index, 1)
    this.renderConnectors()
    this.updateJSON()
  }

  toggleOngoing(event) {
    const container = event.target.closest('[class*="space-y-4"]')
    const endTimeField = container.querySelector('[name="period_end_time"]')

    if (endTimeField) {
      endTimeField.disabled = event.target.checked
      if (event.target.checked) {
        endTimeField.value = ""
      }
    }
  }

  renderPeriods() {
    if (!this.hasPeriodsListTarget) return

    this.periodsListTarget.innerHTML = this.periods.map((period, index) => `
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-md">
        <div>
          <strong>${period.name}</strong>
          <span class="text-sm text-gray-600 ml-2">
            (${this.formatTime(period.startTime)} → ${this.formatTime(period.endTime)})
          </span>
        </div>
        <button
          type="button"
          data-action="click->timeline-form#removePeriod"
          data-timeline-form-index-param="${index}"
          class="text-red-600 hover:text-red-800 text-sm"
        >
          Remove
        </button>
      </div>
    `).join("")
  }

  renderEvents() {
    if (!this.hasEventsListTarget) return

    this.eventsListTarget.innerHTML = this.events.map((event, index) => `
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-md">
        <div>
          <strong>${event.name}</strong>
          <span class="text-sm text-gray-600 ml-2">(${this.formatTime(event.time)})</span>
        </div>
        <button
          type="button"
          data-action="click->timeline-form#removeEvent"
          data-timeline-form-index-param="${index}"
          class="text-red-600 hover:text-red-800 text-sm"
        >
          Remove
        </button>
      </div>
    `).join("")
  }

  renderConnectors() {
    if (!this.hasConnectorsListTarget) return

    this.connectorsListTarget.innerHTML = this.connectors.map((connector, index) => {
      const fromPeriod = this.periods.find(p => p.id === connector.fromId)
      const toPeriod = this.periods.find(p => p.id === connector.toId)
      const typeLabel = connector.type === "undefined" ? " (indirect)" : ""

      return `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-md">
          <div>
            <strong>${fromPeriod?.name || connector.fromId}</strong>
            →
            <strong>${toPeriod?.name || connector.toId}</strong>
            <span class="text-sm text-gray-600">${typeLabel}</span>
          </div>
          <button
            type="button"
            data-action="click->timeline-form#removeConnector"
            data-timeline-form-index-param="${index}"
            class="text-red-600 hover:text-red-800 text-sm"
          >
            Remove
          </button>
        </div>
      `
    }).join("")
  }

  toggleConnectorsSection() {
    if (!this.hasConnectorsSectionTarget) return

    if (this.periods.length >= 2) {
      this.connectorsSectionTarget.classList.remove("hidden")
      this.updateConnectorSelects()
    } else {
      this.connectorsSectionTarget.classList.add("hidden")
    }
  }

  updateConnectorSelects() {
    const fromSelect = this.element.querySelector('[name="connector_from"]')
    const toSelect = this.element.querySelector('[name="connector_to"]')

    if (!fromSelect || !toSelect) return

    const options = this.periods.map(p =>
      `<option value="${p.id}">${p.name}</option>`
    ).join("")

    fromSelect.innerHTML = '<option value="">Select period...</option>' + options
    toSelect.innerHTML = '<option value="">Select period...</option>' + options
  }

  updateJSON() {
    if (!this.hasJsonFieldTarget) return

    const data = {
      events: this.events,
      periods: this.periods,
      connectors: this.connectors
    }

    this.jsonFieldTarget.value = JSON.stringify(data)
    this.validateData(data)
  }

  validateData(data) {
    if (!this.hasValidationMessagesTarget) return

    const validation = validateTimelineData(data)

    // Clear previous messages
    this.validationMessagesTarget.innerHTML = ""

    if (validation.errors.length > 0 || validation.warnings.length > 0) {
      const container = document.createElement("div")
      container.className = "mt-4 space-y-2"

      // Show errors
      validation.errors.forEach(error => {
        const errorDiv = document.createElement("div")
        errorDiv.className = "p-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm"
        errorDiv.innerHTML = `<strong>Error:</strong> ${error.message}`
        container.appendChild(errorDiv)
      })

      // Show warnings
      validation.warnings.forEach(warning => {
        const warningDiv = document.createElement("div")
        warningDiv.className = "p-3 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm"
        warningDiv.innerHTML = `<strong>Warning:</strong> ${warning.message}`
        container.appendChild(warningDiv)
      })

      this.validationMessagesTarget.appendChild(container)
    }
  }

  formatTime(time) {
    if (typeof time === 'object' && time !== null && time.value !== undefined && time.unit !== undefined) {
      const unitLabels = {
        'bce': 'BCE',
        'mya': 'million years ago',
        'years-ago': 'years ago'
      }
      return `${time.value.toLocaleString()} ${unitLabels[time.unit] || time.unit}`
    }
    return time
  }
}
