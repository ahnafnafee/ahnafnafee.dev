# Interactive MDX content

Interactive research and portfolio content uses `InteractivePanel` for a themed frame and view switcher, and `ChoiceGroup` for controlled scenario choices. These modules have no knowledge of a particular research project. Feature-specific data, decisions, and view content stay beside the feature that owns them. This keeps synthetic demonstrations separate from measured content.

`InteractivePanel` accepts one or more views with stable, unique, URL-safe `id` values, labels, and React content. It mounts only the selected view's content by default. Set `preserveInactiveViews` when controls should retain their state while readers switch views. Its tab strip supports arrow keys, Home, and End; one-view panels omit the strip. `ChoiceGroup` works with any string-valued choice set.

To add an interactive feature:

1. Add a folder under the relevant content area, such as `research/my-study/`. Put static data and pure decision rules in a separate file from stateful views.
2. Build a client component that passes view content to `InteractivePanel`, using `ChoiceGroup` for scenario selection when useful. A single-view feature can use the same panel without tabs.
3. Register that component by name in `src/components/content/mdx/interactive.ts`, then use `<RegisteredName />` in a research, portfolio, or blog MDX entry. No route or page-template edit is needed.
4. Label measured results and simulations clearly. Test the feature's decisions and the shared controls separately, then check keyboard focus, dark and light themes, and a narrow viewport.

`RecommendationDecisionLab` is the working example: `EvidenceView` renders fixed results, `RouteSimulator` owns interactive state, and `model.ts` holds the synthetic profiles and routing rule. Its wrapper only composes the two views.
