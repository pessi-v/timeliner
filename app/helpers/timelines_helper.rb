module TimelinesHelper
  def format_timestamp_simple(seconds)
    return "" unless seconds
    
    years = seconds / (365.25 * 24 * 3600)
    
    if years < -1_000_000
      "#{(years.abs / 1_000_000.0).round(1)}M years ago"
    elsif years < -1000
      "#{years.abs.round} years ago"
    elsif years < 1000
      "Year #{years.round}"
    else
      datetime = Event::EPOCH.to_time + seconds
      datetime.strftime('%Y-%m-%d')
    end
  end
end
