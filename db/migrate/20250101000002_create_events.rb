class CreateEvents < ActiveRecord::Migration[8.0]
  def change
    create_table :events do |t|
      t.string :title, null: false
      t.text :description
      t.datetime :start_time, null: false
      t.datetime :end_time
      t.string :event_type, null: false, default: "point"
      t.string :color

      t.timestamps
    end

    add_index :events, :start_time
    add_index :events, :end_time
    add_index :events, :event_type
  end
end
