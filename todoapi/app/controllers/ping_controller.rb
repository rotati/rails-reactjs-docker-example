class PingController < ApplicationController
  def pong
    render json: {reply: 'pong', environment: ENV['RAILS_ENV']}
  end
end