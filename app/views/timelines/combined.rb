# frozen_string_literal: true

module Views
  module Timelines
    class Combined < Views::Base
      include Phlex::Rails::Helpers::LinkTo
      include Phlex::Rails::Helpers::Pluralize

      def initialize(timeline_data:, name:, description:, timelines:)
        @timeline_data = timeline_data
        @name = name
        @description = description
        @timelines = timelines
      end

      def view_template
        div(class: "max-w-7xl mx-auto px-4 sm:px-6 lg:w-full px-8 py-8") do
          render_header
          render_source_timelines
          render_stats
          render_timeline_viewer
          render_raw_json
        end
      end

      private

      def render_header
        div(class: "flex justify-between items-center mb-6") do
          div do
            Heading(level: 1, class: "mb-2") { @name }
            Text(size: "4", class: "text-muted-foreground") { @description }
          end

          div(class: "flex gap-3") do
            link_to timelines_path do
              Button(variant: :primary) { "Back to Index" }
            end
          end
        end
      end

      def render_source_timelines
        Card(class: "mb-6") do
          CardHeader do
            CardTitle(class: "text-base") { "Source Timelines" }
          end
          CardContent do
            div(class: "flex flex-wrap gap-2") do
              @timelines.each do |timeline|
                link_to timeline_path(timeline) do
                  Badge(variant: :secondary) do
                    plain "#{timeline.name} (ID: #{timeline.id})"
                  end
                end
              end
            end
          end
        end
      end

      def render_stats
        div(class: "flex gap-2 mb-6") do
          Badge(variant: :primary) { pluralize(events_count, "event") }
          Badge(variant: :primary) { pluralize(periods_count, "period") }
          Badge(variant: :primary) { pluralize(connectors_count, "connector") }
        end
      end

      def render_timeline_viewer
        Card(class: "mb-8") do
          CardContent(class: "pt-6") do
            div(
              data_controller: "timeline",
              data_timeline_data_value: @timeline_data.to_json,
              class: "w-full"
            )
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
                Codeblock(JSON.pretty_generate(@timeline_data), syntax: :json)
              end
            end
          end
        end
      end

      def events_count
        @timeline_data["events"]&.count || 0
      end

      def periods_count
        @timeline_data["periods"]&.count || 0
      end

      def connectors_count
        @timeline_data["connectors"]&.count || 0
      end
    end
  end
end
