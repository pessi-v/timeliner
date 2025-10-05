class Timeline < ApplicationRecord
  has_many :timeline_events, dependent: :destroy
  has_many :events, through: :timeline_events

  validates :name, presence: true

  def time_range
    return nil if events.empty?

    starts = events.map(&:start_time_seconds).compact
    ends = events.map(&:end_time_seconds).compact

    {
      min: starts.min,
      max: ends.max
    }
  end

  def duration_seconds
    range = time_range
    return 0 unless range

    range[:max] - range[:min]
  end
end
