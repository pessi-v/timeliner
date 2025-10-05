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

# NEW: Create a timeline with many overlapping events - WWII Major Battles
battles_timeline = Timeline.create!(
  name: "World War II - Major Concurrent Battles",
  description: "Overlapping military operations during World War II",
  color: "#991b1b"
)

# Create overlapping battles
battle_britain = Event.create!(
  title: "Battle of Britain",
  description: "German air campaign against the UK",
  start_time: DateTime.new(1940, 7, 10),
  end_time: DateTime.new(1940, 10, 31),
  event_type: "range",
  color: "#dc2626"
)

battle_atlantic = Event.create!(
  title: "Battle of the Atlantic",
  description: "Longest continuous military campaign in WWII",
  start_time: DateTime.new(1939, 9, 3),
  end_time: DateTime.new(1945, 5, 8),
  event_type: "range",
  color: "#1e40af"
)

siege_leningrad = Event.create!(
  title: "Siege of Leningrad",
  description: "872-day siege by German and Finnish forces",
  start_time: DateTime.new(1941, 9, 8),
  end_time: DateTime.new(1944, 1, 27),
  event_type: "range",
  color: "#7c2d12"
)

battle_moscow = Event.create!(
  title: "Battle of Moscow",
  description: "German offensive against Moscow",
  start_time: DateTime.new(1941, 10, 2),
  end_time: DateTime.new(1942, 1, 7),
  event_type: "range",
  color: "#dc2626"
)

battle_stalingrad = Event.create!(
  title: "Battle of Stalingrad",
  description: "Major battle on Eastern Front",
  start_time: DateTime.new(1942, 8, 23),
  end_time: DateTime.new(1943, 2, 2),
  event_type: "range",
  color: "#991b1b"
)

el_alamein = Event.create!(
  title: "Second Battle of El Alamein",
  description: "Turning point in North Africa",
  start_time: DateTime.new(1942, 10, 23),
  end_time: DateTime.new(1942, 11, 11),
  event_type: "range",
  color: "#d97706"
)

guadalcanal = Event.create!(
  title: "Battle of Guadalcanal",
  description: "First major Allied offensive in Pacific",
  start_time: DateTime.new(1942, 8, 7),
  end_time: DateTime.new(1943, 2, 9),
  event_type: "range",
  color: "#059669"
)

kursk = Event.create!(
  title: "Battle of Kursk",
  description: "Largest tank battle in history",
  start_time: DateTime.new(1943, 7, 5),
  end_time: DateTime.new(1943, 8, 23),
  event_type: "range",
  color: "#dc2626"
)

normandy = Event.create!(
  title: "Battle of Normandy",
  description: "Allied invasion of Normandy",
  start_time: DateTime.new(1944, 6, 6),
  end_time: DateTime.new(1944, 8, 25),
  event_type: "range",
  color: "#3b82f6"
)

bulge = Event.create!(
  title: "Battle of the Bulge",
  description: "Last major German offensive",
  start_time: DateTime.new(1944, 12, 16),
  end_time: DateTime.new(1945, 1, 25),
  event_type: "range",
  color: "#dc2626"
)

battles_timeline.events << [
  battle_britain, battle_atlantic, siege_leningrad, battle_moscow,
  battle_stalingrad, el_alamein, guadalcanal, kursk, normandy, bulge
]

# NEW: Create a timeline with overlapping events at minute-level granularity
# A busy hospital emergency room on a single day
hospital_timeline = Timeline.create!(
  name: "Emergency Room - Busy Friday Night",
  description: "Patient arrivals and treatments overlapping throughout the evening",
  color: "#dc2626"
)

patient1 = Event.create!(
  title: "Patient A: Chest Pain",
  description: "65yo male, cardiac evaluation",
  start_time: DateTime.new(2024, 1, 12, 18, 15),
  end_time: DateTime.new(2024, 1, 12, 21, 45),
  event_type: "range",
  color: "#dc2626"
)

patient2 = Event.create!(
  title: "Patient B: Broken Arm",
  description: "12yo child, skateboard accident",
  start_time: DateTime.new(2024, 1, 12, 18, 30),
  end_time: DateTime.new(2024, 1, 12, 20, 15),
  event_type: "range",
  color: "#2563eb"
)

patient3 = Event.create!(
  title: "Patient C: Allergic Reaction",
  description: "28yo female, severe food allergy",
  start_time: DateTime.new(2024, 1, 12, 18, 45),
  end_time: DateTime.new(2024, 1, 12, 19, 30),
  event_type: "range",
  color: "#dc2626"
)

patient4 = Event.create!(
  title: "Patient D: Laceration",
  description: "45yo male, deep cut requiring stitches",
  start_time: DateTime.new(2024, 1, 12, 19, 00),
  end_time: DateTime.new(2024, 1, 12, 20, 30),
  event_type: "range",
  color: "#059669"
)

patient5 = Event.create!(
  title: "Patient E: Asthma Attack",
  description: "8yo child, breathing difficulty",
  start_time: DateTime.new(2024, 1, 12, 19, 15),
  end_time: DateTime.new(2024, 1, 12, 21, 00),
  event_type: "range",
  color: "#dc2626"
)

patient6 = Event.create!(
  title: "Patient F: Sprained Ankle",
  description: "22yo athlete, sports injury",
  start_time: DateTime.new(2024, 1, 12, 19, 45),
  end_time: DateTime.new(2024, 1, 12, 21, 15),
  event_type: "range",
  color: "#2563eb"
)

patient7 = Event.create!(
  title: "Patient G: Migraine",
  description: "35yo female, severe headache",
  start_time: DateTime.new(2024, 1, 12, 20, 00),
  end_time: DateTime.new(2024, 1, 12, 21, 30),
  event_type: "range",
  color: "#7c3aed"
)

patient8 = Event.create!(
  title: "Patient H: MVA Minor",
  description: "Motor vehicle accident, minor injuries",
  start_time: DateTime.new(2024, 1, 12, 20, 30),
  end_time: DateTime.new(2024, 1, 12, 22, 45),
  event_type: "range",
  color: "#d97706"
)

hospital_timeline.events << [
  patient1, patient2, patient3, patient4,
  patient5, patient6, patient7, patient8
]

puts "✅ Created #{Timeline.count} timelines with #{Event.count} events"
puts "\nTimelines:"
Timeline.all.each do |timeline|
  component = TimelineComponent.new(timeline: timeline)
  puts "  - #{timeline.name} (#{timeline.events.count} events, #{component.max_lanes} lanes)"
end
