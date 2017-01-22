var imgSrc, profileId, albumUrl, albumPageDiv, filterImgSrc, imgPreview = '';
var imagesArr, albumUrlStack = [];
var cachedImagesSrcList = [];

var defaults = {
    zoomStyle : {
            "background"         : "#FFFFFF",
            "position"           : "absolute",
            "padding"            : "5 px",
            "z-index"            : "1000",
            "color"              : "#fff",                             
            "border"             : "5px solid #fff",
            "box-shadow"         : "0 5px 5px 5px rgba(187, 187, 187, 0.8)",
            "-webkit-box-shadow" : "0 5px 5px 5px rgba(187, 187, 187, 0.8)",
            "text-align"         : "center"
        },
    };

shaadiPhotoZoom = function(){        

    albumPageDiv = jQuery("<div class='albumPageDiv'></div>").hide();
    imgPreview   = jQuery("<div class='imgPreview'></div>");

    if(jQuery("body .albumPageDiv").length == 0){
        jQuery("body").append(albumPageDiv);
    }

    if(jQuery("body .imgPreview").length == 0){
        jQuery("body").prepend(imgPreview);
    }

    jQuery("img").on( "mousemove", function( event ) {

        imgSrc    = jQuery(this).attr('src');
        profileId = (imgSrc.substring(imgSrc.lastIndexOf('-'), -1)).substring(imgSrc.lastIndexOf('/')).substring(1);
        albumUrl  = window.location.origin+'/profile/index/view-album-photos/profileid/'+profileId;

        // load external album url
        jQuery("body .albumPageDiv").load(albumUrl);
        
        imagesArr = jQuery("body .albumPageDiv").find('div#photo-gallery img').clone();
               
        jQuery("body .imgPreview").html(imagesArr[1]);
        jQuery("body .imgPreview").css(defaults.zoomStyle);

        // calculate x y position with precision
        whenMouseMove(jQuery("body .imgPreview"), event);
        
    }).on('mouseout', function(event){
        // on mouse out of img tag make image preview blank
        jQuery("body .imgPreview").html('');
    });
}

function whenMouseMove(imgObj, e){
    var w  = 0, x = 0;
    var topPos = 0, rightPos = 0;
    
    imgObj.w = w = jQuery(window).width();
    imgObj.h = jQuery(window).height();
    
    imgObj.x = x = e.pageX;
    imgObj.y = e.pageY;
    
    // show the image loader near the mouse pointer and then adjust the loaded image in the window.
    if( imgObj.height() < 50 ){
        $divObj = imgObj;
        setInterval(function() {
            // keep checking till the image is completely loaded
            if( cachedImagesSrcList.indexOf($divObj.find('img').attr('src')) == -1 && $divObj.height() > 50 ){
                topPos = getYPosition($divObj);
                $divObj.css('top',topPos+'px');
                cachedImagesSrcList.push($divObj.find('img').attr('src'));
            }
        }, 900);
    }
    topPos = this.getYPosition(imgObj);
    
    var ratio = (w / 100 * 55);
    if(x > ratio){
        
        // Right position
        rightPos = (x+10) - (imgObj.width() > (w-x))? (w-x) : imgObj.width();
        imgObj.css({
            "width" :"",
            "height":"auto",
            "left"  :"",
            "right" :(rightPos+20)+"px",
            "top"   : topPos+"px"
        });
    } else {
        
        // Left Position
        imgObj.css({
            "width" :"",
            "height":"auto",
            "left"  :(x+20)+"px",
            "right" :"",
            "top"   : topPos+"px"
        });
    }
}

function getYPosition(imgObj){
    var pos = 0;
    imgObj.topPos = (imgObj.h+jQuery(window).scrollTop()) - imgObj.y;                
    if( (imgObj.y-jQuery(window).scrollTop()) >  imgObj.height() ){
        pos =  (imgObj.y-imgObj.height());
    }else{
        pos =  jQuery(window).scrollTop();
    }
    return (imgObj.topPos > imgObj.height() ? (imgObj.y-5) : pos );    
}

jQuery(document).bind('DOMSubtreeModified', function() {
    // DOMSubtreeModified : Fires on a node when a modification occurs in the subtree that belongs to it 
    // i.e. fires whenever there is a change in the document
});

// when DOM is ready
jQuery(function(){
    shaadiPhotoZoom();
});