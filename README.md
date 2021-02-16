# Concentra Solver (Angular Version) #

## Background ##

* For the original version and an explanation of the solving process, see the [GitHub repo](https://github.com/danego/circle-puzzle).

* The new version is interactive while also providing info and hints about solutions. This means the user can not only see the different solutions, but can also attempt to solve the puzzle themselves.

## Changes ##

* The main solving capability is enabled by the Angular Material Drag and Drop functionality with a lot of alterations to make it work for a circular layout and across multiple components.

* The solver now has all three puzzle patterns and their solutions. Because of their differences in piece composition, one pattern has 63 solutions and the other two have 7 solutions. The solving algorithm handles both easily.

* The piece banks are a reserve area for unused puzzle pieces. There is a lot of extra code built into them to provide a smooth, seamless experience not provided out of the box.

* Positioning of the pieces around the circle layers is now done programatically. Changing the style and size of the pieces can now be done from a central location at the drop of a hat.

* The page is mightily responsive, changing layouts, features, and actual puzzle size to best complement each screen range. 

* One particularly exciting feature is the solution tracker which displays how many solutions are still viable based on the currently placed pieces. This feature enables solving in a wholly new manner.

* There are more features sprinkled about the app and their documentation is forthcoming.
