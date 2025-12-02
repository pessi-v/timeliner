# frozen_string_literal: true

module Views
  module Timelines
    class New < Views::Base
      def initialize(timeline:)
        @timeline = timeline
      end

      def view_template
        div(class: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8") do
          Heading(level: 1, class: "mb-8") { "New Timeline" }
          render Form.new(timeline: @timeline)
        end
      end
    end
  end
end
