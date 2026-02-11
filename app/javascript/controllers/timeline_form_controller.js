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
    "validationMessages",
    "periodAddButton",
    "periodCancelButton",
    "eventAddButton",
    "eventCancelButton",
    "connectorAddButton",
    "connectorCancelButton",
    "eventRelatesToSelect"
  ]

  connect() {
    this.periods = []
    this.events = []
    this.connectors = []
    this.editingPeriodIndex = null
    this.editingEventIndex = null
    this.editingConnectorIndex = null
    this.loadExistingData()
    this.updateJSON()
  }

  parseTimeValue(value, hasUnitSelected) {
    // If a unit checkbox is selected (BCE, MYA, Years ago), just return the numeric value
    if (hasUnitSelected) {
      return parseFloat(value)
    }

    // Try to parse various date formats
    const trimmedValue = value.trim()

    // Format: "1988-11-03" (ISO 8601 date - already valid)
    const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/
    if (isoDatePattern.test(trimmedValue)) {
      return trimmedValue
    }

    // Format: "2000-11" (ISO 8601 year-month - convert to full date)
    const isoYearMonthPattern = /^(\d{4})-(\d{2})$/
    const isoYearMonthMatch = trimmedValue.match(isoYearMonthPattern)
    if (isoYearMonthMatch) {
      return `${isoYearMonthMatch[1]}-${isoYearMonthMatch[2]}-01`
    }

    // Match formats like "Nov 2017", "Jun 15 2000", "3.11.1988", etc.
    const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

    // Format: "Nov 2017" or "November 2017"
    const monthYearPattern = /^([a-z]+)\s+(\d{4})$/i
    const monthYearMatch = trimmedValue.match(monthYearPattern)
    if (monthYearMatch) {
      const monthStr = monthYearMatch[1].toLowerCase()
      const year = monthYearMatch[2]
      const monthIndex = monthNames.findIndex(m => monthStr.startsWith(m.substring(0, 3)))
      if (monthIndex !== -1) {
        const month = String(monthIndex + 1).padStart(2, '0')
        return `${year}-${month}-01`
      }
    }

    // Format: "Jun 15 2000" or "June 15 2000"
    const monthDayYearPattern = /^([a-z]+)\s+(\d{1,2})\s+(\d{4})$/i
    const monthDayYearMatch = trimmedValue.match(monthDayYearPattern)
    if (monthDayYearMatch) {
      const monthStr = monthDayYearMatch[1].toLowerCase()
      const day = monthDayYearMatch[2].padStart(2, '0')
      const year = monthDayYearMatch[3]
      const monthIndex = monthNames.findIndex(m => monthStr.startsWith(m.substring(0, 3)))
      if (monthIndex !== -1) {
        const month = String(monthIndex + 1).padStart(2, '0')
        return `${year}-${month}-${day}`
      }
    }

    // Format: "3.11.1988" or "15.3.2025" (DD.MM.YYYY)
    const dotPattern = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/
    const dotMatch = trimmedValue.match(dotPattern)
    if (dotMatch) {
      const day = dotMatch[1].padStart(2, '0')
      const month = dotMatch[2].padStart(2, '0')
      const year = dotMatch[3]
      return `${year}-${month}-${day}`
    }

    // Simple year (e.g., "2000", "1988") - convert to ISO 8601 date
    const yearPattern = /^(\d{4})$/
    const yearMatch = trimmedValue.match(yearPattern)
    if (yearMatch) {
      return `${yearMatch[1]}-01-01`
    }

    // If no pattern matches, return the original value
    return value
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
      this.updateEventRelatesToSelect()
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
    const infoInput = container.querySelector('[name="period_info"]')
    const startTimeValueInput = container.querySelector('[name="period_start_time_value"]')
    const endTimeValueInput = container.querySelector('[name="period_end_time_value"]')
    const ongoingCheckbox = container.querySelector('[name="period_ongoing"]')

    const name = nameInput.value
    const info = infoInput.value
    const startTimeValue = startTimeValueInput.value
    const endTimeValue = endTimeValueInput.value
    const ongoing = ongoingCheckbox.checked

    // Get selected unit checkboxes
    const startTimeUnitCheckbox = container.querySelector('[name="period_start_time_unit"]:checked')
    const endTimeUnitCheckbox = container.querySelector('[name="period_end_time_unit"]:checked')

    if (!name || !startTimeValue) return

    // Build startTime object
    const startTime = startTimeUnitCheckbox
      ? { value: this.parseTimeValue(startTimeValue, true), unit: startTimeUnitCheckbox.value }
      : this.parseTimeValue(startTimeValue, false)

    // Build period object
    const period = {
      id: this.generateId(name),
      name: name,
      startTime: startTime
    }

    if (info) {
      period.info = info
    }

    // Only add endTime if it has a value
    if (ongoing) {
      period.endTime = new Date().toISOString()
    } else if (endTimeValue) {
      period.endTime = endTimeUnitCheckbox
        ? { value: this.parseTimeValue(endTimeValue, true), unit: endTimeUnitCheckbox.value }
        : this.parseTimeValue(endTimeValue, false)
    }
    // If neither ongoing nor endTimeValue, endTime is omitted (ongoing period without explicit end)

    if (this.editingPeriodIndex !== null) {
      period.id = this.periods[this.editingPeriodIndex].id
      this.periods[this.editingPeriodIndex] = period
      this.editingPeriodIndex = null
      this.periodAddButtonTarget.textContent = "Add Period"
      this.periodCancelButtonTarget.classList.add("hidden")
    } else {
      this.periods.push(period)
    }

    this.renderPeriods()
    this.updateJSON()
    this.toggleConnectorsSection()
    this.updateEventRelatesToSelect()

    // Clear inputs
    this.clearPeriodForm(container)
    endTimeValueInput.disabled = false
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
    this.updateEventRelatesToSelect()
  }

  addEvent(event) {
    event.preventDefault()
    const container = event.target.closest('[class*="space-y-4"]')

    const nameInput = container.querySelector('[name="event_name"]')
    const infoInput = container.querySelector('[name="event_info"]')
    const relatesToSelect = container.querySelector('[name="event_relates_to"]')
    const timeValueInput = container.querySelector('[name="event_time_value"]')

    const name = nameInput.value
    const info = infoInput.value
    const relatesTo = relatesToSelect.value
    const timeValue = timeValueInput.value

    // Get selected unit checkbox
    const timeUnitCheckbox = container.querySelector('[name="event_time_unit"]:checked')

    if (!name || !timeValue) return

    // Build time object
    const time = timeUnitCheckbox
      ? { value: this.parseTimeValue(timeValue, true), unit: timeUnitCheckbox.value }
      : this.parseTimeValue(timeValue, false)

    const eventData = {
      id: this.generateId(name),
      name: name,
      time: time
    }

    if (info) {
      eventData.info = info
    }

    if (relatesTo) {
      eventData.relatesTo = relatesTo
    }

    if (this.editingEventIndex !== null) {
      eventData.id = this.events[this.editingEventIndex].id
      this.events[this.editingEventIndex] = eventData
      this.editingEventIndex = null
      this.eventAddButtonTarget.textContent = "Add Event"
      this.eventCancelButtonTarget.classList.add("hidden")
    } else {
      this.events.push(eventData)
    }

    this.renderEvents()
    this.updateJSON()

    // Clear inputs
    this.clearEventForm(container)
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

    if (this.editingConnectorIndex !== null) {
      connector.id = this.connectors[this.editingConnectorIndex].id
      this.connectors[this.editingConnectorIndex] = connector
      this.editingConnectorIndex = null
      this.connectorAddButtonTarget.textContent = "Add Connector"
      this.connectorCancelButtonTarget.classList.add("hidden")
    } else {
      this.connectors.push(connector)
    }

    this.renderConnectors()
    this.updateJSON()

    // Reset selections
    this.clearConnectorForm(container)
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

  populateTimeFields(container, inputName, unitName, timeValue) {
    const input = container.querySelector(`[name="${inputName}"]`)
    const unitCheckboxes = container.querySelectorAll(`[name="${unitName}"]`)

    unitCheckboxes.forEach(cb => cb.checked = false)

    if (typeof timeValue === 'object' && timeValue !== null && timeValue.value !== undefined) {
      input.value = timeValue.value
      const matchingCheckbox = container.querySelector(`[name="${unitName}"][value="${timeValue.unit}"]`)
      if (matchingCheckbox) matchingCheckbox.checked = true
    } else if (timeValue) {
      input.value = timeValue
    } else {
      input.value = ""
    }
  }

  clearPeriodForm(container) {
    container.querySelector('[name="period_name"]').value = ""
    container.querySelector('[name="period_info"]').value = ""
    container.querySelector('[name="period_start_time_value"]').value = ""
    container.querySelector('[name="period_end_time_value"]').value = ""
    container.querySelector('[name="period_ongoing"]').checked = false
    container.querySelectorAll('[name="period_start_time_unit"], [name="period_end_time_unit"]').forEach(cb => cb.checked = false)
  }

  clearEventForm(container) {
    container.querySelector('[name="event_name"]').value = ""
    container.querySelector('[name="event_info"]').value = ""
    container.querySelector('[name="event_relates_to"]').value = ""
    container.querySelector('[name="event_time_value"]').value = ""
    container.querySelectorAll('[name="event_time_unit"]').forEach(cb => cb.checked = false)
  }

  clearConnectorForm(container) {
    container.querySelector('[name="connector_from"]').value = ""
    container.querySelector('[name="connector_to"]').value = ""
    container.querySelector('[name="connector_indirect"]').checked = false
  }

  editPeriod(event) {
    const index = parseInt(event.params.index)
    const period = this.periods[index]
    this.editingPeriodIndex = index

    const container = this.periodAddButtonTarget.closest('[class*="space-y-4"]')
    container.querySelector('[name="period_name"]').value = period.name
    container.querySelector('[name="period_info"]').value = period.info || ""
    this.populateTimeFields(container, "period_start_time_value", "period_start_time_unit", period.startTime)
    this.populateTimeFields(container, "period_end_time_value", "period_end_time_unit", period.endTime)
    container.querySelector('[name="period_ongoing"]').checked = false

    this.periodAddButtonTarget.textContent = "Save Period"
    this.periodCancelButtonTarget.classList.remove("hidden")
  }

  cancelEditPeriod() {
    this.editingPeriodIndex = null
    const container = this.periodAddButtonTarget.closest('[class*="space-y-4"]')
    this.clearPeriodForm(container)
    this.periodAddButtonTarget.textContent = "Add Period"
    this.periodCancelButtonTarget.classList.add("hidden")
  }

  editEvent(event) {
    const index = parseInt(event.params.index)
    const evt = this.events[index]
    this.editingEventIndex = index

    const container = this.eventAddButtonTarget.closest('[class*="space-y-4"]')
    container.querySelector('[name="event_name"]').value = evt.name
    container.querySelector('[name="event_info"]').value = evt.info || ""
    container.querySelector('[name="event_relates_to"]').value = evt.relatesTo || ""
    this.populateTimeFields(container, "event_time_value", "event_time_unit", evt.time)

    this.eventAddButtonTarget.textContent = "Save Event"
    this.eventCancelButtonTarget.classList.remove("hidden")
  }

  cancelEditEvent() {
    this.editingEventIndex = null
    const container = this.eventAddButtonTarget.closest('[class*="space-y-4"]')
    this.clearEventForm(container)
    this.eventAddButtonTarget.textContent = "Add Event"
    this.eventCancelButtonTarget.classList.add("hidden")
  }

  editConnector(event) {
    const index = parseInt(event.params.index)
    const connector = this.connectors[index]
    this.editingConnectorIndex = index

    const container = this.connectorAddButtonTarget.closest('[class*="space-y-4"]')
    container.querySelector('[name="connector_from"]').value = connector.fromId
    container.querySelector('[name="connector_to"]').value = connector.toId
    container.querySelector('[name="connector_indirect"]').checked = connector.type === "undefined"

    this.connectorAddButtonTarget.textContent = "Save Connector"
    this.connectorCancelButtonTarget.classList.remove("hidden")
  }

  cancelEditConnector() {
    this.editingConnectorIndex = null
    const container = this.connectorAddButtonTarget.closest('[class*="space-y-4"]')
    this.clearConnectorForm(container)
    this.connectorAddButtonTarget.textContent = "Add Connector"
    this.connectorCancelButtonTarget.classList.add("hidden")
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
          ${period.info ? `<p class="text-sm text-gray-500 mt-1">${period.info}</p>` : ''}
        </div>
        <div class="flex gap-2">
          <button
            type="button"
            data-action="click->timeline-form#editPeriod"
            data-timeline-form-index-param="${index}"
            class="text-blue-600 hover:text-blue-800 text-sm"
          >
            Edit
          </button>
          <button
            type="button"
            data-action="click->timeline-form#removePeriod"
            data-timeline-form-index-param="${index}"
            class="text-red-600 hover:text-red-800 text-sm"
          >
            Remove
          </button>
        </div>
      </div>
    `).join("")
  }

  renderEvents() {
    if (!this.hasEventsListTarget) return

    this.eventsListTarget.innerHTML = this.events.map((event, index) => {
      const relatedPeriod = event.relatesTo ? this.periods.find(p => p.id === event.relatesTo) : null
      return `
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-md">
        <div>
          <strong>${event.name}</strong>
          <span class="text-sm text-gray-600 ml-2">(${this.formatTime(event.time)})</span>
          ${relatedPeriod ? `<span class="text-sm text-indigo-600 ml-2">→ ${relatedPeriod.name}</span>` : ''}
          ${event.info ? `<p class="text-sm text-gray-500 mt-1">${event.info}</p>` : ''}
        </div>
        <div class="flex gap-2">
          <button
            type="button"
            data-action="click->timeline-form#editEvent"
            data-timeline-form-index-param="${index}"
            class="text-blue-600 hover:text-blue-800 text-sm"
          >
            Edit
          </button>
          <button
            type="button"
            data-action="click->timeline-form#removeEvent"
            data-timeline-form-index-param="${index}"
            class="text-red-600 hover:text-red-800 text-sm"
          >
            Remove
          </button>
        </div>
      </div>
    `}).join("")
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
          <div class="flex gap-2">
            <button
              type="button"
              data-action="click->timeline-form#editConnector"
              data-timeline-form-index-param="${index}"
              class="text-blue-600 hover:text-blue-800 text-sm"
            >
              Edit
            </button>
            <button
              type="button"
              data-action="click->timeline-form#removeConnector"
              data-timeline-form-index-param="${index}"
              class="text-red-600 hover:text-red-800 text-sm"
            >
              Remove
            </button>
          </div>
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

  updateEventRelatesToSelect() {
    if (!this.hasEventRelatesToSelectTarget) return

    const currentValue = this.eventRelatesToSelectTarget.value
    const options = this.periods.map(p =>
      `<option value="${p.id}">${p.name}</option>`
    ).join("")

    this.eventRelatesToSelectTarget.innerHTML = '<option value="">None</option>' + options
    this.eventRelatesToSelectTarget.value = currentValue
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
