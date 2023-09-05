# Atoms

This is where I would move the component that are currently in the theme folder, and add any further components in.

### Simple Components as Atoms

Components, if possible, should be dumb. They should have no knowledge of an application's business logic and just render what they are meant to render.

![Alt text](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*bcPU1S_Z_71ij1yjO6Y0YQ.jpeg)
Three distinct atoms, that when combined, can make a search molecule
Let's say we're making our own Button component. The Button should take in a label, maybe a type (primary, secondary, etc.), and an onClick handler. That's it. It will do its one job to render as designed and handle the onClick. It should not handle making an API call when the onClick happens. That's the job of its container.

This is what makes it an atom. It's a small, contained, and simple component of our application.


--- Taken from [Thinking About React, Atomically ⚛](https://medium.com/@wheeler.katia/thinking-about-react-atomically-608c865d2262)


Atoms are the basic building blocks of all matter. Each chemical element has distinct properties, and they can't be broken down further without losing their meaning. (Yes, it's true atoms are composed of even smaller bits like protons, electrons, and neutrons, but atoms are the smallest functional unit.)
