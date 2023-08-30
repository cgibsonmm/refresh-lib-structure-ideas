# Molecules

This will house small pieces of our apps, and we will need alot of help from our designs here, I would imagin that if I look through our cross brand designs we will find re-used molecules everywhere

I.E.

1. search fields
2. card components

### Molecules in React

Let’s say that we want to make a search module with our new Button component and a TextInput component. When we combine these two components, we can create a Search component that acts as a molecule. If at all possible, molecules, like atoms, should be unaware of business logic within your application. It can take in an onSearchClick handler which gets passed down to the Button component, but it shouldn’t fetch any results based on what was typed into the TextInput component. Again, that’s the job of its container.

![alt text](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*cTWJJbrAR4-k1T2Xsq7CTg.jpeg)

--- Taken from [Thinking About React, Atomically ⚛](https://medium.com/@wheeler.katia/thinking-about-react-atomically-608c865d2262)


Molecules are groups of two or more atoms held together by chemical bonds. These combinations of atoms take on their own unique properties, and become more tangible and operational than atoms.
