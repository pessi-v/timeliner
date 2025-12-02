# frozen_string_literal: true

module Views
  module Timelines
    class Form < Views::Base
      include Phlex::Rails::Helpers::FormWith
      include Phlex::Rails::Helpers::Pluralize
      include Phlex::Rails::Helpers::LinkTo

      def initialize(timeline:)
        @timeline = timeline
      end

      def view_template
        form_with(model: @timeline, data: { controller: "timeline-form" }) do |form|
          render_errors if @timeline.errors.any?
          render_name_field(form)
          render_description_field(form)
          render_timeline_data_field(form)
          render_actions(form)
        end
      end

      private

      def render_errors
        Alert(variant: :destructive, class: "mb-6") do
          AlertTitle do
            "#{pluralize(@timeline.errors.count, "error")} prohibited this timeline from being saved:"
          end
          AlertDescription do
            ul(class: "list-disc list-inside mt-2") do
              @timeline.errors.full_messages.each do |message|
                li { message }
              end
            end
          end
        end
      end

      def render_name_field(form)
        FormField(class: "mb-6") do
          FormFieldLabel { "Name" }
          form.text_field :name,
            class: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        end
      end

      def render_description_field(form)
        FormField(class: "mb-6") do
          FormFieldLabel { "Description" }
          form.text_area :description,
            rows: 3,
            class: "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        end
      end

      def render_timeline_data_field(form)
        FormField(class: "mb-8") do
          FormFieldLabel(class: "text-lg") { "Timeline Data (JSON)" }
          FormFieldHint(class: "mb-4") do
            "Enter your timeline data as JSON. The structure should include events, periods, and connectors arrays."
          end

          form.text_area :timeline_data,
            value: timeline_data_value,
            rows: 20,
            class: "flex min-h-[500px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            data: { timeline_form_target: "jsonField" }

          render_example
        end
      end

      def timeline_data_value
        if @timeline.timeline_data.present?
          JSON.pretty_generate(@timeline.timeline_data)
        else
          JSON.pretty_generate({ events: [], periods: [], connectors: [] })
        end
      end

      def render_example
        Collapsible(class: "mt-4") do
          CollapsibleTrigger do
            div(class: "flex items-center gap-2") do
              Text(size: "2", class: "font-semibold text-primary cursor-pointer hover:underline") do
                "Show Example"
              end
            end
          end
          CollapsibleContent(class: "mt-2") do
            Codeblock(example_json, syntax: :json)
          end
        end
      end

      def example_json
        <<~JSON
          {
            "events": [
              {
                "id": "event1",
                "name": "Big Bang",
                "time": { "value": 13800, "unit": "mya" }
              },
              {
                "id": "event2",
                "name": "Earth Formation",
                "time": { "value": 4543, "unit": "mya" }
              }
            ],
            "periods": [
              {
                "id": "period1",
                "name": "Mesozoic Era",
                "startTime": { "value": 252, "unit": "mya" },
                "endTime": { "value": 66, "unit": "mya" }
              },
              {
                "id": "period2",
                "name": "Cenozoic Era",
                "startTime": { "value": 66, "unit": "mya" },
                "endTime": "2024-01-01T00:00:00Z"
              }
            ],
            "connectors": [
              {
                "id": "conn1",
                "fromId": "period1",
                "toId": "period2",
                "type": "defined"
              }
            ]
          }
        JSON
      end

      def render_actions(form)
        div(class: "flex gap-4") do
          form.submit "Save Timeline",
            class: "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer"
          link_to timelines_path do
            Button(variant: :secondary) { "Cancel" }
          end
        end
      end
    end
  end
end
