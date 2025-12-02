import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["jsonField"]

  connect() {
    // Validate JSON on input
    if (this.hasJsonFieldTarget) {
      this.jsonFieldTarget.addEventListener("blur", () => {
        this.validateJSON()
      })
    }
  }

  validateJSON() {
    const value = this.jsonFieldTarget.value.trim()

    if (!value) {
      return true
    }

    try {
      JSON.parse(value)
      this.jsonFieldTarget.classList.remove("border-red-500")
      this.jsonFieldTarget.classList.add("border-green-500")
      this.clearError()
      return true
    } catch (error) {
      this.jsonFieldTarget.classList.remove("border-green-500")
      this.jsonFieldTarget.classList.add("border-red-500")
      this.showError(`Invalid JSON: ${error.message}`)
      return false
    }
  }

  showError(message) {
    this.clearError()
    const errorDiv = document.createElement("div")
    errorDiv.className = "mt-2 text-sm text-red-600"
    errorDiv.id = "json-error"
    errorDiv.textContent = message
    this.jsonFieldTarget.parentNode.appendChild(errorDiv)
  }

  clearError() {
    const existingError = document.getElementById("json-error")
    if (existingError) {
      existingError.remove()
    }
  }
}
