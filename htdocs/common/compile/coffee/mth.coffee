$ ->
	class textMTH
		defaults:
			targetClass: '.mth-text'

		constructor:  (options) ->
			@options = $.extend {}, @defaults, options
			@className = $(@options.targetClass)
			@_decorateFunc()
			@_setAddClass()

		###要素に囲まれたテキストを1文字ずつspanで囲む###
		_decorateFunc:() ->
			str = []
			$(@className).each (i) ->
			    str[i] = $(this).text()
			    $(this).text ""
			    self = this
			    j = 0
			    while j < str[i].length
			          $(self).append "<span>" + str[i].substr(j, 1) + "</span>"
			          j++
			      return
			    return

		###spanにclass付与（装飾）###
		_setAddClass:() ->
			num = 0
			roopNum = 4
			$(@className).each ->
				  $("span", this).each (i) ->
    				num = num + 1
   					$(this).addClass "type-0" + num
   					if roopNum is num
    					num = 0
   					return
   			return


	textMTH = new textMTH()