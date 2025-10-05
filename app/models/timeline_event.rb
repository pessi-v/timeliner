class TimelineEvent < ApplicationRecord
  belongs_to :timeline
  belongs_to :event

  validates :timeline_id, uniqueness: { scope: :event_id }
end
