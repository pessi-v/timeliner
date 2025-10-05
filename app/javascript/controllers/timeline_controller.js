import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["svg", "content", "modal", "modalTitle", "modalDescription", "modalStart", "modalEnd", "modalType", "scaleLabel"]
  static values = {
    minTime: Number,
    maxTime: Number,
    events: Array
  }

  connect() {
    // Viewport in time (Unix timestamps)
    this.viewStart = this.minTimeValue
    this.viewEnd = this.maxTimeValue
    
    // SVG dimensions
    this.width = parseInt(this.svgTarget.getAttribute('width'))
    this.height = parseInt(this.svgTarget.getAttribute('height'))
    
    // Margins for timeline
    this.marginLeft = 50
    this.marginRight = 50
    this.marginTop = 60
    this.marginBottom = 60
    
    console.log('Timeline connected')
    console.log('Events:', this.eventsValue)
    console.log('Time range:', this.viewStart, 'to', this.viewEnd)
    
    this.setupInteractions()
    this.render()
  }

  setupInteractions() {
    let isDragging = false
    let startX = 0
    let startViewStart = 0
    let startViewEnd = 0

    this.svgTarget.addEventListener('mousedown', (e) => {
      isDragging = true
      startX = e.clientX
      startViewStart = this.viewStart
      startViewEnd = this.viewEnd
      this.svgTarget.style.cursor = 'grabbing'
    })

    this.svgTarget.addEventListener('mousemove', (e) => {
      if (!isDragging) return
      
      const deltaX = e.clientX - startX
      const viewportWidth = this.width - this.marginLeft - this.marginRight
      const timeRange = this.viewEnd - this.viewStart
      const deltaTime = -(deltaX / viewportWidth) * timeRange
      
      this.viewStart = startViewStart + deltaTime
      this.viewEnd = startViewEnd + deltaTime
      
      // Don't pan beyond the data
      const totalRange = this.maxTimeValue - this.minTimeValue
      if (this.viewStart < this.minTimeValue) {
        this.viewEnd += (this.minTimeValue - this.viewStart)
        this.viewStart = this.minTimeValue
      }
      if (this.viewEnd > this.maxTimeValue) {
        this.viewStart -= (this.viewEnd - this.maxTimeValue)
        this.viewEnd = this.maxTimeValue
      }
      
      this.render()
    })

    this.svgTarget.addEventListener('mouseup', () => {
      isDragging = false
      this.svgTarget.style.cursor = 'grab'
    })

    this.svgTarget.addEventListener('mouseleave', () => {
      isDragging = false
      this.svgTarget.style.cursor = 'grab'
    })

    // Mouse wheel zoom
    this.svgTarget.addEventListener('wheel', (e) => {
      e.preventDefault()
      
      const delta = e.deltaY > 0 ? 1.2 : 0.8
      const currentRange = this.viewEnd - this.viewStart
      const newRange = currentRange * delta
      
      // Zoom around the center
      const center = (this.viewStart + this.viewEnd) / 2
      this.viewStart = center - newRange / 2
      this.viewEnd = center + newRange / 2
      
      // Don't zoom beyond the data limits
      const minRange = (this.maxTimeValue - this.minTimeValue) * 0.01 // At least 1% of total range
      const maxRange = (this.maxTimeValue - this.minTimeValue) * 2 // At most 2x of total range
      
      if (this.viewEnd - this.viewStart < minRange) {
        const center = (this.viewStart + this.viewEnd) / 2
        this.viewStart = center - minRange / 2
        this.viewEnd = center + minRange / 2
      }
      
      if (this.viewEnd - this.viewStart > maxRange) {
        const center = (this.viewStart + this.viewEnd) / 2
        this.viewStart = center - maxRange / 2
        this.viewEnd = center + maxRange / 2
      }
      
      // Keep within bounds
      if (this.viewStart < this.minTimeValue - (maxRange - (this.maxTimeValue - this.minTimeValue)) / 2) {
        this.viewStart = this.minTimeValue - (maxRange - (this.maxTimeValue - this.minTimeValue)) / 2
      }
      if (this.viewEnd > this.maxTimeValue + (maxRange - (this.maxTimeValue - this.minTimeValue)) / 2) {
        this.viewEnd = this.maxTimeValue + (maxRange - (this.maxTimeValue - this.minTimeValue)) / 2
      }
      
      this.render()
    })

    this.svgTarget.style.cursor = 'grab'
  }

  timeToX(timestamp) {
    const viewportWidth = this.width - this.marginLeft - this.marginRight
    const timeRange = this.viewEnd - this.viewStart
    const offset = timestamp - this.viewStart
    return this.marginLeft + (offset / timeRange) * viewportWidth
  }

  render() {
    this.contentTarget.innerHTML = ''
    
    // Draw main timeline axis
    const axisY = this.height / 2
    this.drawLine(this.marginLeft, axisY, this.width - this.marginRight, axisY, '#cbd5e1', 2)
    
    // Draw time ticks
    this.drawTimeTicks()
    
    // Draw events
    this.drawEvents()
    
    // Update scale label
    this.updateScaleLabel()
  }

  drawTimeTicks() {
    const axisY = this.height / 2
    const duration = this.viewEnd - this.viewStart
    
    let interval, format
    
    if (duration < 3600) { // Less than 1 hour
      interval = 300 // 5 minutes
      format = (date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    } else if (duration < 86400) { // Less than 1 day
      interval = 3600 // 1 hour
      format = (date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    } else if (duration < 604800) { // Less than 1 week
      interval = 21600 // 6 hours
      format = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + 
                         date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    } else if (duration < 2592000) { // Less than 30 days
      interval = 86400 // 1 day
      format = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } else if (duration < 31536000) { // Less than 1 year
      interval = 2592000 // 30 days
      format = (date) => date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    } else if (duration < 315360000) { // Less than 10 years
      interval = 31536000 // 1 year
      format = (date) => date.getFullYear().toString()
    } else {
      interval = 315360000 // 10 years
      format = (date) => date.getFullYear().toString()
    }
    
    let currentTime = Math.floor(this.viewStart / interval) * interval
    
    while (currentTime <= this.viewEnd) {
      const x = this.timeToX(currentTime)
      
      if (x >= this.marginLeft && x <= this.width - this.marginRight) {
        // Tick mark
        this.drawLine(x, axisY - 5, x, axisY + 5, '#6b7280', 1)
        
        // Label
        const date = new Date(currentTime * 1000)
        this.drawText(x, this.height - 30, format(date), 'middle', '#6b7280', '11px')
      }
      
      currentTime += interval
    }
  }

  drawEvents() {
    const axisY = this.height / 2
    
    console.log('Drawing events, count:', this.eventsValue ? this.eventsValue.length : 0)
    
    if (!this.eventsValue || this.eventsValue.length === 0) {
      console.log('No events to draw')
      return
    }
    
    this.eventsValue.forEach((event, index) => {
      const startX = this.timeToX(event.start_time)
      const endX = this.timeToX(event.end_time)
      
      // Skip events completely outside viewport
      if (endX < this.marginLeft || startX > this.width - this.marginRight) {
        return
      }
      
      const labelY = this.marginTop + (index % 3) * 25
      const isPointEvent = event.event_type === 'point'
      const isOngoing = event.event_type === 'ongoing'
      
      const g = this.createGroup(event)
      
      if (isPointEvent) {
        // Point event - circle
        this.drawCircle(g, startX, axisY, 6, event.color, 'white', 2)
        
        // Connector line
        this.drawLine(startX, axisY - 6, startX, labelY + 15, event.color, 1, '2,2', g)
      } else {
        // Range event - rectangle
        const width = Math.max(endX - startX, 2)
        this.drawRect(g, startX, axisY - 15, width, 30, event.color, event.color, 2, 0.6)
        
        // Connector line
        const centerX = startX + width / 2
        this.drawLine(centerX, axisY - 15, centerX, labelY + 15, event.color, 1, '2,2', g)
        
        // Arrow for ongoing events
        if (isOngoing && endX > this.width - this.marginRight) {
          const arrowX = Math.min(endX, this.width - this.marginRight)
          this.drawPolygon(g, [
            [arrowX, axisY - 10],
            [arrowX + 8, axisY],
            [arrowX, axisY + 10]
          ], event.color)
        }
      }
      
      // Event label
      const labelX = isPointEvent ? startX : startX + (endX - startX) / 2
      const title = event.title.length > 30 ? event.title.substring(0, 27) + '...' : event.title
      this.drawText(labelX, labelY, title, 'middle', '#1f2937', '12px', 'bold', g)
      
      this.contentTarget.appendChild(g)
    })
  }

  updateScaleLabel() {
    const duration = this.viewEnd - this.viewStart
    let scale
    
    if (duration < 3600) scale = 'minutes'
    else if (duration < 86400) scale = 'hours'
    else if (duration < 2592000) scale = 'days'
    else if (duration < 31536000) scale = 'months'
    else if (duration < 315360000) scale = 'years'
    else scale = 'decades'
    
    if (this.hasScaleLabelTarget) {
      this.scaleLabelTarget.textContent = scale
    }
  }

  // Helper methods to create SVG elements
  createGroup(event) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    g.classList.add('event-group', 'cursor-pointer', 'hover:opacity-80', 'transition-opacity')
    g.dataset.eventData = JSON.stringify(event)
    g.addEventListener('click', (e) => {
      e.stopPropagation()
      this.showEventDetails(event)
    })
    return g
  }

  drawLine(x1, y1, x2, y2, stroke, strokeWidth, dashArray = null, parent = null) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('x1', x1)
    line.setAttribute('y1', y1)
    line.setAttribute('x2', x2)
    line.setAttribute('y2', y2)
    line.setAttribute('stroke', stroke)
    line.setAttribute('stroke-width', strokeWidth)
    if (dashArray) line.setAttribute('stroke-dasharray', dashArray)
    
    if (parent) {
      parent.appendChild(line)
    } else {
      this.contentTarget.appendChild(line)
    }
    return line
  }

  drawCircle(parent, cx, cy, r, fill, stroke, strokeWidth) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    circle.setAttribute('cx', cx)
    circle.setAttribute('cy', cy)
    circle.setAttribute('r', r)
    circle.setAttribute('fill', fill)
    circle.setAttribute('stroke', stroke)
    circle.setAttribute('stroke-width', strokeWidth)
    parent.appendChild(circle)
    return circle
  }

  drawRect(parent, x, y, width, height, fill, stroke, strokeWidth, fillOpacity) {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('x', x)
    rect.setAttribute('y', y)
    rect.setAttribute('width', width)
    rect.setAttribute('height', height)
    rect.setAttribute('fill', fill)
    rect.setAttribute('fill-opacity', fillOpacity)
    rect.setAttribute('stroke', stroke)
    rect.setAttribute('stroke-width', strokeWidth)
    rect.setAttribute('rx', 4)
    parent.appendChild(rect)
    return rect
  }

  drawText(x, y, text, anchor, fill, fontSize, fontWeight = 'normal', parent = null) {
    const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    textEl.setAttribute('x', x)
    textEl.setAttribute('y', y)
    textEl.setAttribute('text-anchor', anchor)
    textEl.setAttribute('fill', fill)
    textEl.setAttribute('font-size', fontSize)
    textEl.setAttribute('font-weight', fontWeight)
    textEl.textContent = text
    
    if (parent) {
      parent.appendChild(textEl)
    } else {
      this.contentTarget.appendChild(textEl)
    }
    return textEl
  }

  drawPolygon(parent, points, fill) {
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
    const pointsStr = points.map(p => p.join(',')).join(' ')
    polygon.setAttribute('points', pointsStr)
    polygon.setAttribute('fill', fill)
    parent.appendChild(polygon)
    return polygon
  }

  // Zoom controls
  zoomIn() {
    const currentRange = this.viewEnd - this.viewStart
    const newRange = currentRange * 0.5
    const center = (this.viewStart + this.viewEnd) / 2
    
    this.viewStart = center - newRange / 2
    this.viewEnd = center + newRange / 2
    
    this.render()
  }

  zoomOut() {
    const currentRange = this.viewEnd - this.viewStart
    const newRange = currentRange * 2
    const center = (this.viewStart + this.viewEnd) / 2
    
    this.viewStart = center - newRange / 2
    this.viewEnd = center + newRange / 2
    
    // Don't zoom out beyond reasonable limits
    const maxRange = (this.maxTimeValue - this.minTimeValue) * 2
    if (this.viewEnd - this.viewStart > maxRange) {
      const center = (this.viewStart + this.viewEnd) / 2
      this.viewStart = center - maxRange / 2
      this.viewEnd = center + maxRange / 2
    }
    
    this.render()
  }

  resetZoom() {
    this.viewStart = this.minTimeValue
    this.viewEnd = this.maxTimeValue
    this.render()
  }

  // Modal controls
  showEventDetails(event) {
    this.modalTitleTarget.textContent = event.title
    this.modalDescriptionTarget.textContent = event.description || 'No description available'
    this.modalStartTarget.textContent = event.start_formatted
    this.modalEndTarget.textContent = event.end_formatted
    this.modalTypeTarget.textContent = event.event_type

    this.modalTarget.classList.remove('hidden')
  }

  closeModal() {
    this.modalTarget.classList.add('hidden')
  }

  closeModalBackdrop(event) {
    if (event.target === this.modalTarget) {
      this.closeModal()
    }
  }

  stopPropagation(event) {
    event.stopPropagation()
  }
}
