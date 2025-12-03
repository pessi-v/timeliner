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
                  Badge(variant: :primary) { pluralize(timeline.events.count, "event") }
                  Badge(variant: :primary) { pluralize(timeline.periods.count, "period") }
                  Badge(variant: :primary) { pluralize(timeline.connectors.count, "connector") }
                end
              end

              div(class: "flex gap-2 ml-4") do
                link_to edit_timeline_path(timeline) do
                  Button(variant: :secondary, size: :sm) { "Edit" }
                end
                link_to(timeline_path(timeline), data: { turbo_method: :delete, turbo_confirm: "Are you sure?" }) do
                  Button(variant: :primary, size: :sm) { "Delete" }
                end
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
