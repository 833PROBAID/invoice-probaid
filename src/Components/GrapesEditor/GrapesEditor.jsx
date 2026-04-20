import { useEffect, useRef, useState } from "react";
import grapesjs from "grapesjs";
import gjsPresetWebpage from "grapesjs-preset-webpage";
import gjsBlocksBasic from "grapesjs-blocks-basic";
import loadCustomBlocks from "./GrapesjsCustomBlocks";
import "grapesjs/dist/css/grapes.min.css";
import "./GrapesEditor.css";
import aiGeneratorPlugin from "./GrapesjsAiPlugin";
import codeEditorPlugin from "./GrapesjsCodeEditorPlugin";

const GrapesEditor = ({ initialContent, initialState, onGetContent }) => {
	const editorRef = useRef(null);
	const instanceRef = useRef(null);
	const [editorReady, setEditorReady] = useState(false);

	// Function to get current editor content
	const getCurrentContent = () => {
		if (instanceRef.current) {
			const html = instanceRef.current.getHtml();
			const state = JSON.stringify(instanceRef.current.getProjectData());
			return { html, state };
		}
		return { html: "<p>No content</p>", state: null };
	};

	useEffect(() => {
		if (editorRef.current && !instanceRef.current) {
			instanceRef.current = grapesjs.init({
				container: editorRef.current,
				height: "85vh",
				width: "auto",
				storageManager: false,
				panels: { defaults: [] },
				deviceManager: {},
				plugins: [
					gjsPresetWebpage,
					gjsBlocksBasic,
					aiGeneratorPlugin,
					codeEditorPlugin,
				],
				pluginsOpts: {
					gjsPresetWebpage: {},
					gjsBlocksBasic: {},
				},
				// Add Tailwind CSS classes to the style manager
				canvas: {
					styles: [
						"https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css",
						"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css",
					],
					scripts: ["https://cdn.tailwindcss.com"],
				},
				styleManager: {
					sectors: [
						{
							name: "Typography",
							properties: [
								"font-family",
								"font-size",
								"font-weight",
								"letter-spacing",
								"color",
								"line-height",
								"text-align",
							],
						},
						{
							name: "Background",
							properties: ["background-color", "background"],
						},
					],
				},
			});

			// Load custom blocks after editor initialization
			loadCustomBlocks(instanceRef.current);

			if (initialState) {
				try {
					const parsedState =
						typeof initialState === "string"
							? JSON.parse(initialState)
							: initialState;
					instanceRef.current.loadProjectData(parsedState);
				} catch (error) {
					console.error("Error loading editor state:", error);
					if (initialContent && initialContent !== "<p>No content</p>") {
						instanceRef.current.setComponents(initialContent);
					}
				}
			} else if (initialContent && initialContent !== "<p>No content</p>") {
				instanceRef.current.setComponents(initialContent);
			}

			setEditorReady(true);
		}

		return () => {
			if (instanceRef.current) {
				instanceRef.current.destroy();
				instanceRef.current = null;
			}
		};
	}, [initialContent, initialState]);

	return (
		<div className='grapes-editor-container'>
			<div ref={editorRef} className='editor-canvas'></div>
			{editorReady && (
				<div className='editor-actions'>
					<button
						className='get-content-btn'
						onClick={() => onGetContent && onGetContent(getCurrentContent())}>
						Save Formatted Content
					</button>
				</div>
			)}
		</div>
	);
};

export default GrapesEditor;
