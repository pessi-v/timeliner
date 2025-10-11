class AddTimezoneToEvents < ActiveRecord::Migration[8.0]
  def change
    add_column :events, :timezone, :string, default: "UTC"
  end
end
