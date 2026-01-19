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
  name:"The history of socialism",
  description:"blah blah blah",
  timeline_data:{
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
  name:"Development of Life",
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