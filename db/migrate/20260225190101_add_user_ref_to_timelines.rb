class AddUserRefToTimelines < ActiveRecord::Migration[8.1]
  def change
    add_reference :timelines, :user, null: true, foreign_key: true
  end
end
