$('document').ready(function () {
	let place = 1;
	const $leaders_list = $('#leaders_list');

	const $leaders_item = $(
		'<li class="leaders__item d-flex">' +
			'<p class="leaders__place"></p>' +
			'<p class="leaders__name"></p>' +
			'<p class="leaders__scores"></p>' +
			'</li>'
	);

	const $participants_item = $(
		'<li class="participants__item d-flex">' +
			'<p class="participants__place"></p>' +
			'<p class="participants__name"></p>' +
			'<p class="participants__scores"></p>' +
			'</li>'
	);

	$.ajax({
		url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSdP3ccei1KvSVk2faTVTEmJgRXd7V6KaU0-Wa3qiV1SsqqGcnBuu7A0H_JBIcU9K6sgQ8rZP_yDoG_/pub?output=csv',
		dataType: 'text',
		cache: false,
		success: function (data) {
			var items = $.csv.toObjects(data);

			console.log(items);

			items.sort(function (x, y) {
				return to_float(y['ИТОГ']) - to_float(x['ИТОГ']);
			});

			$.each(items, function (i, val) {
				if (i < 3) {
					add_leaders_item(val);
				} else if (i < 8) {
					add_participants_item(val, '1');
				} else if (i < 14) {
					add_participants_item(val, '2');
				} else {
					add_participants_item(val, '3');
				}
			});
		},
	});

	function add_leaders_item(data) {
		let $new_item = $leaders_item.clone();

		$new_item.find('.leaders__place').text(place++);
		$new_item.find('.leaders__name').text(data['Название команды']);
		$new_item.find('.leaders__scores').text(data['ИТОГ']);

		$leaders_list.append($new_item);
	}

	function add_participants_item(data, num) {
		const $participants_list = $('#participants_list' + num),
			$new_item = $participants_item.clone();

		$new_item.find('.participants__place').text(place++);
		$new_item.find('.participants__name').text(data['Название команды']);
		$new_item.find('.participants__scores').text(data['ИТОГ']);

		$participants_list.append($new_item);
	}

	function to_float(num) {
		return parseFloat(num.replace(/,/, '.'));
	}

	$(document).on('keydown', function (evt) {
		if (evt.keyCode == 39) {
			$('.slide').toggleClass('active');
		}
	});
});
