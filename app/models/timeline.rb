class Timeline < ApplicationRecord
  validates :name, presence: true
  validates :timeline_data, presence: true
  validate :validate_timeline_data_structure
  validate :validate_with_thymeline

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

    # Validate time structure
    if event["time"].is_a?(Hash)
      validate_time_object(event["time"], "event at index #{index}")
    elsif event["time"].is_a?(String)
      validate_iso8601_date(event["time"], "event at index #{index}")
    end
  end

  def validate_period(period, index)
    # endTime is optional (for ongoing periods)
    unless period.is_a?(Hash) && period["id"].present? && period["name"].present? && period["startTime"].present?
      errors.add(:timeline_data, "period at index #{index} must have id, name, and startTime")
      return
    end

    # Validate startTime structure
    if period["startTime"].is_a?(Hash)
      validate_time_object(period["startTime"], "period at index #{index} startTime")
    elsif period["startTime"].is_a?(String)
      validate_iso8601_date(period["startTime"], "period at index #{index} startTime")
    end

    # Validate endTime structure if present
    if period["endTime"].present?
      if period["endTime"].is_a?(Hash)
        validate_time_object(period["endTime"], "period at index #{index} endTime")
      elsif period["endTime"].is_a?(String)
        validate_iso8601_date(period["endTime"], "period at index #{index} endTime")
      end
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

  def validate_iso8601_date(date_string, field_name)
    # ISO 8601 date format: YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS.sssZ
    # Also accept ISO datetime formats
    iso_date_pattern = /^\d{4}-\d{2}-\d{2}$/
    iso_datetime_pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/

    unless date_string.match?(iso_date_pattern) || date_string.match?(iso_datetime_pattern)
      errors.add(:timeline_data, "#{field_name} must be in ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS.sssZ), got: #{date_string}")
    end

    # Additional validation: ensure it's a valid date
    begin
      Date.parse(date_string)
    rescue ArgumentError
      errors.add(:timeline_data, "#{field_name} is not a valid date: #{date_string}")
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

  def validate_with_thymeline
    return if timeline_data.blank?
    return if errors[:timeline_data].any? # Skip if basic validation already failed

    result = TimelineValidatorService.validate(timeline_data)

    # Add errors from thymeline validation
    result[:errors]&.each do |error|
      item_prefix = error["itemId"] ? "[#{error["itemId"]}] " : ""
      errors.add(:timeline_data, "#{item_prefix}#{error["message"]}")
    end

    # Add warnings as base errors (not blocking, but informative)
    result[:warnings]&.each do |warning|
      item_prefix = warning["itemId"] ? "[#{warning["itemId"]}] " : ""
      errors.add(:base, "Warning: #{item_prefix}#{warning["message"]}")
    end
  rescue => e
    Rails.logger.error("Thymeline validation failed: #{e.class} - #{e.message}")
    # Don't add validation errors if the service fails - log and continue
  end
end
