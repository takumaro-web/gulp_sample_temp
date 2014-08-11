(function() {
  $(function() {
    var textMTH;
    textMTH = (function() {
      textMTH.prototype.defaults = {
        targetClass: '.mth-text'
      };

      function textMTH(options) {
        this.options = $.extend({}, this.defaults, options);
        this.className = $(this.options.targetClass);
        this._decorateFunc();
        this._setAddClass();
      }


      /*要素に囲まれたテキストを1文字ずつspanで囲む */

      textMTH.prototype._decorateFunc = function() {
        var str;
        str = [];
        $(this.className).each(function(i) {
          var j, self;
          str[i] = $(this).text();
          $(this).text("");
          self = this;
          j = 0;
          while (j < str[i].length) {
            $(self).append("<span>" + str[i].substr(j, 1) + "</span>");
            j++;
          }
        });
      };


      /*spanにclass付与（装飾） */

      textMTH.prototype._setAddClass = function() {
        var num, roopNum;
        num = 0;
        roopNum = 4;
        return $(this.className).each(function() {
          $("span", this).each(function(i) {
            num = num + 1;
            $(this).addClass("type-0" + num);
            if (roopNum === num) {
              num = 0;
            }
          });
        });
      };

      return textMTH;

    })();
    return textMTH = new textMTH();
  });

}).call(this);
