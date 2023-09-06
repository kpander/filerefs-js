# filerefs-js Changelog

  - v0.0.6 (2023-09-06)
    - Maintenance: internal changes to prevent side effects
    - Maintenance: adds unit tests

  - v0.0.5 (2023-09-03)
    - Bugfix: Ignores data urls

  - v0.0.4 (2023-09-03)
    - Bugfix: Includes the URL hash if it exists
    - Bugfix: Strictly recognizes missing basePath now

  - v0.0.2 (2023-09-03)
    - Breaking: The results key now contains the entire matched tag, not just until the file reference
      - Yes, it's brittle, it assumes a data-attribute isn't going to contain a '>' character

  - v0.0.1 (2023-09-03)
    - Initial build
