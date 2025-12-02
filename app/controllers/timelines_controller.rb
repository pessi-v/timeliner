class TimelinesController < ApplicationController
  before_action :set_timeline, only: [ :show, :edit, :update, :destroy ]

  def index
    timelines = Timeline.all.order(created_at: :desc)
    render Views::Timelines::Index.new(timelines: timelines)
  end

  def show
    render Views::Timelines::Show.new(timeline: @timeline)
  end

  def new
    timeline = Timeline.new
    render Views::Timelines::New.new(timeline: timeline)
  end

  def create
    @timeline = Timeline.new(timeline_params)

    if @timeline.save
      redirect_to @timeline, notice: "Timeline was successfully created."
    else
      render Views::Timelines::New.new(timeline: @timeline), status: :unprocessable_entity
    end
  end

  def edit
    render Views::Timelines::Edit.new(timeline: @timeline)
  end

  def update
    if @timeline.update(timeline_params)
      redirect_to @timeline, notice: "Timeline was successfully updated."
    else
      render Views::Timelines::Edit.new(timeline: @timeline), status: :unprocessable_entity
    end
  end

  def destroy
    @timeline.destroy
    redirect_to timelines_url, notice: "Timeline was successfully destroyed."
  end

  private

  def set_timeline
    @timeline = Timeline.find(params.expect(:id))
  end

  def timeline_params
    permitted = params.expect(timeline: [ :name, :description, :timeline_data ])

    # Parse timeline_data if it's a string
    if permitted[:timeline_data].is_a?(String)
      begin
        permitted[:timeline_data] = JSON.parse(permitted[:timeline_data])
      rescue JSON::ParserError => e
        # Let the model validation handle invalid JSON
        permitted[:timeline_data] = nil
      end
    end

    permitted
  end
end
