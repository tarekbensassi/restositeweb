(function($) {

    $(document).ready(function() {

        $('#real3dflipbook-admin').show()

        $('.creating-page').hide()

        postboxes.save_state = function(){
            return;
        };
        postboxes.save_order = function(){
            return;
        };

        if(postboxes.handle_click && !postboxes.handle_click.guid)
            postboxes.add_postbox_toggles();

        options = $.parseJSON(window.options)

        function convertStrings(obj) {

            $.each(obj, function(key, value) {
                // console.log(key + ": " + options[key]);
                if (typeof(value) == 'object' || typeof(value) == 'array') {
                    convertStrings(value)
                } else if (!isNaN(value)) {
                    if (obj[key] == "")
                        delete obj[key]
                    else if(key != "security")
                        obj[key] = Number(value)
                } else if (value == "true") {
                    obj[key] = true
                } else if (value == "false") {
                    obj[key] = false
                }
            });

        }
        convertStrings(options)

        var title = 'General settings'

        $("#edit-flipbook-text").text(title)
        
        addOptionGeneral(
            "viewMode", 
            "dropdown",         
            "View mode", 
            '<strong>webgl</strong> - realistic 3D page flip with lights and shadows<br/><strong>3d</strong> - CSS 3D flip<br/><strong>swipe</strong> - horizontal swipe<br/><strong>simple</strong> - no animation',
            ["webgl", "3d", "2d", "swipe", "simple"]
        );
        
        addOptionGeneral( 
            "zoomMin",          
            "text", 
            "Initial zoom", 
            'initial book zoom, recommended between 0.8 and 1'
        );

        addOptionGeneral( 
            "singlePageMode",   
            "checkbox", 
            "Single page view", 
            'display one page at a time'
        );

        addOptionGeneral( 
            "pageFlipDuration", 
            "text", 
            "Flip duration", 
            'duration of flip animation, recommended between 0.5 and 2'
        );

        addOptionGeneral( 
            "sound",            
            "checkbox", 
            "Page flip sound"
        );
        addOptionGeneral( 
            "startPage",        
            "text", 
            "Start page", 
            'open flipbook at this page at start'
        );

        
        addOptionGeneral( 
            "responsiveView",   
            "checkbox",
            "Responsive view", 
            'switching from two page layout to one page layout if flipbook width is below certain treshold'
        );
        
        addOptionGeneral( 
            "responsiveViewTreshold", 
            "text", 
            "Responsive view treshold", 
            'treshold (screen width in px) for responsive view feature'
        );

        
        addOptionGeneral( 
            "aspectRatio", 
            "text", 
            "Container responsive ratio", 
            'container width / height ratio, recommended between 1 and 2'
        );
        


        $('input.alpha-color-picker').alphaColorPicker()


        var ui_layouts = {
            'default':{

                menuOverBook: false,
                menuFloating: false,
                menuBackground: '',
                menuShadow: '',
                menuMargin: 0,
                menuPadding: 0,
                menuTransparent:false,

                menu2OverBook:true,
                menu2Floating: false,
                menu2Background:'',
                menu2Shadow: '',
                menu2Margin: 0,
                menu2Padding: 0,
                menu2Transparent:true,

                btnMargin:2,
                sideMenuOverMenu:false,
                sideMenuOverMenu2:true,

                currentPage:{hAlign:'left', vAlign:'top'},
                btnAutoplay:{hAlign:'center', vAlign:'bottom'},
                btnSound:{hAlign:'center', vAlign:'bottom'},
                btnExpand:{hAlign:'center', vAlign:'bottom'},
                btnZoomIn:{hAlign:'center', vAlign:'bottom'},
                btnZoomOut:{hAlign:'center', vAlign:'bottom'},
                btnSearch:{hAlign:'center', vAlign:'bottom'},
                btnBookmark:{hAlign:'center', vAlign:'bottom'},
                btnToc:{hAlign:'center', vAlign:'bottom'},
                btnThumbs:{hAlign:'center', vAlign:'bottom'},
                btnShare:{hAlign:'center', vAlign:'bottom'},
                btnPrint:{hAlign:'center', vAlign:'bottom'},
                btnDownloadPages:{hAlign:'center', vAlign:'bottom'},
                btnDownloadPdf:{hAlign:'center', vAlign:'bottom'},
                btnSelect:{hAlign:'center', vAlign:'bottom'},
            },
            "1":{

            },
            "2":{ // bottom 2
                currentPage:{vAlign:'bottom', hAlign:'center'},
                btnAutoplay:{hAlign:'left'},
                btnSound:{hAlign:'left'},
                btnExpand:{hAlign:'right'},
                btnZoomIn:{hAlign:'right'},
                btnZoomOut:{hAlign:'right'},
                btnSearch:{hAlign:'left'},
                btnBookmark:{hAlign:'left'},
                btnToc:{hAlign:'left'},
                btnThumbs:{hAlign:'left'},
                btnShare:{hAlign:'right'},
                btnPrint:{hAlign:'right'},
                btnDownloadPages:{hAlign:'right'},
                btnDownloadPdf:{hAlign:'right'},
                btnSelect:{hAlign:'right'}
            },
            "3":{ // top 
                menuTransparent:true,
                menu2Transparent:false,
                menu2OverBook:false,
                menu2Padding:5,
                btnMargin:5,
                currentPage:{vAlign:'top', hAlign:'center'},
                btnPrint:{vAlign:'top',hAlign:'right'},
                btnDownloadPdf:{vAlign:'top',hAlign:'right'},
                btnDownloadPages:{vAlign:'top',hAlign:'right'},
                btnThumbs:{vAlign:'top',hAlign:'left'},
                btnToc:{vAlign:'top',hAlign:'left'},
                btnBookmark:{vAlign:'top',hAlign:'left'},
                btnSearch:{vAlign:'top',hAlign:'left'},
                btnSelect:{vAlign:'top',hAlign:'right'},
                btnShare:{vAlign:'top',hAlign:'right'},
                btnAutoplay:{hAlign:'right'},
                btnExpand:{hAlign:'right'},
                btnZoomIn:{hAlign:'right'},
                btnZoomOut:{hAlign:'right'},
                btnSound:{hAlign:'right'},
                menuPadding:5
            },
            "4":{ // top 2
                menu2Transparent:false,
                menu2OverBook:false,
                sideMenuOverMenu2:false,
                currentPage:{vAlign:'top', hAlign:'center'},
                btnAutoplay:{vAlign:'top', hAlign:'left'},
                btnSound:{vAlign:'top', hAlign:'left'},
                btnExpand:{vAlign:'top', hAlign:'right'},
                btnZoomIn:{vAlign:'top', hAlign:'right'},
                btnZoomOut:{vAlign:'top', hAlign:'right'},
                btnSearch:{vAlign:'top', hAlign:'left'},
                btnBookmark:{vAlign:'top', hAlign:'left'},
                btnToc:{vAlign:'top', hAlign:'left'},
                btnThumbs:{vAlign:'top', hAlign:'left'},
                btnShare:{vAlign:'top', hAlign:'right'},
                btnPrint:{vAlign:'top', hAlign:'right'},
                btnDownloadPages:{vAlign:'top', hAlign:'right'},
                btnDownloadPdf:{vAlign:'top', hAlign:'right'},
                btnSelect:{vAlign:'top', hAlign:'right'}
                
            }
        }

        $('select[name="layout"]').change(function(){
            
            var name = this.value

            var defaults = ui_layouts['default']
            for (var key in defaults) {
                setOptionValue(key, defaults[key])
            }

            var obj = ui_layouts[name]
            for (var key in obj) {
                setOptionValue(key, obj[key])
            }

            setOptionValue('layout', name)
        })


        function updateSaveBar() {

            if ((window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 50)) {

                $("#r3d-save").removeClass("r3d-save-sticky")
                $("#r3d-save-holder").hide()

            } else {

                $("#r3d-save").addClass("r3d-save-sticky")
                $("#r3d-save-holder").show()

            }

        }

        $('#real3dflipbook-admin .nav-tab').click(function(e) {
            e.preventDefault()
            $('#real3dflipbook-admin .tab-active').hide()
            $('.nav-tab-active').removeClass('nav-tab-active')
            var a = jQuery(this).addClass('nav-tab-active')
            var id = "#" + a.attr('data-tab')
            jQuery(id).addClass('tab-active').fadeIn()

            updateSaveBar()

        })

        $('#real3dflipbook-admin .nav-tab').focus(function(e) {

            this.blur()
        })

        $($('#real3dflipbook-admin .nav-tab')[0]).trigger('click')

        var $form = $('#real3dflipbook-options-form')

        $form.submit(function(e) {

            e.preventDefault();

            $form.find('.spinner').css('visibility', 'visible')

            $form.find('.save-button').prop('disabled', 'disabled').css('pointer-events', 'none')
            $form.find('.create-button').prop('disabled', 'disabled').css('pointer-events', 'none')
            
            var data = 'action=r3d_save_general&security=' + window.r3d_nonce
            var arr = $form.serializeArray()

            arr.forEach( function(element, index) {

                if(element.value != '') data += ('&' + element.name + '=' + encodeURIComponent(element.value.trim()))

            });
   
            $.ajax({

                type: "POST",
                url: $form.attr('action'),
                data: data,

                success: function(data, textStatus, jqXHR) {

                    $('.spinner').css('visibility', 'hidden')
                    $('.save-button').prop('disabled', '').css('pointer-events', 'auto')
                    $('.create-button').hide()
                    $('.save-button').show()
                    $("#edit-flipbook-text").text("Edit Flipbook")

                    removeAllNotices()
                    addNotice("Settings updated")

                },

                error: function(XMLHttpRequest, textStatus, errorThrown) {

                    alert("Status: " + textStatus);
                    alert("Error: " + errorThrown);

                }
            })

        })

        /**
         * Create and show a dismissible admin notice
         */
        function addNotice( msg ) {
             
            var div = document.createElement( 'div' );
            $(div).addClass( 'notice notice-info' ).css('position', 'relative').fadeIn();
             
            var p = document.createElement( 'p' );
             
            $(p).text( msg ).appendTo($(div));
             
            var b = document.createElement( 'button' );
            $(b).attr( 'type', 'button' ).addClass( 'notice-dismiss' ).appendTo($(div));
         
            var bSpan = document.createElement( 'span' );
            $(bSpan).addClass( 'screen-reader-text' ).text( 'Dismiss this notice' ).appendTo($(b));
             
            var h1 = document.getElementsByTagName( 'h1' )[0];
            h1.parentNode.insertBefore( div, h1.nextSibling);
         
            $(b).click(function () {
                div.parentNode.removeChild( div );
            });
         
        }

        function removeAllNotices(){
            $(".notice").remove()
        }

        $('.flipbook-reset-defaults').click(function(e){
            e.preventDefault()
            if(confirm("Reset Global settings?")){


               var data = 'action=r3d_reset_general&security=' + window.r3d_nonce 

                $.ajax({

                    type: "POST",
                    url: 'admin-ajax.php?page=real3d_flipbook_admin',
                    data: data,


                    success: function(data, textStatus, jqXHR) {

                        location.reload()

                    },

                    error: function(XMLHttpRequest, textStatus, errorThrown) {

                        alert("Status: " + textStatus);
                        alert("Error: " + errorThrown);

                    }
                })

            }
        })

        $(window).scroll(function() {
            updateSaveBar()
        })

        $(window).resize(function() {
            updateSaveBar()
        })

        updateSaveBar()

        function unsaved() { // $('.unsaved').show()
        }


        // flipbook-options

        if (options.socialShare == null)
            options.socialShare = [];

        for (var i = 0; i < options.socialShare.length; i++) {
            var share = options.socialShare[i];
            var shareContainer = $("#share-container");
            var shareItem = createShareHtml(i, share.name, share.icon, share.url, share.target);
            shareItem.appendTo(shareContainer);

        }

        // $(".tabs").tabs();
        $(".ui-sortable").sortable();

        $('#add-share-button').click(function(e) {

            e.preventDefault()

            var shareContainer = $("#share-container");
            var shareCount = shareContainer.find(".share").length;
            var shareItem = createShareHtml("socialShare[" + shareCount + "]", "", "", "", "", "_blank");
            shareItem.appendTo(shareContainer);

        });

       function addOptionGeneral(name, type, desc, help, values){
            addOption('general',name, type, desc, help, values)
        }

        function addOptionMobile(name, type, desc, help, values){
            addOption('mobile',name, type, desc, help, values)
        }

        function addOptionLightbox(name, type, desc, help, values){
            addOption('lightbox',name, type, desc, help, values)
        }

        function addOptionWebgl(name, type, desc, help, values){
            addOption('webgl',name, type, desc, help, values)
        }

        function addOption(section, name, type, desc, help, values){

            var val = options[name]
            if (options[name.split("[")[0]] && name.indexOf("[") != -1 && typeof(options[name.split("[")[0]]) != 'undefined') {
                 val = options[name.split("[")[0]][name.split("[")[1].split("]")[0]]
            } 

            //val = val || defaultValue
            if(typeof val == 'strings')
                val = r3d_stripslashes(val)

            var table = $("#flipbook-" + section + "-options");
            var tableBody = table.find('tbody');
            var row = $('<tr valign="top"  class="field-row"></tr>').appendTo(tableBody);
            var th = $('<th scope="row">' + desc + '</th>').appendTo(row);
            var td = $('<td></td>').appendTo(row);
            var elem

            switch (type) {

                case "text":
                    elem = $('<input type="text" name="' + name + '"/>').appendTo(td);
                    if(typeof val != 'undefined')
                        elem.attr('value', val);
                    break;

                case "color":
                    elem = $('<input type="text" name="' + name + '" class="alpha-color-picker"/>').appendTo(td);
                    elem.attr('value', val);
                    break;

                case "textarea":
                    elem = $('<textarea name="' + name + '"/>').appendTo(td);
                    if(typeof val != 'undefined')
                        elem.attr('value', val);
                    break;

                case "checkbox":
                    elem = $('<select name="' + name + '"></select>').appendTo(td);
                    var enabled = $('<option name="' + name + '" value="true">Enabled</option>').appendTo(elem);
                    var disabled = $('<option name="' + name + '" value="false">Disabled</option>').appendTo(elem);

                    if(val == true) enabled.attr('selected', 'true');
                    else if(val == false) disabled.attr('selected', 'true');
                    break;

                case "selectImage":
                    elem = $('<input type="hidden" name="' + name + '"/><img name="' + name + '"><a class="select-image-button button-secondary button80" href="#">Select image</a><a class="remove-image-button button-secondary button80" href="#">Remove image</a>').appendTo(td);
                    $(elem[0]).attr("value", val);
                    $(elem[1]).attr("src", val);
                    break;

                case "selectFile":
                    elem = $('<input type="text" name="' + name + '"/><a class="select-image-button button-secondary button80" href="#">Select file</a>').appendTo(td);
                    elem.attr('value', val);
                    break;

                case "dropdown":
                
                    elem = $('<select name="' + name + '"></select>').appendTo(td);

                    for (var i = 0; i < values.length; i++) {
                        var option = $('<option name="' + name + '" value="' + values[i] + '">' + values[i] + '</option>').appendTo(elem);
                        if (val == values[i]) {
                            option.attr('selected', 'true');
                        }
                    }
                    break;

            }

             if(typeof help != 'undefined')
                var p = $('<p class="description">'+help+'</p>').appendTo(td)

        }

        function createShareHtml(prefix, id, name, icon, url, target) {

            if (typeof(target) == 'undefined' || target != "_self")
                target = "_blank";

            var markup = $('<div id="' + id + '"class="share">' + '<h4>Share button ' + id + '</h4>' + '<div class="tabs settings-area">' + '<ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" role="tablist">' + '<li><a href="#tabs-1">Icon name</a></li>' + '<li><a href="#tabs-2">Icon css class</a></li>' + '<li><a href="#tabs-3">Link</a></li>' + '<li><a href="#tabs-4">Target</a></li>' + '</ul>' + '<div id="tabs-1" class="ui-tabs-panel ui-widget-content ui-corner-bottom">' + '<div class="field-row">' + '<input id="page-title" name="' + prefix + '[name]" type="text" placeholder="Enter icon name" value="' + name + '" />' + '</div>' + '</div>' + '<div id="tabs-2" class="ui-tabs-panel ui-widget-content ui-corner-bottom">' + '<div class="field-row">' + '<input id="image-path" name="' + prefix + '[icon]" type="text" placeholder="Enter icon CSS class" value="' + icon + '" />' + '</div>' + '</div>' + '<div id="tabs-3" class="ui-tabs-panel ui-widget-content ui-corner-bottom">' + '<div class="field-row">' + '<input id="image-path" name="' + prefix + '[url]" type="text" placeholder="Enter link" value="' + url + '" />' + '</div>' + '</div>' + '<div id="tabs-4" class="ui-tabs-panel ui-widget-content ui-corner-bottom">' + '<div class="field-row">' // + '<input id="image-path" name="'+prefix+'[target]" type="text" placeholder="Enter link" value="'+target+'" />'

                +
                '<select id="social-share" name="' + prefix + '[target]">' // + '<option name="'+prefix+'[target]" value="_self">_self</option>'
                // + '<option name="'+prefix+'[target]" value="_blank">_blank</option>'
                +
                '</select>' + '</div>' + '</div>' + '<div class="submitbox deletediv"><span class="submitdelete deletion">x</span></div>' + '</div>' + '</div>' + '</div>');

            var values = ["_self", "_blank"];
            var select = markup.find('select');

            for (var i = 0; i < values.length; i++) {
                var option = $('<option name="' + prefix + '[target]" value="' + values[i] + '">' + values[i] + '</option>').appendTo(select);
                if (typeof(options["socialShare"][id]) != 'undefined') {
                    if (options["socialShare"][id]["target"] == values[i]) {
                        option.attr('selected', 'true');
                    }
                }
            }

            return markup;
        }

        function getOptionValue(optionName, type) {
            var type = type || 'input'
            var opiton = $(type + "[name='" + optionName + "']")
            return opiton.attr('value');
        }

        function getOption(optionName, type) {
            var type = type || 'input'
            var opiton = $(type + "[name='" + optionName + "']")
            return opiton;
        }

        $('.select-image-button').click(function(e) {
            e.preventDefault();

            var $input = $(this).parent().find("input")
            var $img = $(this).parent().find("img")

            var pdf_uploader = wp.media({
                title: 'Select file',
                button: {
                    text: 'Select'
                },
                multiple: false // Set this to true to allow multiple files to be selected
            }).on('select', function() {

                // $('.unsaved').show()
                var arr = pdf_uploader.state().get('selection');
                var selected = arr.models[0].attributes.url

                $input.val(selected)
                $img.attr('src', selected)
            }).open();
        })

        $('.remove-image-button').click(function(e) {
            e.preventDefault();

            var $input = $(this).parent().find("input")
            var $img = $(this).parent().find("img")

            $input.val('')
            $img.attr('src', '')
        })
        
        function setOptionValue(optionName, value, type) {

            if(typeof value == 'object'){
                for(var key in value){
                    setOptionValue(optionName + '[' + key + ']', value[key])
                }
                return null
            }
            var type = type || 'input'
            var $elem = $(type + "[name='" + optionName + "']").attr('value', value).prop('checked', value);

            if(value === true) value = "true"
            else if(value === false) value = "false"

            $("select[name='" + optionName + "']").val(value);
            $("input[name='" + optionName + "']").val(value).trigger('keyup');

            return $elem
        }

        function setColorOptionValue(optionName, value) {
            var $elem = $("input[name='" + optionName + "']").attr('value', value);
            $elem.wpColorPicker()
            return $elem
        }

       
      

    });
})(jQuery);

function r3d_stripslashes(str) {
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Ates Goral (http://magnetiq.com)
    // +      fixed by: Mick@el
    // +   improved by: marrtins
    // +   bugfixed by: Onno Marsman
    // +   improved by: rezna
    // +   input by: Rick Waldron
    // +   reimplemented by: Brett Zamir (http://brett-zamir.me)
    // +   input by: Brant Messenger (http://www.brantmessenger.com/)
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: stripslashes('Kevin\'s code');
    // *     returns 1: "Kevin's code"
    // *     example 2: stripslashes('Kevin\\\'s code');
    // *     returns 2: "Kevin\'s code"
    return (str + '').replace(/\\(.?)/g, function(s, n1) {
        switch (n1) {
            case '\\':
                return '\\';
            case '0':
                return '\u0000';
            case '':
                return '';
            default:
                return n1;
        }
    });
}