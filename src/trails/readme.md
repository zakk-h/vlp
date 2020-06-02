# Trails Definitions

These trails are typically created using a phone app like RunKeeper,
and then exported to a `gpx` file. A `gpx` file will typically have
latitude and longitude reversed. An editor with regex can be used
to extract the coordinates:

    \],\[
    ],\n\t[
    \[(-[0-9]+.[^,]+),([^,]+),
    [$2,$1,
