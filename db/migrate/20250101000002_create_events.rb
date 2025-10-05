class CreateEvents < ActiveRecord::Migration[8.0]
  def change
    create_table :events do |t|
      t.string :title, null: false
      t.text :description
      # Using bigint to support extreme date ranges (dinosaurs to far future)
      # Stores seconds from epoch (year 0)
      t.bigint :start_time, null: false
      t.bigint :end_time
      t.string :event_type, null: false, default: "point"
      t.string :color

      t.timestamps
    end

    add_index :events, :start_time
    add_index :events, :end_time
    add_index :events, :event_type
  end
end
