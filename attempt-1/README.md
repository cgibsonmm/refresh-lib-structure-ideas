# Folder proposal MK-1

A lot of ideas here come from this medium article [thinking-about-react-atomically](https://medium.com/@wheeler.katia/thinking-about-react-atomically-608c865d2262), I feel that it makes a lot of sense for our use case because we are attempting to build a shared lib that also handles more complex features

## Thoughts

1. File/folder naming convention, only folders that have a direct decendent that renders a JSX.element, test, or render a JSX.element should be capitalized all others should be lower case

2. Each JSX.element should be contained in it's own directory, this seems like it could be overkill but, when you think about the fact that each component should have it's own story, tests, and snapshot, this will help to clean up.
I.E.
   -  Buttons/Button/
      - Button.tsx
      - Button.test.tsx
      - Button.stories.tsx
      - __snapshots__

3. This approach will help to un-blur the lines between what should be a dumb component, vs what should be a smart component. Most of the logic will be handled at the organism level, and we should attempt to leave any thing smaller than that dumb components that have no idea of brand/company logic

4. while I think that storybook is a great way to document, I also think that adding more .md files to document features, components, would be amazing. I added .md files ot explain my thoughts in some of the folders here and I also think this will sale well to keep our code well documented.
