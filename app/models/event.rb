class Event < ApplicationRecord
  has_many :timeline_events, dependent: :destroy
  has_many :timelines, through: :timeline_events

  validates :title, presence: true
  validates :start_time, presence: true
  validates :event_type, inclusion: { in: %w[point range ongoing] }

  validate :end_time_after_start_time

  scope :point_events, -> { where(event_type: "point") }
  scope :range_events, -> { where(event_type: "range") }
  scope :ongoing_events, -> { where(event_type: "ongoing") }

  # Reference epoch for all date calculations (year 0)
  EPOCH = DateTime.new(0, 1, 1).freeze

  # Convert a DateTime to seconds from epoch
  def self.datetime_to_seconds(datetime)
    return nil unless datetime
    (datetime.to_time - EPOCH.to_time).to_i
  end

  # Convert seconds from epoch to DateTime
  def self.seconds_to_datetime(seconds)
    return nil unless seconds
    EPOCH.to_time + seconds
  end

  # Virtual attribute for form: start_time as datetime
  def start_time_datetime
    self.class.seconds_to_datetime(start_time)
  end

  def start_time_datetime=(datetime)
    self.start_time = self.class.datetime_to_seconds(datetime)
  end

  # Virtual attribute for form: end_time as datetime
  def end_time_datetime
    self.class.seconds_to_datetime(end_time)
  end

  def end_time_datetime=(datetime)
    self.end_time = self.class.datetime_to_seconds(datetime)
  end

  # Get start time as seconds from epoch (already stored as bigint)
  def start_time_seconds
    start_time
  end

  # Get end time as seconds from epoch
  def end_time_seconds
    return start_time if point_event?
    return self.class.datetime_to_seconds(Time.current) if ongoing?
    end_time
  end

  # Duration in seconds
  def duration_seconds
    return 0 if point_event?
    end_time_seconds - start_time_seconds
  end

  def point_event?
    event_type == "point"
  end

  def ongoing?
    event_type == "ongoing"
  end

  # Format seconds from epoch for display
  def format_time(seconds)
    return "" unless seconds
    
    # For geological time (millions of years)
    if seconds.abs > 31_536_000_000 # More than 1000 years
      years = seconds / (365.25 * 24 * 3600)
      
      if years < -1_000_000 # More than 1 million years ago
        millions = years.abs / 1_000_000.0
        "#{millions.round(1)} million years ago"
      elsif years < -1000 # More than 1000 years ago
        "#{years.abs.round} years ago"
      elsif years < 0 # Past but less than 1000 years ago
        datetime = EPOCH.to_time + seconds
        "Year #{datetime.year}"
      elsif years > 1000 # Far future
        "Year #{(EPOCH.year + years.round)}"
      else
        datetime = EPOCH.to_time + seconds
        datetime.strftime('%B %d, %Y %H:%M')
      end
    else
      datetime = EPOCH.to_time + seconds
      datetime.strftime('%B %d, %Y %H:%M')
    end
  end

  # Formatted start time for display
  def formatted_start_time
    format_time(start_time)
  end

  # Formatted end time for display
  def formatted_end_time
    format_time(end_time_seconds)
  end

  private

  def end_time_after_start_time
    return if point_event? || ongoing? || end_time.nil?

    if end_time <= start_time
      errors.add(:end_time, "must be after start time")
    end
  end
end
