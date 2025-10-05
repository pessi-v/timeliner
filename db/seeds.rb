# Clear existing data
TimelineEvent.destroy_all
Event.destroy_all
Timeline.destroy_all

# Create a timeline about World War II
ww2_timeline = Timeline.create!(
  name: "World War II",
  description: "Major events of the Second World War",
  color: "#dc2626"
)

# Add events to WW2 timeline
invasion_poland = Event.create!(
  title: "Invasion of Poland",
  description: "Germany invades Poland, marking the start of WWII in Europe",
  start_time: DateTime.new(1939, 9, 1),
  end_time: DateTime.new(1939, 10, 6),
  event_type: "range",
  color: "#dc2626"
)

pearl_harbor = Event.create!(
  title: "Pearl Harbor Attack",
  description: "Japanese surprise attack on Pearl Harbor",
  start_time: DateTime.new(1941, 12, 7, 7, 48),
  event_type: "point",
  color: "#dc2626"
)

d_day = Event.create!(
  title: "D-Day Invasion",
  description: "Allied invasion of Normandy",
  start_time: DateTime.new(1944, 6, 6),
  end_time: DateTime.new(1944, 6, 30),
  event_type: "range",
  color: "#dc2626"
)

hiroshima = Event.create!(
  title: "Hiroshima Bombing",
  description: "Atomic bomb dropped on Hiroshima",
  start_time: DateTime.new(1945, 8, 6, 8, 15),
  event_type: "point",
  color: "#dc2626"
)

ve_day = Event.create!(
  title: "VE Day",
  description: "Victory in Europe Day - Nazi Germany surrenders",
  start_time: DateTime.new(1945, 5, 8),
  event_type: "point",
  color: "#22c55e"
)

vj_day = Event.create!(
  title: "VJ Day",
  description: "Victory over Japan Day - Japan surrenders",
  start_time: DateTime.new(1945, 8, 15),
  event_type: "point",
  color: "#22c55e"
)

ww2_timeline.events << [invasion_poland, pearl_harbor, d_day, hiroshima, ve_day, vj_day]

# Create a timeline about 9/11 attacks (showing hour/minute granularity)
nine_eleven = Timeline.create!(
  name: "September 11, 2001 Attacks",
  description: "Timeline of the terrorist attacks on September 11, 2001",
  color: "#1e40af"
)

first_plane = Event.create!(
  title: "First Plane Hits North Tower",
  description: "American Airlines Flight 11 crashes into North Tower",
  start_time: DateTime.new(2001, 9, 11, 8, 46),
  event_type: "point",
  color: "#dc2626"
)

second_plane = Event.create!(
  title: "Second Plane Hits South Tower",
  description: "United Airlines Flight 175 crashes into South Tower",
  start_time: DateTime.new(2001, 9, 11, 9, 3),
  event_type: "point",
  color: "#dc2626"
)

pentagon = Event.create!(
  title: "Pentagon Attack",
  description: "American Airlines Flight 77 crashes into the Pentagon",
  start_time: DateTime.new(2001, 9, 11, 9, 37),
  event_type: "point",
  color: "#dc2626"
)

south_collapse = Event.create!(
  title: "South Tower Collapses",
  description: "The South Tower of the World Trade Center collapses",
  start_time: DateTime.new(2001, 9, 11, 9, 59),
  event_type: "point",
  color: "#7c2d12"
)

north_collapse = Event.create!(
  title: "North Tower Collapses",
  description: "The North Tower of the World Trade Center collapses",
  start_time: DateTime.new(2001, 9, 11, 10, 28),
  event_type: "point",
  color: "#7c2d12"
)

nine_eleven.events << [first_plane, second_plane, pentagon, south_collapse, north_collapse]

# Create a timeline about Ancient Persia (showing year-level granularity and BC dates)
persia_timeline = Timeline.create!(
  name: "The Sassanid Empire",
  description: "Major periods and events of the Sassanid Persian Empire",
  color: "#7c3aed"
)

founding = Event.create!(
  title: "Founding of Sassanid Empire",
  description: "Ardashir I overthrows the Parthian Empire",
  start_time: DateTime.new(224, 1, 1),
  event_type: "point",
  color: "#7c3aed"
)

shapur_reign = Event.create!(
  title: "Reign of Shapur I",
  description: "Golden age under Shapur I, including victory over Rome",
  start_time: DateTime.new(240, 1, 1),
  end_time: DateTime.new(270, 1, 1),
  event_type: "range",
  color: "#7c3aed"
)

khosrow_reign = Event.create!(
  title: "Reign of Khosrow I",
  description: "Peak of Sassanid power and culture",
  start_time: DateTime.new(531, 1, 1),
  end_time: DateTime.new(579, 1, 1),
  event_type: "range",
  color: "#7c3aed"
)

arab_conquest = Event.create!(
  title: "Arab Conquest",
  description: "Fall of the Sassanid Empire to Arab Muslims",
  start_time: DateTime.new(633, 1, 1),
  end_time: DateTime.new(651, 1, 1),
  event_type: "range",
  color: "#dc2626"
)

persia_timeline.events << [founding, shapur_reign, khosrow_reign, arab_conquest]

# Create a timeline with an ongoing event
tech_timeline = Timeline.create!(
  name: "Modern Tech Era",
  description: "Key moments in modern technology",
  color: "#0891b2"
)

iphone_launch = Event.create!(
  title: "iPhone Launch",
  description: "Apple launches the first iPhone",
  start_time: DateTime.new(2007, 6, 29),
  event_type: "point",
  color: "#0891b2"
)

ai_revolution = Event.create!(
  title: "AI Revolution",
  description: "The ongoing revolution in artificial intelligence",
  start_time: DateTime.new(2022, 11, 30),
  event_type: "ongoing",
  color: "#0891b2"
)

tech_timeline.events << [iphone_launch, ai_revolution]

puts "✅ Created #{Timeline.count} timelines with #{Event.count} events"
puts "Timelines:"
Timeline.all.each do |timeline|
  puts "  - #{timeline.name} (#{timeline.events.count} events)"
end
