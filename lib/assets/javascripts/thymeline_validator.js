/**
 * Thymeline Validator Wrapper for ExecJS
 * This script exposes validation functions to Ruby
 *
 * Note: THYMELINE_CODE will be injected by Ruby before this script runs
 */

(function() {
  // The thymeline UMD code is injected by Ruby into THYMELINE_CODE variable
  // Execute it to get the module exports
  var module = { exports: {} };
  var exports = module.exports;

  // THYMELINE_CODE is defined by Ruby before this script executes
  eval(THYMELINE_CODE);

  // Extract the thymeline module
  var thymeline = module.exports;

  // Expose validation functions globally for ExecJS
  this.validateTimelineData = thymeline.validateTimelineData;
  this.formatValidationResult = thymeline.formatValidationResult;
  this.BIG_BANG_TIME = thymeline.BIG_BANG_TIME;

  // Helper function to validate and return structured results
  this.validate = function(timelineData) {
    try {
      var result = this.validateTimelineData(timelineData);
      return {
        valid: result.valid,
        errors: result.errors,
        warnings: result.warnings
      };
    } catch (error) {
      return {
        valid: false,
        errors: [{
          type: 'error',
          message: 'Validation failed: ' + error.message
        }],
        warnings: []
      };
    }
  };
}).call(this);
