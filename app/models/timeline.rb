class Timeline < ApplicationRecord
  validates :name, presence: true
  validates :timeline_data, presence: true
  validate :validate_timeline_data_structure

  # Ensure timeline_data always has the required keys
  before_validation :ensure_timeline_data_structure

  def events
    timeline_data["events"] || []
  end

  def periods
    timeline_data["periods"] || []
  end

  def connectors
    timeline_data["connectors"] || []
  end

  def config
    timeline_data["config"]
  end

  private

  def ensure_timeline_data_structure
    self.timeline_data ||= {}
    self.timeline_data["events"] ||= []
    self.timeline_data["periods"] ||= []
    self.timeline_data["connectors"] ||= []
  end

  def validate_timeline_data_structure
    return if timeline_data.blank?

    unless timeline_data.is_a?(Hash)
      errors.add(:timeline_data, "must be a valid JSON object")
      return
    end

    # Validate that events, periods, and connectors are arrays
    %w[events periods connectors].each do |key|
      if timeline_data[key].present? && !timeline_data[key].is_a?(Array)
        errors.add(:timeline_data, "#{key} must be an array")
      end
    end

    # Validate event structure
    timeline_data["events"]&.each_with_index do |event, index|
      validate_event(event, index)
    end

    # Validate period structure
    timeline_data["periods"]&.each_with_index do |period, index|
      validate_period(period, index)
    end

    # Validate connector structure
    timeline_data["connectors"]&.each_with_index do |connector, index|
      validate_connector(connector, index)
    end
  end

  def validate_event(event, index)
    unless event.is_a?(Hash) && event["id"].present? && event["name"].present? && event["time"].present?
      errors.add(:timeline_data, "event at index #{index} must have id, name, and time")
      return
    end

    # Validate time structure if it's an object with unit
    if event["time"].is_a?(Hash)
      validate_time_object(event["time"], "event at index #{index}")
    end
  end

  def validate_period(period, index)
    unless period.is_a?(Hash) && period["id"].present? && period["name"].present? && period["startTime"].present? && period["endTime"].present?
      errors.add(:timeline_data, "period at index #{index} must have id, name, startTime, and endTime")
      return
    end

    # Validate time structure if they're objects with units
    if period["startTime"].is_a?(Hash)
      validate_time_object(period["startTime"], "period at index #{index} startTime")
    end

    if period["endTime"].is_a?(Hash)
      validate_time_object(period["endTime"], "period at index #{index} endTime")
    end
  end

  def validate_time_object(time_obj, field_name)
    unless time_obj["value"].present? && time_obj["unit"].present?
      errors.add(:timeline_data, "#{field_name} must have value and unit when specified as an object")
      return
    end

    unless time_obj["value"].is_a?(Numeric)
      errors.add(:timeline_data, "#{field_name} value must be a number")
    end

    valid_units = %w[bce mya years-ago]
    unless valid_units.include?(time_obj["unit"])
      errors.add(:timeline_data, "#{field_name} unit must be one of: #{valid_units.join(', ')}")
    end
  end

  def validate_connector(connector, index)
    unless connector.is_a?(Hash) && connector["id"].present? && connector["fromId"].present? && connector["toId"].present? && connector["type"].present?
      errors.add(:timeline_data, "connector at index #{index} must have id, fromId, toId, and type")
    end

    if connector["type"].present? && !%w[defined undefined].include?(connector["type"])
      errors.add(:timeline_data, "connector at index #{index} type must be 'defined' or 'undefined'")
    end
  end
end
