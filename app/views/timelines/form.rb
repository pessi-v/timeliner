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
        # Form(class: "w-2/3 space-y-6", data: { controller: "timeline-form" }, accept_charset: "UTF-8", method: 'post') do
        #   FormField do
        #     FormFieldLabel { "Default error" }
        #     Input(placeholder: "Joel Drapper", required: true, minlength: "3") { "Joel Drapper" }
        #     FormFieldHint()
        #     FormFieldError()
        #   end
        #   Button(type: "submit") { "Save" }
        # end

        form_with(model: @timeline, data: { controller: "timeline-form" }) do |form|
          render_errors if @timeline.errors.any?
          render_name_field(form)
          render_description_field(form)
          render_periods_section
          render_events_section
          render_connectors_section
          render_validation_messages
          render_hidden_json_field(form)
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

      def render_periods_section
        Card(class: "mb-6") do
          CardHeader do
            CardTitle { "Periods" }
            CardDescription { "Add time periods to your timeline" }
          end
          CardContent do
            # Form to add new period
            div(
              class: "space-y-4 p-4 border rounded-md bg-gray-50"
            ) do
              div(class: "grid grid-cols-1 md:grid-cols-2 gap-4") do
                div do
                  label(class: "block text-sm font-medium mb-1") { "Period Name" }
                  input(
                    type: "text",
                    name: "period_name",
                    class: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  )
                end

                div do
                  label(class: "block text-sm font-medium mb-1") { "Info" }
                  textarea(
                    name: "period_info",
                    rows: 2,
                    placeholder: "Additional information about this period",
                    class: "flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  )
                end

                div do
                  label(class: "block text-sm font-medium mb-1") { "Start Time" }
                  input(
                    type: "text",
                    name: "period_start_time_value",
                    placeholder: "e.g., 2000, 2017-11, Nov 2017, Jun 15 2000, 3.11.1988",
                    class: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mb-2"
                  )
                  div(class: "space-y-2") do
                    label(class: "flex items-center space-x-2 cursor-pointer") do
                      input(
                        type: "checkbox",
                        name: "period_start_time_unit",
                        value: "bce",
                        class: "h-4 w-4 rounded border-gray-300",
                        data_action: "change->timeline-form#onUnitCheckboxChange"
                      )
                      span(class: "text-sm") { "BCE" }
                    end
                    label(class: "flex items-center space-x-2 cursor-pointer") do
                      input(
                        type: "checkbox",
                        name: "period_start_time_unit",
                        value: "mya",
                        class: "h-4 w-4 rounded border-gray-300",
                        data_action: "change->timeline-form#onUnitCheckboxChange"
                      )
                      span(class: "text-sm") { "Million years ago" }
                    end
                    label(class: "flex items-center space-x-2 cursor-pointer") do
                      input(
                        type: "checkbox",
                        name: "period_start_time_unit",
                        value: "years-ago",
                        class: "h-4 w-4 rounded border-gray-300",
                        data_action: "change->timeline-form#onUnitCheckboxChange"
                      )
                      span(class: "text-sm") { "Years ago" }
                    end
                  end
                end

                div do
                  label(class: "block text-sm font-medium mb-1") { "End Time" }
                  input(
                    type: "text",
                    name: "period_end_time_value",
                    placeholder: "e.g., 2024, 2024-12, Dec 2024, Jan 1 2025, 15.3.2025",
                    data_timeline_form_target: "endTime",
                    class: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mb-2"
                  )
                  div(class: "space-y-2") do
                    label(class: "flex items-center space-x-2 cursor-pointer") do
                      input(
                        type: "checkbox",
                        name: "period_end_time_unit",
                        value: "bce",
                        class: "h-4 w-4 rounded border-gray-300",
                        data_action: "change->timeline-form#onUnitCheckboxChange"
                      )
                      span(class: "text-sm") { "BCE" }
                    end
                    label(class: "flex items-center space-x-2 cursor-pointer") do
                      input(
                        type: "checkbox",
                        name: "period_end_time_unit",
                        value: "mya",
                        class: "h-4 w-4 rounded border-gray-300",
                        data_action: "change->timeline-form#onUnitCheckboxChange"
                      )
                      span(class: "text-sm") { "Million years ago" }
                    end
                    label(class: "flex items-center space-x-2 cursor-pointer") do
                      input(
                        type: "checkbox",
                        name: "period_end_time_unit",
                        value: "years-ago",
                        class: "h-4 w-4 rounded border-gray-300",
                        data_action: "change->timeline-form#onUnitCheckboxChange"
                      )
                      span(class: "text-sm") { "Years ago" }
                    end
                  end
                end

                div(class: "flex items-center pt-6") do
                  label(class: "flex items-center space-x-2 cursor-pointer") do
                    input(
                      type: "checkbox",
                      name: "period_ongoing",
                      value: "1",
                      data_action: "change->timeline-form#toggleOngoing",
                      class: "rounded border-gray-300"
                    )
                    span(class: "text-sm font-medium") { "Ongoing" }
                  end
                end
              end

              div(class: "flex gap-2") do
                button(
                  type: "button",
                  data_action: "click->timeline-form#addPeriod",
                  data_timeline_form_target: "periodAddButton",
                  class: "inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                ) { "Add Period" }
                button(
                  type: "button",
                  data_action: "click->timeline-form#cancelEditPeriod",
                  data_timeline_form_target: "periodCancelButton",
                  class: "hidden inline-flex items-center justify-center rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2"
                ) { "Cancel" }
              end
            end

            # List of existing periods
            div(
              data_timeline_form_target: "periodsList",
              class: "space-y-2 mb-4"
            )
          end
        end
      end

      def render_events_section
        Card(class: "mb-6") do
          CardHeader do
            CardTitle { "Events" }
            CardDescription { "Add specific events to your timeline" }
          end
          CardContent do
            # Form to add new event
            div(
              class: "space-y-4 p-4 border rounded-md bg-gray-50"
            ) do
              div(class: "grid grid-cols-1 md:grid-cols-2 gap-4") do
                div do
                  label(class: "block text-sm font-medium mb-1") { "Event Name" }
                  input(
                    type: "text",
                    name: "event_name",
                    class: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  )
                end

                div do
                  label(class: "block text-sm font-medium mb-1") { "Info" }
                  textarea(
                    name: "event_info",
                    rows: 2,
                    placeholder: "Additional information about this event",
                    class: "flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  )
                end

                div do
                  label(class: "block text-sm font-medium mb-1") { "Relates to Period" }
                  select(
                    name: "event_relates_to",
                    data_timeline_form_target: "eventRelatesToSelect",
                    class: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  ) do
                    option(value: "") { "None" }
                  end
                end

                div do
                  label(class: "block text-sm font-medium mb-1") { "Time" }
                  input(
                    type: "text",
                    name: "event_time_value",
                    placeholder: "e.g., 2000, 2017-11, Nov 2017, Jun 15 2000, 3.11.1988",
                    class: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mb-2"
                  )
                  div(class: "space-y-2") do
                    label(class: "flex items-center space-x-2 cursor-pointer") do
                      input(
                        type: "checkbox",
                        name: "event_time_unit",
                        value: "bce",
                        class: "h-4 w-4 rounded border-gray-300",
                        data_action: "change->timeline-form#onUnitCheckboxChange"
                      )
                      span(class: "text-sm") { "BCE" }
                    end
                    label(class: "flex items-center space-x-2 cursor-pointer") do
                      input(
                        type: "checkbox",
                        name: "event_time_unit",
                        value: "mya",
                        class: "h-4 w-4 rounded border-gray-300",
                        data_action: "change->timeline-form#onUnitCheckboxChange"
                      )
                      span(class: "text-sm") { "Million years ago" }
                    end
                    label(class: "flex items-center space-x-2 cursor-pointer") do
                      input(
                        type: "checkbox",
                        name: "event_time_unit",
                        value: "years-ago",
                        class: "h-4 w-4 rounded border-gray-300",
                        data_action: "change->timeline-form#onUnitCheckboxChange"
                      )
                      span(class: "text-sm") { "Years ago" }
                    end
                  end
                end
              end

              div(class: "flex gap-2") do
                button(
                  type: "button",
                  data_action: "click->timeline-form#addEvent",
                  data_timeline_form_target: "eventAddButton",
                  class: "inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                ) { "Add Event" }
                button(
                  type: "button",
                  data_action: "click->timeline-form#cancelEditEvent",
                  data_timeline_form_target: "eventCancelButton",
                  class: "hidden inline-flex items-center justify-center rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2"
                ) { "Cancel" }
              end
            end

            # List of existing events
            div(
              data_timeline_form_target: "eventsList",
              class: "space-y-2 mb-4"
            )
          end
        end
      end

      def render_connectors_section
        Card(
          class: "mb-6 hidden",
          data_timeline_form_target: "connectorsSection"
        ) do
          CardHeader do
            CardTitle { "Connectors" }
            CardDescription { "Connect periods to show relationships" }
          end
          CardContent do
            # Form to add new connector
            div(
              class: "space-y-4 p-4 border rounded-md bg-gray-50"
            ) do
              div(class: "grid grid-cols-1 md:grid-cols-2 gap-4") do
                div do
                  label(class: "block text-sm font-medium mb-1") { "From Period" }
                  select(
                    name: "connector_from",
                    class: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  ) do
                    option(value: "") { "Select period..." }
                  end
                end

                div do
                  label(class: "block text-sm font-medium mb-1") { "To Period" }
                  select(
                    name: "connector_to",
                    class: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  ) do
                    option(value: "") { "Select period..." }
                  end
                end

                div(class: "flex items-center pt-6") do
                  label(class: "flex items-center space-x-2 cursor-pointer") do
                    input(
                      type: "checkbox",
                      name: "connector_indirect",
                      value: "1",
                      class: "rounded border-gray-300"
                    )
                    span(class: "text-sm font-medium") { "Indirect Lineage" }
                  end
                end
              end

              div(class: "flex gap-2") do
                button(
                  type: "button",
                  data_action: "click->timeline-form#addConnector",
                  data_timeline_form_target: "connectorAddButton",
                  class: "inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                ) { "Add Connector" }
                button(
                  type: "button",
                  data_action: "click->timeline-form#cancelEditConnector",
                  data_timeline_form_target: "connectorCancelButton",
                  class: "hidden inline-flex items-center justify-center rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2"
                ) { "Cancel" }
              end
            end

            # List of existing connectors
            div(
              data_timeline_form_target: "connectorsList",
              class: "space-y-2 mb-4"
            )
          end
        end
      end

      def render_validation_messages
        div(
          data_timeline_form_target: "validationMessages",
          class: "mb-6"
        )
      end

      def render_hidden_json_field(form)
        form.hidden_field :timeline_data,
          value: timeline_data_value,
          data: { timeline_form_target: "jsonField" }
      end

      def timeline_data_value
        if @timeline.timeline_data.present?
          JSON.generate(@timeline.timeline_data)
        else
          JSON.generate({ events: [], periods: [], connectors: [] })
        end
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
