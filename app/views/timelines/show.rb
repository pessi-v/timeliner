# frozen_string_literal: true

module Views
  module Timelines
    class Show < Views::Base
      include Phlex::Rails::Helpers::LinkTo
      include Phlex::Rails::Helpers::Pluralize

      def initialize(timeline:)
        @timeline = timeline
      end

      def view_template
        div(class: "h-dvh flex flex-col px-8 py-8 overflow-hidden") do
          render_header
          render_stats
          render_timeline_viewer
          render_raw_json
        end
      end

      private

      def render_header
        div(class: "flex justify-between items-center mb-6") do
          div do
            Heading(level: 1, class: "mb-2") { @timeline.name }
            if @timeline.description.present?
              Text(size: "4", class: "text-muted-foreground") { @timeline.description }
            end
          end

          div(class: "flex gap-3") do
            link_to edit_timeline_path(@timeline) do
              Button(variant: :primary) { "Edit" }
            end
            link_to timelines_path do
              Button(variant: :primary) { "Index" }
            end
          end
        end
      end

      def render_stats
        div(class: "flex gap-2 mb-6") do
          Badge(variant: :primary) { pluralize(@timeline.events.count, "event") }
          Badge(variant: :primary) { pluralize(@timeline.periods.count, "period") }
          Badge(variant: :primary) { pluralize(@timeline.connectors.count, "connector") }
        end
      end

      def render_timeline_viewer
        div(class: "flex-1 min-h-0 mb-4") do
          Card(class: "h-full") do
            CardContent(class: "pt-6 h-full flex flex-col") do
              div(
                id: "timeline_canvas",
                data_controller: "timeline",
                data_timeline_data_value: @timeline.timeline_data.to_json,
                class: "w-full flex-1 min-h-0"
              )
            end
          end
        end
      end

      def render_raw_json
        Collapsible do
          CollapsibleTrigger do
            Card(class: "cursor-pointer hover:bg-accent") do
              CardHeader do
                CardTitle(class: "text-base") { "View Raw JSON Data" }
              end
            end
          end
          CollapsibleContent do
            Card(class: "mt-2") do
              CardContent(class: "pt-6") do
                Codeblock(JSON.pretty_generate(@timeline.timeline_data), syntax: :json)
              end
            end
          end
        end
      end
    end
  end
end
