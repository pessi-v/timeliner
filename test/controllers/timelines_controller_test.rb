require "test_helper"

class TimelinesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @other_user = users(:two)
    @public_timeline = timelines(:public_one)
    @private_timeline = timelines(:private_one)
  end

  # --- index ---

  test "index is accessible without authentication" do
    get timelines_url
    assert_response :success
  end

  # --- show ---

  test "show renders a public timeline for anonymous visitors" do
    get timeline_url(@public_timeline)
    assert_response :success
  end

  test "show hides private timelines from anonymous visitors" do
    get timeline_url(@private_timeline)
    assert_response :not_found
  end

  test "show hides private timelines from other users" do
    sign_in_as(@other_user)
    get timeline_url(@private_timeline)
    assert_response :not_found
  end

  test "show renders a private timeline for its owner" do
    sign_in_as(@user)
    get timeline_url(@private_timeline)
    assert_response :success
  end

  # --- new / create ---

  test "new requires authentication" do
    get new_timeline_url
    assert_redirected_to new_session_url
  end

  test "create requires authentication" do
    assert_no_difference -> { Timeline.count } do
      post timelines_url, params: { timeline: { name: "Nope" } }
    end
    assert_redirected_to new_session_url
  end

  test "create assigns the timeline to the current user" do
    sign_in_as(@user)
    assert_difference -> { @user.timelines.count }, 1 do
      post timelines_url, params: {
        timeline: {
          name: "Bronze Age",
          description: "A new timeline",
          public: false,
          timeline_data: { events: [], periods: [], connectors: [] }.to_json
        }
      }
    end
    timeline = Timeline.find_by!(name: "Bronze Age")
    assert_equal @user, timeline.user
    assert_redirected_to timeline_url(timeline)
  end

  # --- edit / update / destroy ---

  test "edit is not available to non-owners" do
    sign_in_as(@other_user)
    get edit_timeline_url(@public_timeline)
    assert_response :not_found
  end

  test "update is not available to non-owners" do
    sign_in_as(@other_user)
    patch timeline_url(@public_timeline), params: { timeline: { name: "Hijacked" } }
    assert_response :not_found
    assert_equal "Roman Empire", @public_timeline.reload.name
  end

  test "update works for the owner" do
    sign_in_as(@user)
    patch timeline_url(@private_timeline), params: { timeline: { name: "Renamed Plans" } }
    assert_redirected_to timeline_url(@private_timeline)
    assert_equal "Renamed Plans", @private_timeline.reload.name
  end

  test "destroy is not available to non-owners" do
    sign_in_as(@other_user)
    assert_no_difference -> { Timeline.count } do
      delete timeline_url(@private_timeline)
    end
    assert_response :not_found
  end

  test "destroy works for the owner" do
    sign_in_as(@user)
    assert_difference -> { Timeline.count }, -1 do
      delete timeline_url(@private_timeline)
    end
    assert_redirected_to timelines_url
  end

  # --- combine ---

  test "combine excludes private timelines from anonymous visitors" do
    get combine_timelines_url(ids: [ @public_timeline.id, @private_timeline.id ])
    assert_response :success
    assert_no_match @private_timeline.name, response.body
    assert_match @public_timeline.name, response.body
  end

  test "combine includes private timelines for their owner" do
    sign_in_as(@user)
    get combine_timelines_url(ids: [ @public_timeline.id, @private_timeline.id ])
    assert_response :success
    assert_match @private_timeline.name, response.body
  end
end
