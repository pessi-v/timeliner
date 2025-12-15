import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["checkbox"]

  combine() {
    const selectedIds = this.checkboxTargets
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value)

    if (selectedIds.length === 0) {
      alert("Please select at least one timeline to combine")
      return
    }

    const params = new URLSearchParams()
    selectedIds.forEach(id => params.append("ids[]", id))

    window.location.href = `/timelines/combine?${params.toString()}`
  }
}
