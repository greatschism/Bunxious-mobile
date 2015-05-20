var args = arguments[0] || {};

Ti.API.info('args: ' + JSON.stringify(args));


$.pinImage.image = args.image_big.image;
$.title.text = args.title;
$.price.text = Alloy.Globals.Utils.codeToCurrency(args.currency_code) + args.price + ' ' + args.currency_code.toUpperCase();



$.brand.text = 'BRAND: ' + args.brand_id;
$.size.text = 'SIZE: Not yet defined';
$.condition.text = 'CONDITION: ' + args.condition_id;
$.description.value = 'Description: ' + args.description + ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis non mattis lectus. Nunc et mattis sapien. Praesent ac metus ac dolor laoreet vulputate ac eu lacus. Donec accumsan ornare ex, ac luctus tortor finibus vehicula. Nunc quis hendrerit eros, eu ultrices velit. Aliquam erat volutpat. Ut vestibulum in elit ut vestibulum. ';
$.shipping.text = '    SHIPPING FROM ' + args.from;


$.shipToOut.text = 'United States';
$.shipCostOut.text = '$6.50 USD';
$.shipWithOut.text = '$1.00 USD';







