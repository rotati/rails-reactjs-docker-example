require 'test_helper'

class PingControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get ping_show_url
    assert_response :success
  end

end
