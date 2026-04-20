import { useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Quill from "quill";
import BlotFormatter from "quill-blot-formatter-mobile/dist/BlotFormatter";

if (BlotFormatter) {
	Quill.register("modules/blotFormatter", BlotFormatter);
} else {
	console.error("BlotFormatter is undefined. Ensure it's correctly imported.");
}

const Editor = ({ outputHtml, setOutputHtml }) => {
	const quillRef = useRef(null);

	// Update output HTML whenever text changes
	const updateOutputHtml = () => {
		const quill = quillRef.current?.getEditor();
		if (quill) {
			setOutputHtml(quill.root.innerHTML);
		}
	};

	// Sync editor content with `outputHtml` prop
	useEffect(() => {
		const quillInstance = quillRef.current?.getEditor();
		if (quillInstance) {
			quillInstance.root.innerHTML = outputHtml;

			// Ensure only one listener is set up
			quillInstance.on("text-change", updateOutputHtml);
			quillInstance.getModule("blotFormatter").onUpdate = updateOutputHtml;
		}
	}, []);

	const modules = {
		toolbar: [
			["bold", "italic", "underline", "strike"],
			["blockquote", "code-block"],
			[{ header: 1 }, { header: 2 }],
			[{ list: "ordered" }, { list: "bullet" }],
			[{ script: "sub" }, { script: "super" }],
			[{ indent: "-1" }, { indent: "+1" }],
			[{ direction: "rtl" }],
			[{ size: ["small", false, "large", "huge"] }],
			[{ header: [1, 2, 3, 4, 5, 6, false] }],
			[{ color: [] }, { background: [] }],
			[{ font: [] }],
			[{ align: [] }],
			["video"],
			["clean"],
			["link"],
		],
		blotFormatter: {},
	};

	const formats = [
		"align",
		"background",
		"blockquote",
		"bold",
		"code-block",
		"color",
		"float",
		"font",
		"header",
		"height",
		"video",
		"italic",
		"link",
		"list",
		"script",
		"strike",
		"size",
		"underline",
		"width",
	];

	return (
		<div className='ck'>
			<div className='quill'>
				<style>
					{`
						.ql-editor {
							min-height: 300px;
							width: 100%;
							}	
					`}
				</style>
				<ReactQuill
					ref={quillRef}
					theme='snow'
					modules={modules}
					formats={formats}
					value={outputHtml}
					onChange={updateOutputHtml}
					style={{ height: "100%", width: "100%" }}
				/>
			</div>

			{/* 	{showGallery && (
				<div
					style={{
						position: "fixed",
						top: "0",
						left: "0",
						right: "0",
						bottom: "0",
						backgroundColor: "rgba(0, 0, 0, 0.5)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						zIndex: "1000",
					}}>
					<div
						style={{
							backgroundColor: "white",
							padding: "20px",
							borderRadius: "8px",
							maxWidth: "500px",
							width: "100%",
						}}>
						<h3>Select an Image</h3>
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(3, 1fr)",
								gap: "10px",
								marginTop: "20px",
							}}>
							{preloadedImages.map((imgUrl, index) => (
								<img
									key={index}
									src={import.meta.env.VITE_APP_IMAGE_PATH + imgUrl?.path}
									alt={`Preloaded ${index}`}
									style={{
										width: "100%",
										cursor: "pointer",
										borderRadius: "5px",
									}}
									onClick={() => handleImageInsert(imgUrl?.path)}
								/>
							))}
						</div>
						<div className='flex justify-between mt-4'>
							<button
								onClick={() => setShowGallery(false)}
								style={{
									padding: "8px 16px",
									backgroundColor: "#007BFF",
									color: "white",
									borderRadius: "4px",
									border: "none",
									cursor: "pointer",
								}}>
								Close
							</button>
						</div>
					</div>
				</div>
			)} */}
		</div>
	);
};

export default Editor;
