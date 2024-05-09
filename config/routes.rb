Rails.application.routes.draw do
  post '/login', to: 'authentication#login'
  resources :users

  post '/verify_token', to: 'authentication#verify_token'
  post '/getuser', to: 'authentication#get_user'
  post '/signup', to: 'authentication#create'

  post '/save_web_data', to: 'webdata#save_data'

  get '/get_web_data_by_id', to: 'webdata#get_web_data_by_id'
  get '/get_all_web_data', to: 'webdata#get_all_data'

  resources :web_data, only: [:index]
end
