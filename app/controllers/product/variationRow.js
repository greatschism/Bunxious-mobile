var args = arguments[0] || {};

$.gender.addEventListener('click', function() {

	var popupDialog = Alloy.createWidget('ti.ux.popup.list', 'widget', {
		closeButton : true,
		selectable : true,
		options : ['Girls', 'Boys', 'Unisex']
	});

	popupDialog.getView('table').addEventListener('click', function(e) {

		$.genderTitle.text = e.row.data.title;
		popupDialog.hide();
	});

	popupDialog.getView().show();
});

$.condition.addEventListener('click', function() {

	var popupDialog = Alloy.createWidget('ti.ux.popup.list', 'widget', {
		closeButton : true,
		selectable : true,
		options : ['New with Tags', 'New without Tags', 'New with Defects', 'Excellent Used', 'Very Good Used', 'Good Used', 'Play']
	});

	popupDialog.getView('table').addEventListener('click', function(e) {

		$.conditionTitle.text = e.row.data.title;
		popupDialog.hide();
	});

	popupDialog.getView().show();
});

$.size.addEventListener('click', function() {

	var popupDialog = Alloy.createWidget('ti.ux.popup.list', 'widget', {
		closeButton : true,
		selectable : true,
		options : ['New Born', 'Premi', '0-3 Months', '3-6 Months', '6-12 Months', '12-18 Months', '18-24', '2T', '2', '3T', '3', '4T', '4', '5T', '5', '6', '7', '8', '9', '10', '11', '12', 'Extra Small', 'Small', 'Medium', 'Large', 'Extra Large', '2-3', '4-5', '6-8', '10-12']
	});

	popupDialog.getView('table').addEventListener('click', function(e) {

		$.sizeTitle.text = e.row.data.title;
		popupDialog.hide();
	});

	popupDialog.getView().show();
});

$.brand.addEventListener('click', function() {

	var brands = ['7 For All Mankind', 'A La Carte', 'Absorba', 'Aden and Anais', 'Adidas', 'Airwalk', 'Akademiks', 'Al & Ray', 'Alegria', 'Alexis', 'Amanda Remembered', 'American Apparel', 'American Eagle Outfitters', 'American Hawk', 'American Living', 'Anavini', 'Andrew Fezza', 'Animal', 'Arizona', 'Armani', 'Athletic Works', 'Authentic Kids', 'Avirex', 'B.T. Kids', 'Babies "R" Us', 'Baby Aspen', 'Baby Buns', 'Baby Connection', 'Baby CZ', 'Baby Dior', 'Baby Essentials', 'Baby Glam', 'Baby GUND', 'Baby Headquarters', 'Baby King', 'Baby Lulu', 'Baby Nay', 'Baby Phat', 'Baby Q', 'Baby Starters', 'Baby Togs', 'babyGap', 'Babygear', 'Babylegs', 'Babystyle', 'Babyworks', 'Bailey Boys', 'Barneys New York', 'Beaux Et Belles', 'bebe', 'Bees & Dragons', 'Bella', 'Beverly Hills Polo Club', 'Big Dogs', 'Biscotti', 'Blac Label', 'Blueberi Boulevard', 'Boden', 'bon b�b�', 'Bonnie Baby', 'Bonnie Jean', 'Bonpoint', 'Born', 'Bright Future', 'Browning', 'Bugle Boy', 'Buster Brown', 'cachcach', 'Cakewalk', 'Calla Collection', 'Calvin Klein', 'Carhartt', 'Carriage Boutique', 'Carter\'s', 'Carter\'s Just One Year', 'Caterpillar', 'Catimini', 'Ce Ce Co.', 'Champion', 'Chams', 'Chaps', 'Charlie Rocket', 'Charter Club', 'Chase Authentics', 'Cherokee', 'Chez AMI', 'Child of Mine', 'Children\'s Place', 'Chocolate Soup', 'Circa', 'Circo', 'Claiborne', 'Class Club', 'Code V', 'Columbia', 'Company 81', 'Confetti', 'Conscious Children\'s Clothes', 'Converse', 'COOGI', 'Cotton Candy', 'Cotton Kids', 'Cradle Togs', 'Crazy 8', 'Cuddl Duds', 'Customized & Personalized', 'Cutie Pie', 'DC Comics', 'Dickies', 'DIESEL', 'Disney', 'Disney Parks Authentic', 'DKNY', 'Dockers', 'Duck Duck Goose', 'Dwell Studio', 'ECKO', 'Ecko Unltd.', 'Ed Hardy', 'Eddie Bauer', 'Egg', 'Elegant Baby', 'Eliane et Lena', 'Ella Moss', 'Ellemenno', 'English Laundry', 'Enyce', 'Faded Glory', 'Falls Creek', 'FAO Schwarz', 'Felina', 'Feltman Brothers', 'Fila', 'First Impressions', 'First Moments', 'Fisher-Price', 'Flap Happy', 'Flapdoodles', 'Flowers by Zoe', 'Forever Collectibles', 'French Toast', 'Fruit of the Loom', 'FUBU', 'Funkoo\'s', 'Funtasia Too', 'GANZ', 'Garanimals', 'Genuine Baby by OshKosh', 'Genuine Kids', 'George', 'Gerber', 'Giggle Moon', 'Gildan', 'Good Lad', 'Green Apple', 'Greendog', 'GUESS', 'Gymboree', 'H&M', 'Halo', 'Hancock\'s Embroidery', 'Handmade', 'Hanes', 'Hanna Andersson', 'Hanna Banana', 'Happy Fella', 'Harajuku Mini', 'Harley-Davidson', 'Hartstrings', 'Hasbro', 'Hatley', 'Haute Baby', 'Healthtex', 'Heartstrings', 'Heidi Klum', 'Hello Kitty', 'Highland', 'Hilo Hattie', 'Honors', 'Hot Wheels', 'House of Hatten', 'HUGO BOSS', 'Hurley', 'Icky Baby', 'IKKS', 'Indygo Artwear', 'IZOD', 'J Khaki', 'Jacadi', 'Janie and Jack', 'Jelly the Pug', 'Joe Boxer', 'John Deere', 'Jordan', 'Joseph Abboud', 'Juicy Couture', 'Jumping Beans', 'Jumping Jacks', 'Just Born', 'Just One You by Carter\'s', 'Justice', 'Kelly\'s Kids', 'Kenneth Cole', 'Kenneth Cole Reaction', 'Kid Connection', 'Kidgets', 'Kids Headquarters', 'KIKS', 'Kissy Kissy', 'Kitestrings', 'Knitwits', 'Knuckleheads', 'Koala Baby', 'Koala Kids', 'Kushies', 'L.L. Bean', 'La Redoute', 'Lands\' End', 'Laura Ashley', 'Le Petit Bateau', 'Le Top', 'Lee', 'LEGO', 'Levi\'s', 'Life Is Good', 'Lito', 'Little Bitty', 'Little by Little', 'Little Giraffe', 'Little Legends', 'Little Me', 'Little Miss Matched', 'Little Tikes', 'Little Wonders', 'Liz Claiborne', 'Lonsdale', 'Lucky Brand', 'Luna Luna Copenhagen', 'Luvable Friends', 'Magellan', 'Majestic', 'Mamas & Papas', 'Marie Chantal', 'Marks and Spencer', 'Marshall Fields', 'Marvel', 'Mary Engelbreit', 'Mayfair', 'Me Too', 'Mecca', 'Messages From the Heart', 'Mexx', 'Mighty Mac', 'Mini Boden', 'mini mode', 'Minishatsu', 'Miniville', 'Miniwear', 'Mis-Tee-V-Us', 'MLB', 'Mom & Me', 'Monag', 'Mossimo', 'Mossy Oak', 'mothercare', 'Mud Pie', 'Mulberribush', 'My Blankee', 'Naartjie', 'Nannette', 'NASCAR', 'Nautica', 'Neiman Marcus', 'New Balance', 'Next', 'Nickelodeon', 'Nike', 'Noa Lily', 'Nordstrom', 'Not Specified', 'Obermeyer', 'Ocean Pacific', 'Oilily', 'Okie Dokie', 'Old Navy', 'OshKosh B\'gosh', 'Pampolina', 'Parade', 'Patagonia', 'Paul Frank', 'Peanut & Ollie', 'Pelle Pelle', 'Penguin', 'Peter Alexander', 'Petit Ami', 'Petit Bateau', 'Petunia Pickle Bottom', 'Phat Farm', 'Piccino Piccina', 'Pitter Patter', 'Pixar', 'Playskool', 'Polo Ralph Lauren', 'Pottery Barn Kids', 'Precious Cargo', 'Precious Moments', 'Pro Edge', 'PUMA', 'Pumpkin Patch', 'Quiksilver', 'Rabbit Skins', 'Radio Flyer', 'Ralph Lauren', 'Rare Editions', 'Realtree', 'Red Ape', 'Red Oak', 'Reebok', 'Riders', 'Rocawear', 'Romero Britto', 'Rosalina', 'Rothco', 'Rothschild', 'Royal Baby', 'Royal Child', 'Rubie\'s', 'Rugged Bear', 'Rumble Tumble', 'Russell Athletic', 'Samara', 'Sarah Louise', 'Sean John', 'Sears', 'Secret Wishes', 'Sesame Street', 'Silly Goose', 'Simply Basic', 'SKECHERS', 'Sleeping Partners', 'Small Steps', 'Small Wonders', 'Snugabye', 'Sonoma', 'Sophie Dess', 'Sozo', 'Spasilk', 'Specialty Baby', 'Spencer\'s', 'Splendid', 'Sprockets', 'Starter', 'Starting Out', 'Stephan Baby', 'Steve & Barry\'s', 'Strasburg', 'Stride Rite', 'Susan Lazar', 'Sweet & Soft', 'Sweet Dreams', 'Sweet Potatoes', 'SweetHoney', 'Taggies', 'Talbots', 'Tangerine', 'Target', 'Tea Collection', 'The Bailey Boys', 'The Children\'s Place', 'The North Face', 'Timberland', 'TKS', 'Tommy Hilfiger', 'Tony Hawk', 'Toughskins', 'Toys"R"Us', 'Trend Lab', 'True Religion', 'Trumpette', 'Tuff Guys', 'Tutto Piccolo', 'U.S. Polo Assn.', 'Unbranded', 'Under Armour', 'Under the Nile', 'United Colors of Benetton', 'Urban Extreme', 'Vaenait Baby', 'Van Heusen', 'Vitamins Baby', 'Vive La Fete', 'Warner Bros.', 'WearFirst', 'Well Dressed Wolf', 'Wendy Bellissimo', 'Wes & Willy', 'Will\'beth', 'Wilson', 'WonderKids', 'Wrangler', 'Youngland', 'Zoodles', 'Zuccini', 'Zutano'];
	var popupDialog = Alloy.createWidget('ti.ux.popup.list', 'widget', {
		closeButton : true,
		selectable : true,
		options : brands
	});

	popupDialog.getView('table').addEventListener('click', function(e) {

		$.brandTitle.text = e.row.data.title;
		popupDialog.hide();
	});

	popupDialog.getView().show();
});
