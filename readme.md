# color schemes

script to manage dark / light mode in javascript. sets a data attribute on the root `html` element
to indicate the currently active color scheme.

stores the manually selected color scheme in `localstorage`, and falls back to reading system
preference via media query.

make sure to run the script before first paint to avoid flicker.

## how to use

the script adds a global color scheme store to `window.__colorScheme`, which exposes the following
api:

### `get()`

reads the currently active color scheme. returns a state object of this shape:

```ts
interface ColorSchemeState {
	kind: "system" | "user";
	colorScheme: "dark" | "light";
}
```

"system" means the user has not explicitly set a color scheme. the color scheme value then matches
the system preference.

### `set(colorScheme: "dark" | "light" | null)`

sets the currently active color scheme. setting to "null" means falling back to system preference.

### `apply(document?: Document)`

applies (or re-applies) the currently active color scheme as data attribute on the root `html`
element. re-applying is necessary when client-side routers re-render the full document and don't
re-execute inline scripts.

### `subscribe: (listener: () => void)`

subscribes to any changes, which can be triggered by (i) the user setting an explicit color scheme,
(ii) a different tab changing color scheme and writing to `localstorage`, or (iii) a user changing
system settings.

## how to set up

## react

add the following blocking script in `<head>`:

```tsx
import {
	type ColorScheme,
	type ColorSchemeState,
	createColorSchemeScript,
} from "@acdh-oeaw/color-schemes";
import type { ReactNode } from "react";

const dataAttribute = "uiColorScheme";
const localStorageKey = "ui-color-scheme";

export function ColorSchemeScript(): ReactNode {
	return (
		<script
			// eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml
			dangerouslySetInnerHTML={{
				__html: `(${String(createColorSchemeScript)})("${dataAttribute}", "${localStorageKey}")`,
			}}
			id="color-scheme-script"
		/>
	);
}
```

a color scheme toggle can use `react`'s `useSyncExternalStore` to subscribe to the color scheme
store:

```tsx
import type { ColorScheme, ColorSchemeState } from "@acdh-oeaw/color-schemes";
import { useSyncExternalStore } from "react";

function subscribe(callback: () => void): () => void {
	return window.__colorScheme.subscribe(callback);
}

function getSnapshot(): ColorSchemeState {
	return window.__colorScheme.get();
}

function getServerSnapshot(): null {
	return null;
}

function setColorScheme(colorScheme: ColorScheme | null): void {
	window.__colorScheme.set(colorScheme);
}

interface ClientColorSchemeState extends ColorSchemeState {
	setColorScheme: (colorScheme: ColorScheme | null) => void;
}

interface ServerColorSchemeState {
	kind: "server";
}

function useColorScheme(): ServerColorSchemeState | ClientColorSchemeState {
	const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

	if (state == null) {
		return { kind: "server" };
	}

	return { ...state, setColorScheme };
}
```

## astro

add the following blocking script in `<head>`:

```astro
---
import { createColorSchemeScript } from "@acdh-oeaw/color-schemes";

const dataAttribute = "uiColorScheme";
const localStorageKey = "ui-color-scheme";
---

<script
	is:inline
	set:html={`(${String(createColorSchemeScript)})("${dataAttribute}", "${localStorageKey}")`}
/>

<!-- This is necessary when using astro's `ClientRouter`. -->
<script is:inline>
	document.addEventListener("astro:before-swap", (event) => {
		const document = event.newDocument;
		window.__colorScheme?.apply(document);
	});
</script>
```

## how to style

use attribute selectors as styling hooks:

```css
:root,
[data-ui-color-scheme="light"] {
	color-scheme: light;
}

[data-ui-color-scheme="dark"] {
	color-scheme: dark;
}
```
