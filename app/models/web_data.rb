# app/models/web_data.rb
class WebData < ApplicationRecord
  # Add any validations or associations here

  # For example:
  validates :url, presence: true
  validates :id, uniqueness: true
end
