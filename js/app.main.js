;(function(win, $){
    'use strict';
    var app = win.app = typeof (win.app) !== 'undefined' ? win.app : {};
    
    (app.main = function() {
        //private properties
        var defaults = {};
        
        var setActivePageNavIndicator = function(sectionName){
            $('.page-nav-indicators li a').each(function(index, element){
                var $element = $(element);
                //console.log('element.data("section"):' + $element.data('section') + ' sectionName:' + sectionName);
                if ($element.data('section') === sectionName) {
                    $('.page-nav-indicators li a .circle.active').removeClass('active');
                    $element.find('span').addClass('active');
                    return false;
                }
            });
        };
        
        var windowScrolling = function(e) {
            //console.log('vertical scroll position:' + window.scrollY + ' window.height:' + $('#home').get(0).clientHeight + ' scrollY % win height/2: ' + Math.ceil(window.scrollY % Math.ceil(window.innerHeight / 4)));
            // trying to throttle the scrolling a bit, so that it only does some work every quarter of the way through the page. 
            if (Math.ceil(window.scrollY % Math.ceil(window.innerHeight / 2)) < Math.ceil(window.innerHeight / 4)) { 
                var $section = $('#' + getActivePageElementByNavMenuOffset());
                $('section.active').removeClass("active");
                $section.addClass('active');
                setActivePageNavIndicator($section.data('section'));
            }    
        };       
                
        //private methods
        var navigateTo = function(e) {
            e.preventDefault();
            if ($(e.currentTarget).closest('.menu-list').length > 0){
                toggleNavMenu();
            }
            var pageId = $(e.currentTarget).data('section');
            //console.log('navigateTo method: pageId: ' + pageId);
            // set window scrolling off while we navigate
            $(window).off('scroll');
            setTimeout(function (){
                $('html, body')
                    .animate({ scrollTop: $('#' + pageId).offset().top}, 1000, 'swing'/*'easeInOutCubic'*/, function(){
                        //when animation is done
                        setActivePageNavIndicator(pageId);
                        //set window scrolling back on
                        $(window).on('scroll', windowScrolling);
                    });
            }, 500);  // if we're navigating from the hamburger menu, this gives the menu a chance to close.
        };
        
        var getActivePageElementByNavMenuOffset = function(){
            //navMenuOffset is adjusted with the window.innerHeight / 2 so that as a user scrolls halfway through
            //the page, we will indicate the next/prev page depending on the direction.
            var navMenuOffset = $('.nav-menu').offset().top + Math.ceil(window.innerHeight / 2), 
                $pageSections = $('body > section, body > footer'),
                sectionNameShowing = 'home';
            
            $pageSections.each(function(i, element){
                //console.log('section, top:' + $(element).data('section') + ', ' + $(element).offset().top + ' navMenuOffset: ' + navMenuOffset + ' height/2: ' + Math.ceil(window.innerHeight / 2));
                if ($(element).offset().top <= navMenuOffset) {
                    sectionNameShowing = $(element).data('section');
                }
            }); 
            
            return sectionNameShowing;            
        };
        
        var toggleNavMenu = function(e){
            if (typeof (e) !== 'undefined') {
                e.preventDefault();
            }

            var $body = $('body'),
                $section = $('#' + getActivePageElementByNavMenuOffset()),
                $menuLink = $('.nav-menu'),
                $menuList = $('.menu-list ul'),
                transitionEnd = 'transitionend webkitTransitionEnd otransitionend msTransitionEnd';
            
            $menuList.css({top: $body.scrollTop() });
            $body.addClass('animating');
            $menuLink.addClass('animating');
            
            if ($body.hasClass('menu-visible')) {
                $body.addClass('right');
                $menuLink.addClass('right');
            } else {
                $body.addClass('left');
                $menuLink.addClass('left');
            }
            
            $section.one(transitionEnd, function(){
                $body
                    .removeClass('animating left right')
                    .toggleClass('menu-visible');
                if ($body.hasClass('menu-visible')){
                    $menuLink
                        .find('span:first-child')
                        .css({opacity: 0})
                        .next()
                        .css({opacity: 0, 'font-size': '1.2rem'})
                        .removeClass('fa-navicon')
                        .addClass('fa-close')
                        .css({opacity: 1});
                } else {
                    $menuLink
                        .find('span:first-child')
                        .css({opacity: 1})
                        .next()
                        .css({opacity: 0, 'font-size': '1rem'})
                        .removeClass('fa-close')
                        .addClass('fa-navicon')
                        .css({opacity: 1});                    
                }                                        
            });

            $menuLink.one(transitionEnd, function(){
                $menuLink
                    .removeClass('animating left right');
            });
        };
        
        var repositionPageNavIndicators = function(){
            $('.page-nav-indicators')
                .css({top: ($('#home').get(0).clientHeight - $('.page-nav-indicator-list').get(0).clientHeight) / 2 })
        };

        var initPageNavIndicators = function () {
            var $sections = $('body > section, body > footer'),
                $indicatorList = $('.page-nav-indicator-list'),
                $indicatorTemplate = $('.page-nav-indicators .template');
            
            if ($indicatorTemplate.length === 0) {
                return;
            }

            $.each($sections, function(index, section){
                var $clone = $indicatorTemplate.clone();
                $clone
                    .find('a')
                    .data('section', $(section).data('section'))
                    .end()
                    .removeClass('template')
                    .appendTo($indicatorList);
            });
            $('.page-nav-indicator-list .template').remove();
            $indicatorList
                .find('.page-nav-indicator:first .circle')
                .addClass('active');
            repositionPageNavIndicators();
        };
        
        var windowResizing = function(e){
            repositionPageNavIndicators();  
        };
                
        var registerEvents = function(settings) {
            $('.mobile-menu').on('click', toggleNavMenu);
            $('.menu-list').on('click', 'a', navigateTo);
            $(window).on('scroll', windowScrolling);
            $(window).on('resize', windowResizing);
            $('.page-nav-indicator').on('click', 'a', navigateTo);
            $('.see-my-work').on('click', navigateTo);
            $('.right-content a[data-section]').on('click', navigateTo);
        };
        
        // public methods/properties
        return {
            init: function(options){
                var settings = $.extend(defaults, options); // overrides defaults that may already be set
                initPageNavIndicators();
                registerEvents(settings);
            }
        }
    }());    
})(window, jQuery);