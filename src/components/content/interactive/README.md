# Interactive MDX content

Interactive research and portfolio content uses `InteractivePanel` for a themed frame and view switcher, and `ChoiceGroup` for controlled scenario choices. Feature-specific data and behavior stay beside their feature component. This keeps synthetic demonstrations separate from measured content.

`InteractivePanel` renders only the selected view by default. Set `preserveInactiveViews` when controls should retain their state while readers switch views.

To add an interactive feature:

1. Build a client component in the relevant content folder. Compose the shared controls where they fit; keep data and scenario rules in feature files.
2. Register the component in `src/components/content/mdx/interactive.ts`.
3. Use its registered name in an MDX entry. State whether the interface shows measured results, a simulation, or both.
4. Check keyboard focus, dark and light themes, and a narrow viewport in the production build.
