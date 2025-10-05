class TimelineComponent < ViewComponent::Base
  attr_reader :timeline, :width, :height

  def initialize(timeline:, width: 1200, height: 600)
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

  def events_data
    events_with_lanes = assign_lanes(events)
    
    events_with_lanes.map do |event_data|
      event = event_data[:event]
      {
        id: event.id,
        title: event.title,
        description: event.description || "",
        start_time: event.start_time.to_i,
        end_time: event.display_end_time.to_i,
        event_type: event.event_type,
        color: event.color || timeline.color,
        start_formatted: event.start_time.strftime('%B %d, %Y %H:%M'),
        end_formatted: event.display_end_time.strftime('%B %d, %Y %H:%M'),
        lane: event_data[:lane]
      }
    end
  end

  def max_lanes
    @max_lanes ||= begin
      return 1 if events.empty?
      events_data.map { |e| e[:lane] }.max + 1
    end
  end

  private

  # Assign events to lanes so they don't overlap
  def assign_lanes(events_list)
    return [] if events_list.empty?

    sorted_events = events_list.sort_by(&:start_time)
    lanes = [] # Each lane tracks the end time of the last event in that lane
    
    sorted_events.map do |event|
      event_start = event.start_time.to_i
      event_end = event.display_end_time.to_i
      
      # Find the first available lane where this event doesn't overlap
      lane_index = lanes.index { |lane_end_time| lane_end_time <= event_start }
      
      if lane_index.nil?
        # No available lane found, create a new one
        lane_index = lanes.length
        lanes << event_end
      else
        # Use the available lane and update its end time
        lanes[lane_index] = event_end
      end
      
      {
        event: event,
        lane: lane_index
      }
    end
  end
end
