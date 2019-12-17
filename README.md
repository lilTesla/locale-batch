# locale-batch
small utility to change locales and restart java services and iis

before using:
1. open an index.js file
2. On rows 1,2 assign serverConfigLocation and webConfigLocation values to your config.xml and Web.config locations
3. On rows 3,4 assign actionsService and serverService to Flowfinity Actions and Flowfinity Server service names
*. To use the shortcut change it's properties to correspond your node location and the location of the local index.js

to use:
1. rightclick on node.exe shortcut and click "run as administrator" (requieres * step above)
OR
1. set the command line location to your repo's location and run "node index.js" command

*You can also go to shortcut's properties -> advanced -> and check "run as administrator" to skip rightclicking and use double click instead
