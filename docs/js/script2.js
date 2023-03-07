$('document').ready(function () {
  const $leaders_list = $('#leaders_list'),
    $participants_list = $('#participants_list');

  const $leaders_item = $(
    '<li class="leaders__item d-flex">' +
      '<p class="leaders__name">' +
      '</p>' +
      '<p class="leaders__scores"></p>' +
      '</li>'
  );

  const $participants_item = $(
    '<div class="participants__item d-flex">' +
      '<p class="participants__name"></p>' +
      '<p class="participants__scores"></p>' +
      '</div>'
  );

  $.ajax({
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS74DnCragK24SidpUHoaMbpJ4InMtazJOwu61xizQUx71q54YSjzmls54dJLqhil-5xBm2T-D5gbyE/pub?output=csv',
    dataType: 'text',
    cache: false,
    success: function (data) {
      var items = $.csv.toObjects(data);

      items.sort(function (x, y) {
        return y['Промежуточные баллы 2'] - x['Промежуточные баллы 2'];
      });

      $.each(items, function (i, val) {
        if (i < 3) {
          add_leaders_item(val);
        } else {
          add_participants_item(val);
        }
      });

      /* $participants_list.slick({
        vertical: true,
        verticalSwiping: false,
        slidesToShow: 9,
        autoplay: true,
        accessibility: false,
        arrows: false,
        autoplaySpeed: 1500,
        speed: 500,
        waitForAnimate: false,
        infinite: true,
        pauseOnFocus: false,
      }); */

      let $wrapper = $participants_list,
        $marquees = $wrapper.find('.participants__item'),
        wrapperOffset = $wrapper.offset().top;

      clearInterval(interval);

      function move() {
        $.each($marquees, function (i) {
          let $marquee = $(this),
            currentTY = $marquee.css('transform').split(','),
            marqueeHeight = $marquee.outerHeight(true),
            offset = $marquee.offset().top + marqueeHeight;

          if (currentTY[5] === undefined) {
            currentTY = -1;
          } else {
            currentTY = parseFloat(currentTY[5]) - 1;
          }

          $marquee.css('transform', 'translateY(' + currentTY + 'px)');
          /*   if (i == 0) {
            console.log(i + ': ' + wrapperOffset);
            console.log(i + ': ' + offset);
            console.log(offset <= wrapperOffset);
          }
 */
          if (offset <= wrapperOffset) {
            $wrapper.append($marquee);
            update();
          }
        });

        function update() {
          $.each($marquees, function () {
            let $marquee = $(this),
              currentTY = $marquee.css('transform').split(','),
              marqueeHeight = $marquee.outerHeight(true);

            if (currentTY[5] === undefined) {
              currentTY = 0;
            } else {
              currentTY = parseFloat(currentTY[5]);
            }

            $marquee.css(
              'transform',
              'translateY(' + (currentTY + marqueeHeight) + 'px)'
            );
          });
        }
      }

      var interval = setInterval(move, 20);
    },
  });

  function add_leaders_item(data) {
    let $new_item = $leaders_item.clone();

    $new_item.find('.leaders__name').text(data['Название команды']);
    $new_item.find('.leaders__scores').text(data['Промежуточные баллы 2']);

    $leaders_list.append($new_item);
  }

  function add_participants_item(data) {
    let $new_item = $participants_item.clone();

    $new_item.find('.participants__name').text(data['Название команды']);
    $new_item.find('.participants__scores').text(data['Промежуточные баллы 2']);

    $participants_list.append($new_item);
  }
});
