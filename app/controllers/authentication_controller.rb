class AuthenticationController < ApplicationController
  skip_before_action :verify_authenticity_token
  def login
    user = User.find_by(email:params[:email])
    if user && user.authenticate(params[:password])
      token =encode_token({user_id: user.id})
      render json: {token: token, name: user.name, email: user.email}
    else
      render json: {error: 'Invalid email or password'}, status: :unauthorized
    end
  end

  def create
    user = User.new(user_params)
    if user.save
      token = encode_token({user_id: user.id})
      render json: {token: token}, status: :created
    else
      render json: {error: user.errors.full_messages}, status: :unprocessable_entity
    end
  end

  def get_user
    token = request.headers['Authorization']&.split(' ')&.first
    if token
      begin
        decode_token = JWT.decode(token, 'root@123', true, algorithm: 'HS256')
        user = User.find(decode_token[0]['user_id'])

        render json: { tokenStatus: 'Active', data: user }
      rescue JWT::DecodeError, ActiveRecord::RecordNotFound
        render json: { tokenStatus: 'InActive', error: 'Invalid token' }, status: :unauthorized
      end
    else
      render json: { error: 'Token not provided' }, status: :bad_request
    end
  end

  def verify_token
    token = request.headers['Authorization']&.split(' ')&.first
    if token
      begin
        decode_token = JWT.decode(token, 'root@123', true, algorithm: 'HS256')
        user = User.find(decode_token[0]['user_id'])

        render json: { tokenStatus: 'Active', username: user.name, email: user.email }
      rescue JWT::DecodeError, ActiveRecord::RecordNotFound
        render json: { tokenStatus: 'InActive', error: 'Invalid token' }, status: :unauthorized
      end
    else
      render json: { error: 'Token not provided' }, status: :bad_request
    end
  end


  def user_params
    params.require(:user).permit(:name, :email, :password)
  end

    private
    def encode_token(payload)
      JWT.encode(payload, 'root@123',  'HS256')
    end
end
