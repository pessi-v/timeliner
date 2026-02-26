class TimelinesController < ApplicationController
  before_action :set_timeline, only: [ :show, :edit, :update, :destroy ]
  skip_before_action :require_authentication, only: [ :index, :show ]

  def index
    if authenticated?
      my_timelines = Current.user.timelines.order(created_at: :desc)
      public_timelines = Timeline.where(public: true).where.not(user: Current.user).order(created_at: :desc)
    else
      my_timelines = Timeline.none
      public_timelines = Timeline.where(public: true).order(created_at: :desc)
    end
    render Views::Timelines::Index.new(my_timelines: my_timelines, public_timelines: public_timelines)
  end

  def show
    render Views::Timelines::Show.new(timeline: @timeline)
  end

  def combine
    timeline_ids = params[:ids] || []

    if timeline_ids.empty?
      redirect_to timelines_path, alert: "Please select at least one timeline to combine."
      return
    end

    @timelines = Timeline.where(id: timeline_ids)

    if @timelines.empty?
      redirect_to timelines_path, alert: "No valid timelines found."
      return
    end

    combiner = TimelineCombiner.new(@timelines)
    @combined_timeline_data = combiner.combine
    @combined_name = combiner.combined_name
    @combined_description = combiner.combined_description

    render Views::Timelines::Combined.new(
      timeline_data: @combined_timeline_data,
      name: @combined_name,
      description: @combined_description,
      timelines: @timelines
    )
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
    permitted = params.expect(timeline: [ :name, :description, :public, :timeline_data ])

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
