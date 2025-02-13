class CreateTimelines < ActiveRecord::Migration[8.0]
  def change
    create_table :timelines do |t|
      t.string :title
      t.jsonb :content, null: false, default: {}

      t.timestamps
    end
  end
end
