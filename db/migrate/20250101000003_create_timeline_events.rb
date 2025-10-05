class CreateTimelineEvents < ActiveRecord::Migration[8.0]
  def change
    create_table :timeline_events do |t|
      t.references :timeline, null: false, foreign_key: true
      t.references :event, null: false, foreign_key: true

      t.timestamps
    end

    add_index :timeline_events, [ :timeline_id, :event_id ], unique: true
  end
end
