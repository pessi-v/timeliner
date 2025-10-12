import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["svg", "content", "modal", "modalTitle", "modalDescription", "modalStart", "modalEnd", "modalType", "scaleLabel"]
  static values = {
    minTime: Number,
    maxTime: Number,
    maxLanes: Number,
    events: Array
  }

  connect() {
    // Viewport in time (seconds from epoch year 0)
    this.viewStart = this.minTimeValue
    this.viewEnd = this.maxTimeValue
    
    // SVG dimensions
    this.width = parseInt(this.svgTarget.getAttribute('width'))
    this.height = parseInt(this.svgTarget.getAttribute('height'))
    
    // Margins for timeline
    this.marginLeft = 50
    this.marginRight = 50
    this.marginTop = 80
    this.marginBottom = 60
    
    // Epoch offset: seconds from year 0 to Unix epoch (1970-01-01)
    this.epochOffset = 62135596800
    
    console.log('Timeline connected')
    console.log('Events:', this.eventsValue)
    console.log('Max lanes:', this.maxLanesValue)
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
      const minRange = (this.maxTimeValue - this.minTimeValue) * 0.01
      const maxRange = (this.maxTimeValue - this.minTimeValue) * 2
      
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

  getLaneY(laneIndex) {
    const availableHeight = this.height - this.marginTop - this.marginBottom
    const laneHeight = availableHeight / this.maxLanesValue
    return this.marginTop + (laneIndex * laneHeight) + (laneHeight / 2)
  }

  getLaneHeight() {
    const availableHeight = this.height - this.marginTop - this.marginBottom
    return Math.min(availableHeight / this.maxLanesValue, 40)
  }

  render() {
    this.contentTarget.innerHTML = ''
    
    if (this.maxLanesValue > 1) {
      this.drawLaneSeparators()
    }
    
    this.drawTimeTicks()
    this.drawEvents()
    this.updateScaleLabel()
  }

  drawLaneSeparators() {
    const availableHeight = this.height - this.marginTop - this.marginBottom
    const laneHeight = availableHeight / this.maxLanesValue
    
    for (let i = 0; i <= this.maxLanesValue; i++) {
      const y = this.marginTop + (i * laneHeight)
      this.drawLine(
        this.marginLeft, 
        y, 
        this.width - this.marginRight, 
        y, 
        i === 0 || i === this.maxLanesValue ? '#cbd5e1' : '#e5e7eb', 
        i === 0 || i === this.maxLanesValue ? 2 : 1
      )
    }
  }

  // Format timestamp (seconds from year 0) for display
  formatTimestamp(timestamp) {
    const years = timestamp / (365.25 * 24 * 3600)
    
    // Geological time (< -1000 years from year 0)
    if (years < -1000000) {
      const millions = Math.abs(years) / 1000000
      return `${millions.toFixed(1)}M ya`
    } else if (years < -1000) {
      return `${Math.abs(Math.round(years))} ya`
    } else if (years < 0) {
      return `Year ${Math.round(years)}`
    }
    
    // Modern dates - convert to JavaScript Date
    try {
      const unixSeconds = timestamp - this.epochOffset
      const date = new Date(unixSeconds * 1000)
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        // Fallback to year display
        return `Year ${Math.round(years)}`
      }
      
      const duration = this.viewEnd - this.viewStart
      
      // Format based on scale
      if (duration < 3600) {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      } else if (duration < 86400) {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      } else if (duration < 604800) {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' +
               date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      } else if (duration < 2592000) {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      } else if (duration < 31536000) {
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      } else {
        return date.getFullYear().toString()
      }
    } catch (e) {
      // Fallback if Date conversion fails
      return `Year ${Math.round(years)}`
    }
  }

  drawTimeTicks() {
    const tickY = this.height - this.marginBottom + 10
    const duration = this.viewEnd - this.viewStart
    const viewportWidth = this.width - this.marginLeft - this.marginRight
    
    const minLabelSpacing = 80
    const maxTicks = Math.floor(viewportWidth / minLabelSpacing)
    
    const possibleIntervals = [
      60, 300, 600, 1800, 3600, 10800, 21600, 43200,
      86400, 172800, 432000, 604800, 1209600, 2592000,
      7776000, 15552000, 31536000, 63072000, 157680000,
      315360000, 630720000, 1576800000, 3153600000,
      31536000000, 315360000000, 3153600000000,
      31536000000000, 315360000000000
    ]
    
    let interval = possibleIntervals[possibleIntervals.length - 1]
    
    for (let i = 0; i < possibleIntervals.length; i++) {
      const potentialInterval = possibleIntervals[i]
      const tickCount = Math.ceil(duration / potentialInterval)
      
      if (tickCount <= maxTicks) {
        interval = potentialInterval
        break
      }
    }
    
    let currentTime = Math.floor(this.viewStart / interval) * interval
    
    while (currentTime <= this.viewEnd) {
      const x = this.timeToX(currentTime)
      
      if (x >= this.marginLeft && x <= this.width - this.marginRight) {
        this.drawLine(x, tickY - 5, x, tickY + 5, '#6b7280', 1)
        
        const label = this.formatTimestamp(currentTime)
        this.drawText(x, this.height - 30, label, 'middle', '#6b7280', '11px')
      }
      
      currentTime += interval
    }
  }

  drawEvents() {
    if (!this.eventsValue || this.eventsValue.length === 0) {
      return
    }
    
    const eventHeight = Math.min(this.getLaneHeight() * 0.7, 30)
    
    this.eventsValue.forEach((event) => {
      const startX = this.timeToX(event.start_time)
      const endX = this.timeToX(event.end_time)
      
      if (endX < this.marginLeft || startX > this.width - this.marginRight) {
        return
      }
      
      const laneY = this.getLaneY(event.lane)
      const isPointEvent = event.event_type === 'point'
      const isOngoing = event.event_type === 'ongoing'
      
      const g = this.createGroup(event)
      
      if (isPointEvent) {
        this.drawCircle(g, startX, laneY, 6, event.color, 'white', 2)
        const labelX = startX + 12
        this.drawText(labelX, laneY + 4, event.title, 'start', '#1f2937', '12px', 'bold', g)
      } else {
        const width = Math.max(endX - startX, 2)
        const rectY = laneY - eventHeight / 2

        this.drawRect(g, startX, rectY, width, eventHeight, event.color, event.color, 2, 0.7)

        const labelX = startX + width / 2
        // Use dark text with white stroke for better contrast on colored backgrounds
        const textEl = this.drawText(labelX, laneY + 4, event.title, 'middle', '#1f2937', '12px', 'bold', g)
        textEl.setAttribute('stroke', '#ffffff')
        textEl.setAttribute('stroke-width', '3')
        textEl.setAttribute('paint-order', 'stroke')
        
        if (isOngoing && endX > this.width - this.marginRight) {
          const arrowX = Math.min(endX, this.width - this.marginRight)
          this.drawPolygon(g, [
            [arrowX, laneY - eventHeight / 2],
            [arrowX + 10, laneY],
            [arrowX, laneY + eventHeight / 2]
          ], event.color)
        }
      }
      
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
    else if (duration < 3153600000) scale = 'decades'
    else if (duration < 31536000000) scale = 'centuries'
    else if (duration < 31536000000000) scale = 'millennia'
    else scale = 'millions of years'
    
    if (this.hasScaleLabelTarget) {
      this.scaleLabelTarget.textContent = scale
    }
  }

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
