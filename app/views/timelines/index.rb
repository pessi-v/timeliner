# frozen_string_literal: true

module Views
  module Timelines
    class Index < Views::Base
      include Phlex::Rails::Helpers::LinkTo
      include Phlex::Rails::Helpers::ButtonTo
      include Phlex::Rails::Helpers::Pluralize

      def initialize(timelines:)
        @timelines = timelines
      end

      def view_template
        div(class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8") do
          render_header

          if @timelines.any?
            render_timeline_list
          else
            render_empty_state
          end
        end
      end

      private

      def render_header
        div(class: "flex justify-between items-center mb-8") do
          Heading(level: 1) { "Timelines" }

          link_to new_timeline_path do
            Button(variant: :primary) { "New Timeline" }
          end
        end
      end

      def render_timeline_list
        div(class: "grid gap-6") do
          @timelines.each do |timeline|
            render_timeline_card(timeline)
          end
        end
      end

      def render_timeline_card(timeline)
        Card do
          CardHeader do
            div(class: "flex justify-between items-start") do
              div(class: "flex-1") do
                CardTitle do
                  Link(href: timeline_path(timeline)) { timeline.name }
                end

                if timeline.description.present?
                  CardDescription { timeline.description }
                end

                div(class: "flex gap-2 mt-3") do
                  Badge(variant: :secondary) { pluralize(timeline.events.count, "event") }
                  Badge(variant: :secondary) { pluralize(timeline.periods.count, "period") }
                  Badge(variant: :secondary) { pluralize(timeline.connectors.count, "connector") }
                end
              end

              div(class: "flex gap-2 ml-4") do
                link_to edit_timeline_path(timeline) do
                  Button(variant: :ghost, size: :sm) { "Edit" }
                end
                button_to "Delete",
                  timeline_path(timeline),
                  method: :delete,
                  data: { turbo_confirm: "Are you sure?" },
                  class: "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-3 text-red-600 hover:text-red-800"
              end
            end
          end
        end
      end

      def render_empty_state
        div(class: "text-center py-12") do
          Text(size: "4", class: "text-muted-foreground mb-4") { "No timelines yet" }
          link_to new_timeline_path do
            Button(variant: :primary) { "Create your first timeline" }
          end
        end
      end
    end
  end
end
