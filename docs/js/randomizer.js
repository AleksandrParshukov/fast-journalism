$('document').ready(function () {
	const $randomizer = $('.randomizer'),
		$randomizer_btn = $('.randomizer-btn');

	let count = 0;

	$randomizer_btn.on('click', function () {
		count = getRandomIntInclusive(40, 100);
		randomize();
	});

	function randomize() {
		$randomizer.text(getRandomIntInclusive(4, 20));

		if (count > 1) {
			setTimeout(randomize, 10); // Не используем интервал, ибо равные промежтки получить сложно (см. https://habrahabr.ru/post/138062/)
			count--;
		}
	}

	function getRandomIntInclusive(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
	}
});
