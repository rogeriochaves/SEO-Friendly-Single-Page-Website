SEO Friendly Single Page Website
================================

First, it you want to test yourself, clone this repository and run

    npm install
    grunt server


This project aims to help the development of single page websites, without sacrificing the link-based navigations. That means that when Google Bot (or anybody with javascript disabled) tries to navigate your site, it will be just a plain, old website, instead of a single-page one.


This is possible because instead of having all code in the first page, each page has it's own code (/about, /contact, etc), and then the javascript makes an ajax call to load the other ones (all at once to be faster).


First, you have to wrap your content on a .singlepage div, for example, in Ruby on Rails, you would put this on your layout file:

    <div class="singlepage vertical">
        <%= yield %>
    </div>


Then, on each page put a div with the .frame class, having the name of the page as its ID, with another div with the .contents class inside, like this:

    <div class="frame" id="index"> <!-- Note the ID -->
        <div class="contents">
            <!-- Your content goes here -->
        </div>
    </div>


Now, initialize the singlepage script on your javascript, like this

    $('.singlepage').singlepage({
        pages: ["index.html", "about.html", "download.html", "last_page.html"],
        menu: 'nav a',
        ajax_load: {
            url: 'ajax_load.html',
            callback: after_load
        }
    });


That's it! (don't expect much, this is still in version 0.0.1)