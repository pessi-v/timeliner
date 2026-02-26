# frozen_string_literal: true

module Views
  module Timelines
    class Index < Views::Base
      include Phlex::Rails::Helpers::LinkTo
      include Phlex::Rails::Helpers::ButtonTo
      include Phlex::Rails::Helpers::Pluralize

      def initialize(my_timelines:, public_timelines:)
        @my_timelines = my_timelines
        @public_timelines = public_timelines
      end

      def view_template
        div(
          class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",
          data_controller: "timeline-combiner"
        ) do
          render_header

          if helpers.authenticated?
            render_section("My Timelines", @my_timelines, editable: true)
          end

          render_section("Public Timelines", @public_timelines, editable: false)
        end
      end

      private

      def render_header
        div(class: "flex justify-between items-center mb-8") do
          Heading(level: 1) { "Timelines" }

          div(class: "flex gap-3") do
            if helpers.authenticated?
              link_to session_path, data: { turbo_method: :delete } do
                Button(variant: :secondary) { "Log out" }
              end
            else
              link_to new_registration_path do
                Button(variant: :secondary) { "Sign up" }
              end
              link_to new_session_path do
                Button(variant: :secondary) { "Log in" }
              end
            end

            if @my_timelines.any? || @public_timelines.any?
              Button(
                variant: :secondary,
                data_action: "click->timeline-combiner#combine",
                id: "combine-button"
              ) { "Combine Selected" }
            end

            if helpers.authenticated?
              link_to new_timeline_path do
                Button(variant: :primary) { "New Timeline" }
              end
            end
          end
        end
      end

      def render_section(title, timelines, editable:)
        div(class: "mb-10") do
          Heading(level: 2, class: "mb-4") { title }

          if timelines.any?
            div(class: "grid gap-6") do
              timelines.each do |timeline|
                render_timeline_card(timeline, editable: editable)
              end
            end
          else
            render_empty_state(editable: editable)
          end
        end
      end

      def render_timeline_card(timeline, editable:)
        Card do
          CardHeader do
            div(class: "flex justify-between items-start gap-4") do
              div(class: "flex items-start gap-3 flex-1") do
                div(class: "pt-1") do
                  input(
                    type: "checkbox",
                    class: "h-4 w-4 rounded border-gray-300",
                    data_timeline_combiner_target: "checkbox",
                    value: timeline.id
                  )
                end

                div(class: "flex-1") do
                  link_to(timeline_path(timeline)) do
                    CardTitle { timeline.name }
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
              end

              if editable
                div(class: "flex gap-2") do
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
      end

      def render_empty_state(editable:)
        div(class: "text-center py-8") do
          if editable
            Text(size: "4", class: "text-muted-foreground mb-4") { "You haven't created any timelines yet" }
            link_to new_timeline_path do
              Button(variant: :primary) { "Create your first timeline" }
            end
          else
            Text(size: "4", class: "text-muted-foreground") { "No public timelines available" }
          end
        end
      end
    end
  end
end
