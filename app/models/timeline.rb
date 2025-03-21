class Timeline < ApplicationRecord
  validates_presence_of :title, :info, :events
end
