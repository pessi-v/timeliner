import { Controller } from "@hotwired/stimulus";
import { TimelineRenderer } from "thymeline";

export default class extends Controller {
  static values = {
    data: Object,
  };

  connect() {
    console.log("Timeline controller connected");
    console.log("Timeline data:", this.dataValue);
    // Defer until after the flex layout has been calculated so offsetHeight is correct
    requestAnimationFrame(() => this.renderTimeline());
  }

  cleanupTimelineData(data) {
    // Clean up periods: remove undefined/null endTime properties
    if (data.periods) {
      data.periods = data.periods.map((period) => {
        const cleanedPeriod = { ...period };
        // Remove endTime if it's undefined or null
        if (
          cleanedPeriod.endTime === undefined ||
          cleanedPeriod.endTime === null
        ) {
          delete cleanedPeriod.endTime;
        }
        return cleanedPeriod;
      });
    }
    return data;
  }

  renderTimeline() {
    // Clear any existing content
    this.element.innerHTML = "";

    // Create the container first and attach it so CSS layout resolves before we measure
    const container = document.createElement("div");
    container.id = "timeline-container";
    container.style.width = "100%";
    container.style.height = "100%";
    this.element.appendChild(container);

    // Read dimensions from the attached container — clientHeight reflects the true
    // flex-allocated height of the canvas element at this point
    const timelineWidth = container.clientWidth > 0 ? container.clientWidth : 800;
    const timelineHeight = container.clientHeight > 0 ? container.clientHeight : 600;

    try {
      console.log("Creating TimelineRenderer...");
      console.log(
        `Container: ${timelineWidth}px × ${timelineHeight}px`
      );

      // Initialize the timeline renderer
      this.renderer = new TimelineRenderer("#timeline-container", {
        width: timelineWidth,
        height: timelineHeight,
      });

      // Clean up the data before rendering
      // const cleanedData = this.cleanupTimelineData(this.dataValue)
      // console.log("Rendering timeline with data:", cleanedData)
      // Render the timeline with the data
      // this.renderer.render(cleanedData);
      this.renderer.render(this.dataValue);
      console.log("Timeline rendered successfully");
    } catch (error) {
      console.error("Failed to render timeline:", error);
      this.element.innerHTML = `<div class="bg-red-50 border border-red-200 rounded p-4 text-red-800">
        <p class="font-semibold">Error rendering timeline:</p>
        <p class="text-sm mt-2">${error.message}</p>
      </div>`;
    }
  }

  disconnect() {
    if (this.renderer) {
      this.renderer.destroy();
    }
  }
}
