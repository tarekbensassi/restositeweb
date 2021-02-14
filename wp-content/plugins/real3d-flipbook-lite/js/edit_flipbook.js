var pluginDir = (function(scripts) {
    var scripts = document.getElementsByTagName('script'),
        script = scripts[scripts.length - 1];
    if (script.getAttribute.length !== undefined) {
        return script.src.split('js/edit_flipbook')[0]
    }
    return script.getAttribute('src', -1).split('js/edit_flipbook')[0]
})();


(function($) {

    $(document).ready(function() {

        PDFJS = pdfjsLib

        postboxes.save_state = function(){
            return;
        };
        postboxes.save_order = function(){
            return;
        };

        if(postboxes.handle_click && !postboxes.handle_click.guid)
            postboxes.add_postbox_toggles();

        $('#real3dflipbook-admin').show()

        var pdfDocument = null
       
        $('.creating-page').hide()

        options = $.parseJSON(window.flipbook)

        function convertStrings(obj) {

            $.each(obj, function(key, value) {

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

        var title
        if (options.status == "draft") {
            title = 'Add New Flipbook'
        } else {
            title = 'Edit Flipbook'
        }

        $("#edit-flipbook-text").text(title)
        $("#title").val(r3d_stripslashes(options.name))

        
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
            'Initial book zoom, recommended between 0.8 and 1'
        );
        

        addOptionGeneral( 
            "singlePageMode",   
            "checkbox", 
            "Single page view", 
            'Display one page at a time'
        );

        addOptionGeneral( 
            "pageFlipDuration", 
            "text", 
            "Flip duration", 
            'Duration of flip animation, recommended between 0.5 and 2'
        );

        addOptionGeneral( 
            "sound",            
            "checkbox", 
            "Page flip sound"
        );
        
        addOptionGeneral( 
            "responsiveView",   
            "checkbox",
            "Responsive view", 
            'Switching from two page layout to one page layout if flipbook width is below certain treshold'
        );
        
        addOptionGeneral( 
            "responsiveViewTreshold", 
            "text", 
            "Responsive view treshold", 
            'Treshold (screen width in px) for responsive view feature'
        );

        addOptionGeneral( 
            "aspectRatio", 
            "text", 
            "Container responsive ratio", 
            'Container width / height ratio, recommended between 1 and 2'
        );
        
       
        setOptionValue('pdfUrl', options.pdfUrl)

        $('input.alpha-color-picker').alphaColorPicker()


        function previewPDFPages(){

            PDFJS.GlobalWorkerOptions.workerSrc = pluginDir + 'js/pdf.worker.min.js'

            var params = {
                cMapPacked: true,
                cMapUrl: "cmaps/",
                // disableAutoFetch: false,
                // disableCreateObjectURL: false,
                // disableFontFace: false,
                // disableRange: false,
                disableAutoFetch: true,
                disableStream: true,
                // isEvalSupported: true,
                // maxImageSize: -1,
                // pdfBug: false,
                // postMessageTransfers: true,
                url: options.pdfUrl
                // verbosity: 1
            }

            var loadingTask = PDFJS.getDocument(params)

            loadingTask.promise.then(function(pdf) {
                pdfDocument = pdf
                creatingPage = 1
                loadPageFromPdf(pdf)

                pdf.getPage(1).then(function(page){
                    generateLightboxThumbnail(page)
                })
            })

        }

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
            window.location.hash = a.attr('data-tab').split("-")[1]
            updateSaveBar()

        })

        $('#real3dflipbook-admin .nav-tab').focus(function(e) {

            this.blur()
        })

        if(window.location.hash){
            $($('.nav-tab[data-tab="tab-'+window.location.hash.split("#")[1]+'"]')[0]).trigger('click')
        }else{
            $($('#real3dflipbook-admin .nav-tab')[0]).trigger('click')
        }


        function sortOptions(){

            function sortTocItems(tocItems, prefix){
                var prefix = prefix || 'tableOfContent'
                for (var i = 0; i < tocItems.length; i++) {
                    $item = $(tocItems[i])
                    $item.find('.toc-title').attr('name', prefix + '['+i+'][title]')
                    $item.find('.toc-page').attr('name', prefix + '['+i+'][page]')

                    var $items = $item.children('.toc-item-wrapper')
                    if($items.length > 0){
                        sortTocItems($items, prefix + '['+i+'][items]')

                    }
                    
                }

            }
  
            var tocItems = $("#toc-items").children(".toc-item-wrapper")
            sortTocItems(tocItems)
            

            var pages = $('#pages-container .page')

            if(pages.length > 0){
                for (var i = 0; i < pages.length; i++) {
                    $item = $(pages[i])
                    $item.find('#page-src').attr('name', 'pages['+i+'][src]')
                    $item.find('#page-thumb').attr('name', 'pages['+i+'][thumb]')
                    $item.find('#page-title').attr('name', 'pages['+i+'][title]')
                    $item.find('#page-html').attr('name', 'pages['+i+'][htmlContent]')
                }
            }


        }

        var $form = $('#real3dflipbook-options-form')
        var previewFlipbook

        if(options.status == "draft")
            $('.create-button').show()
        else
            $('.save-button').show()

        $('.flipbook-reset-defaults').click(function(e) {
            e.preventDefault()
            var inputs = $form.find('.global-option')
            inputs.each(function(){
                // console.log(this)
                $(this).val('')
            })

            
        })

        $('.flipbook-preview').click(function(e) {

            e.preventDefault()

            sortOptions()

            $form.find('.spinner').css('visibility', 'visible')

            $form.find('.save-button').prop('disabled', 'disabled').css('pointer-events', 'none')

            // var data = $form.serialize() + '&action=r3d_preview'

            var data = 'action=r3d_preview'
            var arr = $form.serializeArray()

            arr.forEach( function(element, index) {

                if(element.value != '') data += ('&' + element.name + '=' + encodeURIComponent(element.value.trim()))

            });


            // var previewOptions = $form.serializeArray()
            // var lightboxElement = $('<p></p>')
            //         previewOptions.lightBox = true
            //        previewOptions.lightBoxOpened = true
            //        debugger
            //         lightboxElement.flipBook(previewOptions)

            //         return

            $.ajax({
                type: "POST",
                url: $form.attr('action'), //.replace('admin-ajax','admin'),
                data: data,
                success: function(response, textStatus, jqXHR) {

                    // console.log(response);
                    // var books = $.parseJSON(flipbooks);

                    $form.find('.spinner').css('visibility', 'hidden')
                    $form.find('.save-button').prop('disabled', '').css('pointer-events', 'auto')

                    var o = $.parseJSON(response)
                    convertStrings(o)

                    o.assets = {
                        preloader: pluginDir + "images/preloader.jpg",
                        left: pluginDir + "images/left.png",
                        overlay: pluginDir + "images/overlay.jpg",
                        flipMp3: pluginDir + "mp3/turnPage.mp3",
                        shadowPng: pluginDir + "images/shadow.png"
                    };

                    o.pages = o.pages || []

                    for (var key in o.pages) {
                        o.pages[key].htmlContent = unescape(o.pages[key].htmlContent)
                    }

                    if (o.pages.length < 1 && !o.pdfUrl) {
                        alert('Flipbook has no pages!')
                        e.preventDefault()
                        return false
                    }

                    var lightboxElement = $('<p></p>')
                    o.lightBox = true
                    o.lightBoxOpened = true
                    o.lightboxBackground = o.backgroundImage || o.background || o.backgroundColor
                    // o.lightboxBackground = 'rgba(0,0,0,.5)'
                    if(previewFlipbook)
                        previewFlipbook.dispose()

                    previewFlipbook = lightboxElement.flipBook(o)

                    $(window).trigger('resize')

                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    alert("Status: " + textStatus);
                    alert("Error: " + errorThrown);
                }
            })

        });

        $form.submit(function(e) {

            e.preventDefault();

            sortOptions()

            $form.find('.spinner').css('visibility', 'visible')

            $form.find('.save-button').prop('disabled', 'disabled').css('pointer-events', 'none')
            $form.find('.create-button').prop('disabled', 'disabled').css('pointer-events', 'none')
            
            var data = 'action=r3d_save'
            var arr = $form.serializeArray()

            arr.forEach( function(element, index) {

                if(element.value != '') data += ('&' + element.name + '=' + encodeURIComponent(element.value.trim()))

            });

            data += ('&bookId=' + options.id + '&security=' + options.security + '&id=' + options.id + '&date=' + encodeURIComponent(options.date) )

            if(options.status == "draft")
                data  += '&status=published';
                
            $.ajax({

                type: "POST",
                url: $form.attr('action'), //.replace('admin-ajax','admin'),
                data: data,

                success: function(data, textStatus, jqXHR) {

                    $('.spinner').css('visibility', 'hidden')
                    $('.save-button').prop('disabled', '').css('pointer-events', 'auto')
                    $('.create-button').hide()
                    $('.save-button').show()
                    $("#edit-flipbook-text").text("Edit Flipbook")

                    removeAllNotices()
                    if(options.status == "draft"){
                        addNotice("Flipbook published")
                        options.status = "published"
                   } else{
                        addNotice("Flipbook updated")
                   }

                },

                error: function(XMLHttpRequest, textStatus, errorThrown) {

                    alert("Status: " + textStatus);
                    alert("Error: " + errorThrown);

                }
            })

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

            var defaultValue = options.globals[name];

            if(typeof defaultValue == 'undefined')
                defaultValue = ""

            if(name.indexOf("[") != -1){
                if(options.globals[name.split("[")[0]])
                    defaultValue = options.globals[name.split("[")[0]][name.split("[")[1].split("]")[0]]
            }

            var val = options[name]
            if (options[name.split("[")[0]] && name.indexOf("[") != -1 && typeof(options[name.split("[")[0]]) != 'undefined') {
                 val = options[name.split("[")[0]][name.split("[")[1].split("]")[0]]
            } 

            //val = val || defaultValue
            if(typeof val == 'string')
                val = r3d_stripslashes(val)

            var table = $("#flipbook-" + section + "-options");
            var tableBody = table.find('tbody');
            var row = $('<tr valign="top"  class="field-row"></tr>').appendTo(tableBody);
            var th = $('<th scope="row">' + desc + '</th>').appendTo(row);
            var td = $('<td></td>').appendTo(row);
            var elem

            switch (type) {

                case "text":
                    elem = $('<input type="text" name="' + name + '" placeholder="Global setting"/>').appendTo(td);
                    if(typeof val != 'undefined')
                        elem.attr('value', val);
                    elem.addClass("global-option")
                    break;

                case "color":
                    elem = $('<input type="text" name="' + name + '" class="alpha-color-picker" placeholder="Global setting"/>').appendTo(td);
                    elem.attr('value', val);
                    elem.addClass("global-option")
                    break;

                case "textarea":
                    elem = $('<textarea name="' + name + '" placeholder="Global setting"/>').appendTo(td);
                    if(typeof val != 'undefined')
                        elem.attr('value', val);
                    elem.addClass("global-option")
                    break;

                case "checkbox":
                    elem = $('<select name="' + name + '"></select>').appendTo(td);
                    var globalSetting = $('<option name="' + name + '" value="">Global setting</option>').appendTo(elem);
                    var enabled = $('<option name="' + name + '" value="true">Enabled</option>').appendTo(elem);
                    var disabled = $('<option name="' + name + '" value="false">Disabled</option>').appendTo(elem);

                    if(val == true) enabled.attr('selected', 'true');
                    else if(val == false) disabled.attr('selected', 'true');
                    else globalSetting.attr('selected', 'true');
                    elem.addClass("global-option")
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

                    var globalSetting = $('<option name="' + name + '" value="">Global setting</option>')
                    .appendTo(elem)
                    .attr('selected', 'true');

                    for (var i = 0; i < values.length; i++) {
                        var option = $('<option name="' + name + '" value="' + values[i] + '">' + values[i] + '</option>').appendTo(elem);
                        if (val == values[i]) {
                            option.attr('selected', 'true');
                        }
                    }
                    elem.addClass("global-option")
                    break;

            }

            if(type == 'checkbox')
                defaultValue = defaultValue ? 'Enabled' : 'Disabled'

            if(type != 'selectImage' && type != 'selectFile')
                $('<span class="default-setting">Global setting : <strong>'+defaultValue+'</strong></span>').appendTo(td)

             if(typeof help != 'undefined')
                var p = $('<p class="description">'+help+'</p>').appendTo(td)

        }

            if(options.pages && options.pages.length){

                for (var i = 0; i < options.pages.length; i++) {
                    var page = options.pages[i];
                    var pagesContainer = $("#pages-container");
                    var pageItem = createPageHtml(i + 1, page.title, page.src, page.thumb, page.htmlContent);
                    pageItem.appendTo(pagesContainer);

                }
            }else if(options.pdfUrl){
                  previewPDFPages()
            }

            $('.page-delete').show()
            $('.replace-page').show()

            generateLightboxThumbnail()

        if (options.socialShare == null)
            options.socialShare = [];

        for (var i = 0; i < options.socialShare.length; i++) {
            var share = options.socialShare[i];
            var shareContainer = $("#share-container");
            var shareItem = createShareHtml(i, share.name, share.icon, share.url, share.target);
            shareItem.appendTo(shareContainer);

        }

        if (options.tableOfContent == null)
            options.tableOfContent = [];

        for (var i = 0; i < options.tableOfContent.length; i++) {

            var item = options.tableOfContent[i];
            var tocContainer = $("#toc-items");
            var tocItem = createTocItem(item.title, item.page, item.items);
            tocItem.appendTo(tocContainer);


        }

        // $(".tabs").tabs();
        $(".ui-sortable").sortable();
        addListeners();

        $('.attachment-details').hide()

        $('#add-share-button').click(function(e) {

            e.preventDefault()

            var shareContainer = $("#share-container");
            var shareCount = shareContainer.find(".share").length;
            var shareItem = createShareHtml("socialShare[" + shareCount + "]", "", "", "", "", "_blank");
            shareItem.appendTo(shareContainer);

            //addListeners();
            // $(".tabs").tabs();
        });

        function addTocItem(){
            var index = $('.toc-item').length
            var $item = createTocItem().appendTo("#toc-items")
        }

        function convertPdfPageToImage(index, name, size, onComplete){

            pdfDocument.getPage(index).then(function(page){

                renderPdfPage(page,function(canvas){

                    saveCanvasToServer(canvas, name, onComplete)

                },size)
            })

        }




        function selectJpgImages() {

            if (getOptionValue('pdfUrl')) {

                clearPages()
                options.pages = []

            }

            // setOptionValue('type', 'jpg')

            setOptionValue('pdfUrl', '')

            $('.attachment-details').hide()

            var pdf_uploader = wp.media({
                title: 'Select images',
                button: {
                    text: 'Send to Flipbook'
                },
                library: { type: ['image' ]},
                multiple: true // Set this to true to allow multiple files to be selected
            }).on('select', function() {

                var arr = pdf_uploader.state().get('selection');
                var pages = new Array();

                for (var i = 0; i < arr.models.length; i++) {
                    var url = arr.models[i].attributes.sizes.full.url;
                    var thumb = (typeof(arr.models[i].attributes.sizes.medium) != "undefined") ? arr.models[i].attributes.sizes.medium.url : url;
                    var title = arr.models[i].attributes.title;
                    pages.push({
                        title: title,
                        url: url,
                        thumb: thumb
                    });
                }

                var pagesContainer = $("#pages-container");
                var pagesCount = pagesContainer.find(".page").length;
                
                for (var i = 0; i < pages.length; i++) {

                    var pageItem = createPageHtml(pagesCount+i + 1, pages[i].title, pages[i].url, pages[i].thumb, "");
                    
                    pageItem.appendTo(pagesContainer);
                    pageItem.hide().fadeIn();

                    pageItem.click(function(e) {
                        expandPage($(this).attr('id'))
                    })

                }

                $('.page-delete').show()
                $('.replace-page').show()


                // addListeners();

                clearLightboxThumbnail()

                generateLightboxThumbnail()

                //document.getElementById("real3dflipbook-options-form").submit();

            }).open();

        }

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

        function clearPages() {
            $('.page').remove();
        }

        function clearLightboxThumbnail() {
            $("input[name='lightboxThumbnailUrl']").attr('value', '')
            $("img[name='lightboxThumbnailUrl']").attr('src', '')
        }

        function removePage(index) {
            $('#pages-container').find('#' + index).remove();

            $('.attachment-details').hide()
        }

        function addListeners() {
            $('.submitdelete').click(function() {
                $(this).parent().parent().animate({
                    'opacity': 0
                }, 100).slideUp(100, function() {
                    $(this).remove();
                });
                // $('.unsaved').show()
            });

            /*$('.html-content').each(function() {
                $(this).parent().find('.html-content-hidden').val(escape($(this).val()))
            })
            $('.html-content').change(function() {
                $(this).parent().find('.html-content-hidden').val(escape($(this).val()))
            })*/

            /*$('.select-image-button').click(function(e) {
                        e.preventDefault();
                        var imageURLInput = $(this).parent().find("input");
                        tb_show('', 'media-upload.php?type=image&amp;TB_iframe=true');
                        $("#TB_window,#TB_overlay,#TB_HideSelect").one("unload", function(e) {
                            e.stopPropagation();
                            e.stopImmediatePropagation();
                            return false;
                        });
             window.send_to_editor = function (html) {
             var imgurl = jQuery('img',html).attr('src');
             imageURLInput.val(imgurl);
             tb_remove();
             };
             }); */

            $('.add-pdf-pages-button').click(function(e) {
                e.preventDefault();

                if ($('.page').length == 0 || confirm('All current pages will be lost. Are you sure?')) {

                    selectPdfFile(previewPDFPages)

                }
            })

            $('.delete-pages-button').click(function(e) {
                e.preventDefault();

                if ($('.page').length == 0 || confirm('Delete all pages. Are you sure?')) {

                    clearPages()

                    options.pages = []

                }
            })

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

            $('.generate-thumbnail-button').click(function(e){
                e.preventDefault()
                if(pdfDocument ){
                    
                    setOptionValue('lightboxThumbnailUrl', "")

                    $("input[name='lightboxThumbnailUrl']").attr('value', "")
                
                    pdfDocument.getPage(1).then(function(page){
                        generateLightboxThumbnail(page)
                   })
                }
                else
                    generateLightboxThumbnail()
                
                
            })

            $('.remove-image-button').click(function(e) {
                e.preventDefault();

                var $input = $(this).parent().find("input")
                var $img = $(this).parent().find("img")

                $input.val('')
                $img.attr('src', '')
            })

            $('.delete-all-pages-button').click(function(e) {

                e.preventDefault();

                clearPages()

            });

            $('.delete-page').click(function(e) {

                e.preventDefault();

                var index = jQuery('.attachment-details').attr('data-id')

                if (confirm('Delete page ' + index + '. Are you sure?')) {

                    removePage(index)
                }

            });

            $('.add-jpg-pages-button').click(function(e) {
                //open editor to select one or multiple images and create pages from them
                e.preventDefault();

                if (getOptionValue('pdfUrl')) {
                    if ($('.page').length == 0 || confirm('All current pages will be lost. Are you sure?')) {

                        selectJpgImages()

                    }
                } else
                    selectJpgImages()

            });

            $('.add-toc-item').click(function(e) {

                e.preventDefault();

                addTocItem()

            });

            $('.toc-delete-all').click(function(e) {

                e.preventDefault();

                if($(".toc-item-wrapper").length == 0 || confirm('Delete current table on contets?'))
                    $("#toc-items").empty();
                
            });

            $('.load-pdf-outline').click(function(e) {

                e.preventDefault();

                if(getOptionValue('pdfUrl') == ''){
                    alert("Only for PDF flipbook")
                    return
                }

                if($(".toc-item-wrapper").length == 0 || confirm('Delete current table on contets?')){

                    var tocContainer = $("#toc-items").empty();

                    pdfDocument.getOutline().then(function(outline){

                        if(outline && outline.length){

                            for (var i = 0; i < outline.length; i++) {

                                var item = outline[i];

                                var tocItem = createTocItem(item.title, item.page, item.items, item.dest);
                                tocItem.appendTo(tocContainer);

                            }

                        }

                    })

                }

            });

            $('.replace-page').click(function(event) {
                replacePage()
            });

        }

        function replacePage() {
            var pdf_uploader = wp.media({
                title: 'Select image',
                button: {
                    text: 'Select'
                },
                library: {
                        type: ['image' ]
                },
                multiple: false // Set this to true to allow multiple files to be selected
            }).on('select', function() {

                var index = getEditingPageIndex()

                var selected = pdf_uploader.state().get('selection').models[0];

                var url = selected.attributes.sizes.full.url;
                var thumb = (typeof(selected.attributes.sizes.medium) != "undefined") ? selected.attributes.sizes.medium.url : null;

                setSrc(index, url)
                setThumb(index, thumb)
                setEditingPageThumb(thumb)

            }).open();
        }

        function selectPdfFile(onPdfSelected, pdf2jpg) {

            var pdf_uploader = wp.media({
                title: 'Select PDF',
                button: {
                    text: 'Send to Flipbook'
                },
                library: {
                        type: ['application/pdf' ]
                },
                multiple: false // Set this to true to allow multiple files to be selected
            }).on('select', function() {

                // $('.unsaved').show()
                var arr = pdf_uploader.state().get('selection');
                var pdfUrl = arr.models[0].attributes.url
                // $("input[name='pdfUrl']").attr('value', pdfUrl);

                setOptionValue('pdfUrl', pdfUrl)
                
                if(!pdf2jpg){
                        setOptionValue('type', 'pdf')
                }

                if(!pdf2jpg || getOptionValue("pdfUrl")){
                        clearPages()
                        clearLightboxThumbnail()

                        options.pages = []
                }



                $('.attachment-details').hide()
                        

                

                $('#pages-container').removeClass('ui-sortable')

                //we have the pdf url, now use pdf.js to open PDF 
                function getDocumentProgress(progressData) {
                    $('.creating-page').html('Loading PDF ' + parseInt(100 * progressData.loaded / progressData.total) + '% ')
                    $('.creating-page').show()

                }

                onPdfSelected(pdfUrl)

            }).open();
        }





        function createTocItem(title, page, items, dest) {

            if (title == 'undefined' || typeof(title) == 'undefined')
                title = ''
            title = r3d_stripslashes(title)

            if (page == 'undefined' || typeof(page) == 'undefined')
                page = ''
            
            var $itemWrapper = $('<div class="toc-item-wrapper">')
            // var $toggle = $('<span>+</span>').appendTo($itemWrapper)
            var $item = $('<div class="toc-item"><input type="text" class="toc-title" placeholder="Title" value="'+title+'"></input><span> : </span><input type="number" placeholder="Page number" class="toc-page" value="'+page+'"></input></div>').appendTo($itemWrapper)
            
            if(dest){
                pdfDocument.getPageIndex(dest[0]).then(function(index){
                    $item.children('.toc-page').val(index + 1)
                })
            }

            var $controls = $('<div>').addClass('toc-controls').appendTo($item)
            // var $btnAddSubItem = $('<button type="button" class="button-secondary toc-add-sub">Add sub item</button>')
            var $btnAddSubItem = $('<span>').addClass('toc-add-sub fa fa-plus').attr('title','Add sub item')
            .appendTo($controls)
            .click(function(){
                // console.log(this)
                var $subItem = createTocItem().appendTo($itemWrapper).addClass('toc-sub-item')
                // var $toggle = $('<span>').addClass('toc-toggle fa fa-caret-right').prependTo($subItem)
            })
            var $btnDelete = $('<span>').addClass('fa fa-times toc-delete').attr('title', 'Delete itemm')
            .appendTo($controls)
            .click(function(){
                if($itemWrapper.find('.toc-item-wrapper').length == 0 || confirm('Delete item and all children') ){

                    $itemWrapper.fadeOut(300,function(){$(this).remove()})
                }
            })

            if(items){
                for (var i = 0; i < items.length; i++) {
                    var item = items[i]
                    var $subItem = createTocItem(item.title, item.page, item.items, item.dest).appendTo($itemWrapper).addClass('toc-sub-item')
                }
            }

            return $itemWrapper.fadeIn()

        }

        function createPageHtml(id, title, src, thumb, htmlContent) {

            htmlContent = unescape(htmlContent);

            if (htmlContent == 'undefined' || typeof(htmlContent) == 'undefined')
                htmlContent = ''

            if (title == 'undefined' || typeof(title) == 'undefined')
                title = ''

            title = r3d_stripslashes(title)

            var res = $('<li id="' + id + '"class="page">' + '<div class="page-img"><img src="' + thumb + '"></div>' + '<p class="page-title">' + id + '</p>' + '<div style="display:block;">' + '<input id="page-title" type="hidden" placeholder="title" value="' + title + '" readonly/>' + '<input id="page-src" type="hidden" placeholder="src" value="' + src + '" readonly/>' + '<input id="page-thumb" type="hidden" placeholder="thumb" value="' + thumb + '" readonly/>' + '<input id="page-html" type="hidden" placeholder="htmlContent" class="html-content-hidden" value="' + escape(htmlContent) + '"readonly/>' + '</div>' + '</li>');

            var $img = res.find('img')

            $img.bind('load', function() {
                var h = $(this).height()
                var w = $(this).width()
                var ch = res.find('.page-img').height()
                // res.find('.page-img').css('width', ch * w / h + 'px')
            })

            if(!src)
                $img.remove()
           
            var $del = $('<span>').addClass('fa fa-times page-delete').appendTo(res).click(function(e){
                
                e.preventDefault();

                if (confirm('Delete page ' + id + '. Are you sure?')) {

                    removePage(id)
                }


            })

            return res
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
            return opiton.attr('value') || options.globals[optionName];
        }

        function getOption(optionName, type) {
            var type = type || 'input'
            var opiton = $(type + "[name='" + optionName + "']")
            return opiton;
        }

        function onModeChange() {
            if (getOptionValue('mode', 'select') == 'lightbox')
                $('[href="#tab-lightbox"]').closest('li').show();
            else
                $('[href="#tab-lightbox"]').closest('li').hide();
        }

        getOption('mode', 'select').change(onModeChange)
        onModeChange()

        function onViewModeChange() {
            if (getOptionValue('viewMode', 'select') == 'webgl')
                $('[href="#tab-webgl"]').closest('li').show();
            else
                $('[href="#tab-webgl"]').closest('li').hide();
        }

        getOption('viewMode', 'select').change(onViewModeChange)
        onViewModeChange()

        function setOptionValue(optionName, value, type) {

            options[optionName] = value

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
            $("input[name='" + optionName + "']").val(value).trigger("keyup");

            return $elem
        }

        function setColorOptionValue(optionName, value) {
            var $elem = $("input[name='" + optionName + "']").attr('value', value);
            $elem.wpColorPicker()
            return $elem
        }

        function renderPdfPage(pdfPage, onComplete, height) {
            var context, scale, viewport, canvas, context, renderContext;

            viewport = pdfPage.getViewport({scale:1});
            scale = (height || 80) / viewport.height
            viewport = pdfPage.getViewport({scale:scale});
            canvas = document.createElement('canvas');
            context = canvas.getContext('2d');
            canvas.width = viewport.width
            canvas.height = viewport.height

            renderContext = {
                canvasContext: context,
                viewport: viewport,
                intent: 'display' // intent:'print'
            };

            pdfPage.cleanupAfterRender = true


            var renderTask = pdfPage.render(renderContext);
            renderTask.promise.then(function () {
                pdfPage.cleanup()
                onComplete(canvas)
            });

            // pdfPage.render(renderContext).then(function() {

            //     onComplete(canvas)
            // })
        }

        function generateLightboxThumbnail(pdfPage) {

        }


        function setEditingPageIndex(index) {
            $('.attachment-details').attr('data-id', index)
        }

        function getEditingPageIndex() {
            return $('.attachment-details').attr('data-id')
        }

        function setEditingPageTitle(title) {
            $('#edit-page-title').val(title)
        }

        function getEditingPageTitle() {
            return $('#edit-page-title').val()
        }

        function setEditingPageSrc(val) {
            $('#edit-page-src').val(val)
        }

        function getEditingPageSrc() {
            return $('#edit-page-src').val()
        }

        function setEditingPageThumb(val) {
            $('#edit-page-canvas').empty()
            $('#edit-page-thumb').val(val)
            $('#edit-page-img').attr('src', val)
        }

        function setEditingPageThumbCanvas(canvas) {
            $('#edit-page-canvas').empty()
            $('#edit-page-img').attr('src', '')
            $(canvas).appendTo($('#edit-page-canvas'))
        }

        function getEditingPageThumb() {
            return $('#edit-page-thumb').val()
        }

        function setEditingPageHtmlContent(htmlContent) {
            $('#edit-page-html-content').val(htmlContent)
        }

        function getEditingPageHtmlContent() {
            return $('#edit-page-html-content').val()
        }

        function getPage(index) {
            return $('#pages-container li[id="' + index + '"]')
        }

        function getTitle(index) {
            return getPage(index).find('#page-title').val()
        }

        function setTitle(index, val) {
            getPage(index).find('#page-title').val(val)
        }

        function getSrc(index) {
            return getPage(index).find('#page-src').val()
        }

        function setSrc(index, val) {
            getPage(index).find('#page-src').val(val)
        }

        function getThumb(index) {
            return getPage(index).find('#page-thumb').val()
        }

        function setThumb(index, val) {
            getPage(index).find('#page-thumb').val(val)
            // getPage(index).find('.page-img').find('img').attr('src', val)
            getPage(index).find('.page-img').css('background', 'url("' + val + '")')
        }

        function getHtmlContent(index) {
            return getPage(index).find('.html-content-hidden').val()
        }

        function setHtmlContent(index, val) {
            getPage(index).find('.html-content-hidden').val(val)
        }

        $('#edit-page-title').bind('change keyup paste', function() {

            var dataId = $(this).parent().parent().attr('data-id')
            setTitle(dataId, $(this).val())

        })

        $('#edit-page-html-content').bind('change keyup paste', function() {

            var dataId = $(this).parent().parent().attr('data-id')
            setHtmlContent(dataId, escape($(this).val()))

        })

        $('.preview-pdf-pages').click(function(e) {
            e.preventDefault();
            
            if(pdfDocument && getOptionValue('pdfUrl') != ''){
                // createEmptyPages(pdfDocument)
                loadPageFromPdf(pdfDocument, 1)
            }
                
        })

        function loadPageFromPdf(pdf, pageIndex) {

            // $(".pdf-to-jpg-info").text("PDF pages preview")

            if (!pdf.pageScale) {
                pdf.getPage(1).then(function(page) {
                    var v = page.getViewport({scale:1})

                    pdf.pageScale = v.height / 150
                    pdf.thumbScale = v.height / 150

                    createEmptyPages(pdf)
                    // loadPageFromPdf(pdf, pageIndex)

                })
                return
            }

            pdf.getPage(creatingPage).then(function getPage(page) {

                var pagesContainer = $("#pages-container");

                renderPdfPage(page, function(canvas) {

                    // var pagesCount = pagesContainer.find(".page").length;
                    // var currentPage = pagesCount + 1;
                    // var title = options.pages && options.pages[currentPage - 1] ? options.pages[currentPage - 1].title : ''
                    // var htmlContent = options.pages && options.pages[currentPage - 1] ? options.pages[currentPage - 1].htmlContent : ''

                    // var pageItem = createPageHtml("pages[" + pagesCount + "]", currentPage, title, "", "", htmlContent);
                    var pageItem = $("#pages-container").find("#" + creatingPage)

                    pageItem.find('.page-img').empty().append($(canvas))

                    // pageItem.find('.page-img').width($(canvas).width())

                    // pageItem.appendTo(pagesContainer).click(function(e) {
                    //     expandPage($(this).attr("id"))
                    // })

                    if (creatingPage < pdf._pdfInfo.numPages) {

                        creatingPage++
                        loadPageFromPdf(pdf)

                    }

                })

            })
        }

        function createEmptyPages(pdf) {
            
            var numPages = pdf._pdfInfo.numPages
            var pagesContainer = $("#pages-container");

            pdf.getPage(1).then(function(page) {
                var v = page.getViewport({scale:1})

                for (var i = 1; i <= numPages; i++) {
                    var p = options.pages && options.pages[i - 1] ? options.pages[i - 1] : null
                    var title = p && p.title ? p.title : ''
                    var src = p && p.src ? p.src : ''
                    var thumb = p && p.thumb ? p.thumb : ''
                    var htmlContent = p && p.htmlContent ? p.htmlContent : ''
                    var pageItem = createPageHtml(i, title, src, thumb, htmlContent);
                    //pageItem.find('.page-img').css('min-width', 80 * v.width / v.height + 'px')
                    //pageItem.find('.page-img').empty()
                    pageItem.appendTo(pagesContainer)

                }

                $('.page-delete').hide()
                $('.replace-page').hide()


            })

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