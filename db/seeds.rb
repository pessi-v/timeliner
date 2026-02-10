# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

Timeline.create(
  name: "The history of socialism",
  description: "blah blah blah",
  timeline_data: {
  "events": [
    {
      "id": "event-manifesto",
      "name": "Communist Manifesto Published",
      "time": "1848-02-21",
      "info": "Karl Marx and Friedrich Engels publish 'The Communist Manifesto', laying out the theoretical foundations of scientific socialism. The pamphlet declares 'A spectre is haunting Europe — the spectre of communism' and ends with the famous call: 'Workers of the world, unite!'"
    },
    {
      "id": "event-1848-revolutions",
      "name": "Revolutions of 1848",
      "time": "1848-03-15",
      "info": "A wave of revolutions sweeps across Europe, driven by demands for democratic reform, national unification, and workers' rights. Though ultimately suppressed, these uprisings mark the emergence of the working class as a political force."
    },
    {
      "id": "event-kapital",
      "name": "Das Kapital Vol. 1 Published",
      "time": "1867-09-14",
      "info": "Karl Marx publishes the first volume of 'Das Kapital', his magnum opus analyzing capitalism's internal contradictions. The work introduces concepts like surplus value, commodity fetishism, and the tendency of the rate of profit to fall."
    },
    {
      "id": "event-paris-commune",
      "name": "Paris Commune",
      "time": "1871-03-18",
      "info": "Workers seize control of Paris for 72 days, establishing the first proletarian government in history. The Commune implements radical reforms including workers' self-management, separation of church and state, and women's rights. Brutally suppressed with 20,000-30,000 killed."
    },
    {
      "id": "event-haymarket",
      "name": "Haymarket Affair",
      "time": "1886-05-04",
      "info": "A labor rally in Chicago for the eight-hour workday turns violent when a bomb explodes, leading to the execution of four anarchist leaders. The event becomes a rallying point for the international labor movement and the origin of May Day celebrations worldwide."
    },
    {
      "id": "event-iww-founding",
      "name": "IWW Founded",
      "time": "1905-06-27",
      "info": "The Industrial Workers of the World is founded in Chicago by radical unionists including Eugene V. Debs, Mother Jones, and Big Bill Haywood. The 'Wobblies' advocate for 'One Big Union' organizing all workers regardless of skill, race, or gender."
    },
    {
      "id": "event-1905-revolution",
      "name": "Russian Revolution of 1905",
      "time": "1905-01-22",
      "info": "Bloody Sunday massacre triggers a revolutionary wave across the Russian Empire. Workers form the first soviets (councils), demonstrating new forms of democratic organization. Though defeated, the revolution serves as a 'dress rehearsal' for 1917."
    },
    {
      "id": "event-february-revolution",
      "name": "February Revolution",
      "time": "1917-03-08",
      "info": "Women workers in Petrograd strike on International Women's Day, sparking a revolution that topples the Romanov dynasty. Dual power emerges between the Provisional Government and the soviets of workers, soldiers, and peasants."
    },
    {
      "id": "event-october-revolution",
      "name": "October Revolution",
      "time": "1917-11-07",
      "info": "The Bolsheviks, led by Vladimir Lenin and Leon Trotsky, overthrow the Provisional Government in the name of 'All Power to the Soviets'. The world's first socialist state is proclaimed, sending shockwaves through the global order."
    },
    {
      "id": "event-rosa-assassination",
      "name": "Rosa Luxemburg Assassinated",
      "time": "1919-01-15",
      "info": "Revolutionary socialist Rosa Luxemburg and Karl Liebknecht are murdered by Freikorps paramilitaries during the failed Spartacist uprising in Berlin. Luxemburg's writings on spontaneity, democracy, and mass strikes remain influential across the socialist left."
    },
    {
      "id": "event-kronstadt",
      "name": "Kronstadt Rebellion",
      "time": "1921-03-01",
      "info": "Sailors at the Kronstadt naval base, former Bolshevik supporters, rebel demanding 'Soviets without Bolsheviks', free elections, and an end to War Communism. The rebellion's suppression marks a turning point, criticized by anarchists and left communists."
    },
    {
      "id": "event-long-march",
      "name": "Long March Begins",
      "time": "1934-10-16",
      "info": "The Chinese Red Army begins its 6,000-mile retreat from Nationalist forces, a journey that will forge the Communist Party's leadership under Mao Zedong and become central to revolutionary mythology."
    },
    {
      "id": "event-spanish-revolution",
      "name": "Spanish Revolution",
      "time": "1936-07-19",
      "info": "Workers and peasants respond to Franco's fascist coup by launching a social revolution. In Catalonia and Aragon, anarchist collectives manage factories and farms. George Orwell documents the experience in 'Homage to Catalonia'."
    },
    {
      "id": "event-tito-stalin-split",
      "name": "Tito-Stalin Split",
      "time": "1948-06-28",
      "info": "Yugoslavia is expelled from the Cominform after Josip Broz Tito refuses to subordinate Yugoslav interests to Soviet control. The split leads to the development of 'workers' self-management' as an alternative socialist model."
    },
    {
      "id": "event-cuban-revolution",
      "name": "Cuban Revolution Triumphs",
      "time": "1959-01-01",
      "info": "Fidel Castro's 26th of July Movement overthrows the Batista dictatorship. The revolution, initially nationalist, soon declares itself socialist. Che Guevara becomes a global icon of revolutionary commitment."
    },
    {
      "id": "event-che-death",
      "name": "Che Guevara Killed",
      "time": "1967-10-09",
      "info": "Ernesto 'Che' Guevara is captured and executed by Bolivian forces with CIA assistance while attempting to spread revolution in Latin America. His image becomes the most reproduced photograph in history."
    },
    {
      "id": "event-prague-spring",
      "name": "Prague Spring Crushed",
      "time": "1968-08-20",
      "info": "Warsaw Pact forces invade Czechoslovakia to end Alexander Dubček's reforms of 'socialism with a human face'. The invasion deepens divisions in the international communist movement and disillusions many Western leftists."
    },
    {
      "id": "event-allende-elected",
      "name": "Allende Elected in Chile",
      "time": "1970-09-04",
      "info": "Salvador Allende becomes the world's first democratically elected Marxist head of state. His Popular Unity government nationalizes copper mines and banks while preserving democratic institutions."
    },
    {
      "id": "event-allende-coup",
      "name": "Chilean Coup",
      "time": "1973-09-11",
      "info": "General Augusto Pinochet, backed by the CIA, overthrows Salvador Allende in a violent coup. Allende dies in the presidential palace. The coup inaugurates brutal repression and neoliberal economic 'shock therapy'."
    },
    {
      "id": "event-sandinista-revolution",
      "name": "Sandinista Revolution",
      "time": "1979-07-19",
      "info": "The Sandinista National Liberation Front overthrows the Somoza dictatorship in Nicaragua after years of guerrilla struggle. The revolution implements literacy campaigns and land reform while facing US-backed Contra war."
    },
    {
      "id": "event-solidarity",
      "name": "Solidarity Founded",
      "time": "1980-09-17",
      "info": "Polish workers at the Gdańsk shipyard, led by Lech Wałęsa, form Solidarity, the first independent trade union in the Soviet bloc. The movement, supported by the Catholic Church, eventually helps bring down communist rule in Poland."
    },
    {
      "id": "event-berlin-wall-fall",
      "name": "Fall of the Berlin Wall",
      "time": "1989-11-09",
      "info": "East Germans breach the Berlin Wall after weeks of mass protests, symbolizing the collapse of Soviet-style socialism in Eastern Europe. The event triggers rapid German reunification and the end of the Cold War."
    },
    {
      "id": "event-ussr-dissolution",
      "name": "USSR Dissolved",
      "time": "1991-12-26",
      "info": "The Soviet Union officially dissolves after the failed August coup and declarations of independence by constituent republics. The world's first socialist state ends after 74 years, leaving contested legacies across the political spectrum."
    },
    {
      "id": "event-zapatista-uprising",
      "name": "Zapatista Uprising",
      "time": "1994-01-01",
      "info": "The Zapatista Army of National Liberation (EZLN) launches an uprising in Chiapas, Mexico, on the day NAFTA takes effect. Led by Subcomandante Marcos, the movement combines indigenous rights with anti-capitalist politics and innovative use of media."
    },
    {
      "id": "event-chavez-elected",
      "name": "Hugo Chávez Elected",
      "time": "1998-12-06",
      "info": "Hugo Chávez wins Venezuela's presidency, launching the 'Bolivarian Revolution' and inspiring a 'pink tide' of left-wing governments across Latin America. His '21st century socialism' emphasizes participatory democracy and regional integration."
    }
  ],
  "periods": [
    {
      "id": "period-utopian-socialism",
      "name": "Utopian Socialism",
      "startTime": "1800-01-01",
      "endTime": "1848-02-21",
      "info": "Early socialist thinkers envision ideal communities based on cooperation rather than competition. Robert Owen establishes New Lanark and New Harmony; Charles Fourier designs phalanstères; Henri de Saint-Simon advocates technocratic planning. Marx and Engels later distinguish their 'scientific' socialism from these 'utopian' predecessors."
    },
    {
      "id": "period-first-international",
      "name": "First International",
      "startTime": "1864-09-28",
      "endTime": "1876-07-15",
      "info": "The International Workingmen's Association unites trade unionists, socialists, and anarchists across Europe. Karl Marx drafts its founding address. Internal conflicts between Marx and Mikhail Bakunin over centralization, the state, and revolutionary strategy lead to the organization's collapse."
    },
    {
      "id": "period-second-international",
      "name": "Second International",
      "startTime": "1889-07-14",
      "endTime": "1916-04-24",
      "info": "Socialist and labor parties form a new international, establishing May Day and building mass parties. Key debates emerge between reformists like Eduard Bernstein and revolutionaries like Rosa Luxemburg. The International collapses when most parties support their nations in World War I."
    },
    {
      "id": "period-third-international",
      "name": "Third International (Comintern)",
      "startTime": "1919-03-02",
      "endTime": "1943-05-15",
      "info": "Lenin founds the Communist International to spread world revolution and coordinate communist parties. The 21 Conditions require parties to break with reformists. Under Stalin, the Comintern becomes an instrument of Soviet foreign policy. Dissolved during WWII to appease Western allies."
    },
    {
      "id": "period-iww",
      "name": "IWW Peak Years",
      "startTime": "1905-06-27",
      "endTime": "1924-12-31",
      "info": "The Industrial Workers of the World organizes militant strikes among miners, textile workers, and migrant laborers. The Wobblies pioneer tactics like the sit-down strike and produce enduring songs like 'Solidarity Forever'. Government repression during WWI and the Red Scare devastates the union."
    },
    {
      "id": "period-ussr",
      "name": "Soviet Union",
      "startTime": "1922-12-30",
      "endTime": "1991-12-26",
      "info": "The Union of Soviet Socialist Republics becomes the world's first constitutionally socialist state. Rapid industrialization transforms a peasant society but at enormous human cost. The USSR defeats Nazi Germany, develops nuclear weapons, and sponsors revolutionary movements worldwide before economic stagnation and political crisis lead to its dissolution."
    },
    {
      "id": "period-cnt-fai",
      "name": "CNT-FAI Revolutionary Period",
      "startTime": "1936-07-19",
      "endTime": "1939-04-01",
      "info": "The anarcho-syndicalist CNT (National Confederation of Labor) and FAI (Iberian Anarchist Federation) lead a social revolution in Republican Spain. Workers collectivize factories; peasants socialize land. Internal conflicts with Communists and the Republic's defeat by Franco end the experiment."
    },
    {
      "id": "period-ccp-revolution",
      "name": "Chinese Revolution",
      "startTime": "1927-08-01",
      "endTime": "1949-10-01",
      "info": "The Chinese Communist Party, led by Mao Zedong, wages a revolutionary war combining peasant mobilization with guerrilla tactics. After surviving the Long March, defeating Japanese invasion, and winning civil war against the Nationalists, the CCP proclaims the People's Republic."
    },
    {
      "id": "period-prc",
      "name": "People's Republic of China",
      "startTime": "1949-10-01",
      "info": "The Communist Party establishes the People's Republic of China, implementing land reform, collectivization, and rapid industrialization. The Great Leap Forward causes famine; the Cultural Revolution brings upheaval. After Mao's death, Deng Xiaoping's reforms create 'socialism with Chinese characteristics'."
    },
    {
      "id": "period-yugoslavia",
      "name": "Socialist Yugoslavia",
      "startTime": "1945-11-29",
      "endTime": "1992-04-27",
      "info": "Yugoslavia under Josip Broz Tito develops a distinctive socialist model featuring workers' self-management, market mechanisms, and non-alignment in the Cold War. The federation holds together diverse nationalities until economic crisis and nationalist mobilization lead to violent dissolution in the 1990s."
    },
    {
      "id": "period-ddr",
      "name": "German Democratic Republic",
      "startTime": "1949-10-07",
      "endTime": "1990-10-03",
      "info": "East Germany becomes the most economically developed Warsaw Pact state, claiming to represent the antifascist German tradition. The Berlin Wall (1961) stems emigration but symbolizes the regime's lack of legitimacy. Mass protests in 1989 lead to the Wall's fall and rapid reunification with West Germany."
    },
    {
      "id": "period-cuba",
      "name": "Socialist Cuba",
      "startTime": "1961-04-16",
      "info": "Cuba declares itself socialist after the Bay of Pigs invasion, becoming the Western Hemisphere's first socialist state. Despite US embargo, Cuba achieves notable advances in healthcare and education while supporting revolutionary movements in Latin America and Africa."
    },
    {
      "id": "period-allende",
      "name": "Allende's Chile",
      "startTime": "1970-11-03",
      "endTime": "1973-09-11",
      "info": "Salvador Allende's Popular Unity government attempts a 'Chilean road to socialism' through democratic means. Nationalizations of copper and banking provoke US opposition and domestic polarization. The experiment ends with Pinochet's coup and Allende's death."
    },
    {
      "id": "period-sandinistas",
      "name": "Sandinista Nicaragua",
      "startTime": "1979-07-19",
      "endTime": "1990-04-25",
      "info": "The Sandinista Front governs Nicaragua, implementing literacy campaigns, land reform, and mixed economy policies. The US-backed Contra war and economic embargo devastate the country. The Sandinistas lose the 1990 election but return to power in 2006."
    },
    {
      "id": "period-mst",
      "name": "MST",
      "startTime": "1984-01-20",
      "info": "The Landless Workers' Movement (MST) becomes Latin America's largest social movement, organizing landless peasants in Brazil to occupy unused land and demand agrarian reform. The movement combines direct action with cooperatives, schools, and alliance with the Workers' Party."
    },
    {
      "id": "period-ezln",
      "name": "Zapatista Autonomous Zones",
      "startTime": "1994-01-01",
      "info": "After their 1994 uprising, the Zapatistas establish autonomous municipalities in Chiapas, Mexico. The 'caracoles' practice participatory democracy, collective land use, and autonomous education and healthcare, inspiring anti-globalization movements worldwide."
    },
    {
      "id": "period-bolivarian",
      "name": "Bolivarian Venezuela",
      "startTime": "1999-02-02",
      "endTime": "2013-03-05",
      "info": "Hugo Chávez's Bolivarian Revolution nationalizes key industries, expands social programs called 'missions', and promotes participatory democracy through communal councils. Oil revenues fund regional integration initiatives like ALBA. The project faces ongoing crisis after Chávez's death."
    },
    {
      "id": "period-fourth-international",
      "name": "Fourth International",
      "startTime": "1938-09-03",
      "info": "Leon Trotsky founds the Fourth International to continue revolutionary socialism against both capitalism and Stalinist 'bureaucratic degeneration'. Though never achieving mass influence, Trotskyist organizations persist globally, characterized by anti-Stalinism, permanent revolution theory, and frequent splits."
    }
  ],
  "connectors": [
    {
      "id": "conn-utopian-first",
      "fromId": "period-utopian-socialism",
      "toId": "period-first-international",
      "type": "defined",
      "metadata": { "note": "Scientific socialism emerges from critique of utopian socialism" }
    },
    {
      "id": "conn-first-second",
      "fromId": "period-first-international",
      "toId": "period-second-international",
      "type": "undefined",
      "metadata": { "note": "Internationals as successive attempts at workers' coordination" }
    },
    {
      "id": "conn-second-third",
      "fromId": "period-second-international",
      "toId": "period-third-international",
      "type": "undefined",
      "metadata": { "note": "Third International founded in opposition to Second's 'social patriotism'" }
    },
    {
      "id": "conn-third-fourth",
      "fromId": "period-third-international",
      "toId": "period-fourth-international",
      "type": "undefined",
      "metadata": { "note": "Fourth International founded in opposition to Stalinist Comintern" }
    },
    {
      "id": "conn-ussr-ddr",
      "fromId": "period-ussr",
      "toId": "period-ddr",
      "type": "defined",
      "metadata": { "note": "DDR established in Soviet occupation zone" }
    },
    {
      "id": "conn-ussr-yugoslavia",
      "fromId": "period-ussr",
      "toId": "period-yugoslavia",
      "type": "defined",
      "metadata": { "note": "Yugoslav partisans supported by USSR, later independent" }
    },
    {
      "id": "conn-ccp-prc",
      "fromId": "period-ccp-revolution",
      "toId": "period-prc",
      "type": "defined",
      "metadata": { "note": "Revolutionary period leads to state formation" }
    },
    {
      "id": "conn-revolution-ussr",
      "fromId": "period-first-international",
      "toId": "period-ussr",
      "type": "defined",
      "metadata": { "note": "Marxist tradition from First International shapes Bolshevism" }
    },
    {
      "id": "conn-cnt-iww",
      "fromId": "period-iww",
      "toId": "period-cnt-fai",
      "type": "undefined",
      "metadata": { "note": "Anarcho-syndicalist tradition connects IWW and CNT" }
    },
    {
      "id": "conn-cuba-sandinistas",
      "fromId": "period-cuba",
      "toId": "period-sandinistas",
      "type": "defined",
      "metadata": { "note": "Cuban support for Sandinista revolution" }
    },
    {
      "id": "conn-sandinistas-bolivarian",
      "fromId": "period-sandinistas",
      "toId": "period-bolivarian",
      "type": "undefined",
      "metadata": { "note": "Latin American revolutionary tradition continues" }
    },
    {
      "id": "conn-allende-bolivarian",
      "fromId": "period-allende",
      "toId": "period-bolivarian",
      "type": "undefined",
      "metadata": { "note": "Democratic socialist tradition in Latin America" }
    }
  ]
}
)

Timeline.create(
  name: "Development of Life",
  timeline_data: {
  "events": [
    {
      "id": "event-earth-formation",
      "name": "Formation of Earth",
      "time": { "value": 4540, "unit": "mya" },
      "info": "Earth forms from the solar nebula through accretion of dust and gas. The early Earth is molten, bombarded by asteroids, and has no atmosphere or oceans. The collision that forms the Moon occurs shortly after."
    },
    {
      "id": "event-first-life",
      "name": "First Life Appears",
      "time": { "value": 3800, "unit": "mya" },
      "relates_to": "period-archean",
      "info": "The earliest evidence of life appears in the form of simple prokaryotic cells (bacteria and archaea). These single-celled organisms likely emerge near hydrothermal vents or in warm shallow pools, using chemical energy rather than sunlight."
    },
    {
      "id": "event-photosynthesis",
      "name": "First Photosynthesis",
      "time": { "value": 3500, "unit": "mya" },
      "relates_to": "period-archean",
      "info": "Cyanobacteria evolve oxygenic photosynthesis, the ability to convert sunlight, water, and carbon dioxide into energy while releasing oxygen. Stromatolites—layered structures built by cyanobacterial mats—become common in shallow seas."
    },
    {
      "id": "event-great-oxygenation",
      "name": "Great Oxygenation Event",
      "time": { "value": 2400, "unit": "mya" },
      "relates_to": "period-proterozoic",
      "info": "Oxygen produced by cyanobacteria accumulates in Earth's atmosphere, rising from trace amounts to about 2%. This transforms the planet, rusting iron in the oceans, creating a new atmosphere, and causing a mass extinction of anaerobic life."
    },
    {
      "id": "event-first-eukaryotes",
      "name": "First Eukaryotic Cells",
      "time": { "value": 2100, "unit": "mya" },
      "relates_to": "period-proterozoic",
      "info": "Eukaryotes—cells with a nucleus and membrane-bound organelles—evolve through endosymbiosis. Mitochondria originate as engulfed bacteria that become permanent energy-producing partners. This innovation enables larger, more complex cells."
    },
    {
      "id": "event-sexual-reproduction",
      "name": "Sexual Reproduction Evolves",
      "time": { "value": 1200, "unit": "mya" },
      "relates_to": "period-proterozoic",
      "info": "Sexual reproduction emerges, enabling genetic recombination and dramatically accelerating evolution. The mixing of genes from two parents creates variation that natural selection can act upon more effectively."
    },
    {
      "id": "event-first-multicellular",
      "name": "First Multicellular Life",
      "time": { "value": 1000, "unit": "mya" },
      "relates_to": "period-proterozoic",
      "info": "Simple multicellular organisms appear, with cells beginning to specialize for different functions. Red and green algae are among the earliest multicellular forms, followed by early sponges and other simple animals."
    },
    {
      "id": "event-snowball-earth",
      "name": "Snowball Earth",
      "time": { "value": 720, "unit": "mya" },
      "relates_to": "period-proterozoic",
      "info": "Earth enters a period of extreme glaciation, possibly freezing over almost entirely. Ice sheets may have reached the equator. The eventual thawing releases carbon dioxide and may have triggered conditions favorable for complex life."
    },
    {
      "id": "event-ediacaran-fauna",
      "name": "Ediacaran Fauna Appears",
      "time": { "value": 575, "unit": "mya" },
      "relates_to": "period-proterozoic",
      "info": "The first large, complex multicellular organisms appear in the fossil record. The Ediacaran biota includes strange, quilted creatures like Dickinsonia and Charnia—soft-bodied organisms unlike anything alive today."
    },
    {
      "id": "event-cambrian-explosion",
      "name": "Cambrian Explosion",
      "time": { "value": 538.8, "unit": "mya" },
      "relates_to": "period-cambrian",
      "info": "An evolutionary burst produces most major animal body plans within about 25 million years. Eyes, shells, legs, and other innovations appear. The Burgess Shale preserves extraordinary fossils including Anomalocaris, Hallucigenia, and the first chordates."
    },
    {
      "id": "event-first-vertebrates",
      "name": "First Vertebrates",
      "time": { "value": 530, "unit": "mya" },
      "relates_to": "period-cambrian",
      "info": "The earliest vertebrates appear as small, jawless fish-like creatures. Haikouichthys, from the Cambrian of China, has a notochord, primitive skull, and segmented muscles—the basic vertebrate body plan that will give rise to all fish, amphibians, reptiles, birds, and mammals."
    },
    {
      "id": "event-first-land-plants",
      "name": "First Land Plants",
      "time": { "value": 470, "unit": "mya" },
      "relates_to": "period-ordovician",
      "info": "Plants begin colonizing land, initially as simple moss-like forms lacking roots or vascular tissue. They transform barren rock into soil, paving the way for terrestrial ecosystems. Fungi likely assist by forming symbiotic relationships."
    },
    {
      "id": "event-ordovician-extinction",
      "name": "Ordovician Mass Extinction",
      "time": { "value": 445, "unit": "mya" },
      "relates_to": "period-ordovician",
      "info": "The second-largest mass extinction in Earth's history kills about 85% of marine species. Caused by glaciation and falling sea levels, it devastates the trilobites, brachiopods, and other invertebrates that dominate Ordovician seas."
    },
    {
      "id": "event-first-jawed-fish",
      "name": "First Jawed Fish",
      "time": { "value": 430, "unit": "mya" },
      "relates_to": "period-silurian",
      "info": "Jaws evolve from modified gill arches, revolutionizing vertebrate feeding. Jawed fish can bite, grasp, and process food in new ways. This innovation eventually leads to the dominance of jawed vertebrates on Earth."
    },
    {
      "id": "event-first-insects",
      "name": "First Insects",
      "time": { "value": 410, "unit": "mya" },
      "relates_to": "period-devonian",
      "info": "Insects appear on land, evolving from crustacean-like ancestors. These six-legged arthropods will become the most diverse group of animals on Earth, eventually comprising over half of all known species."
    },
    {
      "id": "event-first-amphibians",
      "name": "First Amphibians",
      "time": { "value": 375, "unit": "mya" },
      "relates_to": "period-devonian",
      "info": "Tiktaalik and similar 'fishapods' bridge the gap between fish and tetrapods, using sturdy fins to prop themselves up in shallow water. True amphibians like Ichthyostega soon follow, becoming the first vertebrates to walk on land."
    },
    {
      "id": "event-devonian-extinction",
      "name": "Late Devonian Extinction",
      "time": { "value": 372, "unit": "mya" },
      "relates_to": "period-devonian",
      "info": "A prolonged extinction event kills about 75% of species over millions of years. Tropical marine species are hit hardest, including many reef-building organisms. The causes may include oxygen depletion, climate change, or asteroid impacts."
    },
    {
      "id": "event-first-reptiles",
      "name": "First Reptiles",
      "time": { "value": 312, "unit": "mya" },
      "relates_to": "period-carboniferous",
      "info": "Reptiles evolve the amniotic egg, which can be laid on land without drying out. This breakthrough frees vertebrates from dependence on water for reproduction. Hylonomus is among the earliest known reptiles."
    },
    {
      "id": "event-first-flying-insects",
      "name": "Giant Flying Insects",
      "time": { "value": 300, "unit": "mya" },
      "relates_to": "period-carboniferous",
      "info": "Insects take to the air, becoming the first animals to achieve powered flight. High oxygen levels allow giant forms like Meganeura, a dragonfly with a 70cm wingspan. Flight enables insects to exploit new ecological niches."
    },
    {
      "id": "event-permian-extinction",
      "name": "Permian Mass Extinction",
      "time": { "value": 252, "unit": "mya" },
      "relates_to": "period-permian",
      "info": "The 'Great Dying' eliminates about 96% of marine species and 70% of land species—the worst mass extinction in Earth's history. Massive volcanic eruptions in Siberia trigger climate change, ocean acidification, and oxygen depletion."
    },
    {
      "id": "event-first-dinosaurs",
      "name": "First Dinosaurs",
      "time": { "value": 233, "unit": "mya" },
      "relates_to": "period-triassic",
      "info": "Dinosaurs evolve from small, bipedal archosaurs. Early dinosaurs like Eoraptor and Herrerasaurus are modest-sized predators. They will eventually dominate terrestrial ecosystems for over 160 million years."
    },
    {
      "id": "event-first-mammals",
      "name": "First True Mammals",
      "time": { "value": 225, "unit": "mya" },
      "relates_to": "period-triassic",
      "info": "Mammals evolve from synapsid reptiles. Early mammals are small, nocturnal insectivores, living in the shadow of dinosaurs. Their warm-blooded metabolism, fur, and milk production will prove advantageous after the dinosaurs' extinction."
    },
    {
      "id": "event-triassic-extinction",
      "name": "Triassic-Jurassic Extinction",
      "time": { "value": 201, "unit": "mya" },
      "relates_to": "period-triassic",
      "info": "A mass extinction kills about 80% of species, including most large amphibians and many reptile groups. Volcanic activity as Pangaea breaks apart is the likely cause. Dinosaurs survive and diversify rapidly afterward."
    },
    {
      "id": "event-first-birds",
      "name": "First Birds",
      "time": { "value": 150, "unit": "mya" },
      "relates_to": "period-jurassic",
      "info": "Archaeopteryx, discovered in Germany, shows a mix of dinosaurian and avian features: feathered wings, teeth, and a bony tail. Birds evolve from small, feathered theropod dinosaurs, making modern birds living dinosaurs."
    },
    {
      "id": "event-first-flowering-plants",
      "name": "First Flowering Plants",
      "time": { "value": 130, "unit": "mya" },
      "relates_to": "period-cretaceous",
      "info": "Angiosperms (flowering plants) appear and begin their explosive diversification. Their flowers attract pollinators; their fruits spread seeds. By the end of the Cretaceous, they dominate most terrestrial ecosystems."
    },
    {
      "id": "event-kt-extinction",
      "name": "Cretaceous-Paleogene Extinction",
      "time": { "value": 66, "unit": "mya" },
      "relates_to": "period-cretaceous",
      "info": "An asteroid 10km wide strikes the Yucatan Peninsula, triggering global catastrophe. Dust and debris block sunlight; fires rage; temperatures plunge then spike. All non-avian dinosaurs perish, along with 75% of species. Mammals inherit the Earth."
    },
    {
      "id": "event-first-primates",
      "name": "First Primates",
      "time": { "value": 55, "unit": "mya" },
      "relates_to": "period-paleogene",
      "info": "Primates evolve, characterized by grasping hands, forward-facing eyes, and large brains relative to body size. Early primates like Plesiadapis are small, tree-dwelling creatures. They will eventually give rise to monkeys, apes, and humans."
    },
    {
      "id": "event-first-whales",
      "name": "Whales Return to Sea",
      "time": { "value": 50, "unit": "mya" },
      "relates_to": "period-paleogene",
      "info": "Cetaceans evolve from land-dwelling hoofed mammals. Pakicetus and Ambulocetus show the transition, with limbs gradually becoming flippers. Within 10 million years, fully aquatic whales roam the oceans."
    },
    {
      "id": "event-grasslands-spread",
      "name": "Grasslands Spread",
      "time": { "value": 25, "unit": "mya" },
      "relates_to": "period-neogene",
      "info": "Grasslands expand across continents as climate becomes cooler and drier. This new ecosystem drives the evolution of grazing mammals with specialized teeth and long legs for running on open plains."
    },
    {
      "id": "event-first-hominins",
      "name": "First Hominins",
      "time": { "value": 7, "unit": "mya" },
      "relates_to": "period-neogene",
      "info": "The human lineage splits from the ancestors of chimpanzees. Sahelanthropus tchadensis, discovered in Chad, may be near this divergence point. Early hominins begin developing bipedal locomotion in African forests."
    },
    {
      "id": "event-australopithecus",
      "name": "Australopithecus Appears",
      "time": { "value": 4, "unit": "mya" },
      "relates_to": "period-quaternary",
      "info": "Australopithecus, including the famous 'Lucy', walks upright in East Africa. These early human relatives have small brains but are fully bipedal, freeing their hands for tool use and carrying food."
    },
    {
      "id": "event-first-stone-tools",
      "name": "First Stone Tools",
      "time": { "value": 3.3, "unit": "mya" },
      "relates_to": "period-quaternary",
      "info": "The oldest known stone tools appear in East Africa, predating the genus Homo. These simple flakes and choppers mark a cognitive leap—the ability to plan, craft, and use technology to extend physical capabilities."
    },
    {
      "id": "event-homo-erectus",
      "name": "Homo erectus Emerges",
      "time": { "value": 1.9, "unit": "mya" },
      "relates_to": "period-quaternary",
      "info": "Homo erectus evolves with a larger brain, smaller face, and modern body proportions. This species masters fire, creates more sophisticated tools, and becomes the first hominin to leave Africa, spreading across Asia and Europe."
    },
    {
      "id": "event-first-fire-use",
      "name": "Controlled Use of Fire",
      "time": { "value": 1, "unit": "mya" },
      "relates_to": "period-quaternary",
      "info": "Hominins begin using fire regularly for cooking, warmth, and protection. Cooking makes food more digestible and nutritious, possibly enabling the evolution of larger brains. Fire extends the day and enables habitation of colder climates."
    },
    {
      "id": "event-homo-sapiens",
      "name": "Homo sapiens Evolves",
      "time": { "value": 300000, "unit": "years-ago" },
      "relates_to": "period-quaternary",
      "info": "Anatomically modern humans appear in Africa, distinguished by a globular skull, small face, and prominent chin. Fossils from Jebel Irhoud, Morocco push back our species' origin. Modern human behavior, including art and symbolism, follows."
    },
    {
      "id": "event-out-of-africa",
      "name": "Out of Africa Migration",
      "time": { "value": 70000, "unit": "years-ago" },
      "relates_to": "period-quaternary",
      "info": "Homo sapiens expands out of Africa, eventually colonizing every continent except Antarctica. Along the way, our ancestors encounter and interbreed with Neanderthals and Denisovans, whose DNA persists in modern populations."
    },
    {
      "id": "event-cave-art",
      "name": "First Cave Art",
      "time": { "value": 40000, "unit": "years-ago" },
      "relates_to": "period-quaternary",
      "info": "Humans create the earliest known cave paintings in Indonesia and Europe. These artworks—depicting animals, hands, and abstract patterns—demonstrate symbolic thinking, creativity, and the capacity for culture that defines our species."
    },
    {
      "id": "event-megafauna-extinction",
      "name": "Megafauna Extinction",
      "time": { "value": 12000, "unit": "years-ago" },
      "relates_to": "period-quaternary",
      "info": "Woolly mammoths, saber-toothed cats, giant sloths, and other large Ice Age mammals go extinct. Climate change and human hunting both contribute. These extinctions reshape ecosystems and remove ecological roles not yet refilled."
    },
    {
      "id": "event-agriculture",
      "name": "Agriculture Begins",
      "time": { "value": 10000, "unit": "years-ago" },
      "relates_to": "period-quaternary",
      "info": "Humans begin domesticating plants and animals in multiple regions independently. This Neolithic Revolution enables settled communities, population growth, and eventually cities and civilizations. It also brings new diseases and social hierarchies."
    }
  ],
  "periods": [
    {
      "id": "period-hadean",
      "name": "Hadean Eon",
      "startTime": { "value": 4540, "unit": "mya" },
      "endTime": { "value": 4000, "unit": "mya" },
      "info": "The earliest eon of Earth's history, named after Hades (the Greek underworld) for its hellish conditions. The Earth is molten, bombarded by asteroids, and has no stable crust, oceans, or life. The Moon forms from a giant impact. No rocks survive from this time."
    },
    {
      "id": "period-archean",
      "name": "Archean Eon",
      "startTime": { "value": 4000, "unit": "mya" },
      "endTime": { "value": 2500, "unit": "mya" },
      "info": "Life emerges on Earth during this eon. The first continents form as the crust stabilizes. Prokaryotic life (bacteria and archaea) dominates, with cyanobacteria eventually evolving photosynthesis and beginning to oxygenate the atmosphere. Stromatolites build layered structures in shallow seas."
    },
    {
      "id": "period-proterozoic",
      "name": "Proterozoic Eon",
      "startTime": { "value": 2500, "unit": "mya" },
      "endTime": { "value": 538.8, "unit": "mya" },
      "info": "The eon of 'earlier life' sees major evolutionary innovations: eukaryotic cells, sexual reproduction, and multicellular organisms. The Great Oxygenation Event transforms the atmosphere. Snowball Earth glaciations occur. By its end, the Ediacaran fauna—the first large, complex organisms—appears."
    },
    {
      "id": "period-cambrian",
      "name": "Cambrian Period",
      "startTime": { "value": 538.8, "unit": "mya" },
      "endTime": { "value": 485.4, "unit": "mya" },
      "info": "The Cambrian Explosion produces most major animal phyla in a geologically brief burst of evolution. Trilobites, anomalocarids, and the ancestors of all vertebrates appear. Hard shells and exoskeletons evolve, improving fossil preservation. The first predators drive an evolutionary arms race."
    },
    {
      "id": "period-ordovician",
      "name": "Ordovician Period",
      "startTime": { "value": 485.4, "unit": "mya" },
      "endTime": { "value": 443.8, "unit": "mya" },
      "info": "Marine life diversifies dramatically in the 'Great Ordovician Biodiversification Event'. Brachiopods, bryozoans, and corals flourish. Fish remain jawless. The first land plants appear. The period ends with a severe mass extinction caused by glaciation."
    },
    {
      "id": "period-silurian",
      "name": "Silurian Period",
      "startTime": { "value": 443.8, "unit": "mya" },
      "endTime": { "value": 419.2, "unit": "mya" },
      "info": "Life recovers from the Ordovician extinction. The first jawed fish and bony fish evolve. Vascular plants develop, allowing them to grow taller and spread across land. The first terrestrial arthropods—millipedes and early arachnids—colonize the land."
    },
    {
      "id": "period-devonian",
      "name": "Devonian Period",
      "startTime": { "value": 419.2, "unit": "mya" },
      "endTime": { "value": 358.9, "unit": "mya" },
      "info": "The 'Age of Fishes' sees incredible diversity among fish, including armored placoderms, sharks, and lobe-finned fish. The first forests grow on land. Insects appear. Vertebrates make the transition to land, with Tiktaalik bridging fish and amphibians. Ends with a prolonged mass extinction."
    },
    {
      "id": "period-carboniferous",
      "name": "Carboniferous Period",
      "startTime": { "value": 358.9, "unit": "mya" },
      "endTime": { "value": 298.9, "unit": "mya" },
      "info": "Vast swamp forests cover tropical lowlands, eventually forming the coal deposits that give this period its name. High oxygen levels allow giant insects. Amphibians diversify; the first reptiles evolve with their waterproof eggs. The supercontinent Pangaea begins forming."
    },
    {
      "id": "period-permian",
      "name": "Permian Period",
      "startTime": { "value": 298.9, "unit": "mya" },
      "endTime": { "value": 252, "unit": "mya" },
      "info": "Reptiles diversify and dominate land ecosystems. Synapsids (mammal ancestors) include the large, sail-backed Dimetrodon. Pangaea is fully assembled, creating vast interior deserts. The period ends with the catastrophic Permian-Triassic extinction, the worst in Earth's history."
    },
    {
      "id": "period-triassic",
      "name": "Triassic Period",
      "startTime": { "value": 252, "unit": "mya" },
      "endTime": { "value": 201.3, "unit": "mya" },
      "info": "Life recovers from the Great Dying. The first dinosaurs, mammals, pterosaurs, and marine reptiles evolve. Conifers and cycads dominate plant life. Pangaea begins breaking apart. Another mass extinction at the period's end clears the way for dinosaur dominance."
    },
    {
      "id": "period-jurassic",
      "name": "Jurassic Period",
      "startTime": { "value": 201.3, "unit": "mya" },
      "endTime": { "value": 145, "unit": "mya" },
      "info": "The 'Age of Dinosaurs' reaches its peak. Sauropods like Brachiosaurus and Diplodocus become the largest land animals ever. Theropods include Allosaurus and early tyrannosaurs. The first birds evolve from feathered dinosaurs. Pangaea continues splitting."
    },
    {
      "id": "period-cretaceous",
      "name": "Cretaceous Period",
      "startTime": { "value": 145, "unit": "mya" },
      "endTime": { "value": 66, "unit": "mya" },
      "info": "The longest period of the Mesozoic Era. Flowering plants revolutionize ecosystems, co-evolving with pollinating insects. Tyrannosaurus, Triceratops, and the giant sauropod Argentinosaurus roam. The period ends abruptly with the asteroid impact that eliminates non-avian dinosaurs."
    },
    {
      "id": "period-paleogene",
      "name": "Paleogene Period",
      "startTime": { "value": 66, "unit": "mya" },
      "endTime": { "value": 23, "unit": "mya" },
      "info": "Mammals rapidly diversify to fill ecological niches left by dinosaurs. Modern mammal orders appear: primates, rodents, carnivores, whales, and more. Birds also diversify. India collides with Asia, raising the Himalayas. Climate cools gradually."
    },
    {
      "id": "period-neogene",
      "name": "Neogene Period",
      "startTime": { "value": 23, "unit": "mya" },
      "endTime": { "value": 2.6, "unit": "mya" },
      "info": "Grasslands spread as climate becomes cooler and drier, driving evolution of grazing mammals. Apes diversify in Africa; great apes and early hominins diverge. The Panama land bridge forms, connecting North and South America and enabling the Great American Interchange."
    },
    {
      "id": "period-quaternary",
      "name": "Quaternary Period",
      "startTime": { "value": 2.6, "unit": "mya" },
      "info": "The current geological period, defined by cycles of ice ages. Homo erectus, Neanderthals, and Homo sapiens evolve. Humans spread across the globe, develop agriculture, and transform the planet. Many large mammals go extinct as humans expand."
    },
    {
      "id": "period-age-of-fish",
      "name": "Age of Fishes",
      "startTime": { "value": 530, "unit": "mya" },
      "endTime": { "value": 360, "unit": "mya" },
      "info": "Fish dominate the oceans from the Cambrian through the Devonian. Jawless fish give way to jawed fish, including placoderms, sharks, and bony fish. Lobe-finned fish give rise to the first tetrapods, beginning the vertebrate conquest of land."
    },
    {
      "id": "period-age-of-dinosaurs",
      "name": "Age of Dinosaurs",
      "startTime": { "value": 233, "unit": "mya" },
      "endTime": { "value": 66, "unit": "mya" },
      "info": "Dinosaurs dominate terrestrial ecosystems for over 160 million years—longer than any other group of large land animals. They evolve into thousands of species, from tiny feathered theropods to the largest animals to ever walk the Earth."
    },
    {
      "id": "period-age-of-mammals",
      "name": "Age of Mammals",
      "startTime": { "value": 66, "unit": "mya" },
      "info": "Following the extinction of non-avian dinosaurs, mammals diversify explosively. From tiny insectivores, they evolve into forms as diverse as whales, bats, elephants, and humans. Mammals occupy nearly every ecological niche on land, sea, and air."
    },
    {
      "id": "period-human-evolution",
      "name": "Human Evolution",
      "startTime": { "value": 7, "unit": "mya" },
      "info": "The human lineage diverges from other apes and evolves through multiple species. Bipedalism, tool use, enlarged brains, and language develop over millions of years. Homo sapiens emerges in Africa and eventually becomes the dominant species on Earth."
    }
  ],
  "connectors": [
    {
      "id": "conn-hadean-archean",
      "fromId": "period-hadean",
      "toId": "period-archean",
      "type": "defined",
      "metadata": {
        "note": "Earth stabilizes, enabling the emergence of life"
      }
    },
    {
      "id": "conn-archean-proterozoic",
      "fromId": "period-archean",
      "toId": "period-proterozoic",
      "type": "defined",
      "metadata": {
        "note": "Oxygenation transforms the planet"
      }
    },
    {
      "id": "conn-proterozoic-cambrian",
      "fromId": "period-proterozoic",
      "toId": "period-cambrian",
      "type": "defined",
      "metadata": {
        "note": "Multicellular life leads to the Cambrian Explosion"
      }
    },
    {
      "id": "conn-devonian-carboniferous",
      "fromId": "period-devonian",
      "toId": "period-carboniferous",
      "type": "defined",
      "metadata": {
        "note": "Land vertebrates from fish ancestors flourish in coal swamps"
      }
    },
    {
      "id": "conn-permian-triassic",
      "fromId": "period-permian",
      "toId": "period-triassic",
      "type": "defined",
      "metadata": {
        "note": "Great Dying reshapes life, dinosaurs emerge"
      }
    },
    {
      "id": "conn-fish-to-age",
      "fromId": "period-cambrian",
      "toId": "period-age-of-fish",
      "type": "defined",
      "metadata": {
        "note": "First vertebrates begin fish dominance"
      }
    },
    {
      "id": "conn-triassic-dinosaurs",
      "fromId": "period-triassic",
      "toId": "period-age-of-dinosaurs",
      "type": "defined",
      "metadata": {
        "note": "Dinosaurs evolve and begin their reign"
      }
    },
    {
      "id": "conn-dinosaurs-mammals",
      "fromId": "period-age-of-dinosaurs",
      "toId": "period-age-of-mammals",
      "type": "defined",
      "metadata": {
        "note": "Dinosaur extinction enables mammal diversification"
      }
    },
    {
      "id": "conn-cretaceous-paleogene",
      "fromId": "period-cretaceous",
      "toId": "period-paleogene",
      "type": "defined",
      "metadata": {
        "note": "Mass extinction ends the Mesozoic, mammals inherit Earth"
      }
    },
    {
      "id": "conn-neogene-human",
      "fromId": "period-neogene",
      "toId": "period-human-evolution",
      "type": "defined",
      "metadata": {
        "note": "Hominin lineage diverges from other apes"
      }
    },
    {
      "id": "conn-mammals-human",
      "fromId": "period-age-of-mammals",
      "toId": "period-human-evolution",
      "type": "undefined",
      "metadata": {
        "note": "Primates evolve within mammalian radiation"
      }
    },
    {
      "id": "conn-jurassic-cretaceous",
      "fromId": "period-jurassic",
      "toId": "period-cretaceous",
      "type": "defined",
      "metadata": {
        "note": "Dinosaur dominance continues, birds diversify"
      }
    }
  ]
}
)

Timeline.create(
  name: "History of Civilizations",
  timeline_data: {
  "events": [
    {
      "id": "event-lomekwi-tools",
      "name": "Oldest Known Stone Tools (Lomekwi)",
      "time": { "value": 3.3, "unit": "mya" },
      "info": "Stone tools discovered at Lomekwi 3 in Kenya represent the oldest known manufactured artifacts. These pre-Oldowan tools, likely made by Australopithecus or Kenyanthropus, predate the emergence of the Homo genus and push back the origins of tool-making by 700,000 years."
    },
    {
      "id": "event-genus-homo",
      "name": "Genus Homo Appears",
      "time": { "value": 2.8, "unit": "mya" },
      "relates_to": "period-lower-paleolithic",
      "info": "The first members of the genus Homo emerge in East Africa, distinguished from earlier Australopithecines by larger brains and more sophisticated tool use. Homo habilis ('handy man') is among the earliest species, associated with systematic tool manufacturing."
    },
    {
      "id": "event-oldowan-tools",
      "name": "Oldowan Tool Industry Begins",
      "time": { "value": 2.6, "unit": "mya" },
      "relates_to": "period-lower-paleolithic",
      "info": "The Oldowan stone tool tradition emerges in East Africa, associated with early Homo species. These simple choppers and flakes represent the first standardized tool-making technology, persisting for over a million years."
    },
    {
      "id": "event-homo-erectus-fire",
      "name": "Fire Use at Bnot Ya'akov Bridge",
      "time": { "value": 790000, "unit": "years-ago" },
      "relates_to": "period-lower-paleolithic",
      "info": "Evidence from Bnot Ya'akov Bridge in Israel provides the most widely accepted early claim of controlled fire use by Homo erectus or Homo ergaster. Fire enables cooking, warmth, protection, and extends human activity into the night."
    },
    {
      "id": "event-first-fire",
      "name": "Earliest Evidence of Controlled Fire",
      "time": { "value": 1, "unit": "mya" },
      "info": "Evidence from Wonderwerk Cave in South Africa suggests hominins were using controlled fire by this time. Fire provided warmth, protection from predators, and the ability to cook food—potentially enabling the evolution of larger brains."
    },
    {
      "id": "event-oldest-homo-sapiens",
      "name": "Oldest Homo Sapiens Fossils",
      "time": { "value": 300000, "unit": "years-ago" },
      "info": "Fossils from Jebel Irhoud in Morocco represent the earliest known anatomically modern humans. These remains push back the origin of our species by 100,000 years and suggest Homo sapiens evolved across Africa rather than in a single location."
    },
    {
      "id": "event-oldest-burial",
      "name": "Earliest Known Intentional Burial",
      "time": { "value": 100000, "unit": "years-ago" },
      "relates_to": "period-middle-paleolithic",
      "info": "Burials at Qafzeh Cave in Israel provide the earliest clear evidence of intentional human burial, with bodies placed in prepared graves with grave goods. This suggests early symbolic thinking and possibly beliefs about death and afterlife."
    },
    {
      "id": "event-invention-clothing",
      "name": "Invention of Clothing",
      "time": { "value": 170000, "unit": "years-ago" },
      "relates_to": "period-middle-paleolithic",
      "info": "Genetic studies of body lice suggest clothing was invented between 170,000 and 83,000 years ago. Clothing enabled humans to survive in colder climates and was essential for migration into Europe, Asia, and eventually the Americas."
    },
    {
      "id": "event-toba-eruption",
      "name": "Toba Supervolcano Eruption",
      "time": { "value": 75000, "unit": "years-ago" },
      "relates_to": "period-middle-paleolithic",
      "info": "The Toba supervolcano in Sumatra erupts in one of Earth's largest known volcanic events, ejecting 2,800 cubic kilometers of material. Some researchers propose this caused a volcanic winter and human population bottleneck, though this remains debated."
    },
    {
      "id": "event-out-of-africa",
      "name": "Major Human Migration Out of Africa",
      "time": { "value": 70000, "unit": "years-ago" },
      "info": "Homo sapiens begins the major wave of migration out of Africa that will eventually colonize every continent. Genetic evidence suggests a population bottleneck around this time, possibly linked to the Toba supervolcanic eruption."
    },
    {
      "id": "event-oldest-figurative-art",
      "name": "Oldest Figurative Art (Sulawesi Cave)",
      "time": { "value": 45500, "unit": "years-ago" },
      "relates_to": "period-upper-paleolithic",
      "info": "A cave painting of a warty pig in Sulawesi, Indonesia represents the oldest known figurative artwork. This discovery proves that symbolic artistic expression emerged independently in both Europe and Southeast Asia."
    },
    {
      "id": "event-australia-settlement",
      "name": "Human Settlement of Australia",
      "time": { "value": 40000, "unit": "years-ago" },
      "relates_to": "period-upper-paleolithic",
      "info": "Indigenous Australians become the first humans to colonize Australia, crossing from Southeast Asia via land bridges and short sea voyages. This represents the earliest known sea crossing by humans and the colonization of an entirely new continent."
    },
    {
      "id": "event-new-guinea-settlement",
      "name": "Human Settlement of New Guinea",
      "time": { "value": 30500, "unit": "years-ago" },
      "relates_to": "period-upper-paleolithic",
      "info": "New Guinea is populated by colonists from Asia or Australia. The island's inhabitants will later independently develop agriculture, making it one of the few places where farming originated independently."
    },
    {
      "id": "event-gravettian-inventions",
      "name": "Gravettian Culture and Inventions",
      "time": { "value": 28000, "unit": "years-ago" },
      "relates_to": "period-upper-paleolithic",
      "info": "The Gravettian culture flourishes in Europe, producing sophisticated tools including harpoons, needles, and saws. This period sees the creation of famous Venus figurines and advances in clothing and shelter construction."
    },
    {
      "id": "event-last-glacial-maximum",
      "name": "Last Glacial Maximum",
      "time": { "value": 26500, "unit": "years-ago" },
      "relates_to": "period-upper-paleolithic",
      "info": "Global ice sheets reach their maximum extent, with sea levels dropping 120 meters below present. Ice covers much of North America and northern Europe. Human populations retreat to refugia, later recolonizing as ice melts."
    },
    {
      "id": "event-oldest-settlement",
      "name": "Oldest Permanent Settlement (Dolní Věstonice)",
      "time": { "value": 25000, "unit": "years-ago" },
      "relates_to": "period-upper-paleolithic",
      "info": "A settlement of huts built from rocks and mammoth bones near Dolní Věstonice in Moravia (Czech Republic) represents the oldest known permanent human settlement found by archaeologists."
    },
    {
      "id": "event-lion-man",
      "name": "Lion-Man of Hohlenstein-Stadel Carved",
      "time": { "value": 40000, "unit": "years-ago" },
      "info": "The Lion-Man, a 31cm ivory sculpture of a human-lion hybrid found in Germany, is one of the oldest known examples of figurative art and demonstrates sophisticated symbolic thinking and craftsmanship in Ice Age Europe."
    },
    {
      "id": "event-oldest-flute",
      "name": "Oldest Known Musical Instrument",
      "time": { "value": 40000, "unit": "years-ago" },
      "relates_to": "period-upper-paleolithic",
      "info": "Bone flutes discovered in Hohle Fels cave in Germany, made from bird bones and mammoth ivory, represent the earliest known musical instruments. Music likely played important roles in social bonding and ritual."
    },
    {
      "id": "event-chauvet-cave",
      "name": "Chauvet Cave Paintings Created",
      "time": { "value": 36000, "unit": "years-ago" },
      "info": "Artists in southern France create sophisticated paintings of lions, mammoths, rhinoceroses, and other animals in Chauvet Cave. The artistic skill and use of perspective rivals much later artwork."
    },
    {
      "id": "event-lascaux-cave",
      "name": "Lascaux Cave Paintings Created",
      "time": { "value": 17000, "unit": "years-ago" },
      "info": "The famous Lascaux cave paintings in France depict horses, deer, bison, and other animals with remarkable artistry. The 'Hall of Bulls' contains some of the most impressive prehistoric art ever discovered."
    },
    {
      "id": "event-oldest-pottery",
      "name": "Oldest Known Pottery",
      "time": { "value": 20000, "unit": "years-ago" },
      "info": "Ceramic fragments from Xianrendong Cave in China represent the oldest known pottery, created by hunter-gatherers during the Last Glacial Maximum. This predates agriculture and the traditional association of pottery with settled life."
    },
    {
      "id": "event-natufian-culture",
      "name": "Natufian Culture Flourishes",
      "time": { "value": 12500, "unit": "bce" },
      "relates_to": "period-mesolithic",
      "info": "The Natufian culture emerges in the Levant as sedentary hunter-gatherers who may have cultivated wild rye. Living in permanent villages, they represent a crucial transition between mobile foraging and settled agricultural life."
    },
    {
      "id": "event-agriculture-origins",
      "name": "Emergence of Agriculture",
      "time": { "value": 12000, "unit": "years-ago" },
      "relates_to": "period-neolithic",
      "info": "The Neolithic Revolution begins independently in multiple regions as humans start domesticating plants and animals. The Fertile Crescent sees early cultivation of wheat and barley, transforming human society from nomadic to settled."
    },
    {
      "id": "event-first-figs",
      "name": "First Cultivated Figs",
      "time": { "value": 9400, "unit": "bce" },
      "relates_to": "period-neolithic",
      "info": "Parthenocarpic (sterile) figs cultivated at Gilgal I in the Jordan Valley may represent the earliest known instance of agriculture, predating the domestication of wheat, barley, and legumes by about a thousand years."
    },
    {
      "id": "event-jericho-tower",
      "name": "Tower of Jericho Built",
      "time": { "value": 8000, "unit": "bce" },
      "relates_to": "period-neolithic",
      "info": "A round stone tower 8.5 meters high and 8.5 meters in diameter is built at Jericho, one of the oldest known stone monuments. Its purpose remains debated—possibly defensive, ceremonial, or for flood protection."
    },
    {
      "id": "event-mehrgarh-founded",
      "name": "Mehrgarh Settlement Founded",
      "time": { "value": 7000, "unit": "bce" },
      "relates_to": "period-mehrgarh",
      "info": "One of the earliest Neolithic settlements in South Asia is established at Mehrgarh in Balochistan (modern Pakistan). Inhabitants cultivate wheat and barley, domesticate cattle, sheep and goats, and develop mud-brick architecture. This pre-Harappan culture lays the foundation for the later Indus Valley Civilization."
    },
    {
      "id": "event-mehrgarh-pottery",
      "name": "Mehrgarh Pottery and Craft Production",
      "time": { "value": 5500, "unit": "bce" },
      "relates_to": "period-mehrgarh",
      "info": "Mehrgarh develops sophisticated pottery, bead-making, and metallurgy. Artisans create distinctive ceramics and drill tiny beads from semi-precious stones. Evidence of early dentistry—drilling teeth to treat decay—appears at this site, the oldest known dental work."
    },
    {
      "id": "event-catal-huyuk",
      "name": "Çatalhöyük Settlement Founded",
      "time": { "value": 7500, "unit": "bce" },
      "relates_to": "period-neolithic",
      "info": "One of the world's first proto-cities emerges in Anatolia, housing up to 10,000 people. Residents enter homes through roof hatches, decorate walls with murals and reliefs, and bury dead beneath house floors."
    },
    {
      "id": "event-copper-smelting",
      "name": "Earliest Copper Smelting",
      "time": { "value": 5000, "unit": "bce" },
      "relates_to": "period-chalcolithic",
      "info": "Copper smelting begins in the Balkans and possibly independently in other regions. The Vinča culture in Serbia provides some of the oldest securely dated evidence of high-temperature copper working."
    },
    {
      "id": "event-proto-cuneiform",
      "name": "Proto-Cuneiform Writing Appears",
      "time": { "value": 3700, "unit": "bce" },
      "relates_to": "period-chalcolithic",
      "info": "Pictographic proto-writing appears in Sumer for record-keeping, representing the earliest known writing system. Initially used for accounting and administration, it will evolve into full cuneiform script."
    },
    {
      "id": "event-otzi-iceman",
      "name": "Ötzi the Iceman Dies",
      "time": { "value": 3300, "unit": "bce" },
      "relates_to": "period-chalcolithic",
      "info": "A man later known as Ötzi dies in the Alps, his body preserved by ice until discovery in 1991. His copper axe, clothing, and equipment provide extraordinary insight into Chalcolithic life. Evidence suggests he was murdered."
    },
    {
      "id": "event-skara-brae",
      "name": "Skara Brae Settlement Built",
      "time": { "value": 3100, "unit": "bce" },
      "relates_to": "period-neolithic",
      "info": "A stone-built Neolithic village is constructed in Orkney, Scotland, featuring ten clustered houses with stone hearths, beds, cupboards, and a sophisticated drainage system. Occupied for 600 years before abandonment."
    },
    {
      "id": "event-stonehenge",
      "name": "Stonehenge Construction Begins",
      "time": { "value": 3000, "unit": "bce" },
      "relates_to": "period-neolithic",
      "info": "Construction begins on Stonehenge in England, initially as a circular ditch and bank with 56 wooden posts. The famous stone circle is added later, with some stones transported from Wales, 150 miles away."
    },
    {
      "id": "event-yamnaya-expansion",
      "name": "Yamnaya Migrations Begin",
      "time": { "value": 3000, "unit": "bce" },
      "relates_to": "period-bronze-age",
      "info": "Pastoral nomads from the Pontic-Caspian steppe begin expanding into Europe and Asia. These migrations spread Yamnaya ancestry and are thought to have carried Indo-European languages across much of Eurasia."
    },
    {
      "id": "event-cuneiform",
      "name": "Invention of Cuneiform Writing",
      "time": { "value": 3400, "unit": "bce" },
      "relates_to": "period-sumer",
      "info": "The Sumerians develop cuneiform, one of the earliest writing systems. Initially used for record-keeping, it evolves to record literature, law, and science. Cuneiform is adapted by subsequent Mesopotamian civilizations."
    },
    {
      "id": "event-pyramids-giza",
      "name": "Great Pyramids of Giza Built",
      "time": { "value": 2560, "unit": "bce" },
      "relates_to": "period-egypt",
      "info": "Pharaoh Khufu commissions the Great Pyramid, the largest of the Giza pyramids. These monuments demonstrate Egypt's organizational capacity, engineering knowledge, and religious beliefs about the afterlife."
    },
    {
      "id": "event-code-hammurabi",
      "name": "Code of Hammurabi",
      "time": { "value": 1754, "unit": "bce" },
      "relates_to": "period-babylon",
      "info": "Babylonian king Hammurabi promulgates one of the oldest known written legal codes. Its 282 laws cover family, commerce, and criminal matters, establishing the principle of 'an eye for an eye'."
    },
    {
      "id": "event-bronze-age-collapse",
      "name": "Bronze Age Collapse",
      "time": { "value": 1200, "unit": "bce" },
      "relates_to": "period-hittite",
      "info": "A catastrophic period sees the fall of multiple Mediterranean civilizations including the Hittites, Mycenaeans, and others. Causes may include climate change, invasions by 'Sea Peoples', and systemic failures. Ushers in a centuries-long 'dark age'."
    },
    {
      "id": "event-founding-rome",
      "name": "Traditional Founding of Rome",
      "time": { "value": 753, "unit": "bce" },
      "relates_to": "period-rome",
      "info": "According to legend, Romulus founds Rome after killing his twin brother Remus. Archaeological evidence suggests the settlement actually developed gradually from earlier Latin and Etruscan communities."
    },
    {
      "id": "event-first-olympics",
      "name": "First Olympic Games",
      "time": { "value": 776, "unit": "bce" },
      "relates_to": "period-greece",
      "info": "The first recorded Olympic Games are held at Olympia in honor of Zeus. The games become a unifying event for Greek city-states, establishing a four-year cycle and a tradition lasting over a millennium."
    },
    {
      "id": "event-athenian-democracy",
      "name": "Athenian Democracy Established",
      "time": { "value": 508, "unit": "bce" },
      "relates_to": "period-greece",
      "info": "Cleisthenes reforms Athenian government, creating the world's first known democracy. Citizens participate directly in legislation and judicial decisions, though women, slaves, and foreigners are excluded."
    },
    {
      "id": "event-persian-wars",
      "name": "Persian Wars Begin",
      "time": { "value": 499, "unit": "bce" },
      "relates_to": "period-persia-achaemenid",
      "info": "The Ionian Revolt against Persian rule sparks decades of conflict between Greece and Persia. Key battles at Marathon, Thermopylae, and Salamis become legendary, shaping Greek identity and Western historical memory."
    },
    {
      "id": "event-alexander-conquest",
      "name": "Alexander Conquers Persia",
      "time": { "value": 330, "unit": "bce" },
      "relates_to": "period-macedon",
      "info": "Alexander the Great defeats Darius III and conquers the Achaemenid Empire. His campaigns spread Greek culture from Egypt to India, initiating the Hellenistic period of cultural fusion."
    },
    {
      "id": "event-qin-unification",
      "name": "Qin Unifies China",
      "time": { "value": 221, "unit": "bce" },
      "relates_to": "period-qin",
      "info": "Qin Shi Huang conquers rival states and establishes China's first unified empire. He standardizes weights, measures, currency, and writing, and begins construction of the Great Wall. His brutal reign ends after just 15 years."
    },
    {
      "id": "event-punic-wars-end",
      "name": "Rome Destroys Carthage",
      "time": { "value": 146, "unit": "bce" },
      "relates_to": "period-rome",
      "info": "Rome defeats Carthage in the Third Punic War, destroying the city and salting the earth. Rome becomes the dominant power in the Mediterranean, controlling North Africa, Spain, and beyond."
    },
    {
      "id": "event-julius-caesar-assassination",
      "name": "Assassination of Julius Caesar",
      "time": { "value": 44, "unit": "bce" },
      "relates_to": "period-rome",
      "info": "Julius Caesar is assassinated by senators fearing his dictatorial power. His death triggers civil war and ultimately the end of the Roman Republic, as his adopted heir Octavian becomes Emperor Augustus."
    },
    {
      "id": "event-silk-road-established",
      "name": "Silk Road Trade Flourishes",
      "time": { "value": 130, "unit": "bce" },
      "relates_to": "period-han",
      "info": "The Han Dynasty establishes regular diplomatic and trade contact with Central Asia following Zhang Qian's expeditions. The Silk Road connects China with Persia, India, and eventually Rome, facilitating exchange of goods, ideas, and religions."
    },
    {
      "id": "event-fall-western-rome",
      "name": "Fall of Western Roman Empire",
      "time": "0476-09-04",
      "relates_to": "period-rome",
      "info": "Germanic chieftain Odoacer deposes the last Western Roman Emperor, Romulus Augustulus. This date traditionally marks the end of ancient Rome and the beginning of the medieval period in Western Europe."
    },
    {
      "id": "event-justinian-code",
      "name": "Justinian's Code Compiled",
      "time": "0529-04-07",
      "relates_to": "period-byzantine",
      "info": "Emperor Justinian I codifies Roman law into the Corpus Juris Civilis. This compilation preserves and systematizes centuries of legal thought, becoming the foundation of civil law systems throughout Europe."
    },
    {
      "id": "event-islam-founding",
      "name": "Muhammad's Revelation",
      "time": "0610-08-10",
      "relates_to": "period-rashidun",
      "info": "Prophet Muhammad receives his first revelation from the angel Gabriel in a cave near Mecca. This begins the religion of Islam, which will rapidly spread to create one of history's largest empires."
    },
    {
      "id": "event-arab-conquest-persia",
      "name": "Arab Conquest of Persia",
      "time": "0651-01-01",
      "relates_to": "period-rashidun",
      "info": "The Rashidun Caliphate completes the conquest of the Sasanian Persian Empire following the Battle of Nahavand. Persia gradually converts to Islam while retaining its distinct cultural identity."
    },
    {
      "id": "event-battle-tours",
      "name": "Battle of Tours",
      "time": "0732-10-10",
      "relates_to": "period-umayyad",
      "info": "Charles Martel's Frankish forces halt the Umayyad advance into Western Europe near Tours, France. Often seen as a turning point that preserved Christian Europe, though its significance is debated by historians."
    },
    {
      "id": "event-abbasid-revolution",
      "name": "Abbasid Revolution",
      "time": "0750-01-25",
      "relates_to": "period-abbasid",
      "info": "The Abbasids overthrow the Umayyad Caliphate, massacring most of the ruling family. The new dynasty moves the capital to Baghdad and presides over an Islamic Golden Age of science, philosophy, and culture."
    },
    {
      "id": "event-charlemagne-crowned",
      "name": "Charlemagne Crowned Emperor",
      "time": "0800-12-25",
      "info": "Pope Leo III crowns Charlemagne as Emperor of the Romans, reviving the Western Roman imperial title. This marks the beginning of what will become the Holy Roman Empire and establishes the precedent of papal authority to crown emperors."
    },
    {
      "id": "event-maya-classic-collapse",
      "name": "Classic Maya Collapse",
      "time": { "value": 900, "unit": "ce" },
      "relates_to": "period-maya",
      "info": "Major Maya cities in the southern lowlands are abandoned over several decades. Causes may include drought, warfare, overpopulation, and environmental degradation. Maya civilization continues in the northern Yucatan."
    },
    {
      "id": "event-great-schism",
      "name": "Great Schism",
      "time": "1054-07-16",
      "relates_to": "period-byzantine",
      "info": "Mutual excommunications between the Pope and the Patriarch of Constantinople formalize the split between Roman Catholic and Eastern Orthodox Christianity. The divide reflects centuries of theological, political, and cultural divergence."
    },
    {
      "id": "event-genghis-khan-unifies",
      "name": "Genghis Khan Unifies Mongols",
      "time": "1206-01-01",
      "relates_to": "period-mongol",
      "info": "Temujin is proclaimed Genghis Khan ('Universal Ruler') at a great assembly of Mongol tribes. He creates a disciplined military machine that will conquer the largest contiguous land empire in history."
    },
    {
      "id": "event-mongol-sack-baghdad",
      "name": "Mongols Sack Baghdad",
      "time": "1258-02-10",
      "relates_to": "period-mongol",
      "info": "Hulagu Khan's Mongol army destroys Baghdad, ending the Abbasid Caliphate. The city's libraries are destroyed, its population massacred. This marks the end of the Islamic Golden Age and shifts power in the Islamic world."
    },
    {
      "id": "event-black-death",
      "name": "Black Death Reaches Europe",
      "time": "1347-10-01",
      "info": "The bubonic plague arrives in Europe via Genoese trading ships from Crimea. Over the next five years, it kills 30-60% of Europe's population, transforming society, economy, and culture."
    },
    {
      "id": "event-fall-constantinople",
      "name": "Fall of Constantinople",
      "time": "1453-05-29",
      "relates_to": "period-ottoman",
      "info": "Ottoman Sultan Mehmed II captures Constantinople after a 53-day siege, ending the Byzantine Empire. The city becomes Istanbul, capital of the Ottoman Empire. Greek scholars flee west, contributing to the Renaissance."
    },
    {
      "id": "event-columbus-voyage",
      "name": "Columbus Reaches Americas",
      "time": "1492-10-12",
      "info": "Christopher Columbus, sailing for Spain, reaches the Bahamas, initiating sustained European contact with the Americas. This begins the Columbian Exchange and the eventual devastation of indigenous American civilizations."
    },
    {
      "id": "event-tenochtitlan-fall",
      "name": "Fall of Tenochtitlan",
      "time": "1521-08-13",
      "relates_to": "period-aztec",
      "info": "Spanish conquistador Hernán Cortés, allied with indigenous enemies of the Aztecs, captures Tenochtitlan after a brutal siege. The Aztec Empire falls, and Spain establishes New Spain on its ruins."
    },
    {
      "id": "event-inca-fall",
      "name": "Conquest of the Inca Empire",
      "time": "1533-08-29",
      "relates_to": "period-inca",
      "info": "Francisco Pizarro executes the Inca emperor Atahualpa despite receiving an enormous ransom. The Spanish complete their conquest of the Inca Empire, seizing vast quantities of gold and silver."
    },
    {
      "id": "event-mughal-founding",
      "name": "Mughal Empire Founded",
      "time": "1526-04-21",
      "relates_to": "period-mughal",
      "info": "Babur, a descendant of Timur and Genghis Khan, defeats the Delhi Sultanate at the First Battle of Panipat. He establishes the Mughal Empire, which will rule most of the Indian subcontinent for over three centuries."
    },
    {
      "id": "event-taj-mahal",
      "name": "Taj Mahal Completed",
      "time": "1653-01-01",
      "relates_to": "period-mughal",
      "info": "Mughal Emperor Shah Jahan completes the Taj Mahal as a mausoleum for his wife Mumtaz Mahal. The white marble monument becomes one of the world's most recognized symbols of architectural beauty and devotion."
    },
    {
      "id": "event-ottoman-siege-vienna",
      "name": "Siege of Vienna",
      "time": "1683-09-12",
      "relates_to": "period-ottoman",
      "info": "The Ottoman Empire's second siege of Vienna fails when a relief force led by Polish King Jan III Sobieski defeats the Ottoman army. This marks the beginning of Ottoman territorial decline in Europe."
    },
    {
      "id": "event-qing-conquest",
      "name": "Qing Dynasty Established",
      "time": "1644-06-06",
      "relates_to": "period-qing",
      "info": "Manchu forces capture Beijing as the Ming Dynasty collapses. The Qing Dynasty will rule China for nearly 300 years, expanding the empire to its greatest territorial extent."
    },
    {
      "id": "event-french-revolution",
      "name": "French Revolution Begins",
      "time": "1789-07-14",
      "info": "The storming of the Bastille marks the beginning of the French Revolution. Revolutionary ideals of liberty, equality, and fraternity spread across Europe, challenging traditional monarchies and inspiring independence movements."
    },
    {
      "id": "event-opium-wars",
      "name": "First Opium War",
      "time": "1839-09-04",
      "relates_to": "period-qing",
      "info": "Britain attacks China to force continued opium trade, defeating the Qing military. The Treaty of Nanking cedes Hong Kong and opens treaty ports, beginning China's 'Century of Humiliation'."
    },
    {
      "id": "event-meiji-restoration",
      "name": "Meiji Restoration",
      "time": "1868-01-03",
      "relates_to": "period-japan-imperial",
      "info": "Emperor Meiji is restored to power, ending the Tokugawa shogunate. Japan embarks on rapid modernization and industrialization, transforming from feudal society to world power within decades."
    },
    {
      "id": "event-ottoman-end",
      "name": "Ottoman Empire Dissolved",
      "time": "1922-11-01",
      "relates_to": "period-ottoman",
      "info": "The Turkish Grand National Assembly abolishes the Ottoman Sultanate, ending over 600 years of Ottoman rule. Mustafa Kemal Atatürk establishes the secular Republic of Turkey the following year."
    },
    {
      "id": "event-qing-fall",
      "name": "Fall of Qing Dynasty",
      "time": "1912-02-12",
      "relates_to": "period-qing",
      "info": "The last Qing emperor, the child Puyi, abdicates following the Xinhai Revolution. Two thousand years of imperial rule in China ends, replaced by the Republic of China."
    }
  ],
  "periods": [
    {
      "id": "period-lower-paleolithic",
      "name": "Lower Paleolithic",
      "startTime": { "value": 3.3, "unit": "mya" },
      "endTime": { "value": 300000, "unit": "years-ago" },
      "info": "The earliest and longest period of the Stone Age, beginning with the first stone tools at Lomekwi in Kenya. Early hominins including Homo habilis and Homo erectus develop increasingly sophisticated tool-making techniques, from simple Oldowan choppers to the more refined Acheulean hand axes. Fire is controlled, and hominins spread from Africa to Asia and Europe."
    },
    {
      "id": "period-middle-paleolithic",
      "name": "Middle Paleolithic",
      "startTime": { "value": 300000, "unit": "years-ago" },
      "endTime": { "value": 50000, "unit": "years-ago" },
      "info": "The era when anatomically modern Homo sapiens emerges in Africa. Neanderthals thrive in Europe and Western Asia, developing the Mousterian tool culture. This period sees the first definitive evidence of controlled fire use, intentional burials suggesting symbolic thought, invention of clothing, and the beginning of behavioral modernity including language."
    },
    {
      "id": "period-upper-paleolithic",
      "name": "European Upper Paleolithic",
      "startTime": { "value": 50000, "unit": "years-ago" },
      "endTime": { "value": 12000, "unit": "years-ago" },
      "info": "A period of rapid cultural innovation as modern humans spread across the globe. Cave art flourishes at sites like Chauvet and Lascaux. Sophisticated tools including harpoons, needles, and saws are invented. The first permanent settlements appear, humans colonize Australia and the Americas, and Neanderthals go extinct."
    },
    {
      "id": "period-european-mesolithic",
      "name": "European Mesolithic",
      "startTime": { "value": 15000, "unit": "years-ago" },
      "endTime": { "value": 5000, "unit": "bce" },
      "info": "The 'Middle Stone Age' bridges the Paleolithic and Neolithic, beginning as glaciers retreat at the end of the Pleistocene. Characterized by microlithic tools, fishing tackle, and the first canoes. The Natufian culture in the Levant represents sedentary hunter-gatherers who may have begun cultivating wild cereals."
    },
    {
      "id": "period-wa-mesolithic",
      "name": "West Asian Mesolithic",
      "startTime": { "value": 20000, "unit": "years-ago" },
      "endTime": { "value": 10000, "unit": "bce" },
      "info": "The 'Middle Stone Age' bridges the Paleolithic and Neolithic, beginning as glaciers retreat at the end of the Pleistocene. Characterized by microlithic tools, fishing tackle, and the first canoes. The Natufian culture in the Levant represents sedentary hunter-gatherers who may have begun cultivating wild cereals."
    },
    {
      "id": "period-neolithic",
      "name": "Neolithic",
      "startTime": { "value": 10000, "unit": "bce" },
      "endTime": { "value": 2000, "unit": "bce" },
      "info": "The 'New Stone Age' witnesses the Neolithic Revolution: the transition from hunting-gathering to agriculture and settled life. Crops and animals are domesticated, permanent villages emerge, pottery is invented, and megalithic monuments like Stonehenge are built. This transformation begins in the Fertile Crescent and spreads gradually across the world."
    },
    {
      "id": "period-chalcolithic",
      "name": "Chalcolithic (Copper Age)",
      "startTime": { "value": 5000, "unit": "bce" },
      "endTime": { "value": 3300, "unit": "bce" },
      "info": "A transitional period between the Stone Age and Bronze Age when copper metallurgy first appears alongside stone tools. Copper smelting may have been invented independently in multiple locations. The period sees the rise of the first fortified settlements, increasing social stratification, and the earliest proto-writing systems."
    },
    {
      "id": "period-bronze-age",
      "name": "Bronze Age",
      "startTime": { "value": 3300, "unit": "bce" },
      "endTime": { "value": 1200, "unit": "bce" },
      "info": "The discovery that adding tin to copper creates harder bronze revolutionizes tool and weapon making. The first true civilizations with writing emerge: Sumer, Egypt, the Indus Valley, and Shang China. Long-distance trade networks develop to obtain rare tin. The period ends with a widespread collapse around 1200 BCE affecting many Mediterranean civilizations."
    },
    {
      "id": "period-iron-age",
      "name": "Iron Age",
      "startTime": { "value": 1200, "unit": "bce" },
      "endTime": { "value": 500, "unit": "bce" },
      "info": "Iron working technology spreads, democratizing access to metal tools and weapons since iron ore is far more common than tin. This period sees the rise of classical civilizations in Greece, Rome, Persia, India, and China. Writing becomes widespread, and many regions transition from prehistory to recorded history."
    },
    {
      "id": "period-gobekli-tepe",
      "name": "Göbekli Tepe Culture",
      "startTime": { "value": 9500, "unit": "bce" },
      "endTime": { "value": 8000, "unit": "bce" },
      "info": "A pre-pottery Neolithic culture in southeastern Anatolia that constructed Göbekli Tepe, the world's oldest known monumental architecture. Hunter-gatherers erected massive stone circles with T-shaped pillars carved with animals and symbols, challenging assumptions that organized religion and monumental building required settled agricultural societies. The site was deliberately buried around 8000 BCE for unknown reasons."
    },
    {
      "id": "period-uruk",
      "name": "Uruk Period",
      "startTime": { "value": 4000, "unit": "bce" },
      "endTime": { "value": 3100, "unit": "bce" },
      "info": "The period when Uruk became the world's first true city, with a population reaching 40,000-80,000. Uruk saw the development of proto-cuneiform writing, cylinder seals, monumental architecture (including temples to Inanna), and the first bureaucratic administration. The 'Uruk expansion' spread Mesopotamian culture across the Near East."
    },
    {
      "id": "period-sumer",
      "name": "Sumerian Civilization",
      "startTime": { "value": 3350, "unit": "bce" },
      "endTime": { "value": 2500, "unit": "bce" },
      "info": "The world's first urban civilization emerges in southern Mesopotamia (modern Iraq). Sumerians invent cuneiform writing, the wheel, and the plow. City-states like Ur, Uruk, and Eridu develop complex governments, religions, and the first known literary work, the Epic of Gilgamesh."
    },
    {
      "id": "period-minoan",
      "name": "Minoan Civilization",
      "startTime": { "value": 3000, "unit": "bce" },
      "endTime": { "value": 1100, "unit": "bce" },
      "info": "Europe's first advanced civilization, centered on the island of Crete. The Minoans built elaborate palace complexes at Knossos, Phaistos, and Malia, developed Linear A script (still undeciphered), and created distinctive art featuring bulls, marine life, and acrobatic sports. Their civilization influenced the later Mycenaean Greeks."
    },
    {
      "id": "period-mycenean",
      "name": "Mycenaean civilization",
      "startTime": { "value": 1750, "unit": "bce" },
      "endTime": { "value": 1050, "unit": "bce" },
      "info": "Mycenaean civilization was the last phase of the Bronze Age in ancient Greece. It represents the first advanced and distinctively Greek civilization in mainland Greece with its palatial states, urban organization, works of art, and writing system. The Mycenaeans were mainland Greek peoples who were likely stimulated by their contact with insular Minoan Crete and other Mediterranean cultures to develop a more sophisticated sociopolitical culture of their own."
    },
    {
      "id": "period-egypt",
      "name": "Ancient Egypt",
      "startTime": { "value": 3150, "unit": "bce" },
      "endTime": { "value": 27, "unit": "bce" },
      "info": "One of history's longest-lasting civilizations, unified under pharaohs who are considered living gods. Egyptians build pyramids, develop hieroglyphic writing, and create a rich religious tradition focused on the afterlife. The civilization endures through multiple dynasties until Roman conquest."
    },
    {
      "id": "period-roman-egypt",
      "name": "Roman Egypt",
      "startTime": { "value": 27, "unit": "bce" },
      "endTime": { "value": 642, "unit": "ce" },
      "info": "During the era of the Roman Empire, most of modern-day Egypt except for the Sinai was ruled as the imperial province of Aegyptus."
    },
    {
      "id": "period-mehrgarh",
      "name": "Mehrgarh Culture",
      "startTime": { "value": 7000, "unit": "bce" },
      "endTime": { "value": 2600, "unit": "bce" },
      "info": "A pre-Harappan Neolithic culture centered at Mehrgarh in Balochistan, representing the earliest farming community in South Asia. Over 4,000 years, inhabitants develop agriculture, animal husbandry, pottery, metallurgy, and long-distance trade. The culture shows continuous evolution leading directly to the Indus Valley Civilization."
    },
    {
      "id": "period-indus",
      "name": "Indus Valley Civilization",
      "startTime": { "value": 3300, "unit": "bce" },
      "endTime": { "value": 1300, "unit": "bce" },
      "info": "A sophisticated Bronze Age civilization in South Asia with major cities at Mohenjo-daro and Harappa. Features advanced urban planning, standardized weights and measures, and sophisticated drainage systems. Its script remains undeciphered, and its decline is still debated."
    },
    {
      "id": "period-akkad",
      "name": "Akkadian Empire",
      "startTime": { "value": 2334, "unit": "bce" },
      "endTime": { "value": 2154, "unit": "bce" },
      "info": "The world's first empire, founded by Sargon of Akkad who conquers Sumerian city-states and creates a unified state. Akkadian becomes the lingua franca of the ancient Near East. The empire introduces new administrative techniques but collapses after about 180 years."
    },
    {
      "id": "period-babylon",
      "name": "Babylonian Empire",
      "startTime": { "value": 1894, "unit": "bce" },
      "endTime": { "value": 539, "unit": "bce" },
      "info": "A Mesopotamian civilization centered on Babylon. Under Hammurabi, it produces one of history's first law codes. After decline and Assyrian rule, the Neo-Babylonian Empire under Nebuchadnezzar II builds the Hanging Gardens and destroys Jerusalem before falling to Persia."
    },
    {
      "id": "period-assyria",
      "name": "Assyrian Empire",
      "startTime": { "value": 2500, "unit": "bce" },
      "endTime": { "value": 609, "unit": "bce" },
      "info": "A Mesopotamian empire known for military prowess and administrative innovation. The Neo-Assyrian Empire (911-609 BCE) becomes the largest empire yet seen, controlling Mesopotamia, the Levant, and Egypt. Known for brutal warfare but also library-building and astronomical records."
    },
    {
      "id": "period-hittite",
      "name": "Hittite Empire",
      "startTime": { "value": 1600, "unit": "bce" },
      "endTime": { "value": 1178, "unit": "bce" },
      "info": "An Anatolian civilization that rivals Egypt and Mesopotamia. The Hittites develop iron-working technology and create one of the earliest known peace treaties with Egypt. Their empire collapses during the Bronze Age collapse around 1200 BCE."
    },
    {
      "id": "period-phoenicia",
      "name": "Phoenician Civilization",
      "startTime": { "value": 1500, "unit": "bce" },
      "endTime": { "value": 332, "unit": "bce" },
      "info": "Seafaring traders from the Levant who establish a commercial network across the Mediterranean. Phoenicians found Carthage and other colonies, produce purple dye, and create an alphabet that becomes the ancestor of Greek, Latin, Arabic, and Hebrew scripts."
    },
    {
      "id": "period-shang",
      "name": "Shang Dynasty",
      "startTime": { "value": 1600, "unit": "bce" },
      "endTime": { "value": 1046, "unit": "bce" },
      "info": "China's first historically verified dynasty, known for bronze casting, oracle bone divination, and the earliest Chinese writing. The Shang ruled from a series of capitals in the Yellow River valley, with Yin (near Anyang) as their final capital. Their sophisticated bronze vessels and jade artifacts demonstrate advanced craftsmanship."
    },
    {
      "id": "period-zhou",
      "name": "Zhou Dynasty",
      "startTime": { "value": 1046, "unit": "bce" },
      "endTime": { "value": 256, "unit": "bce" },
      "info": "China's longest dynasty, introducing the Mandate of Heaven concept. The early Western Zhou maintains centralized control, but the Eastern Zhou period sees fragmentation into competing states. This era produces Confucius, Laozi, and other foundational Chinese philosophers."
    },
    {
      "id": "period-greece",
      "name": "Ancient Greece",
      "startTime": { "value": 800, "unit": "bce" },
      "endTime": { "value": 146, "unit": "bce" },
      "info": "A civilization of independent city-states that develops democracy, philosophy, theater, and the Olympic Games. Athens and Sparta lead the defense against Persian invasion. Greek culture spreads through Alexander's conquests, becoming the foundation of Western civilization."
    },
    {
      "id": "period-persia-achaemenid",
      "name": "Achaemenid Persian Empire",
      "startTime": { "value": 550, "unit": "bce" },
      "endTime": { "value": 330, "unit": "bce" },
      "info": "The first Persian Empire, founded by Cyrus the Great. At its height under Darius I, it spans from Egypt to India, the largest empire yet seen. Known for religious tolerance, efficient administration via satrapies, and the Royal Road communication system."
    },
    {
      "id": "period-carthage",
      "name": "Carthaginian Empire",
      "startTime": { "value": 814, "unit": "bce" },
      "endTime": { "value": 146, "unit": "bce" },
      "info": "A Phoenician colony that becomes a major Mediterranean power. Carthage controls trade routes and North African territories, coming into conflict with Rome in the Punic Wars. General Hannibal famously crosses the Alps with elephants. Rome ultimately destroys the city entirely."
    },
    {
      "id": "period-macedon",
      "name": "Macedonian Empire",
      "startTime": { "value": 359, "unit": "bce" },
      "endTime": { "value": 323, "unit": "bce" },
      "info": "Under Philip II and his son Alexander the Great, Macedonia transforms from a regional kingdom to a world empire. Alexander conquers Persia, Egypt, and reaches India. His empire fragments after his death, but Hellenistic successor states spread Greek culture across the Near East."
    },
    {
      "id": "period-maurya",
      "name": "Maurya Empire",
      "startTime": { "value": 322, "unit": "bce" },
      "endTime": { "value": 185, "unit": "bce" },
      "info": "India's first major empire, founded by Chandragupta Maurya. Under Ashoka, it encompasses most of the Indian subcontinent. Ashoka's conversion to Buddhism after the bloody Kalinga War leads him to promote non-violence and dharma through his famous edicts."
    },
    {
      "id": "period-qin",
      "name": "Qin Dynasty",
      "startTime": { "value": 221, "unit": "bce" },
      "endTime": { "value": 206, "unit": "bce" },
      "info": "China's first imperial dynasty unifies the warring states under Qin Shi Huang, the 'First Emperor.' Brutal but transformative, the Qin standardizes writing, currency, and measurements, builds the Great Wall's first sections, and creates the Terracotta Army. Collapses shortly after the emperor's death."
    },
    {
      "id": "period-han",
      "name": "Han Dynasty",
      "startTime": { "value": 206, "unit": "bce" },
      "endTime": { "value": 220, "unit": "ce" },
      "info": "One of China's golden ages, so influential that ethnic Chinese still call themselves 'Han people.' The dynasty establishes Confucianism as state ideology, creates the civil service examination, expands the Silk Road trade, and invents paper. Considered a classical era of Chinese civilization."
    },
    {
      "id": "period-rome",
      "name": "Roman Civilization",
      "startTime": { "value": 753, "unit": "bce" },
      "endTime": "0476-09-04",
      "info": "From a small Italian city-state to an empire spanning three continents. Rome evolves from monarchy to republic to empire, developing law, engineering, and military systems that influence the world for millennia. Latin becomes the basis for Romance languages; Roman law underlies Western legal traditions."
    },
    {
      "id": "period-parthia",
      "name": "Parthian Empire",
      "startTime": { "value": 247, "unit": "bce" },
      "endTime": { "value": 224, "unit": "ce" },
      "info": "An Iranian empire that succeeds the Seleucids and becomes Rome's eastern rival. Parthia controls the Silk Road trade, develops heavy cavalry tactics, and defeats multiple Roman invasions. Famous for the 'Parthian shot'—firing arrows while retreating on horseback."
    },
    {
      "id": "period-kushan",
      "name": "Kushan Empire",
      "startTime": { "value": 30, "unit": "ce" },
      "endTime": { "value": 375, "unit": "ce" },
      "info": "A Central Asian empire controlling the Silk Road's crucial middle section. Under Kanishka, the Kushans patronize Buddhism and Greco-Buddhist art. The empire facilitates cultural exchange between China, India, Persia, and Rome."
    },
    {
      "id": "period-sasanian",
      "name": "Sasanian Persian Empire",
      "startTime": { "value": 224, "unit": "ce" },
      "endTime": "0651-01-01",
      "info": "The last pre-Islamic Persian empire, reviving Achaemenid traditions. The Sasanians are Rome/Byzantium's main rival for four centuries, developing sophisticated art, architecture, and Zoroastrian religious institutions. Falls to the Arab Muslim conquest in the 7th century."
    },
    {
      "id": "period-gupta",
      "name": "Gupta Empire",
      "startTime": { "value": 320, "unit": "ce" },
      "endTime": { "value": 550, "unit": "ce" },
      "info": "India's 'Golden Age,' marked by advances in science, mathematics (including the concept of zero), astronomy, literature, and art. The Gupta period sees the flourishing of classical Hindu culture, Sanskrit literature, and the Ajanta cave paintings."
    },
    {
      "id": "period-byzantine",
      "name": "Byzantine Empire",
      "startTime": "0330-05-11",
      "endTime": "1453-05-29",
      "info": "The eastern continuation of the Roman Empire, centered on Constantinople. Byzantium preserves Greek and Roman learning, develops Orthodox Christianity, and influences Slavic cultures. Despite gradual territorial losses, it endures for over a millennium until Ottoman conquest."
    },
    {
      "id": "period-maya",
      "name": "Maya Civilization",
      "startTime": { "value": 2000, "unit": "bce" },
      "endTime": "1697-03-13",
      "info": "A Mesoamerican civilization known for advanced writing, astronomy, mathematics (including zero), and monumental architecture. Maya city-states flourish in the Classic period, then largely collapse in the southern lowlands around 900 CE. Northern Maya continue until Spanish conquest."
    },
    {
      "id": "period-poverty-point",
      "name": "Poverty Point Culture",
      "startTime": { "value": 1700, "unit": "bce" },
      "endTime": { "value": 1100, "unit": "bce" },
      "info": "A Late Archaic archaeological culture in the lower Mississippi Valley, centered on the massive earthwork complex at Poverty Point, Louisiana. Hunter-gatherers built enormous mound complexes and participated in trade networks spanning much of eastern North America, obtaining copper, soapstone, and other materials from distant sources."
    },
    {
      "id": "period-hopewell",
      "name": "Hopewell Culture",
      "startTime": { "value": 200, "unit": "bce" },
      "endTime": { "value": 500, "unit": "ce" },
      "info": "A Native American culture flourishing in the Eastern Woodlands, known for elaborate burial mounds, extensive trade networks (the 'Hopewell Interaction Sphere'), and sophisticated artwork. Hopewell peoples traded obsidian from Yellowstone, copper from the Great Lakes, shells from the Gulf, and mica from the Appalachians."
    },
    {
      "id": "period-teotihuacan",
      "name": "Teotihuacan",
      "startTime": { "value": 100, "unit": "bce" },
      "endTime": { "value": 550, "unit": "ce" },
      "info": "A major Mesoamerican city that became one of the largest in the ancient world, with a population of 125,000-200,000 at its peak. Famous for the Pyramid of the Sun, Pyramid of the Moon, and the Avenue of the Dead. Its influence extended throughout Mesoamerica, but its ethnic identity and the cause of its collapse remain mysterious."
    },
    {
      "id": "period-mississippian",
      "name": "Mississippian Culture",
      "startTime": { "value": 800, "unit": "ce" },
      "endTime": { "value": 1600, "unit": "ce" },
      "info": "A mound-building Native American civilization of the Midwestern, Eastern, and Southeastern United States. Centered on maize agriculture and characterized by large earthen platform mounds, shell-tempered pottery, and chiefdom-level political organization. Cahokia, near modern St. Louis, was its largest city."
    },
    {
      "id": "period-cahokia",
      "name": "Cahokia",
      "startTime": { "value": 1050, "unit": "ce" },
      "endTime": { "value": 1350, "unit": "ce" },
      "info": "The largest pre-Columbian settlement north of Mexico, located near present-day St. Louis. At its peak around 1100 CE, Cahokia had a population of 10,000-20,000, with Monks Mound being the largest earthen structure in the Americas. The city declined and was abandoned before European contact for reasons still debated."
    },
    {
      "id": "period-northwest-coast",
      "name": "Northwest Coast Cultures",
      "startTime": { "value": 1500, "unit": "bce" },
      "endTime": { "value": 1900, "unit": "ce" },
      "info": "Complex hunter-gatherer societies along the Pacific coast from Alaska to northern California, including the Haida, Tlingit, Kwakwaka'wakw, and others. Known for elaborate woodworking (totem poles, canoes), potlatch ceremonies, social stratification including slavery, and artistic traditions. Rich marine resources supported dense, sedentary populations without agriculture."
    },
    {
      "id": "period-wendat",
      "name": "Wendat (Huron) Confederacy",
      "startTime": { "value": 1400, "unit": "ce" },
      "endTime": { "value": 1650, "unit": "ce" },
      "info": "A confederacy of Iroquoian-speaking peoples in the Great Lakes region, primarily in present-day Ontario. The Wendat were major agricultural producers and traders, acting as middlemen in the fur trade. Their confederacy was destroyed by warfare with the Haudenosaunee (Iroquois) Confederacy in the 1640s-1650s."
    },
    {
      "id": "period-rashidun",
      "name": "Rashidun Caliphate",
      "startTime": "0632-06-08",
      "endTime": "0661-01-29",
      "info": "The first Islamic caliphate, led by the 'Rightly Guided' successors of Prophet Muhammad. Under the Rashidun, Islam expands from Arabia to conquer the Sasanian Empire and much of Byzantine territory. Internal conflict leads to the Sunni-Shia split."
    },
    {
      "id": "period-umayyad",
      "name": "Umayyad Caliphate",
      "startTime": "0661-01-29",
      "endTime": "0750-01-25",
      "info": "The first hereditary Islamic dynasty, ruling from Damascus. The Umayyads expand the caliphate to its greatest extent, from Spain to Central Asia. They build the Dome of the Rock and develop Islamic administrative systems before being overthrown by the Abbasids."
    },
    {
      "id": "period-tang",
      "name": "Tang Dynasty",
      "startTime": "0618-06-18",
      "endTime": "0907-06-04",
      "info": "Considered China's most cosmopolitan dynasty and a high point of Chinese civilization. The Tang capital Chang'an is the world's largest city. Poetry, art, and trade flourish; Buddhism reaches its peak influence. The Silk Road brings foreign cultures, religions, and peoples."
    },
    {
      "id": "period-abbasid",
      "name": "Abbasid Caliphate",
      "startTime": "0750-01-25",
      "endTime": "1258-02-10",
      "info": "The Islamic Golden Age flourishes under the Abbasids, who move the capital to Baghdad. The House of Wisdom translates Greek, Persian, and Indian texts. Advances in mathematics, astronomy, medicine, and philosophy transform world knowledge. Power declines before Mongol destruction."
    },
    {
      "id": "period-khmer",
      "name": "Khmer Empire",
      "startTime": "0802-01-01",
      "endTime": "1431-01-01",
      "info": "A Southeast Asian empire centered in Cambodia, famous for building Angkor Wat, the world's largest religious monument. The Khmer develop sophisticated water management, supporting a population of up to a million. The empire declines following Thai invasions."
    },
    {
      "id": "period-song",
      "name": "Song Dynasty",
      "startTime": "0960-02-04",
      "endTime": "1279-03-19",
      "info": "A period of economic revolution and technological innovation in China. The Song develop movable type printing, gunpowder weapons, the compass, and paper money. Commercial cities thrive, but military weakness leads to loss of northern China and eventual Mongol conquest."
    },
    {
      "id": "period-ghana",
      "name": "Ghana Empire",
      "startTime": { "value": 300, "unit": "ce" },
      "endTime": { "value": 1200, "unit": "ce" },
      "info": "The first major West African empire, controlling trans-Saharan gold and salt trade. Not related to modern Ghana, it was located in present-day Mauritania and Mali. Ghana's wealth inspires later empires including Mali and Songhai."
    },
    {
      "id": "period-mali",
      "name": "Mali Empire",
      "startTime": { "value": 1235, "unit": "ce" },
      "endTime": { "value": 1600, "unit": "ce" },
      "info": "A West African empire that succeeds Ghana, controlling gold and salt trade. Under Mansa Musa, Mali becomes fabulously wealthy; his pilgrimage to Mecca reportedly crashes gold prices in Egypt. Timbuktu becomes a center of Islamic learning."
    },
    {
      "id": "period-mongol",
      "name": "Mongol Empire",
      "startTime": "1206-01-01",
      "endTime": "1368-09-14",
      "info": "The largest contiguous land empire in history, founded by Genghis Khan. Mongol conquests devastate populations from China to Eastern Europe but also facilitate unprecedented exchange along the Silk Road. The empire fragments into khanates that rule much of Eurasia."
    },
    {
      "id": "period-delhi",
      "name": "Delhi Sultanate",
      "startTime": "1206-06-25",
      "endTime": "1526-04-21",
      "info": "A succession of Turkic and Afghan dynasties ruling northern India from Delhi. The Sultanate introduces Persian culture and Islamic architecture to India, builds the Qutub Minar, and resists Mongol invasions. Eventually supplanted by the Mughal Empire."
    },
    {
      "id": "period-aztec",
      "name": "Aztec Empire",
      "startTime": "1428-01-01",
      "endTime": "1521-08-13",
      "info": "A Mesoamerican empire centered on Tenochtitlan, one of the world's largest cities. The Aztecs develop sophisticated agriculture (chinampas), a complex calendar, and monumental architecture. Their tributary empire and human sacrifice practices are ended by Spanish conquest."
    },
    {
      "id": "period-inca",
      "name": "Inca Empire",
      "startTime": "1438-01-01",
      "endTime": "1533-08-29",
      "info": "The largest pre-Columbian empire in the Americas, stretching along South America's Pacific coast. The Inca build an extensive road network, develop the quipu record-keeping system, and create Machu Picchu. Conquered by Spanish conquistadors under Pizarro."
    },
    {
      "id": "period-ottoman",
      "name": "Ottoman Empire",
      "startTime": "1299-01-01",
      "endTime": "1922-11-01",
      "info": "One of history's longest-lasting empires, spanning Southeast Europe, Western Asia, and North Africa. The Ottomans capture Constantinople, threaten Vienna, and control the Islamic holy cities. The empire develops distinctive art, architecture, and the millet system for religious minorities."
    },
    {
      "id": "period-ming",
      "name": "Ming Dynasty",
      "startTime": "1368-01-23",
      "endTime": "1644-04-25",
      "info": "A Chinese dynasty known for stability, cultural refinement, and the Forbidden City. The early Ming sponsors Zheng He's massive naval expeditions, but later turns inward. Ming porcelain, literature, and philosophy reach new heights before Manchu conquest."
    },
    {
      "id": "period-mughal",
      "name": "Mughal Empire",
      "startTime": "1526-04-21",
      "endTime": "1857-11-01",
      "info": "An Islamic empire ruling most of the Indian subcontinent, founded by Babur. The Mughals create a syncretic culture blending Persian, Indian, and Islamic elements, exemplified by the Taj Mahal. The empire weakens in the 18th century before British takeover."
    },
    {
      "id": "period-safavid",
      "name": "Safavid Empire",
      "startTime": "1501-01-01",
      "endTime": "1736-03-08",
      "info": "An Iranian empire that establishes Shia Islam as the state religion, shaping modern Iranian identity. The Safavids rival the Ottomans and Mughals, developing distinctive art, architecture, and the magnificent capital Isfahan. They preside over a Persian cultural renaissance."
    },
    {
      "id": "period-qing",
      "name": "Qing Dynasty",
      "startTime": "1644-06-06",
      "endTime": "1912-02-12",
      "info": "China's last imperial dynasty, founded by Manchu conquerors. The Qing expand China to its greatest territorial extent, including Tibet, Xinjiang, and Taiwan. After initial prosperity, the dynasty declines through corruption, rebellions, and foreign imperialism."
    },
    {
      "id": "period-japan-imperial",
      "name": "Imperial Japan",
      "startTime": "1868-01-03",
      "endTime": "1947-05-03",
      "info": "Following the Meiji Restoration, Japan rapidly industrializes and becomes an imperial power. Japan defeats China and Russia, colonizes Korea and Taiwan, and ultimately launches World War II in Asia. Military defeat leads to American occupation and a new constitutional monarchy."
    },
    {
      "id": "period-british-raj",
      "name": "British Raj",
      "startTime": "1858-08-02",
      "endTime": "1947-08-15",
      "info": "British colonial rule over the Indian subcontinent following the 1857 rebellion. The Raj transforms India through railways, English education, and legal systems while extracting wealth and causing famines. Independence movements lead to partition into India and Pakistan."
    },
    {
      "id": "period-merina",
      "name": "Merina Kingdom",
      "startTime": { "value": 1540, "unit": "ce" },
      "endTime": { "value": 1897, "unit": "ce" },
      "info": "The dominant kingdom of Madagascar, founded in the central highlands. Under rulers like Andrianampoinimerina and Radama I, the Merina unified much of Madagascar, developed a written language using Latin script, established diplomatic relations with Britain, and modernized their military. The kingdom was annexed by France in 1897 after resisting colonization."
    }
  ],
  "connectors": [
    {
      "id": "conn-lower-middle-paleo",
      "fromId": "period-lower-paleolithic",
      "toId": "period-middle-paleolithic",
      "type": "defined",
      "metadata": {
        "note": "Emergence of Homo sapiens marks transition to Middle Paleolithic"
      }
    },
    {
      "id": "conn-egypt-roman-egypt",
      "fromId": "period-egypt",
      "toId": "period-roman-egypt",
      "type": "defined"
    },
    {
      "id": "conn-middle-upper-paleo",
      "fromId": "period-middle-paleolithic",
      "toId": "period-upper-paleolithic",
      "type": "defined",
      "metadata": {
        "note": "Behavioral modernity and migration out of Africa"
      }
    },
    {
      "id": "conn-upper-paleo-mesolithic",
      "fromId": "period-upper-paleolithic",
      "toId": "period-european-mesolithic",
      "type": "defined",
      "metadata": {
        "note": "End of last Ice Age transforms environments and cultures"
      }
    },
    {
      "id": "conn-mesolithic-neolithic",
      "fromId": "period-european-mesolithic",
      "toId": "period-neolithic",
      "type": "defined",
      "metadata": {
        "note": "Agricultural revolution transforms human societies"
      }
    },
    {
      "id": "conn-neolithic-chalcolithic",
      "fromId": "period-neolithic",
      "toId": "period-chalcolithic",
      "type": "defined",
      "metadata": {
        "note": "First metal working emerges alongside stone tools"
      }
    },
    {
      "id": "conn-chalcolithic-bronze",
      "fromId": "period-chalcolithic",
      "toId": "period-bronze-age",
      "type": "defined",
      "metadata": {
        "note": "Discovery of bronze alloy revolutionizes metallurgy"
      }
    },
    {
      "id": "conn-bronze-iron",
      "fromId": "period-bronze-age",
      "toId": "period-iron-age",
      "type": "defined",
      "metadata": {
        "note": "Iron working spreads, democratizing access to metal"
      }
    },
    {
      "id": "conn-mehrgarh-indus",
      "fromId": "period-mehrgarh",
      "toId": "period-indus",
      "type": "defined",
      "metadata": {
        "note": "Mehrgarh's pre-Harappan culture evolves into Indus Valley Civilization"
      }
    },
    {
      "id": "conn-sumer-akkad",
      "fromId": "period-sumer",
      "toId": "period-akkad",
      "type": "defined",
      "metadata": {
        "note": "Akkadian Empire conquers and absorbs Sumerian city-states"
      }
    },
    {
      "id": "conn-akkad-babylon",
      "fromId": "period-akkad",
      "toId": "period-babylon",
      "type": "defined",
      "metadata": {
        "note": "Babylon rises from Akkadian cultural foundations"
      }
    },
    {
      "id": "conn-sumer-babylon",
      "fromId": "period-sumer",
      "toId": "period-babylon",
      "type": "defined",
      "metadata": {
        "note": "Babylonians inherit Sumerian writing, religion, and knowledge"
      }
    },
    {
      "id": "conn-babylon-assyria",
      "fromId": "period-babylon",
      "toId": "period-assyria",
      "type": "undefined",
      "metadata": {
        "note": "Rival Mesopotamian powers with periods of conquest and cultural exchange"
      }
    },
    {
      "id": "conn-assyria-persia",
      "fromId": "period-assyria",
      "toId": "period-persia-achaemenid",
      "type": "undefined",
      "metadata": {
        "note": "Persia inherits Assyrian imperial administrative techniques"
      }
    },
    {
      "id": "conn-babylon-persia",
      "fromId": "period-babylon",
      "toId": "period-persia-achaemenid",
      "type": "defined",
      "metadata": {
        "note": "Cyrus the Great conquers Babylon peacefully"
      }
    },
    {
      "id": "conn-mycenea-greece",
      "fromId": "period-mycenean",
      "toId": "period-greece",
      "type": "defined"
    },
    {
      "id": "conn-phoenicia-carthage",
      "fromId": "period-phoenicia",
      "toId": "period-carthage",
      "type": "defined",
      "metadata": {
        "note": "Phoenicians found Carthage as a colony"
      }
    },
    {
      "id": "conn-greece-persia",
      "fromId": "period-greece",
      "toId": "period-persia-achaemenid",
      "type": "undefined",
      "metadata": {
        "note": "Persian Wars shape Greek identity; later Greek conquest of Persia"
      }
    },
    {
      "id": "conn-greece-macedon",
      "fromId": "period-greece",
      "toId": "period-macedon",
      "type": "defined",
      "metadata": {
        "note": "Macedonia unifies Greece and spreads Hellenistic culture"
      }
    },
    {
      "id": "conn-minoan-mycenean",
      "fromId": "period-minoan",
      "toId": "period-mycenean",
      "type": "undefined"
    },
    {
      "id": "conn-macedon-persia",
      "fromId": "period-macedon",
      "toId": "period-persia-achaemenid",
      "type": "undefined",
      "metadata": {
        "note": "Alexander conquers the Persian Empire"
      }
    },
    {
      "id": "conn-macedon-egypt",
      "fromId": "period-macedon",
      "toId": "period-egypt",
      "type": "undefined",
      "metadata": {
        "note": "Alexander conquers Egypt; Ptolemaic dynasty rules until Roman conquest"
      }
    },
    {
      "id": "conn-greece-rome",
      "fromId": "period-greece",
      "toId": "period-rome",
      "type": "defined",
      "metadata": {
        "note": "Rome conquers Greece but absorbs Greek culture"
      }
    },
    {
      "id": "conn-carthage-rome",
      "fromId": "period-carthage",
      "toId": "period-rome",
      "type": "undefined",
      "metadata": {
        "note": "Punic Wars determine Mediterranean dominance"
      }
    },
    {
      "id": "conn-rome-byzantine",
      "fromId": "period-rome",
      "toId": "period-byzantine",
      "type": "defined",
      "metadata": {
        "note": "Byzantine Empire continues Eastern Roman tradition"
      }
    },
    {
      "id": "conn-rome-parthia",
      "fromId": "period-rome",
      "toId": "period-parthia",
      "type": "undefined",
      "metadata": {
        "note": "Eastern rivals competing over Armenia and Mesopotamia"
      }
    },
    {
      "id": "conn-parthia-sasanian",
      "fromId": "period-parthia",
      "toId": "period-sasanian",
      "type": "defined",
      "metadata": {
        "note": "Sasanians overthrow Parthians, revive Persian imperial tradition"
      }
    },
    {
      "id": "conn-persia-parthia",
      "fromId": "period-persia-achaemenid",
      "toId": "period-parthia",
      "type": "undefined",
      "metadata": {
        "note": "Parthians claim Achaemenid legacy after Hellenistic interlude"
      }
    },
    {
      "id": "conn-sasanian-byzantine",
      "fromId": "period-sasanian",
      "toId": "period-byzantine",
      "type": "undefined",
      "metadata": {
        "note": "Centuries of warfare between Persian and Roman successor states"
      }
    },
    {
      "id": "conn-maurya-gupta",
      "fromId": "period-maurya",
      "toId": "period-gupta",
      "type": "undefined",
      "metadata": {
        "note": "Gupta Empire revives Indian imperial tradition after Mauryan decline"
      }
    },
    {
      "id": "conn-zhou-qin",
      "fromId": "period-zhou",
      "toId": "period-qin",
      "type": "defined",
      "metadata": {
        "note": "Qin conquers warring states, ending Zhou era"
      }
    },
    {
      "id": "conn-qin-han",
      "fromId": "period-qin",
      "toId": "period-han",
      "type": "defined",
      "metadata": {
        "note": "Han Dynasty succeeds Qin, preserving unified empire"
      }
    },
    {
      "id": "conn-han-silk-road",
      "fromId": "period-han",
      "toId": "period-kushan",
      "type": "undefined",
      "metadata": {
        "note": "Silk Road trade connects Han China with Central Asian empires"
      }
    },
    {
      "id": "conn-han-rome",
      "fromId": "period-han",
      "toId": "period-rome",
      "type": "undefined",
      "metadata": {
        "note": "Indirect trade via Silk Road; Roman records mention 'Serica'"
      }
    },
    {
      "id": "conn-sasanian-rashidun",
      "fromId": "period-sasanian",
      "toId": "period-rashidun",
      "type": "defined",
      "metadata": {
        "note": "Arab conquest ends Sasanian Empire"
      }
    },
    {
      "id": "conn-byzantine-rashidun",
      "fromId": "period-byzantine",
      "toId": "period-rashidun",
      "type": "undefined",
      "metadata": {
        "note": "Arab conquests take Byzantine Syria, Egypt, and North Africa"
      }
    },
    {
      "id": "conn-rashidun-umayyad",
      "fromId": "period-rashidun",
      "toId": "period-umayyad",
      "type": "defined",
      "metadata": {
        "note": "Umayyads establish hereditary caliphate after civil war"
      }
    },
    {
      "id": "conn-umayyad-abbasid",
      "fromId": "period-umayyad",
      "toId": "period-abbasid",
      "type": "defined",
      "metadata": {
        "note": "Abbasid revolution overthrows Umayyads"
      }
    },
    {
      "id": "conn-tang-abbasid",
      "fromId": "period-tang",
      "toId": "period-abbasid",
      "type": "undefined",
      "metadata": {
        "note": "Battle of Talas (751); cultural exchange despite conflict"
      }
    },
    {
      "id": "conn-tang-song",
      "fromId": "period-tang",
      "toId": "period-song",
      "type": "defined",
      "metadata": {
        "note": "Song reunifies China after Tang collapse"
      }
    },
    {
      "id": "conn-abbasid-mongol",
      "fromId": "period-abbasid",
      "toId": "period-mongol",
      "type": "defined",
      "metadata": {
        "note": "Mongols destroy Baghdad, ending Abbasid Caliphate"
      }
    },
    {
      "id": "conn-song-mongol",
      "fromId": "period-song",
      "toId": "period-mongol",
      "type": "defined",
      "metadata": {
        "note": "Mongols conquer Southern Song, unifying China under Yuan"
      }
    },
    {
      "id": "conn-mongol-ming",
      "fromId": "period-mongol",
      "toId": "period-ming",
      "type": "defined",
      "metadata": {
        "note": "Ming rebellion expels Mongol Yuan dynasty"
      }
    },
    {
      "id": "conn-byzantine-ottoman",
      "fromId": "period-byzantine",
      "toId": "period-ottoman",
      "type": "defined",
      "metadata": {
        "note": "Ottomans conquer Constantinople, ending Byzantine Empire"
      }
    },
    {
      "id": "conn-mongol-ottoman",
      "fromId": "period-mongol",
      "toId": "period-ottoman",
      "type": "undefined",
      "metadata": {
        "note": "Ottomans rise in Anatolia following Mongol disruption of Seljuks"
      }
    },
    {
      "id": "conn-ghana-mali",
      "fromId": "period-ghana",
      "toId": "period-mali",
      "type": "defined",
      "metadata": {
        "note": "Mali Empire succeeds Ghana, controlling gold trade"
      }
    },
    {
      "id": "conn-delhi-mughal",
      "fromId": "period-delhi",
      "toId": "period-mughal",
      "type": "defined",
      "metadata": {
        "note": "Babur defeats Delhi Sultanate, founds Mughal Empire"
      }
    },
    {
      "id": "conn-mongol-mughal",
      "fromId": "period-mongol",
      "toId": "period-mughal",
      "type": "undefined",
      "metadata": {
        "note": "Mughal dynasty descends from Timur and claims Mongol heritage"
      }
    },
    {
      "id": "conn-safavid-mughal",
      "fromId": "period-safavid",
      "toId": "period-mughal",
      "type": "undefined",
      "metadata": {
        "note": "Rival Islamic empires with Persian cultural influence"
      }
    },
    {
      "id": "conn-ottoman-safavid",
      "fromId": "period-ottoman",
      "toId": "period-safavid",
      "type": "undefined",
      "metadata": {
        "note": "Sunni-Shia rivalry; frequent wars over Mesopotamia"
      }
    },
    {
      "id": "conn-ming-qing",
      "fromId": "period-ming",
      "toId": "period-qing",
      "type": "defined",
      "metadata": {
        "note": "Manchu conquest replaces Ming with Qing dynasty"
      }
    },
    {
      "id": "conn-maya-aztec",
      "fromId": "period-maya",
      "toId": "period-aztec",
      "type": "undefined",
      "metadata": {
        "note": "Shared Mesoamerican cultural traditions; limited direct contact"
      }
    },
    {
      "id": "conn-mughal-british",
      "fromId": "period-mughal",
      "toId": "period-british-raj",
      "type": "defined",
      "metadata": {
        "note": "British East India Company gradually supplants declining Mughal rule"
      }
    },
    {
      "id": "conn-qing-japan",
      "fromId": "period-qing",
      "toId": "period-japan-imperial",
      "type": "undefined",
      "metadata": {
        "note": "Japan defeats China in 1895; rivalry shapes East Asian history"
      }
    },
    {
      "id": "conn-uruk-sumer",
      "fromId": "period-uruk",
      "toId": "period-sumer",
      "type": "defined",
      "metadata": {
        "note": "Uruk develops into the broader Sumerian civilization with multiple city-states"
      }
    },
    {
      "id": "conn-minoan-greece",
      "fromId": "period-minoan",
      "toId": "period-greece",
      "type": "undefined",
      "metadata": {
        "note": "Minoan culture influences later Greek civilization through Mycenaean intermediaries"
      }
    },
    {
      "id": "conn-shang-zhou",
      "fromId": "period-shang",
      "toId": "period-zhou",
      "type": "defined",
      "metadata": {
        "note": "Zhou dynasty conquers and succeeds the Shang"
      }
    },
    {
      "id": "conn-teotihuacan-aztec",
      "fromId": "period-teotihuacan",
      "toId": "period-aztec",
      "type": "undefined",
      "metadata": {
        "note": "Aztecs revered the abandoned ruins of Teotihuacan as a sacred place of the gods"
      }
    },
    {
      "id": "conn-hopewell-mississippian",
      "fromId": "period-hopewell",
      "toId": "period-mississippian",
      "type": "undefined",
      "metadata": {
        "note": "Mississippian culture builds on earlier Hopewell mound-building traditions"
      }
    },
    {
      "id": "conn-mississippian-cahokia",
      "fromId": "period-mississippian",
      "toId": "period-cahokia",
      "type": "defined",
      "metadata": {
        "note": "Cahokia is the largest and most influential Mississippian center"
      }
    }
  ]
}

)
