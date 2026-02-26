# frozen_string_literal: true

module Views
  module Registrations
    class New < Views::Base
      include Phlex::Rails::Helpers::FormWith
      include Phlex::Rails::Helpers::LinkTo

      def view_template
        div(class: "mx-auto md:w-2/3 w-full") do
          render_flash
          h1(class: "font-bold text-4xl") { "Sign up" }
          form_with(url: registration_url) do |form|
            render_email_field(form)
            render_password_field(form)
            render_password_confirmation_field(form)
            render_actions(form)
          end
        end
      end

      private

      def render_flash
        if (alert = helpers.flash[:alert])
          p(class: "py-2 px-3 bg-red-50 mb-5 text-red-500 font-medium rounded-lg inline-block", id: "alert") { alert }
        end
      end

      def render_email_field(form)
        div(class: "my-5") do
          form.email_field :email_address,
            required: true,
            autofocus: true,
            autocomplete: "username",
            placeholder: "Enter your email address",
            class: "block shadow-sm rounded-md border border-gray-400 focus:outline-blue-600 px-3 py-2 mt-2 w-full"
        end
      end

      def render_password_field(form)
        div(class: "my-5") do
          div(class: "relative mt-2", data_controller: "password-visibility") do
            form.password_field :password,
              required: true,
              autocomplete: "new-password",
              placeholder: "Enter your password",
              maxlength: 72,
              class: "block shadow-sm rounded-md border border-gray-400 focus:outline-blue-600 px-3 py-2 pr-16 w-full",
              data: { password_visibility_target: "input" }
            button(
              type: "button",
              class: "absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700",
              data_password_visibility_target: "button",
              data_action: "click->password-visibility#toggle"
            ) { "Show" }
          end
        end
      end

      def render_password_confirmation_field(form)
        div(class: "my-5") do
          div(class: "relative mt-2", data_controller: "password-visibility") do
            form.password_field :password_confirmation,
              required: true,
              autocomplete: "new-password",
              placeholder: "Confirm your password",
              maxlength: 72,
              class: "block shadow-sm rounded-md border border-gray-400 focus:outline-blue-600 px-3 py-2 pr-16 w-full",
              data: { password_visibility_target: "input" }
            button(
              type: "button",
              class: "absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700",
              data_password_visibility_target: "button",
              data_action: "click->password-visibility#toggle"
            ) { "Show" }
          end
        end
      end

      def render_actions(form)
        div(class: "col-span-6 sm:flex sm:items-center sm:gap-4") do
          div(class: "inline") do
            form.submit "Sign up",
              class: "w-full sm:w-auto text-center rounded-md px-3.5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white inline-block font-medium cursor-pointer"
          end
          div(class: "mt-4 text-sm text-gray-500 sm:mt-0") do
            plain "Already have an account? "
            link_to "Sign in", new_session_path, class: "text-gray-700 underline hover:no-underline"
          end
        end
      end
    end
  end
end
