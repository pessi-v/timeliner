class AddUserRefToTimelines < ActiveRecord::Migration[8.1]
  def up
    add_reference :timelines, :user, foreign_key: true
    add_column :timelines, :public, :boolean, default: true

    # Timelines may predate the users table: claim them for the oldest user,
    # creating a placeholder account if no user exists yet
    owner_id = select_value("SELECT MIN(id) FROM users")
    if owner_id.nil? && select_value("SELECT COUNT(*) FROM timelines").to_i.positive?
      digest = BCrypt::Password.create(SecureRandom.hex(16))
      owner_id = select_value(<<~SQL)
        INSERT INTO users (email_address, password_digest, created_at, updated_at)
        VALUES ('placeholder@example.com', '#{digest}', NOW(), NOW())
        RETURNING id
      SQL
      say "Created placeholder user 'placeholder@example.com' (id #{owner_id}) to own existing timelines — reassign or set a password via the console"
    end
    execute("UPDATE timelines SET user_id = #{owner_id.to_i} WHERE user_id IS NULL") if owner_id

    change_column_null :timelines, :user_id, false
  end

  def down
    remove_column :timelines, :public
    remove_reference :timelines, :user
  end
end
