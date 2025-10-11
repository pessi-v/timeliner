class Event < ApplicationRecord
  has_many :timeline_events, dependent: :destroy
  has_many :timelines, through: :timeline_events

  validates :title, presence: true
  validates :start_time, presence: true
  validates :event_type, inclusion: { in: %w[point range ongoing] }
  validates :timezone, inclusion: { in: ActiveSupport::TimeZone.all.map(&:name), allow_nil: true }

  validate :end_time_after_start_time

  scope :point_events, -> { where(event_type: "point") }
  scope :range_events, -> { where(event_type: "range") }
  scope :ongoing_events, -> { where(event_type: "ongoing") }

  # Reference epoch for all date calculations (year 0)
  EPOCH = DateTime.new(0, 1, 1).freeze

  # Convert a DateTime to seconds from epoch
  # If timezone is provided, treats the datetime as being in that timezone and converts to UTC
  def self.datetime_to_seconds(datetime, timezone = "UTC")
    return nil unless datetime

    # If datetime is a string, parse it
    datetime = DateTime.parse(datetime.to_s) if datetime.is_a?(String)

    # Parse the datetime components in the specified timezone
    # This treats the year, month, day, hour, minute as being in the specified timezone
    time_zone = ActiveSupport::TimeZone[timezone]
    time_in_zone = time_zone.local(
      datetime.year,
      datetime.month,
      datetime.day,
      datetime.hour,
      datetime.min,
      datetime.sec
    )

    (time_in_zone.utc.to_time - EPOCH.to_time).to_i
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
    return if datetime.blank?
    # Use the event's timezone (or UTC if not set) to convert to UTC
    tz = timezone.presence || "UTC"
    self.start_time = self.class.datetime_to_seconds(datetime, tz)
  end

  # Virtual attribute for form: end_time as datetime
  def end_time_datetime
    self.class.seconds_to_datetime(end_time)
  end

  def end_time_datetime=(datetime)
    return if datetime.blank?
    # Use the event's timezone (or UTC if not set) to convert to UTC
    tz = timezone.presence || "UTC"
    self.end_time = self.class.datetime_to_seconds(datetime, tz)
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

    datetime = EPOCH.to_time + seconds
    years_from_epoch = datetime.year

    # For geological time (millions of years ago)
    if years_from_epoch < -1_000_000
      millions = years_from_epoch.abs / 1_000_000.0
      "#{millions.round(1)} million years ago"
    elsif years_from_epoch < -1000 # More than 1000 years ago
      "#{years_from_epoch.abs} years ago"
    elsif years_from_epoch > 10000 # Far future (year 10000+)
      "Year #{years_from_epoch}"
    else
      # For recent history and near future, show full date
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

  # Override attribute display in console to show human-readable dates
  def attribute_for_inspect(attr_name)
    value = read_attribute(attr_name)

    case attr_name
    when "start_time"
      "#{value} (#{formatted_start_time})"
    when "end_time"
      "#{value} (#{formatted_end_time})"
    else
      super
    end
  end

  private

  def end_time_after_start_time
    return if point_event? || ongoing? || end_time.nil?

    if end_time <= start_time
      errors.add(:end_time, "must be after start time")
    end
  end
end
