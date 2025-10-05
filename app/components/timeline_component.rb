class TimelineComponent < ViewComponent::Base
  attr_reader :timeline, :width, :height

  def initialize(timeline:, width: 1200, height: 400)
    @timeline = timeline
    @width = width
    @height = height
  end

  def time_range
    @time_range ||= timeline.time_range
  end

  def events
    @events ||= timeline.events.order(:start_time)
  end

  def total_duration_seconds
    return 0 unless time_range
    (time_range[:max] - time_range[:min]).to_i
  end

  def time_scale
    return "hours" if total_duration_seconds < 86400 # Less than a day
    return "days" if total_duration_seconds < 2_592_000 # Less than 30 days
    return "months" if total_duration_seconds < 31_536_000 # Less than a year
    return "years" if total_duration_seconds < 315_360_000 # Less than 10 years

    "decades"
  end

  # Generate time axis tick marks
  def time_ticks
    return [] unless time_range

    ticks = []
    duration = total_duration_seconds
    
    # Determine tick interval based on duration
    if duration < 3600 # Less than 1 hour - show every 5 minutes
      interval = 5.minutes
      format = "%H:%M"
    elsif duration < 86400 # Less than 1 day - show every hour
      interval = 1.hour
      format = "%H:%M"
    elsif duration < 604800 # Less than 1 week - show every 6 hours
      interval = 6.hours
      format = "%b %d %H:%M"
    elsif duration < 2_592_000 # Less than 30 days - show every day
      interval = 1.day
      format = "%b %d"
    elsif duration < 31_536_000 # Less than 1 year - show every month
      interval = 1.month
      format = "%b %Y"
    elsif duration < 315_360_000 # Less than 10 years - show every year
      interval = 1.year
      format = "%Y"
    else # 10+ years - show every decade
      interval = 10.years
      format = "%Y"
    end

    current_time = time_range[:min]
    end_time = time_range[:max]

    while current_time <= end_time
      ticks << {
        time: current_time,
        label: current_time.strftime(format)
      }
      current_time += interval
    end

    ticks
  end

  def events_data
    events.map do |event|
      {
        id: event.id,
        title: event.title,
        description: event.description || "",
        start_time: event.start_time.to_i,
        end_time: event.display_end_time.to_i,
        event_type: event.event_type,
        color: event.color || timeline.color,
        start_formatted: event.start_time.strftime('%B %d, %Y %H:%M'),
        end_formatted: event.display_end_time.strftime('%B %d, %Y %H:%M')
      }
    end
  end
end
