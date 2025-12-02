class CreateTimelines < ActiveRecord::Migration[8.1]
  def change
    create_table :timelines do |t|
      t.string :name, null: false
      t.text :description
      t.jsonb :timeline_data, null: false, default: { events: [], periods: [], connectors: [] }

      t.timestamps
    end

    add_index :timelines, :timeline_data, using: :gin
  end
end
