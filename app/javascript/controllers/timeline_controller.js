import { Controller } from "@hotwired/stimulus"
import { TimelineRenderer } from "thymeline"

export default class extends Controller {
  static values = {
    data: Object
  }

  connect() {
    console.log("Timeline controller connected")
    console.log("Timeline data:", this.dataValue)
    this.renderTimeline()
  }

  cleanupTimelineData(data) {
    // Clean up periods: remove undefined/null endTime properties
    if (data.periods) {
      data.periods = data.periods.map(period => {
        const cleanedPeriod = { ...period }
        // Remove endTime if it's undefined or null
        if (cleanedPeriod.endTime === undefined || cleanedPeriod.endTime === null) {
          delete cleanedPeriod.endTime
        }
        return cleanedPeriod
      })
    }
    return data
  }

  renderTimeline() {
    // Clear any existing content
    this.element.innerHTML = ""

    // Use parent container's width
    const parentWidth = this.element.offsetWidth
    const timelineWidth = parentWidth > 0 ? parentWidth : 800 // Fallback to 800 if parent width is 0
    const timelineHeight = 600

    // Create a container for the timeline
    const container = document.createElement("div")
    container.id = "timeline-container"
    container.style.width = "100%"
    container.style.height = `${timelineHeight}px`
    this.element.appendChild(container)

    try {
      console.log("Creating TimelineRenderer...")
      console.log(`Parent width: ${parentWidth}px, Timeline width: ${timelineWidth}px`)

      // Initialize the timeline renderer
      this.renderer = new TimelineRenderer("#timeline-container", {
        width: timelineWidth,
        height: timelineHeight
      })

      // Clean up the data before rendering
      const cleanedData = this.cleanupTimelineData(this.dataValue)
      console.log("Rendering timeline with data:", cleanedData)
      // Render the timeline with the data
      this.renderer.render(cleanedData)
      console.log("Timeline rendered successfully")
    } catch (error) {
      console.error("Failed to render timeline:", error)
      this.element.innerHTML = `<div class="bg-red-50 border border-red-200 rounded p-4 text-red-800">
        <p class="font-semibold">Error rendering timeline:</p>
        <p class="text-sm mt-2">${error.message}</p>
      </div>`
    }
  }

  disconnect() {
    if (this.renderer) {
      this.renderer.destroy()
    }
  }
}
