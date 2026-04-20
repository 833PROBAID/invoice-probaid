import DOMPurify from "dompurify";
import { Template } from "./Template";
import { config } from "../../config/config";

const aiGeneratorPlugin = (editor) => {
  const apiKey = config.gemenaiApiKey;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const staticPhotoUrl = "/sample.png";
  let cachedImageBase64 = null;

  const getImageAsBase64 = async (imageUrl) => {
    if (cachedImageBase64) return cachedImageBase64;
    try {
      const absoluteUrl = imageUrl.startsWith("http")
        ? imageUrl
        : `${window.location.origin}${imageUrl}`;
      const response = await fetch(absoluteUrl);
      if (!response.ok)
        throw new Error(`Failed to fetch image: ${response.status}`);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          cachedImageBase64 = reader.result;
          resolve(cachedImageBase64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Image conversion error:", error);
      return null;
    }
  };

  const Componentstyles = `
    .ai-generator-component {
      padding: 20px;
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
      margin-bottom: 25px;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    .ai-generator-header {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .ai-icon {
      background: linear-gradient(135deg, #0097A7 0%, #178e93 100%);
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .ai-generator-title {
      flex: 1;
      color: #1f2937;
      font-size: 16px;
      font-weight: 600;
      line-height: 1.4;
      margin: 0;
    }
    
    .ai-prompt-area {
      width: 100%;
      min-height: 120px;
      padding: 12px;
      margin-bottom: 15px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      line-height: 1.5;
      background-color: white;
      color: #4b5563;
      resize: vertical;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    
    .ai-prompt-area:focus {
      outline: none;
      border-color: #0097A7;
      box-shadow: 0 0 0 3px rgba(30, 170, 177, 0.15);
    }
    
    .ai-prompt-helper {
      font-size: 12px;
      color: #6b7280;
      margin-top: -10px;
      margin-bottom: 15px;
    }
    
    .ai-generator-footer {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
    
    .ai-brand-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: linear-gradient(135deg, #0097A7 0%, #178e93 100%);
      color: white;
      font-size: 12px;
      font-weight: 500;
      padding: 4px 8px;
      border-radius: 4px;
      margin-right: 10px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
    
    .ai-generate-btn {
      background: linear-gradient(135deg, #0097A7 0%, #178e93 100%);
      color: white;
      border: none;
      border-radius: 6px;
      padding: 10px 18px;
      cursor: pointer;
      font-weight: 500;
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .ai-generate-btn:hover {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.12);
      transform: translateY(-1px);
    }
    
    .ai-generate-btn:active {
      transform: translateY(0);
    }
    
    .ai-generate-btn:disabled {
      background: #9ca3af;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
    
    .ai-loading {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #6b7280;
    }
    
    .ai-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(30, 170, 177, 0.3);
      border-radius: 50%;
      border-top-color: #0097A7;
      animation: ai-spin 1s linear infinite;
    }
    
    @keyframes ai-spin {
      to { transform: rotate(360deg); }
    }
    
    .ai-error {
      margin-top: 10px;
      padding: 10px;
      border-radius: 6px;
      background-color: #fee2e2;
      color: #b91c1c;
      font-size: 13px;
    }
    
    .ai-progress-tracker {
      margin: 15px 0;
      padding: 15px;
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      border-radius: 8px;
      color: #0369a1;
    }
    
    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    
    .stage-indicator {
      background: #dbeafe;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
    }
    
    .progress-bar-container {
      height: 8px;
      background: #e0f2fe;
      border-radius: 4px;
      overflow: hidden;
    }
    
    .progress-bar {
      height: 100%;
      background: #0ea5e9;
      transition: width 0.3s ease;
    }
    
    .ai-progress-steps {
      margin: 10px 0;
      padding-left: 20px;
    }
    
    .ai-progress-step {
      font-size: 13px;
      color: #4b5563;
      margin: 5px 0;
      position: relative;
      padding-left: 25px;
    }
    
    .ai-progress-step::before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #0097A7;
      font-weight: bold;
    }
    
    .ai-progress-step.pending::before {
      content: "•";
      color: #d1d5db;
    }
    
    .ai-estimated-time {
      font-size: 12px;
      color: #6b7280;
      margin-top: 8px;
    }`;

  editor.DomComponents.addType("ai-generator", {
    model: {
      defaults: {
        tagName: "div",
        attributes: { class: "ai-generator-component" },
        traits: [
          {
            type: "textarea",
            name: "prompt",
            label: "Your Blog Content",
            placeholder: "Paste your blog content here...",
          },
        ],
        styles: Componentstyles,
      },
    },
    view: {
      init() {
        this.listenTo(this.model, "change:prompt", this.updateContent);
        this.render();
      },

      updateContent() {
        const promptEl = this.el.querySelector(".ai-prompt-area");
        if (promptEl) {
          promptEl.value = this.model.getTrait("prompt").get("value") || "";
        }
      },

      render() {
        this.el.innerHTML = `
          <div class="ai-generator-header">
            <div class="ai-icon"><i class="fas fa-robot"></i></div>
            <h3 class="ai-generator-title">AI Blog Formatter</h3>
          </div>
          <div style="margin:0 0 15px 0; padding:8px 12px; background:#e6f7ff; border-radius:6px; font-size:13px; color:#0070a3">
            <strong>How this works:</strong>
            <ul style="margin:5px 0 0 15px; padding:0">
              <li>You provide your blog content</li>
              <li>AI formats it using 833PROBAID's style</li>
              <li>Content remains exactly the same</li>
            </ul>
          </div>
          <textarea class="ai-prompt-area" placeholder="Paste your complete blog content here..."></textarea>
          <div class="ai-prompt-helper">
            <strong>Your content is the prompt</strong> — AI applies styling without changes
          </div>
          <div class="ai-generator-footer">
            <div class="ai-brand-badge"><i class="fas fa-palette"></i> 833PROBAID Style</div>
            <button class="ai-generate-btn"><i class="fas fa-wand-magic-sparkles"></i> Format Content</button>
          </div>
          <div class="ai-loading" style="display:none">
            <div class="ai-spinner"></div>
            <span>Generating content...</span>
          </div>
          <div class="ai-error" style="display:none"></div>`;

        const promptArea = this.el.querySelector(".ai-prompt-area");
        if (promptArea) {
          promptArea.value = this.model.getTrait("prompt").get("value") || "";
          promptArea.addEventListener("input", (e) => {
            this.model.getTrait("prompt").set("value", e.target.value);
          });
        }

        const generateBtn = this.el.querySelector(".ai-generate-btn");
        if (generateBtn) {
          generateBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            this.generateContent();
          });
        }

        return this;
      },

      async generateContent() {
        const elements = {
          prompt: this.el.querySelector(".ai-prompt-area"),
          loading: this.el.querySelector(".ai-loading"),
          button: this.el.querySelector(".ai-generate-btn"),
          error: this.el.querySelector(".ai-error"),
        };

        if (
          !elements.prompt ||
          !elements.loading ||
          !elements.button ||
          !elements.error
        ) {
          console.error("Missing required elements in AI generator");
          return;
        }

        elements.error.style.display = "none";
        const prompt = elements.prompt.value
          ? elements.prompt.value.trim()
          : "";

        if (!prompt) {
          this.showError("Please paste your blog content first.");
          return;
        }

        elements.loading.style.display = "flex";
        elements.button.disabled = true;

        try {
          await this.processContent(prompt, elements);
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : "Unknown error occurred";
          this.showError(`Processing failed: ${errorMsg}`);
          console.error("Generation error:", error);
        } finally {
          elements.loading.style.display = "none";
          elements.button.disabled = false;
        }
      },

      async processContent(content, elements) {
        if (!content || typeof content !== "string") {
          throw new Error("Invalid content provided");
        }

        const progress = this.createProgressTracker();
        if (
          progress.element &&
          elements.loading &&
          elements.loading.parentNode
        ) {
          elements.loading.parentNode.insertBefore(
            progress.element,
            elements.loading,
          );
        }

        try {
          const startTime = Date.now();
          progress.update("Initializing AI engine...", 5);

          const imageBase64 = await getImageAsBase64(staticPhotoUrl);
          progress.update("Processed reference image", 10);

          const chunks = this.createContentChunks(content);
          if (!chunks || !Array.isArray(chunks)) {
            throw new Error("Failed to create content chunks");
          }

          if (chunks.length === 0) {
            throw new Error("No valid content chunks could be created");
          }

          progress.addSteps([
            `Processing ${chunks.length} content sections`,
            "Applying 833PROBAID styling",
            "Validating HTML structure",
          ]);

          const results = [];
          let currentStage = 0;

          for (const [index, chunk] of chunks.entries()) {
            if (!chunk || typeof chunk !== "string") {
              console.warn(`Skipping invalid chunk at index ${index}`);
              continue;
            }

            const progressPercent =
              10 + Math.floor((index / chunks.length) * 70);
            progress.update(
              `Processing section ${index + 1}/${chunks.length}`,
              progressPercent,
              currentStage,
            );

            const result = await this.processChunk(
              chunk,
              index,
              chunks.length,
              imageBase64,
            );
            if (result.error) {
              throw new Error(result.error);
            }
            results.push(result);

            currentStage = Math.floor(((index + 1) / chunks.length) * 3);
          }

          progress.update("Finalizing formatting...", 95, 2);
          const combinedHtml = this.combineResults(results);
          this.insertContent(combinedHtml);

          const elapsed = Math.round((Date.now() - startTime) / 1000);
          progress.update(`Completed in ${elapsed}s`, 100, 3);
          setTimeout(() => {
            if (progress.element && progress.element.parentNode) {
              progress.element.remove();
            }
          }, 2000);
        } catch (error) {
          if (progress.element && progress.element.parentNode) {
            progress.element.remove();
          }
          throw error;
        }
      },

      createProgressTracker() {
        const element = document.createElement("div");
        element.className = "ai-progress-tracker";
        element.innerHTML = `
          <div class="progress-header">
            <strong class="progress-title"></strong>
            <span class="stage-indicator"></span>
          </div>
          <div class="progress-detail"></div>
          <div class="ai-progress-steps"></div>
          <div class="ai-estimated-time"></div>
          <div class="progress-bar-container">
            <div class="progress-bar" style="width:0%"></div>
          </div>`;

        const tracker = {
          element,
          steps: [],
          update: (message, percent, stageIndex = 0) => {
            const title = element.querySelector(".progress-title");
            const detail = element.querySelector(".progress-detail");
            const bar = element.querySelector(".progress-bar");
            const stepsContainer = element.querySelector(".ai-progress-steps");
            const timeEstimate = element.querySelector(".ai-estimated-time");

            if (title) title.textContent = message || "";
            if (bar)
              bar.style.width = `${Math.min(100, Math.max(0, percent))}%`;

            if (stepsContainer && tracker.steps && tracker.steps.length > 0) {
              stepsContainer.innerHTML = tracker.steps
                .map(
                  (step, i) =>
                    `<div class="ai-progress-step ${
                      i <= stageIndex ? "" : "pending"
                    }">${step}</div>`,
                )
                .join("");
            }

            if (timeEstimate) {
              const remaining = Math.round((100 - percent) * 0.5);
              timeEstimate.textContent = `Estimated time remaining: ${remaining}s`;
            }
          },
          addSteps: (steps) => {
            if (Array.isArray(steps)) {
              tracker.steps = steps;
            }
          },
        };

        return tracker;
      },

      createContentChunks(content) {
        if (!content || typeof content !== "string") {
          console.error("Invalid content provided for chunking");
          return [];
        }

        const MAX_CHUNK = 1900;
        const sentenceSplit = /(?<!\b\w\s)\.\s+/g;
        const paragraphs = content
          .split(/\n\s*\n/)
          .filter((p) => p && p.trim());

        if (!paragraphs || paragraphs.length === 0) {
          console.error("No valid paragraphs found in content");
          return [];
        }

        const chunks = [];

        for (const para of paragraphs) {
          const sentences = para
            .split(sentenceSplit)
            .filter((s) => s && s.trim());
          let currentChunk = [];
          let currentLength = 0;

          for (const sentence of sentences) {
            const sentenceLength = sentence.length + 2;

            if (
              currentLength + sentenceLength > MAX_CHUNK &&
              currentChunk.length > 0
            ) {
              chunks.push(currentChunk.join(". ") + ".");
              currentChunk = [];
              currentLength = 0;
            }

            currentChunk.push(sentence);
            currentLength += sentenceLength;
          }

          if (currentChunk.length > 0) {
            chunks.push(currentChunk.join(". ") + ".");
          }
        }

        return chunks.length > 0 ? chunks : [content.substring(0, MAX_CHUNK)];
      },

      async processChunk(chunk, index, total, imageBase64) {
        if (!chunk || typeof chunk !== "string") {
          return { error: `Invalid chunk at index ${index}`, index };
        }

        try {
          const isFirst = index === 0;
          const prompt = `
			${Template}
			Format this ${isFirst ? "first" : "next"} blog section (${
        index + 1
      }/${total}) using HTML/Tailwind.
			PRESERVE ALL CONTENT EXACTLY. ${
        isFirst
          ? "Include header with title/subTitle/author/date, use a relevant title/subTitle based on the blog content provided by user."
          : ""
      }
			Use brand colors: #FF5300 (accent) and #0097A7 (primary).
			Reference image: ${staticPhotoUrl}
			
			IMPORTANT: Use your best judgment when applying the template. Not all content will fit a standard blog format - adapt the styling while maintaining the same visual theme and branding elements. The structure should serve the content, not force the content into a rigid structure. and avoid using any css styles other than Tailwind CSS classes. Dont use any max-width for the main div, it should be 100% width.
			
			Return clean HTML without markdown or wrappers:
			---
			${chunk}
			---`;

          const parts = [{ text: prompt }];
          if (imageBase64) {
            parts.push({
              inline_data: {
                mime_type: "image/jpeg",
                data: imageBase64.split(",")[1],
              },
            });
          }

          const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts }],
              generationConfig: {
                temperature: 0.4,
                maxOutputTokens: 8192,
                topP: 0.95,
              },
            }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
              errorData.message || `API error: ${response.status}`,
            );
          }

          const data = await response.json();
          if (!data?.candidates?.[0]?.content?.parts) {
            throw new Error("Invalid API response structure");
          }

          return {
            html: this.normalizeHtml(this.extractHtml(data)),
            index,
          };
        } catch (error) {
          console.error(`Error processing chunk ${index + 1}/${total}:`, error);
          return {
            error: error.message || `Failed to process section ${index + 1}`,
            index,
          };
        }
      },

      extractHtml(data) {
        try {
          if (!data || !data.candidates || !Array.isArray(data.candidates)) {
            throw new Error("Invalid data structure");
          }

          const text =
            data.candidates[0]?.content?.parts
              ?.map((part) => part.text || "")
              ?.join("") || "";

          const htmlMatch = text.match(/```html?([\s\S]*?)```/);
          return htmlMatch ? htmlMatch[1] : text;
        } catch (error) {
          console.error("Error extracting HTML:", error);
          return `<div>Error processing response: ${error.message}</div>`;
        }
      },

      normalizeHtml(html) {
        if (!html) return "";
        return DOMPurify.sanitize(
          html
            .replace(/```html?|```/g, "")
            .replace(/(\n\s*){3,}/g, "\n\n")
            .replace(/<(\/?)h3/g, "<$1h2")
            .replace(/<br\s*\/?>\s*<br\s*\/?>/g, "</p><p>")
            .trim(),
        );
      },

      combineResults(results) {
        if (!results || !Array.isArray(results)) {
          console.error("Invalid results array:", results);
          return '<div class="error">Error combining results</div>';
        }

        const validResults = results.filter(
          (r) => r && r.html && typeof r.html === "string",
        );
        if (validResults.length === 0) {
          return '<div class="error">No valid content generated</div>';
        }

        const sortedResults = validResults.sort(
          (a, b) => (a.index || 0) - (b.index || 0),
        );
        const mainContent = sortedResults
          .map((result) => result.html)
          .join("\n");

        return `
          <div class="blog-container mx-auto max-w-4xl px-4 py-8">
            ${mainContent}
          </div>`;
      },

      insertContent(html) {
        if (!html || typeof html !== "string") {
          console.error("Invalid HTML content to insert");
          this.showError("No content was generated");
          return;
        }

        try {
          const cleanHtml = DOMPurify.sanitize(html, {
            ADD_TAGS: ["iframe", "svg", "path"],
            ADD_ATTR: [
              "allow",
              "allowfullscreen",
              "frameborder",
              "scrolling",
              "d",
              "viewBox",
              "width",
              "height",
              "fill",
              "stroke",
            ],
          });

          // Get the AI component to remove after insertion
          const aiComponent = editor.getSelected();

          // Add the generated content as a new component
          const component = editor.Components.addComponent({
            type: "default",
            Components: cleanHtml,
            style: Template,
            removable: true,
            draggable: true,
          });

          // Place the new component in the editor
          if (aiComponent && aiComponent.get("type") === "ai-generator") {
            // Insert at the same position as the AI generator
            const parent = aiComponent.parent();
            const index = parent.Components().indexOf(aiComponent);

            if (index >= 0) {
              parent.Components().add(component, { at: index });
            } else {
              editor.getWrapper().append(component);
            }

            // Remove the AI generator component
            aiComponent.remove();
          } else {
            editor.getWrapper().append(component);
          }

          // Ensure all AI generator Components are removed from the editor
          const allComponents = editor.DomComponents.getComponents();
          this.removeAiGeneratorComponents(allComponents);
        } catch (error) {
          console.error("Error inserting content:", error);
          this.showError(`Failed to insert content: ${error.message}`);
        }
      },

      // Helper method to recursively remove all AI generator Components
      removeAiGeneratorComponents(Components) {
        if (!Components || !Components.length) return;

        for (let i = Components.length - 1; i >= 0; i--) {
          const comp = Components.at(i);
          if (comp.get("type") === "ai-generator") {
            comp.remove();
          } else if (comp.Components && comp.Components().length) {
            this.removeAiGeneratorComponents(comp.Components());
          }
        }
      },

      showError(message) {
        if (!message || typeof message !== "string") return;

        const errorEl = this.el.querySelector(".ai-error");
        if (errorEl) {
          errorEl.innerHTML = DOMPurify.sanitize(`
            <strong>Error:</strong> ${message}<br>
            <em>Please try again or contact support.</em>
          `);
          errorEl.style.display = "block";
        }
      },
    },
  });

  editor.Commands.add("ai-generate", {
    run(editor) {
      editor.addComponents({ type: "ai-generator" });
    },
  });
};

export default aiGeneratorPlugin;
