class WebdataController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :authenticate_user!

  def save_data
    # Parse request body data
    data = JSON.parse(request.body.read)

    # Find existing or initialize a new WebData record
    web_data = WebData.find_or_initialize_by(id: data['id'])

    p web_data.attributes
    # Update attributes with the parsed data
    web_data.attributes = data

    if web_data.save
      status = web_data.persisted? ? :ok : :created
      render json: { message: 'Data saved successfully', status: status }, status: status
    else
      render json: { error: web_data.errors.full_messages }, status: :unprocessable_entity
    end
  end


  def get_all_data
    # Save the data to MySQL
   web_data = WebData.all
   total_web_data = WebData.count

    render json: { data: web_data, total: total_web_data }
  end

  def get_web_data_by_id
    web_data = WebData.find_by(id:params[:id])
    if web_data
      render json: { message: 'Data fetched', data: web_data } , status: :ok
    else
      render json: {error: web_data.errors.full_messages}, status: :RecordNotFound
    end
  end

  def index
    @web_data = WebData.all
    render json: @web_data
  end

  private

  def authenticate_user!
    unless current_user
      render json: { message: 'Invalid User' ,  alert: "Please sign in to access this page."}, status: :unauthorized
      # redirect_to "/", alert: "Please sign in to access this page."
    end
  end

  def current_user
    token = request.headers['Authorization']&.split(' ')&.first
    if token
      begin
        decode_token = JWT.decode(token, 'root@123', true, algorithm: 'HS256')
        user = User.find(decode_token[0]['user_id'])
        @current_user ||= user
      rescue JWT::DecodeError, ActiveRecord::RecordNotFound
        @current_user ||= false
      end
    else
      @current_user ||= false
    end
  end
end
