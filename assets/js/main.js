let isIndex = window.location.pathname === "/" || window.location.pathname.includes("index.html");

jQuery(document).ready(function($) {
    // Function to handle responsive display changes
    function updateResponsiveDisplay() {
        if ($(window).width() < 960) {
            $(".ai-header-nav-sticky").css({"display": "flex"});
            $(".ai-header-nav").css({"display": "none"});
            if(!isIndex){
                $(".ai-main-footer").css({"margin-bottom": "65px"})
            }
        } else {
            $(".ai-header-nav-sticky").css({"display": "none"});
            $(".ai-header-nav").css({"display": "flex"});
            $(".ai-main-footer").css({"margin-bottom": "0"})
            // Reset mobile menu state when switching to desktop
            $('#sidebar').removeClass('active');
        }
    }
    
    // Run on page load and window resize
    updateResponsiveDisplay();
    $(window).resize(updateResponsiveDisplay);

    // Mobile navigation toggle
    $('#navToggle').on('click', function() {
        $('#sidebar').toggleClass('active');
    });

    // Close mobile menu when clicking outside
    $(document).on('click', function(e) {
        if ($(window).width() < 960 && 
            $('#sidebar').hasClass('active') && 
            !$(e.target).closest('#sidebar, #navToggle').length) {
            $('#sidebar').removeClass('active');
        }
    });

    // Function to set active state on nav items
    function setActiveNavItem(targetId) {
        // Remove all active classes first
        $('.ai-nav a').removeClass('active');
        $('.ai-nav .has-children').removeClass('expanded');
        
        // Set active class on the target link
        $('.ai-nav a[href="#' + targetId + '"]').addClass('active');
        
        // Find and expand parent if this is a child item
        const $parentLi = $('.ai-nav a[href="#' + targetId + '"]').closest('.has-children');
        if ($parentLi.length) {
            $parentLi.addClass('expanded');
            // Also set active on the parent link
            $parentLi.children('a').addClass('active');
            
            // If this is a nested submenu, expand all parents
            let $grandparent = $parentLi.parent().closest('.has-children');
            while ($grandparent.length) {
                $grandparent.addClass('expanded');
                $grandparent.children('a').addClass('active');
                $grandparent = $grandparent.parent().closest('.has-children');
            }
        }
    }

    // Handle nav item expand/collapse and scrolling
    $('.ai-nav a').on('click', function(e) {
        const targetHash = this.hash;
        
        // If this is a parent item with children
        if ($(this).parent().hasClass('has-children')) {
            // On mobile or if no hash, just toggle expanded state
            if ($(window).width() < 960 || targetHash === '') {
                e.preventDefault();
                $(this).parent().toggleClass('expanded');
                return;
            }
        }
        
        // If this is a link with a hash, scroll to section
        if (targetHash !== '') {
            e.preventDefault();
            
            const $targetElement = $(targetHash);
            if ($targetElement.length) {
                // Scroll to the section
                $('html, body').animate({
                    scrollTop: $targetElement.offset().top - 85
                }, 600, function() {
                    // Set active state after scrolling completes
                    setActiveNavItem(targetHash.substring(1));
                    
                    // Update URL hash without scrolling again
                    if (history.pushState) {
                        history.pushState(null, null, targetHash);
                    } else {
                        location.hash = targetHash;
                    }
                });
            }
        }
    });

    // Set active class based on scroll position
    $(window).on('scroll', function() {
        const scrollPosition = $(window).scrollTop();
        let currentSection = '';
        
        // Find the current visible section
        $('section[id], div[id]').each(function() {
            const sectionTop = $(this).offset().top - 100;
            const sectionBottom = sectionTop + $(this).outerHeight();
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSection = $(this).attr('id');
                return false; // Exit loop once found
            }
        });
        
        // Only update active state if we found a section and it's different
        if (currentSection !== '' && 
            !$('.ai-nav a[href="#' + currentSection + '"]').hasClass('active')) {
            setActiveNavItem(currentSection);
        }
    });
    
    // Initialize active state on page load
    setTimeout(function() {
        $(window).trigger('scroll');
    }, 100);
});

