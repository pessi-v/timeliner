class TimelinesController < ApplicationController
  def index
    @timelines = Timeline.includes(:events).all
  end

  def show
    @timeline = Timeline.includes(:events).find(params[:id])
  end

  def new
    @timeline = Timeline.new
  end

  def create
    @timeline = Timeline.new(timeline_params)
    
    if @timeline.save
      redirect_to @timeline, notice: "Timeline created successfully."
    else
      render :new, status: :unprocessable_entity
    end
  end

  private

  def timeline_params
    params.require(:timeline).permit(:name, :description, :color)
  end
end
