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

  def edit
    @timeline = Timeline.includes(:events).find(params[:id])
  end

  def update
    @timeline = Timeline.find(params[:id])

    if @timeline.update(timeline_params)
      redirect_to @timeline, notice: "Timeline updated successfully."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def merge_form
    @timelines = Timeline.all
  end

  def merge
    timeline_ids = params[:timeline_ids].reject(&:blank?)
    
    if timeline_ids.length < 2
      redirect_to merge_form_timelines_path, alert: "Please select at least 2 timelines to merge."
      return
    end

    timelines = Timeline.where(id: timeline_ids).includes(:events)
    
    # Create new merged timeline
    merged_timeline = Timeline.new(
      name: params[:merged_name].presence || "Merged Timeline: #{timelines.map(&:name).join(' + ')}",
      description: params[:merged_description].presence || "Combined timeline from: #{timelines.map(&:name).join(', ')}",
      color: params[:merged_color].presence || timelines.first.color
    )

    if merged_timeline.save
      # Collect all unique events from selected timelines
      all_events = timelines.flat_map(&:events).uniq
      
      # Add all events to the merged timeline
      merged_timeline.events << all_events
      
      redirect_to merged_timeline, notice: "Successfully merged #{timelines.count} timelines with #{all_events.count} events."
    else
      @timelines = Timeline.all
      flash.now[:alert] = "Failed to create merged timeline."
      render :merge_form, status: :unprocessable_entity
    end
  end

  private

  def timeline_params
    params.require(:timeline).permit(
      :name,
      :description,
      :color,
      events_attributes: [:id, :title, :description, :start_time_datetime, :end_time_datetime, :event_type, :_destroy]
    )
  end
end
