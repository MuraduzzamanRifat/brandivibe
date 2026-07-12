# Problem card images

Drop six files here and the homepage picks them up automatically:

    problem-1.jpg   nobody enquires through the site
    problem-2.jpg   months of SEO spend, nothing to show
    problem-3.jpg   work split across freelancers who don't talk
    problem-4.jpg   the site is slow and you've given up on it
    problem-5.jpg   the same manual job, every single week
    problem-6.jpg   the brand looks different everywhere

.jpg, .jpeg, .png and .webp all work. Existence is checked at BUILD time
(lib/problem-images.ts), so a card with no file simply shows its icon instead —
you can add them one at a time and nothing breaks.

Target 1600x1000 (16:10) and keep each under ~300KB; next/image handles the rest.
