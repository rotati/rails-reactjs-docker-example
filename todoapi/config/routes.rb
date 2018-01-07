Rails.application.routes.draw do
  get 'ping', to: 'ping#pong'
  # get '/patients/:id', to: 'patients#show'

  resources :notes
end