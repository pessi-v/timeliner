# frozen_string_literal: true

# Service to validate timeline data using the thymeline.js validation library
# Uses ExecJS to run JavaScript validation code from Ruby
class TimelineValidatorService
  class ValidationError < StandardError; end

  VALIDATOR_SCRIPT_PATH = Rails.root.join("lib/assets/javascripts/thymeline_validator.js")
  THYMELINE_LIB_PATH = Rails.root.join("vendor/javascript/thymeline.umd.js")

  # Validate timeline data using thymeline.js validation
  # @param timeline_data [Hash] The timeline data to validate
  # @return [Hash] Validation result with :valid, :errors, and :warnings keys
  def self.validate(timeline_data)
    new.validate(timeline_data)
  end

  def initialize
    @context = nil
  end

  def validate(timeline_data)
    load_validator_context unless @context

    # Call the JavaScript validation function
    result = @context.call("validate", timeline_data)

    # Return structured result
    {
      valid: result["valid"],
      errors: result["errors"] || [],
      warnings: result["warnings"] || []
    }
  rescue ExecJS::RuntimeError => e
    Rails.logger.error("Thymeline validation runtime error: #{e.message}")
    {
      valid: false,
      errors: [ { "type" => "error", "message" => "JavaScript runtime error: #{e.message}" } ],
      warnings: []
    }
  rescue => e
    Rails.logger.error("Thymeline validation error: #{e.class} - #{e.message}")
    {
      valid: false,
      errors: [ { "type" => "error", "message" => "Validation service error: #{e.message}" } ],
      warnings: []
    }
  end

  private

  def load_validator_context
    # Check that both files exist
    unless File.exist?(VALIDATOR_SCRIPT_PATH)
      raise ValidationError, "Validator script not found at #{VALIDATOR_SCRIPT_PATH}"
    end

    unless File.exist?(THYMELINE_LIB_PATH)
      raise ValidationError, "Thymeline library not found at #{THYMELINE_LIB_PATH}"
    end

    # Read the thymeline library code
    thymeline_code = File.read(THYMELINE_LIB_PATH)

    # Read the validator wrapper script
    validator_script = File.read(VALIDATOR_SCRIPT_PATH)

    # Build the complete script by injecting thymeline code as a string variable
    # We need to escape the code properly to make it a JavaScript string
    escaped_thymeline_code = thymeline_code.gsub("\\", "\\\\\\\\").gsub("'", "\\\\'").gsub("\n", "\\n")

    complete_script = <<~JAVASCRIPT
      var THYMELINE_CODE = '#{escaped_thymeline_code}';
      #{validator_script}
    JAVASCRIPT

    ExecJS.runtime = ExecJS::Runtimes::MiniRacer

    # Compile the complete script with ExecJS
    @context = ExecJS.compile(complete_script)
  end
end
