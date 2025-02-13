# frozen_string_literal: true

class TimelineComponent < ViewComponent::Base
  def initialize(timelines)
    @timelines = Array(timelines)
    @events = parse_events
    @start_date = calculate_start_date
    @end_date = calculate_end_date
    @total_days = (@end_date - @start_date).to_i
    @rows = assign_rows_to_events
  end

  private

  def parse_events
    @timelines.flat_map do |timeline|
      next [] unless timeline.content.present?
      
      timeline.content.map do |description, dates|
        {
          description: description,
          from: Date.parse(dates['from']),
          until: dates['until'].present? ? Date.parse(dates['until']) : Date.today,
          timeline_id: timeline.id
        }
      end
    end
  end

  def assign_rows_to_events
    rows = []
    sorted_events = @events.sort_by { |e| [e[:from], e[:until] - e[:from]] }
    
    sorted_events.each do |event|
      # Find the first row where this event doesn't overlap with any existing events
      row_index = 0
      while overlap_in_row?(rows[row_index], event)
        row_index += 1
      end
      
      # Ensure the row exists
      rows[row_index] ||= []
      # Add the event to the row
      rows[row_index] << event
    end
    
    rows
  end

  def overlap_in_row?(row, event)
    return false if row.nil? || row.empty?
    
    row.any? do |existing|
      (event[:from] <= existing[:until]) && (event[:until] >= existing[:from])
    end
  end

  def calculate_start_date
    return Date.today if @events.empty?
    @events.map { |event| event[:from] }.min
  end

  def calculate_end_date
    return Date.today if @events.empty?
    [Date.today, @events.map { |event| event[:until] }.max].max
  end

  def calculate_position_and_width(event)
    days_from_start = (event[:from] - @start_date).to_i
    event_duration = (event[:until] - event[:from]).to_i
    
    position_percentage = (days_from_start.to_f / @total_days * 100).round(2)
    width_percentage = (event_duration.to_f / @total_days * 100).round(2)
    
    {
      left: "#{position_percentage}%",
      width: "#{width_percentage}%"
    }
  end

  def format_date(date)
    date.strftime("%d.%m.%Y")
  end
end