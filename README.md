Subconscious Earth
==================

This work is a semblance of a real-time data visualization based
on seismic activity. It is meant to be more expressive and thought
provoking than to accurately represent the source data.

Conceptual description
----------------------

If the Earth were to dream, what would it dream? And how would we
interpret her dreams?

Human dreams are a function of the brain while in a subconscious
state during which certain older parts of the brain, such as the
brainstem and mid-brain, create stimuli which, in turn, activate
higher brain activity in the cortex. These stimuli access memories
in non-linear combinations. The two parts--stimuli and memory--weave
together into a seemingly nonsensical narrative. However, there
remains a connection to reality since the raw materials are rooted
in real memories. Freudian psychologists spend a great deal of time
interpreting dreams.

A parallel exists within the Earth. We observe stimuli from the
Earth as earthquakes, some large, some slight, some originate from
very deep within the Earth while others are at the surface. The
Earth is actively producing seismic stimuli.
There is a memory also, in the form of photographic images
captured by a collective humanity and subsequently made available
on sites such as Flickr. Many of these photographs are geo-coded,
meaning longitude and latitude data are available (in fact,
searchable). So matching seismic activity with imagery can be done
through longitude and latitude.

My project, Subconscious Earth, attempts to interpret the Earth's
dreams through a temporal manifestation of combined imagery resulting
from Earth's seismic stimuli: it monitors worldwide seismic data
from the USGS and reacts to the earthquakes as they occur by finding
Flickr images and meshing the imagery together with recent activity
(events older than an hour are forgotten). One image is associated
with each seismic event, it's longitude, latitude, magnitude and
depth. These four data-points are used in rendering the combination
of images to influence opacity & blur, in order to represent (reflect)
these data.

Most seismic activity on an hourly basis consist of very small,
sometimes imperceptible, earthquakes. In response, Subconscious
Earth renders a soupy mixture, but if a significant event were to
occur, it would stand out in contrast. In effect, this is a real-time
data visualization, only its representation is further decoupled
from concrete meaning. It is, after all, suggestive of the dream.

Functional description
----------------------

As earthquake data come in through the USGS real-time data service,
The models/collections with the application react (in actuality,
the app polls the USGS API via the use of a Miso.dataset mechanism).
Adding an earthquake event to the collection results in calling a
simplistic view, which in actuality is more of a controller, as it
really no longer renders anything (it used to display the raw data
as a list), but instead calls into the next apparatus: the Flickr
lookup. Getting images from Flickr API results in the next AJAX
call which, upon success, adds the found photograph into another
collection. This in turn triggers a subsequent view to render the
image in combination with potentially other images within the
collection. Presently, these are overlayed using an opacity which
is determined by the strength or depth of the earthquake (the exact
connection is being reworked, but depth and magnitude are involved).

Since the Flickr search is based on longitude/latitude, and there
are certainly parts of the world so remote there are no photographs,
I have a notion of a secondary search. Presently, there is a place-
holder, text-based search, but the plans are to use a literary
reference (corpus) to connect the seismic event's long-lat with a
spatially determined location in the text, then use that text in
the secondary Flickr search.

If you dig in, you will see everything going to the same endpoint,
a super simple Sinatra app, including a proxying of AJAX requests.
This was a quick way for me to avoid cross origin (CORS) problems,
and focus on the rest.

This "single page app" uses Backbone, Underscore, Miso.Dataset and
jQuery with future plans to use Pixastic (or something equivalent)
for blur and alternative ways to combine the layered images. And
I am thinking of D3 if I decide to add an element of standard data
visualization to the mix.

Setup to run
------------

If you have all the requirements in-place, running the shell script
called start.sh is all that is required. I am using Ruby 1.9.3,
Sinatra 1.3.2; this is on a Mac running OS X Mountain Lion.

If you are starting from scratch, you will need Ruby and its gems
to be installed, and I recommend 'rvm' for all that is required.
But, before that, if you're starting from a Mac which has none of
these things, then you will need to setup Xcode (C/C++ compiler),
Homebrew is nice to have, and finally 'rvm' for managing your Ruby
software environment. http://bit.ly/Njo8XD is one person's set of
instructions to get started.

Once you have 'rvm' you can install a Ruby; for this projet I have
used ruby-1.9.3-p392, but I'm sure newer versions will also work.
Following that, there is a .rvmrc in the project which will create
a gemset called subearth. The first time you 'cd' into the project
directory with rvm installed, it will ask to use it, and by all
means do use it! With the empty gemset created, the second step
is to populate it (bundle install) which is to say install the
required gems into this gemset. Finally, you can then start the
sinatra server and then hit it with a browser.

Here are the steps (once you have rvm available):
* rvm install ruby-1.9.3-p392
* bundle install
* bash start.sh
* point your browser at http://localhost:4567 (default port)

You might also look at the console log in your browser as this
is running. Definitely a work in progress. Feel free to contact
me for any questions, etc.  wade at umn dot edu

