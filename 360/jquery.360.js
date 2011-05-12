/**
 * 360
 */
(function($) {
	$.fn.ThreeSixty = function(options)
	{
		var element = $(this);

		var defaults = {
			'count' : '72',
			'src' : "img/##.jpg",
			'num' : 1
		};

		var setting = $.extend(defaults, options);

		var isiPad = navigator.userAgent.match(/iPad/i) != null,
		    isiPhone = navigator.userAgent.match(/(iPhone|iPod)/i) != null,
		    start,
		    x = 0,
		    down = false;

		setting.margin = setting.dif / 36;

		var dif = Math.floor($(this).attr('width') / setting.count);
		var margin = dif / 36; // 72枚基準での数値。調整用

		var preload = function() {
			for (var i=0; i<setting.count; i++) {
				var load_num = i + 1;
				var load_src= setting.src.replace('##', load_num);

				$('<img />').attr('src', load_src);
			}
		}

		var touchHandler = function(e)
		{
			e.preventDefault(); // イベント中のスクロール禁止

			if (isiPad || isiPhone) {
				var touch = e.originalEvent.touches[0];
			} else {
				var touch = e;
			}

			if (e.type == "touchstart" || e.type == "mousedown") {
				start = touch.pageX;
				down = true;

				return false;
			} else if (e.type == "touchend" || e.type == "mouseup") {
				inertia(x);

				down = false;
			} else if (e.type == "touchmove" || e.type == "mousemove") {
				if (down == false) {
					return;
				}

				x = start - touch.pageX;


				if (Math.abs(x) >= dif) {
					start = touch.pageX;

					var page = Math.abs(x) / dif;
					changeImage(page);
				}
			}
		}

		var inertia = function()
		{
			var ma = x * 0.1;
			var page = Math.ceil(x / dif / 3);

			if (Math.abs(x) > dif) {
				changeImage(page);
				setTimeout(inertia, 10);
			}
			x = x - ma;
		}

		var changeImage = function(move)
		{
			move = Math.abs(move);

			if (x > 0) {
				setting.num = setting.num + move;
				if (setting.num > setting.count) {
					setting.num = 1;
				}
			} else {
				setting.num = setting.num - move;
				if (setting.num < 1) {
					setting.num = setting.count;
				}
			}

			setting.num = Math.floor(setting.num);

			var new_src = setting.src.replace('##', setting.num);

			element.attr('src', new_src);
		}

		preload();

		$(this).bind('mousedown mousemove mouseup touchstart touchmove touchend', touchHandler);
		$('body').mouseup(touchHandler).mousemove(touchHandler);

		return this;
	}

})(jQuery);