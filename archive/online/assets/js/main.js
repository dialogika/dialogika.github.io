!function(a){"use strict";var o;a(window).on("load",function(){a("#preloader").length&&a("#preloader").delay(100).fadeOut("slow",function(){a(this).remove()})}),a(".typed").length&&(o=(o=a(".typed").data("typed-items")).split(","),new Typed(".typed",{strings:o,loop:!0,typeSpeed:100,backSpeed:50,backDelay:2e3})),a(document).on("click",".nav-menu a, .scrollto",function(o){if(location.pathname.replace(/^\//,"")==this.pathname.replace(/^\//,"")&&location.hostname==this.hostname){var t=a(this.hash);if(t.length){o.preventDefault();var e=t.offset().top;return a("html, body").animate({scrollTop:e},1500,"easeInOutExpo"),a(this).parents(".nav-menu, .mobile-nav").length&&(a(".nav-menu .active, .mobile-nav .active").removeClass("active"),a(this).closest("li").addClass("active")),a("body").hasClass("mobile-nav-active")&&(a("body").removeClass("mobile-nav-active"),a(".mobile-nav-toggle i").toggleClass("icofont-navigation-menu icofont-close")),!1}}}),a(document).ready(function(){var o,t;window.location.hash&&(o=window.location.hash,a(o).length&&(t=a(o).offset().top,a("html, body").animate({scrollTop:t},1500,"easeInOutExpo")))}),a(document).on("click",".mobile-nav-toggle",function(o){a("body").toggleClass("mobile-nav-active"),a(".mobile-nav-toggle i").toggleClass("icofont-navigation-menu icofont-close")}),a(document).click(function(o){var t=a(".mobile-nav-toggle");t.is(o.target)||0!==t.has(o.target).length||a("body").hasClass("mobile-nav-active")&&(a("body").removeClass("mobile-nav-active"),a(".mobile-nav-toggle i").toggleClass("icofont-navigation-menu icofont-close"))});var t=a("section"),i=a(".nav-menu, #mobile-nav");function e(){AOS.init({duration:1e3,once:!0})}a(window).on("scroll",function(){var e=a(this).scrollTop()+300;t.each(function(){var o=a(this).offset().top,t=o+a(this).outerHeight();o<=e&&e<=t&&(e<=t&&i.find("li").removeClass("active"),i.find('a[href="#'+a(this).attr("id")+'"]').parent("li").addClass("active")),e<200&&a(".nav-menu ul:first li:first").addClass("active")})}),a(window).scroll(function(){100<a(this).scrollTop()?a(".back-to-top").fadeIn("slow"):a(".back-to-top").fadeOut("slow")}),a(".back-to-top").click(function(){return a("html, body").animate({scrollTop:0},1500,"easeInOutExpo"),!1}),a('[data-toggle="counter-up"]').counterUp({delay:10,time:1e3}),a(".skills-content").waypoint(function(){a(".progress .progress-bar").each(function(){a(this).css("width",a(this).attr("aria-valuenow")+"%")})},{offset:"80%"}),a(window).on("load",function(){var o=a(".portfolio-container").isotope({itemSelector:".portfolio-item"});a("#portfolio-flters li").on("click",function(){a("#portfolio-flters li").removeClass("filter-active"),a(this).addClass("filter-active"),o.isotope({filter:a(this).data("filter")}),e()}),a(".venobox").venobox({share:!1}),e()}),a(".testimonials-carousel").owlCarousel({autoplay:!0,dots:!0,loop:!0,items:1}),a(".portfolio-details-carousel").owlCarousel({autoplay:!0,dots:!0,loop:!0,items:1})}(jQuery);