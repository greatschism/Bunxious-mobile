var args = arguments[0] || {};

$.orderPhoto.image = args.image;
$.orderTitle.text = args.product;
$.orderQuantity.text = args.quantity + ' ' + args.qty;
$.orderSubPrice.text = $.orderPrice.text = args.price + ' ' + args.currency;
$.orderBrand.text = args.brand;
$.orderCondition.text = args.condition;
$.orderSize.text = "Size: " + args.size;
