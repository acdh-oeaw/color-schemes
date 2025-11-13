import "@/styles/index.css";

import { createColorSchemeScript } from "@acdh-oeaw/color-schemes";
import type { ReactNode } from "react";

const dataAttribute = "uiColorScheme";
const localStorageKey = "ui-color-scheme";

interface RootLayoutProps extends LayoutProps<"/"> {}

export default function RootLayout(props: Readonly<RootLayoutProps>): ReactNode {
	const { children } = props;

	const locale = "en";

	return (
		<html lang={locale}>
			<head>
				<script
					// eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml
					dangerouslySetInnerHTML={{
						__html: `(${String(createColorSchemeScript)})("${dataAttribute}", "${localStorageKey}")`,
					}}
				/>
			</head>
			<body>{children}</body>
		</html>
	);
}
