class CreateTimelines < ActiveRecord::Migration[8.0]
  def change
    create_table :timelines do |t|
      t.string :name, null: false
      t.text :description
      t.string :color, default: "#3b82f6"

      t.timestamps
    end
  end
end
