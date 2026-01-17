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