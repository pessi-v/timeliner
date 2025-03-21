class HomeController < ApplicationController
  def index
  end

  def frontpage
    @new_timelines = Timeline.last(10)
    @user_timelines = Timeline.where(user_id: Current.user.id).last(10)
  end
end
