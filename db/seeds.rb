# Clear existing data
TimelineEvent.destroy_all
Event.destroy_all
Timeline.destroy_all

# Helper method to convert DateTime to seconds from epoch
# Optionally specify timezone to convert from that timezone to UTC
def datetime_seconds(datetime, timezone = "UTC")
  Event.datetime_to_seconds(datetime, timezone)
end

# Helper method to convert years to seconds from epoch
def years_seconds(years)
  (years * 365.25 * 24 * 3600).to_i
end

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
  start_time: datetime_seconds(DateTime.new(1939, 9, 1)),
  end_time: datetime_seconds(DateTime.new(1939, 10, 6)),
  event_type: "range",
  color: "#dc2626"
)

pearl_harbor = Event.create!(
  title: "Pearl Harbor Attack",
  description: "Japanese surprise attack on Pearl Harbor",
  start_time: datetime_seconds(DateTime.new(1941, 12, 7, 7, 48), "Hawaii"),
  event_type: "point",
  color: "#dc2626",
  timezone: "Hawaii"
)

d_day = Event.create!(
  title: "D-Day Invasion",
  description: "Allied invasion of Normandy",
  start_time: datetime_seconds(DateTime.new(1944, 6, 6)),
  end_time: datetime_seconds(DateTime.new(1944, 6, 30)),
  event_type: "range",
  color: "#dc2626"
)

hiroshima = Event.create!(
  title: "Hiroshima Bombing",
  description: "Atomic bomb dropped on Hiroshima",
  start_time: datetime_seconds(DateTime.new(1945, 8, 6, 8, 15), "Tokyo"),
  event_type: "point",
  color: "#dc2626",
  timezone: "Tokyo"
)

ve_day = Event.create!(
  title: "VE Day",
  description: "Victory in Europe Day - Nazi Germany surrenders",
  start_time: datetime_seconds(DateTime.new(1945, 5, 8)),
  event_type: "point",
  color: "#22c55e"
)

vj_day = Event.create!(
  title: "VJ Day",
  description: "Victory over Japan Day - Japan surrenders",
  start_time: datetime_seconds(DateTime.new(1945, 8, 15)),
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
  start_time: datetime_seconds(DateTime.new(2001, 9, 11, 8, 46), "Eastern Time (US & Canada)"),
  event_type: "point",
  color: "#dc2626",
  timezone: "Eastern Time (US & Canada)"
)

second_plane = Event.create!(
  title: "Second Plane Hits South Tower",
  description: "United Airlines Flight 175 crashes into South Tower",
  start_time: datetime_seconds(DateTime.new(2001, 9, 11, 9, 3), "Eastern Time (US & Canada)"),
  event_type: "point",
  color: "#dc2626",
  timezone: "Eastern Time (US & Canada)"
)

pentagon = Event.create!(
  title: "Pentagon Attack",
  description: "American Airlines Flight 77 crashes into the Pentagon",
  start_time: datetime_seconds(DateTime.new(2001, 9, 11, 9, 37), "Eastern Time (US & Canada)"),
  event_type: "point",
  color: "#dc2626",
  timezone: "Eastern Time (US & Canada)"
)

south_collapse = Event.create!(
  title: "South Tower Collapses",
  description: "The South Tower of the World Trade Center collapses",
  start_time: datetime_seconds(DateTime.new(2001, 9, 11, 9, 59), "Eastern Time (US & Canada)"),
  event_type: "point",
  color: "#7c2d12",
  timezone: "Eastern Time (US & Canada)"
)

north_collapse = Event.create!(
  title: "North Tower Collapses",
  description: "The North Tower of the World Trade Center collapses",
  start_time: datetime_seconds(DateTime.new(2001, 9, 11, 10, 28), "Eastern Time (US & Canada)"),
  event_type: "point",
  color: "#7c2d12",
  timezone: "Eastern Time (US & Canada)"
)

nine_eleven.events << [first_plane, second_plane, pentagon, south_collapse, north_collapse]

# Create a timeline about Ancient Persia
persia_timeline = Timeline.create!(
  name: "The Sassanid Empire",
  description: "Major periods and events of the Sassanid Persian Empire",
  color: "#7c3aed"
)

founding = Event.create!(
  title: "Founding of Sassanid Empire",
  description: "Ardashir I overthrows the Parthian Empire",
  start_time: datetime_seconds(DateTime.new(224, 1, 1)),
  event_type: "point",
  color: "#7c3aed"
)

shapur_reign = Event.create!(
  title: "Reign of Shapur I",
  description: "Golden age under Shapur I, including victory over Rome",
  start_time: datetime_seconds(DateTime.new(240, 1, 1)),
  end_time: datetime_seconds(DateTime.new(270, 1, 1)),
  event_type: "range",
  color: "#7c3aed"
)

khosrow_reign = Event.create!(
  title: "Reign of Khosrow I",
  description: "Peak of Sassanid power and culture",
  start_time: datetime_seconds(DateTime.new(531, 1, 1)),
  end_time: datetime_seconds(DateTime.new(579, 1, 1)),
  event_type: "range",
  color: "#7c3aed"
)

arab_conquest = Event.create!(
  title: "Arab Conquest",
  description: "Fall of the Sassanid Empire to Arab Muslims",
  start_time: datetime_seconds(DateTime.new(633, 1, 1)),
  end_time: datetime_seconds(DateTime.new(651, 1, 1)),
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
  start_time: datetime_seconds(DateTime.new(2007, 6, 29)),
  event_type: "point",
  color: "#0891b2"
)

ai_revolution = Event.create!(
  title: "AI Revolution",
  description: "The ongoing revolution in artificial intelligence",
  start_time: datetime_seconds(DateTime.new(2022, 11, 30)),
  event_type: "ongoing",
  color: "#0891b2"
)

tech_timeline.events << [iphone_launch, ai_revolution]

# Create a timeline with many overlapping events - WWII Major Battles
battles_timeline = Timeline.create!(
  name: "World War II - Major Concurrent Battles",
  description: "Overlapping military operations during World War II",
  color: "#991b1b"
)

# Create overlapping battles
battle_britain = Event.create!(
  title: "Battle of Britain",
  description: "German air campaign against the UK",
  start_time: datetime_seconds(DateTime.new(1940, 7, 10)),
  end_time: datetime_seconds(DateTime.new(1940, 10, 31)),
  event_type: "range",
  color: "#dc2626"
)

battle_atlantic = Event.create!(
  title: "Battle of the Atlantic",
  description: "Longest continuous military campaign in WWII",
  start_time: datetime_seconds(DateTime.new(1939, 9, 3)),
  end_time: datetime_seconds(DateTime.new(1945, 5, 8)),
  event_type: "range",
  color: "#1e40af"
)

siege_leningrad = Event.create!(
  title: "Siege of Leningrad",
  description: "872-day siege by German and Finnish forces",
  start_time: datetime_seconds(DateTime.new(1941, 9, 8)),
  end_time: datetime_seconds(DateTime.new(1944, 1, 27)),
  event_type: "range",
  color: "#7c2d12"
)

battle_moscow = Event.create!(
  title: "Battle of Moscow",
  description: "German offensive against Moscow",
  start_time: datetime_seconds(DateTime.new(1941, 10, 2)),
  end_time: datetime_seconds(DateTime.new(1942, 1, 7)),
  event_type: "range",
  color: "#dc2626"
)

battle_stalingrad = Event.create!(
  title: "Battle of Stalingrad",
  description: "Major battle on Eastern Front",
  start_time: datetime_seconds(DateTime.new(1942, 8, 23)),
  end_time: datetime_seconds(DateTime.new(1943, 2, 2)),
  event_type: "range",
  color: "#991b1b"
)

el_alamein = Event.create!(
  title: "Second Battle of El Alamein",
  description: "Turning point in North Africa",
  start_time: datetime_seconds(DateTime.new(1942, 10, 23)),
  end_time: datetime_seconds(DateTime.new(1942, 11, 11)),
  event_type: "range",
  color: "#d97706"
)

guadalcanal = Event.create!(
  title: "Battle of Guadalcanal",
  description: "First major Allied offensive in Pacific",
  start_time: datetime_seconds(DateTime.new(1942, 8, 7)),
  end_time: datetime_seconds(DateTime.new(1943, 2, 9)),
  event_type: "range",
  color: "#059669"
)

kursk = Event.create!(
  title: "Battle of Kursk",
  description: "Largest tank battle in history",
  start_time: datetime_seconds(DateTime.new(1943, 7, 5)),
  end_time: datetime_seconds(DateTime.new(1943, 8, 23)),
  event_type: "range",
  color: "#dc2626"
)

normandy = Event.create!(
  title: "Battle of Normandy",
  description: "Allied invasion of Normandy",
  start_time: datetime_seconds(DateTime.new(1944, 6, 6)),
  end_time: datetime_seconds(DateTime.new(1944, 8, 25)),
  event_type: "range",
  color: "#3b82f6"
)

bulge = Event.create!(
  title: "Battle of the Bulge",
  description: "Last major German offensive",
  start_time: datetime_seconds(DateTime.new(1944, 12, 16)),
  end_time: datetime_seconds(DateTime.new(1945, 1, 25)),
  event_type: "range",
  color: "#dc2626"
)

battles_timeline.events << [
  battle_britain, battle_atlantic, siege_leningrad, battle_moscow,
  battle_stalingrad, el_alamein, guadalcanal, kursk, normandy, bulge
]

# Create a timeline with overlapping events at minute-level granularity
hospital_timeline = Timeline.create!(
  name: "Emergency Room - Busy Friday Night",
  description: "Patient arrivals and treatments overlapping throughout the evening",
  color: "#dc2626"
)

patient1 = Event.create!(
  title: "Patient A: Chest Pain",
  description: "65yo male, cardiac evaluation",
  start_time: datetime_seconds(DateTime.new(2024, 1, 12, 18, 15)),
  end_time: datetime_seconds(DateTime.new(2024, 1, 12, 21, 45)),
  event_type: "range",
  color: "#dc2626"
)

patient2 = Event.create!(
  title: "Patient B: Broken Arm",
  description: "12yo child, skateboard accident",
  start_time: datetime_seconds(DateTime.new(2024, 1, 12, 18, 30)),
  end_time: datetime_seconds(DateTime.new(2024, 1, 12, 20, 15)),
  event_type: "range",
  color: "#2563eb"
)

patient3 = Event.create!(
  title: "Patient C: Allergic Reaction",
  description: "28yo female, severe food allergy",
  start_time: datetime_seconds(DateTime.new(2024, 1, 12, 18, 45)),
  end_time: datetime_seconds(DateTime.new(2024, 1, 12, 19, 30)),
  event_type: "range",
  color: "#dc2626"
)

patient4 = Event.create!(
  title: "Patient D: Laceration",
  description: "45yo male, deep cut requiring stitches",
  start_time: datetime_seconds(DateTime.new(2024, 1, 12, 19, 00)),
  end_time: datetime_seconds(DateTime.new(2024, 1, 12, 20, 30)),
  event_type: "range",
  color: "#059669"
)

patient5 = Event.create!(
  title: "Patient E: Asthma Attack",
  description: "8yo child, breathing difficulty",
  start_time: datetime_seconds(DateTime.new(2024, 1, 12, 19, 15)),
  end_time: datetime_seconds(DateTime.new(2024, 1, 12, 21, 00)),
  event_type: "range",
  color: "#dc2626"
)

patient6 = Event.create!(
  title: "Patient F: Sprained Ankle",
  description: "22yo athlete, sports injury",
  start_time: datetime_seconds(DateTime.new(2024, 1, 12, 19, 45)),
  end_time: datetime_seconds(DateTime.new(2024, 1, 12, 21, 15)),
  event_type: "range",
  color: "#2563eb"
)

patient7 = Event.create!(
  title: "Patient G: Migraine",
  description: "35yo female, severe headache",
  start_time: datetime_seconds(DateTime.new(2024, 1, 12, 20, 00)),
  end_time: datetime_seconds(DateTime.new(2024, 1, 12, 21, 30)),
  event_type: "range",
  color: "#7c3aed"
)

patient8 = Event.create!(
  title: "Patient H: MVA Minor",
  description: "Motor vehicle accident, minor injuries",
  start_time: datetime_seconds(DateTime.new(2024, 1, 12, 20, 30)),
  end_time: datetime_seconds(DateTime.new(2024, 1, 12, 22, 45)),
  event_type: "range",
  color: "#d97706"
)

hospital_timeline.events << [
  patient1, patient2, patient3, patient4,
  patient5, patient6, patient7, patient8
]

# Timeline of Dinosaurs - Using negative years to represent millions of years ago
dinosaurs_timeline = Timeline.create!(
  name: "Age of Dinosaurs",
  description: "Major dinosaur species across the Mesozoic Era (252-66 million years ago)",
  color: "#15803d"
)

# Triassic Period dinosaurs (252-201 million years ago)
coelophysis = Event.create!(
  title: "Coelophysis",
  description: "Early theropod, one of the first dinosaurs (Late Triassic)",
  start_time: years_seconds(-228_000_000),
  end_time: years_seconds(-200_000_000),
  event_type: "range",
  color: "#84cc16"
)

plateosaurus = Event.create!(
  title: "Plateosaurus",
  description: "Early large herbivore, early sauropodomorph",
  start_time: years_seconds(-214_000_000),
  end_time: years_seconds(-204_000_000),
  event_type: "range",
  color: "#65a30d"
)

# Jurassic Period dinosaurs (201-145 million years ago)
dilophosaurus = Event.create!(
  title: "Dilophosaurus",
  description: "Large theropod with distinctive double crest",
  start_time: years_seconds(-193_000_000),
  end_time: years_seconds(-183_000_000),
  event_type: "range",
  color: "#fbbf24"
)

stegosaurus = Event.create!(
  title: "Stegosaurus",
  description: "Plated dinosaur with distinctive back plates and spiked tail",
  start_time: years_seconds(-155_000_000),
  end_time: years_seconds(-150_000_000),
  event_type: "range",
  color: "#f59e0b"
)

allosaurus = Event.create!(
  title: "Allosaurus",
  description: "Large carnivorous theropod, apex predator of late Jurassic",
  start_time: years_seconds(-155_000_000),
  end_time: years_seconds(-145_000_000),
  event_type: "range",
  color: "#dc2626"
)

brachiosaurus = Event.create!(
  title: "Brachiosaurus",
  description: "Massive long-necked sauropod",
  start_time: years_seconds(-154_000_000),
  end_time: years_seconds(-153_000_000),
  event_type: "range",
  color: "#16a34a"
)

archaeopteryx = Event.create!(
  title: "Archaeopteryx",
  description: "Transitional fossil between dinosaurs and birds",
  start_time: years_seconds(-150_000_000),
  event_type: "point",
  color: "#06b6d4"
)

# Cretaceous Period dinosaurs (145-66 million years ago)
iguanodon = Event.create!(
  title: "Iguanodon",
  description: "Large herbivorous ornithopod",
  start_time: years_seconds(-140_000_000),
  end_time: years_seconds(-120_000_000),
  event_type: "range",
  color: "#22c55e"
)

spinosaurus = Event.create!(
  title: "Spinosaurus",
  description: "Largest known carnivorous dinosaur with sail-like spine",
  start_time: years_seconds(-112_000_000),
  end_time: years_seconds(-93_000_000),
  event_type: "range",
  color: "#991b1b"
)

velociraptor = Event.create!(
  title: "Velociraptor",
  description: "Small but intelligent pack-hunting theropod",
  start_time: years_seconds(-75_000_000),
  end_time: years_seconds(-71_000_000),
  event_type: "range",
  color: "#7c2d12"
)

triceratops = Event.create!(
  title: "Triceratops",
  description: "Large horned herbivore with bony frill",
  start_time: years_seconds(-68_000_000),
  end_time: years_seconds(-66_000_000),
  event_type: "range",
  color: "#92400e"
)

tyrannosaurus = Event.create!(
  title: "Tyrannosaurus Rex",
  description: "Apex predator of late Cretaceous, one of largest land carnivores",
  start_time: years_seconds(-68_000_000),
  end_time: years_seconds(-66_000_000),
  event_type: "range",
  color: "#7f1d1d"
)

ankylosaurus = Event.create!(
  title: "Ankylosaurus",
  description: "Heavily armored herbivore with club tail",
  start_time: years_seconds(-68_000_000),
  end_time: years_seconds(-66_000_000),
  event_type: "range",
  color: "#57534e"
)

extinction_event = Event.create!(
  title: "K-Pg Extinction Event",
  description: "Asteroid impact ends the age of dinosaurs",
  start_time: years_seconds(-66_000_000),
  event_type: "point",
  color: "#000000"
)

dinosaurs_timeline.events << [
  coelophysis, plateosaurus, dilophosaurus, stegosaurus, allosaurus,
  brachiosaurus, archaeopteryx, iguanodon, spinosaurus, velociraptor,
  triceratops, tyrannosaurus, ankylosaurus, extinction_event
]

# Climate Change - 150 years into the future
climate_timeline = Timeline.create!(
  name: "Climate Change Projections (2025-2175)",
  description: "Past milestones and future projections of climate change impacts",
  color: "#0284c7"
)

# Historical/recent events
paris_agreement = Event.create!(
  title: "Paris Agreement",
  description: "195 countries adopt the Paris Climate Agreement",
  start_time: datetime_seconds(DateTime.new(2015, 12, 12)),
  event_type: "point",
  color: "#22c55e"
)

ipcc_report = Event.create!(
  title: "IPCC 1.5°C Report",
  description: "Report warns of catastrophic impacts above 1.5°C warming",
  start_time: datetime_seconds(DateTime.new(2018, 10, 8)),
  event_type: "point",
  color: "#f59e0b"
)

current_warming = Event.create!(
  title: "1.1°C Global Warming",
  description: "Global temperature reaches 1.1°C above pre-industrial levels",
  start_time: datetime_seconds(DateTime.new(2020, 1, 1)),
  end_time: datetime_seconds(DateTime.new(2024, 12, 31)),
  event_type: "range",
  color: "#f59e0b"
)

# Near-term projections (2025-2050)
coal_phaseout = Event.create!(
  title: "Major Coal Phase-Out",
  description: "Developed nations complete transition away from coal power",
  start_time: datetime_seconds(DateTime.new(2030, 1, 1)),
  end_time: datetime_seconds(DateTime.new(2040, 12, 31)),
  event_type: "range",
  color: "#22c55e"
)

temp_15c = Event.create!(
  title: "1.5°C Threshold Exceeded",
  description: "Global warming surpasses 1.5°C above pre-industrial (projected)",
  start_time: datetime_seconds(DateTime.new(2034, 1, 1)),
  event_type: "point",
  color: "#dc2626"
)

arctic_ice_free = Event.create!(
  title: "First Ice-Free Arctic Summer",
  description: "Arctic Ocean becomes ice-free in summer months",
  start_time: datetime_seconds(DateTime.new(2045, 7, 1)),
  event_type: "point",
  color: "#0284c7"
)

renewable_majority = Event.create!(
  title: "Renewables Reach 75% Globally",
  description: "Renewable energy becomes dominant power source worldwide",
  start_time: datetime_seconds(DateTime.new(2048, 1, 1)),
  event_type: "point",
  color: "#22c55e"
)

# Mid-term projections (2050-2100)
temp_2c = Event.create!(
  title: "2°C Warming Reached",
  description: "Global temperature 2°C above pre-industrial baseline",
  start_time: datetime_seconds(DateTime.new(2052, 1, 1)),
  event_type: "point",
  color: "#dc2626"
)

sea_level_rise_1m = Event.create!(
  title: "1 Meter Sea Level Rise",
  description: "Global sea levels rise 1 meter, displacing millions",
  start_time: datetime_seconds(DateTime.new(2060, 1, 1)),
  end_time: datetime_seconds(DateTime.new(2070, 12, 31)),
  event_type: "range",
  color: "#0284c7"
)

amazon_tipping = Event.create!(
  title: "Amazon Rainforest Tipping Point",
  description: "Amazon transitions from carbon sink to carbon source",
  start_time: datetime_seconds(DateTime.new(2065, 1, 1)),
  event_type: "point",
  color: "#7c2d12"
)

carbon_neutral = Event.create!(
  title: "Global Carbon Neutrality",
  description: "World achieves net-zero carbon emissions (target scenario)",
  start_time: datetime_seconds(DateTime.new(2075, 1, 1)),
  event_type: "point",
  color: "#22c55e"
)

greenland_melt = Event.create!(
  title: "Greenland Ice Sheet Collapse Begins",
  description: "Irreversible melting of Greenland ice sheet accelerates",
  start_time: datetime_seconds(DateTime.new(2080, 1, 1)),
  end_time: datetime_seconds(DateTime.new(2150, 12, 31)),
  event_type: "range",
  color: "#dc2626"
)

# Long-term projections (2100-2175)
temp_3c = Event.create!(
  title: "3°C Warming Scenario",
  description: "Without intervention, temperature reaches 3°C above baseline",
  start_time: datetime_seconds(DateTime.new(2100, 1, 1)),
  event_type: "point",
  color: "#991b1b"
)

miami_underwater = Event.create!(
  title: "Major Coastal Cities Threatened",
  description: "Cities like Miami, Mumbai face permanent flooding",
  start_time: datetime_seconds(DateTime.new(2110, 1, 1)),
  end_time: datetime_seconds(DateTime.new(2130, 12, 31)),
  event_type: "range",
  color: "#0c4a6e"
)

geoengineering = Event.create!(
  title: "Large-Scale Geoengineering Deployed",
  description: "Solar radiation management and carbon capture at scale",
  start_time: datetime_seconds(DateTime.new(2120, 1, 1)),
  end_time: datetime_seconds(DateTime.new(2175, 12, 31)),
  event_type: "range",
  color: "#7c3aed"
)

climate_migration = Event.create!(
  title: "Mass Climate Migration Peak",
  description: "1 billion+ climate refugees worldwide",
  start_time: datetime_seconds(DateTime.new(2130, 1, 1)),
  end_time: datetime_seconds(DateTime.new(2150, 12, 31)),
  event_type: "range",
  color: "#7c2d12"
)

stabilization = Event.create!(
  title: "Climate Stabilization Efforts",
  description: "Global temperature begins to stabilize (optimistic scenario)",
  start_time: datetime_seconds(DateTime.new(2150, 1, 1)),
  event_type: "ongoing",
  color: "#059669"
)

climate_timeline.events << [
  paris_agreement, ipcc_report, current_warming, coal_phaseout,
  temp_15c, arctic_ice_free, renewable_majority, temp_2c,
  sea_level_rise_1m, amazon_tipping, carbon_neutral, greenland_melt,
  temp_3c, miami_underwater, geoengineering, climate_migration,
  stabilization
]

puts "✅ Created #{Timeline.count} timelines with #{Event.count} events"
puts "\nTimelines:"
Timeline.all.each do |timeline|
  component = TimelineComponent.new(timeline: timeline)
  puts "  - #{timeline.name} (#{timeline.events.count} events, #{component.max_lanes} lanes)"
end
