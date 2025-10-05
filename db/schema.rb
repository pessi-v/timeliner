# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_01_01_000003) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "events", force: :cascade do |t|
    t.string "title", null: false
    t.text "description"
    t.datetime "start_time", null: false
    t.datetime "end_time"
    t.string "event_type", default: "point", null: false
    t.string "color"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["end_time"], name: "index_events_on_end_time"
    t.index ["event_type"], name: "index_events_on_event_type"
    t.index ["start_time"], name: "index_events_on_start_time"
  end

  create_table "timeline_events", force: :cascade do |t|
    t.bigint "timeline_id", null: false
    t.bigint "event_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["event_id"], name: "index_timeline_events_on_event_id"
    t.index ["timeline_id", "event_id"], name: "index_timeline_events_on_timeline_id_and_event_id", unique: true
    t.index ["timeline_id"], name: "index_timeline_events_on_timeline_id"
  end

  create_table "timelines", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.string "color", default: "#3b82f6"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "timeline_events", "events"
  add_foreign_key "timeline_events", "timelines"
end
