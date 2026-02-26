class AddUserRefToTimelines < ActiveRecord::Migration[8.1]
  def change
    add_reference :timelines, :user, null: false, foreign_key: true
    add_column :timelines, :public, :boolean, default: true
  end
end
