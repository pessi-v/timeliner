class RegistrationsController < ApplicationController
  allow_unauthenticated_access only: %i[new create]

  def new
    render Views::Registrations::New.new
  end

  def create
    user = User.new(params.permit(:email_address, :password, :password_confirmation))

    if user.save
      start_new_session_for user
      redirect_to root_path, notice: "Welcome! Your account has been created."
    else
      redirect_to new_registration_path, alert: user.errors.full_messages.to_sentence
    end
  end
end
