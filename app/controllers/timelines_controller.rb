class TimelinesController < ApplicationController
  before_action :set_timeline, only: %i[ show edit update destroy ]

  # GET /timelines or /timelines.json
  def index
    @timelines = Timeline.all
  end

  # GET /timelines/1 or /timelines/1.json
  def show
  end

  def present
    # binding.pry
    ids = params[:ids].split('+').map(&:to_i)
    @timelines = Timeline.find(ids)
  end

  # GET /timelines/new
  def new
    @timeline = Timeline.new
  end

  # GET /timelines/1/edit
  def edit
  end

  # POST /timelines or /timelines.json
  def create
    # @timeline = Timeline.new(timeline_params)

    # respond_to do |format|
    #   if @timeline.save
    #     format.html { redirect_to @timeline, notice: "Timeline was successfully created." }
    #     format.json { render :show, status: :created, location: @timeline }
    #   else
    #     format.html { render :new, status: :unprocessable_entity }
    #     format.json { render json: @timeline.errors, status: :unprocessable_entity }
    #   end
    # end
    @timeline = Timeline.new(timeline_params)
    # binding.pry
    @timeline.content = JSON.parse(params[:events])
    
    if @timeline.save
      redirect_to @timeline, notice: 'Timeline created successfully.'
    else
      render :new
    end
  end

  # PATCH/PUT /timelines/1 or /timelines/1.json
  def update
    respond_to do |format|
      if @timeline.update(timeline_params)
        format.html { redirect_to @timeline, notice: "Timeline was successfully updated." }
        format.json { render :show, status: :ok, location: @timeline }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @timeline.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /timelines/1 or /timelines/1.json
  def destroy
    @timeline.destroy!

    respond_to do |format|
      format.html { redirect_to timelines_path, status: :see_other, notice: "Timeline was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_timeline
      @timeline = Timeline.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def timeline_params
      params.require(:timeline).permit(:title)
    end
end
