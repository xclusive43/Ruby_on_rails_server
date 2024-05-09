# db/migrate/20240509232346_create_web_data.rb
class CreateWebData < ActiveRecord::Migration[6.1]
  def change
    create_table :web_data, id: false do |t|
      t.bigint :id, auto_increment: true, primary_key: true
      t.string :url
      t.json :time

      t.timestamps
    end
  end
end
