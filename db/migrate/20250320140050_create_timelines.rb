class CreateTimelines < ActiveRecord::Migration[8.0]
  def change
    create_table :timelines do |t|
      t.timestamps
      t.string :title
      t.string :info # less than 255 characters
      t.jsonb :events, null: false, default: {}
      t.references :user, null: false, foreign_key: true
    end
  end
end
