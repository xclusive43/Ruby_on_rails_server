# db/migrate/20240509232345_create_users.rb
class CreateUsers < ActiveRecord::Migration[6.1]
  def change
    create_table :users do |t|
      t.string :name
      t.string :email, primary_key: true
      t.string :password_digest
      t.timestamps
    end
  end
end
