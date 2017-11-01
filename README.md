# Queuel

**Queuel** (pronounced "kewl") is an application for managing signup queues for organized events.  For example, the original use for this system was a haunted Halloween maze.  Visitors to the maze would sign up in groups at a kiosk, while staff running the maze event would use the app to indicate when to send the next group into the maze, and staff outside the maze would advance the queue after each group.

The app communicates via WebSockets with a Node backend running Sails.  The backend is located in a [separate repo here](https://github.com/josiah-keller/queuel-api).

This system was successfully used to run 5 queues simultaneously for an event that featured 5 different attractions.  It does currently have some known bugs, primarily on the backend, but until they're fixed they can be worked around.

## Development

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0.

Run `ng serve` for a dev server on `localhost:4200`.

See [Angular CLI's documentation](https://github.com/angular/angular-cli/blob/master/README.md) for more information.

## License

This software is available under the MIT license.