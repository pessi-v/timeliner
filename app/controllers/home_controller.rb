class HomeController < ApplicationController
  skip_before_action :authenticate, only: [:index]
  before_action :set_current_session, only: [:index]

  def index
    if Current.user
      render :index
    else
      @new_timelines = Timeline.last(10)
      render :frontpage
    end
  end

  def frontpage
    @new_timelines = Timeline.last(10)
    @user_timelines = Timeline.where(user_id: Current.user.id).last(10)
  end

  private

  def set_current_session
    Current.session = if session_record = Session.find_by_id(cookies.signed[:session_token])
      session_record
    else
      nil
    end
  end
end
