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

  def duration_seconds
    return 0 if point_event?
    return (Time.current - start_time).to_i if ongoing?

    (end_time - start_time).to_i
  end

  def point_event?
    event_type == "point"
  end

  def ongoing?
    event_type == "ongoing"
  end

  def display_end_time
    return start_time if point_event?
    return Time.current if ongoing?

    end_time
  end

  private

  def end_time_after_start_time
    return if point_event? || ongoing? || end_time.nil?

    if end_time <= start_time
      errors.add(:end_time, "must be after start time")
    end
  end
end
