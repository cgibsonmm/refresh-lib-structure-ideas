# Organisms

This is where we would house our Nav bars, RATs, Monitoring, components and so fourth,
Diving deeper into RATs, I think it would make sense that at this level Rats fits well while it is still a feature, and contains it's own logic it still feels okay to be places here and not in the features section folder


### Organisms

Organisms are more like the complex UI elements we're used to grouping pages into. Since they're more complex than molecules and atoms, it's possible that the organisms in our applications need to handle business logic.

Let's say I have an e-commerce website and we're on the product page. This page is made up of organisms such as a Navbar organism and a ProductGrid organism that contains Product molecules. What do these organisms look like? Let's look at the Navbar organism.

![alt](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*CE3O8vsViq2rM0xmDFhx0Q.jpeg)

Our Navbar organism is made up of our Search molecule that we made earlier, a Navigation molecule, and a Logo atom. In this particular instance, our organism doesn't need to handle any business logic. Organisms, when combined, can make up templates and pages which can manage any business logic and state for us.

--- Taken from [Thinking About React, Atomically ⚛](https://medium.com/@wheeler.katia/thinking-about-react-atomically-608c865d2262)
