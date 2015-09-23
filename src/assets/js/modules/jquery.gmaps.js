(function($) {

  $.fn.gmaps = function(options) {

    return this.each(function() {
      var settings = $.extend({
        zoom: 16,
        scrollwheel: false,
        center: new google.maps.LatLng(-7.119764, -34.872458)
      }, options);
      var map = new google.maps.Map(this, settings);

      var markerOptions = {};

      if ($(this).data('icon-size') !== undefined && $(this).data('icon') !== undefined) {
        var sizes = $(this).data('icon-size').split(',');
        var size1 = parseInt(sizes[0]);
        var size2 = parseInt(sizes[1]);
        markerOptions['icon'] = new google.maps.MarkerImage($(this).data('icon'), null, null, null, new google.maps.Size(size1, size2));
      } else if ($(this).data('icon') !== undefined) {
        markerOptions['icon'] = $(this).data('icon');
      }

      if ($(this).data('latitude') !== undefined && $(this).data('longitude') !== undefined) {
        markerOptions['position'] = new google.maps.LatLng(parseFloat($(this).data('latitude')), parseFloat($(this).data('longitude')));
      }

      if ($(this).data('title') !== undefined && $(this).data('text') !== undefined) {
        markerOptions['content'] = [
          '<b>',
          $(this).data('title'),
          '</b> <br / >',
          $(this).data('text')

        ].join('');
      }

      var markerSettings = $.extend({
        map: map
      }, markerOptions);

      var marker = new google.maps.Marker(markerSettings);
      console.log(marker);
      map.setCenter(markerOptions['position']);

      var infowindow = new google.maps.InfoWindow({
        content: markerSettings['content']
      });

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
        map.panTo(marker.getPosition());
      });
    });

  };

}(jQuery));
