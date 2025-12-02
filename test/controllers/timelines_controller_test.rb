require "test_helper"

class TimelinesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get timelines_index_url
    assert_response :success
  end

  test "should get show" do
    get timelines_show_url
    assert_response :success
  end

  test "should get new" do
    get timelines_new_url
    assert_response :success
  end

  test "should get create" do
    get timelines_create_url
    assert_response :success
  end

  test "should get edit" do
    get timelines_edit_url
    assert_response :success
  end

  test "should get update" do
    get timelines_update_url
    assert_response :success
  end
end
