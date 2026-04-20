const loadCustomBlocks = (editor) => {
	const blockManager = editor.BlockManager;

	// Organize blocks into professional categories

	// AI Tools category
	blockManager.add("ai-generator", {
		label: "AI Blog Template",
		attributes: { class: "fa fa-wand-magic-sparkles" },
		category: "AI Tools",
		content: {
			type: "ai-generator",
		},
		media: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2C8.69 2 6 4.69 6 8c0 1.83.83 3.47 2.13 4.58C5.5 13.94 4 16.6 4 19.5c0 .5.08 1 .22 1.5H7c-.11-.38-.19-.87-.19-1.34 0-2.15 1.65-4.31 4.16-5.46.83.26 1.72.4 2.63.4 1.13 0 2.2-.21 3.19-.59 2.76 1.15 4.5 3.35 4.5 5.66 0 .46-.08.93-.19 1.33h2.78c.14-.5.22-1 .22-1.5 0-2.93-1.58-5.59-4.13-6.94C21.17 11.45 22 9.8 22 8c0-3.31-2.69-6-6-6h-4z"/>
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/>
    <path d="M16.5,14.5 L19.5,17.5"></path>
    <path d="M9.5,14.5 L6.5,17.5"></path>
    <path d="M14,17.5 C14,16.672 13.328,16 12.5,16 L11.5,16 C10.672,16 10,16.672 10,17.5"></path>
  </svg>`,
	});

	// Blog Headers category for heading elements
	blockManager.add("blog-header", {
		label: "Blog Header with Image",
		attributes: { class: "fa fa-image" },
		category: "Blog Headers",
		content: `
    <div class="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
      <div class="w-full p-6 mb-6 rounded-lg shadow-md bg-blue-50 border-l-8 border-4 border-[#FF5300]">
        <img class="w-full h-48 object-cover rounded-lg mb-4" src="https://placehold.co/1200x400" alt="Blog Banner" />
        <h1 class="font-bold text-[#FF5300] text-4xl mb-2">Blog Title</h1>
        <p class="text-[#0097A7] font-bold text-xl">Blog subtitle or description goes here</p>
        <div class="flex items-center gap-4 mt-4">
          <span class="text-[#0097A7] text-sm">By: Author Name</span>
          <span class="text-[#0097A7] text-sm">Published: Date</span>
        </div>
      </div>
    </div>
  `,
	});

	blockManager.add("blog-title", {
		label: "Blog Main Title",
		attributes: { class: "fa fa-text-height" },
		category: "Blog Headers",
		content: `
    <div class="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
      <p class="block antialiased font-sans text-3xl md:text-5xl font-bold mt-5 text-[#0097A7]">6 Steps of Probate</p>
    </div>
  `,
	});

	blockManager.add("blog-header-with-image", {
		label: "Featured Blog Header",
		attributes: { class: "fa fa-heading" },
		category: "Blog Headers",
		content: `
		<div class="mb-12 rounded-xl shadow-lg border border-5 border-l-8 border-2 border-[#FF5300] bg-white transform transition duration-500 hover:shadow-2xl">
			<div class="p-6 md:p-8">
				<div class="relative w-full h-72 md:h-96 mb-8 rounded-lg overflow-hidden group">
					<img src="https://placehold.co/1200x630" alt="Featured Image" class="object-cover w-full h-full transform transition duration-700 group-hover:scale-105" />
					<div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
				</div>
				<h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-[#FF5300] mb-4 tracking-tight animate-fade-in">
					Your Blog Title Here
				</h1>
				<p class="text-xl md:text-2xl font-semibold text-[#0097A7] mb-6">
					Your blog subtitle or description here
				</p>
				<div class="flex flex-col sm:flex-row sm:items-center gap-4 mt-6 text-[#0097A7] border-t border-gray-100 pt-6">
					<span class="text-sm font-medium flex items-center transform transition duration-300 hover:translate-x-1">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
						By: Author Name
					</span>
					<span class="text-sm font-medium flex items-center transform transition duration-300 hover:translate-x-1">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>
						Published: Date
					</span>
				</div>
			</div>
		</div>
    `,
	});

	blockManager.add("blog-image-overlay", {
		label: "Image with Overlay Text",
		attributes: { class: "fa fa-layer-group" },
		category: "Blog Headers",
		content: `
    <div class="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
      <div class="relative z-0 border-4 border-[#0097A7] rounded-lg shadow-lg overflow-hidden">
        <img src="/ConservatorshipSales.png" alt="Understanding Conservatorship Sales" class="w-full h-auto object-cover">
        <div class="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <p class="block antialiased font-sans text-center text-4xl md:text-5xl font-bold text-white p-4 max-w-lg">
            Understanding Conservatorship Sales
          </p>
        </div>
      </div>
    </div>
  `,
	});

	// Blog Content category for main textual content
	blockManager.add("blog-title-details-normal", {
		label: "Blog Title with Details",
		attributes: { class: "fa fa-align-left" },
		category: "Blog Content",
		content: `
    <div class="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
      <div>
        <p class="block antialiased font-sans text-3xl md:text-5xl font-bold my-5 text-[#0097A7]">Role of Estate Agent</p>
        <p class="block antialiased font-sans font-normal text-lg text-[#FF5300] mb-6">
          Certified Probate Real Estate Specialists (C.P.R.E.S) are essential in assisting with probate sales, offering
          valuable expertise and support every step of the way. With their in-depth understanding of local markets and
          real estate regulations, along with their adept negotiation abilities and wide network of resources, they
          serve as crucial allies for executors and beneficiaries navigating the intricacies of probate transactions.
        </p>
      </div>
    </div>
  `,
	});

	blockManager.add("blog-details", {
		label: "Blog Details Section",
		attributes: { class: "fa fa-file-alt" },
		category: "Blog Content",
		content: `
    <div class="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
      <ul class="flex flex-col justify-center gap-6 sm:gap-8 mt-9">
	<li
		class="flex items-start gap-4 md:items-baseline rounded-lg shadow-md p-4 transition-transform duration-300 ease-in-out hover:scale-105 bg-tealSoft bg-opacity-40 border-l-8 border-4 border-[#FF5300] cursor-pointer"
	>
		<span class="flex-shrink-0"
			><i
				class="fa-regular fa-circle-check text-4xl text-[#0097A7] hidden sm:block"
			></i
		></span>
		<div class="p-2 rounded-md w-full">
			<p
				class="block antialiased font-sans font-bold text-[#FF5300] text-3xl"
			></p>
			<p class="block antialiased font-sans text-[#0097A7] font-bold text-xl">
				Following someone's passing, their estate, comprising property,
				possessions, and financial assets, must be managed and distributed
				according to their wishes or state laws if there is no will. probate
				serves as the legal avenue for this distribution.
			</p>
			<ul class="flex flex-col justify-center gap-2 mt-2"></ul>
			<ul class="flex flex-col justify-center gap-2 mt-2"></ul>
		</div>
	</li>
	<li
		class="flex items-start gap-4 md:items-baseline rounded-lg shadow-md p-4 transition-transform duration-300 ease-in-out hover:scale-105 bg-tealSoft bg-opacity-40 border-l-8 border-4 border-[#FF5300] cursor-pointer"
	>
		<span class="flex-shrink-0"
			><i
				class="fa-regular fa-circle-check text-4xl text-[#0097A7] hidden sm:block"
			></i
		></span>
		<div class="p-2 rounded-md w-full">
			<p
				class="block antialiased font-sans font-bold text-[#FF5300] text-3xl"
			></p>
			<p class="block antialiased font-sans text-[#0097A7] font-bold text-xl">
				During probate, the court appoints a representative, often known as an
				Executor or Personal Representative, to manage the estate. This person
				is responsible for tasks such as asset valuation, debt payments, and
				asset distribution to beneficiaries or heirs.
			</p>
			<ul class="flex flex-col justify-center gap-2 mt-2"></ul>
			<ul class="flex flex-col justify-center gap-2 mt-2"></ul>
		</div>
	</li>
</ul>
    </div>
  `,
	});

	blockManager.add("blog-intro-section", {
		label: "Blog Introduction",
		attributes: { class: "fa fa-paragraph" },
		category: "Blog Content",
		content: `
		<div class="mb-10 rounded-xl shadow-lg border border-l-8 border-2 border-[#FF5300] bg-white/80 backdrop-blur-sm transform transition duration-500 hover:shadow-xl hover:-translate-y-1">
			<div class="p-6 md:p-8">
				<div class="flex gap-3 sm:gap-4">
					<div class="hidden sm:block mt-1">
						<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0097A7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 animate-pulse">
							<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
							<polyline points="22 4 12 14.01 9 11.01"></polyline>
						</svg>
					</div>
					<p class="text-lg md:text-xl text-[#0097A7] font-medium leading-relaxed">
						Enter your introduction text here. Provide context about the topic and why it matters to your readers. This is a good place to establish the problem that your article will help solve.
					</p>
				</div>
			</div>
		</div>
    `,
	});

	blockManager.add("blog-title-details", {
		label: "Detailed Blog Section",
		attributes: { class: "fa fa-info-circle" },
		category: "Blog Content",
		content: `
    <div class="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
      <ul class="flex flex-col justify-center gap-6 sm:gap-8 mt-9">
	<li
		class="flex items-start gap-4 md:items-baseline rounded-lg shadow-md p-4 transition-transform duration-300 ease-in-out hover:scale-105 bg-tealSoft bg-opacity-40 border-l-8 border-4 border-[#FF5300] cursor-pointer"
	>
		<span class="flex-shrink-0"
			><i
				class="fa-regular fa-circle-check text-4xl text-[#0097A7] hidden sm:block"
			></i
		></span>
		<div class="p-2 rounded-md w-full">
			<p
				class="block antialiased font-sans font-bold text-[#FF5300] text-3xl"
			>
				Evaluate Offers Thoroughly
			</p>
			<p class="block antialiased font-sans text-[#0097A7] font-bold text-xl">
				When reviewing offers from potential buyers, evaluate factors like offer
				price, terms, contingencies, and buyer considerations. Compare these
				against your priorities to assess offer strength and suitability.
			</p>
			<ul class="flex flex-col justify-center gap-2 mt-2"></ul>
			<ul class="flex flex-col justify-center gap-2 mt-2"></ul>
		</div>
	</li>
	<li
		class="flex items-start gap-4 md:items-baseline rounded-lg shadow-md p-4 transition-transform duration-300 ease-in-out hover:scale-105 bg-tealSoft bg-opacity-40 border-l-8 border-4 border-[#FF5300] cursor-pointer"
	>
		<span class="flex-shrink-0"
			><i
				class="fa-regular fa-circle-check text-4xl text-[#0097A7] hidden sm:block"
			></i
		></span>
		<div class="p-2 rounded-md w-full">
			<p
				class="block antialiased font-sans font-bold text-[#FF5300] text-3xl"
			>
				Counteroffers and Negotiations
			</p>
			<p class="block antialiased font-sans text-[#0097A7] font-bold text-xl">
				Sellers can counteroffer to adjust terms like price or contingencies.
				Effective negotiation involves open communication, flexibility, and
				focusing on mutual interests for a mutually beneficial agreement.
			</p>
			<ul class="flex flex-col justify-center gap-2 mt-2"></ul>
			<ul class="flex flex-col justify-center gap-2 mt-2"></ul>
		</div>
	</li>

</ul>
    </div>
  `,
	});

	// Blog Media Elements
	blockManager.add("blog-image", {
		label: "Standalone Blog Image",
		attributes: { class: "fa fa-image" },
		category: "Blog Media",
		content: `
    <div class="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
      <img src="/WhatIsProbate.jpg" alt="Probate" class="w-full mt-5 rounded-lg shadow-lg border-2 border-[#FF5300]">
    </div>
  `,
	});

	// Lists & Steps category
	blockManager.add("blog-checkmark-title", {
		label: "Blog Checklist",
		attributes: { class: "fa fa-list-check" },
		category: "Lists & Steps",
		content: `
    <div class="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
      <ul class="flex flex-col justify-center gap-6 sm:gap-8 mt-9">
	<li
		class="flex items-start gap-4 md:items-baseline rounded-lg shadow-md p-4 transition-transform duration-300 ease-in-out hover:scale-105 bg-tealSoft bg-opacity-40 border-l-8 border-4 border-[#FF5300] cursor-pointer"
	>
		<span class="flex-shrink-0"
			><i
				class="fa-regular fa-circle-check text-4xl text-[#0097A7] hidden sm:block"
			></i
		></span>
		<div class="p-2 rounded-md w-full">
			<p
				class="block antialiased font-sans font-bold text-[#FF5300] text-3xl"
			></p>
			<p class="block antialiased font-sans text-[#0097A7] font-bold text-xl">
				The individual suffers from dementia, Alzheimer's, or a brain injury and
				can no longer manage finances.
			</p>
			<ul class="flex flex-col justify-center gap-2 mt-2"></ul>
			<ul class="flex flex-col justify-center gap-2 mt-2"></ul>
		</div>
	</li>
	<li
		class="flex items-start gap-4 md:items-baseline rounded-lg shadow-md p-4 transition-transform duration-300 ease-in-out hover:scale-105 bg-tealSoft bg-opacity-40 border-l-8 border-4 border-[#FF5300] cursor-pointer"
	>
		<span class="flex-shrink-0"
			><i
				class="fa-regular fa-circle-check text-4xl text-[#0097A7] hidden sm:block"
			></i
		></span>
		<div class="p-2 rounded-md w-full">
			<p
				class="block antialiased font-sans font-bold text-[#FF5300] text-3xl"
			></p>
			<p class="block antialiased font-sans text-[#0097A7] font-bold text-xl">
				No power of attorney was established beforehand.
			</p>
			<ul class="flex flex-col justify-center gap-2 mt-2"></ul>
			<ul class="flex flex-col justify-center gap-2 mt-2"></ul>
		</div>
	</li>

</ul>
    </div>
  `,
	});

	blockManager.add("blog-title-list", {
		label: "Blog Title with List",
		attributes: { class: "fa fa-list" },
		category: "Lists & Steps",
		content: `
    <div class="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
      <ul class="flex flex-col justify-center gap-6 sm:gap-8 mt-9">
	<li
		class="flex items-start gap-4 md:items-baseline rounded-lg shadow-md p-4 transition-transform duration-300 ease-in-out hover:scale-105 bg-tealSoft bg-opacity-40 border-l-8 border-4 border-[#FF5300] cursor-pointer"
	>
		<span class="flex-shrink-0"
			><i
				class="fa-regular fa-circle-check text-4xl text-[#0097A7] hidden sm:block"
			></i
		></span>
		<div class="p-2 rounded-md w-full">
			<p
				class="block antialiased font-sans font-bold text-[#FF5300] text-3xl"
			>
				Initial Consultation and Assessment
			</p>
			<p
				class="block antialiased font-sans text-[#0097A7] font-bold text-xl"
			></p>
			<ul class="flex flex-col justify-center gap-2 mt-2">
				<li class="flex items-baseline gap-4">
					<i class="fa-solid fa-arrow-right text-[#FF5300]"></i>
					<p
						class="block antialiased font-sans text-[#0097A7] font-bold text-xl"
					>
						The executor consults a real estate agent to assess the market
						worth.
					</p>
				</li>
				<li class="flex items-baseline gap-4">
					<i class="fa-solid fa-arrow-right text-[#FF5300]"></i>
					<p
						class="block antialiased font-sans text-[#0097A7] font-bold text-xl"
					>
						The agent evaluates the property.
					</p>
				</li>
				<li class="flex items-baseline gap-4">
					<i class="fa-solid fa-arrow-right text-[#FF5300]"></i>
					<p
						class="block antialiased font-sans text-[#0097A7] font-bold text-xl"
					>
						Discuss the timeline, goals, and expectations for the probate sale.
					</p>
				</li>
			</ul>
			<ul class="flex flex-col justify-center gap-2 mt-2"></ul>
		</div>
	</li>
	<li
		class="flex items-start gap-4 md:items-baseline rounded-lg shadow-md p-4 transition-transform duration-300 ease-in-out hover:scale-105 bg-tealSoft bg-opacity-40 border-l-8 border-4 border-[#FF5300] cursor-pointer"
	>
		<span class="flex-shrink-0"
			><i
				class="fa-regular fa-circle-check text-4xl text-[#0097A7] hidden sm:block"
			></i
		></span>
		<div class="p-2 rounded-md w-full">
			<p
				class="block antialiased font-sans font-bold text-[#FF5300] text-3xl"
			>
				Property Preparation and Marketing
			</p>
			<p
				class="block antialiased font-sans text-[#0097A7] font-bold text-xl"
			></p>
			<ul class="flex flex-col justify-center gap-2 mt-2">
				<li class="flex items-baseline gap-4">
					<i class="fa-solid fa-arrow-right text-[#FF5300]"></i>
					<p
						class="block antialiased font-sans text-[#0097A7] font-bold text-xl"
					>
						Prepare the property for sale.
					</p>
				</li>
				<li class="flex items-baseline gap-4">
					<i class="fa-solid fa-arrow-right text-[#FF5300]"></i>
					<p
						class="block antialiased font-sans text-[#0097A7] font-bold text-xl"
					>
						Develops a comprehensive marketing strategy.
					</p>
				</li>
				<li class="flex items-baseline gap-4">
					<i class="fa-solid fa-arrow-right text-[#FF5300]"></i>
					<p
						class="block antialiased font-sans text-[#0097A7] font-bold text-xl"
					>
						Property is listed on the market, and showings are scheduled.
					</p>
				</li>
			</ul>
			<ul class="flex flex-col justify-center gap-2 mt-2"></ul>
		</div>
	</li>
</ul>
    </div>
  `,
	});

	blockManager.add("probate-step", {
		label: "Probate Process Step",
		attributes: { class: "fa fa-list-ol" },
		category: "Lists & Steps",
		content: `
		<div class="mb-10 rounded-xl shadow-lg border border-l-8 border-2 border-[#FF5300] bg-white/80 backdrop-blur-sm transform transition duration-500 hover:shadow-xl hover:-translate-y-1">
			<div class="p-6 md:p-8">
				<div class="flex gap-3 sm:gap-4">
					<div class="hidden sm:block mt-1">
						<div class="h-12 w-12 rounded-full bg-[rgba(30,170,177,0.1)] flex items-center justify-center transform transition duration-500 hover:scale-110">
							<span class="text-2xl font-bold text-[#0097A7]">1</span>
						</div>
					</div>
					<div class="space-y-4 sm:space-y-6 flex-1">
						<h2 class="text-2xl sm:text-3xl font-bold text-[#FF5300] mb-2 sm:mb-4 tracking-tight">
							Step Title Goes Here
						</h2>
						<div class="bg-[rgba(30,170,177,0.05)] rounded-lg p-4 sm:p-6 border-l-4 border-[#0097A7] transform transition duration-500 hover:bg-[rgba(30,170,177,0.1)]">
							<p class="text-lg md:text-xl mb-4">
								<span class="text-[#FF5300] font-bold">Why It Matters</span>
								<span class="text-[#0097A7] font-medium">
									Explain why this step is important in the probate process and what outcomes it affects.
								</span>
							</p>
						</div>

						<p class="text-xl font-bold text-[#FF5300] mb-2 sm:mb-4">Actions to Take</p>
						<ul class="space-y-3 sm:space-y-4">
							<li class="flex items-start gap-3 bg-white rounded-lg p-4 shadow-md transform transition duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-[rgba(30,170,177,0.02)]">
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF5300" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-1 flex-shrink-0 animate-pulse">
									<line x1="5" y1="12" x2="19" y2="12"></line>
									<polyline points="12 5 19 12 12 19"></polyline>
								</svg>
								<p class="text-lg">
									<span class="text-[#FF5300] font-medium">Action Item Title:</span>
									<span class="text-[#0097A7] font-medium">Description of the action to take.</span>
								</p>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
    `,
	});

	blockManager.add("blog-steps-section", {
		label: "Blog Steps",
		attributes: { class: "fa fa-list-ol" },
		category: "Lists & Steps",
		content: `
			<div
				class="mb-10 rounded-xl shadow-lg border border-l-8 border-2 border-[#FF5300] bg-white/80 backdrop-blur-sm transform transition duration-500 hover:shadow-xl hover:-translate-y-1"
			>
				<div class="p-6 md:p-8">
					<div class="flex gap-3 sm:gap-4">
						<div class="hidden sm:block mt-1">
							<div
								class="h-12 w-12 rounded-full bg-[rgba(30,170,177,0.1)] flex items-center justify-center transform transition duration-500 hover:scale-110"
							>
								<span class="text-2xl font-bold text-[#0097A7]">1</span>
							</div>
						</div>
						<div class="space-y-4 sm:space-y-6 flex-1">
							<h2
								class="text-2xl sm:text-3xl font-bold text-[#FF5300] mb-2 sm:mb-4 tracking-tight"
							>
								Step 1: Understand the Probate Process
							</h2>
							<div
								class="bg-[rgba(30,170,177,0.05)] rounded-lg p-4 sm:p-6 border-l-4 border-[#0097A7] transform transition duration-500 hover:bg-[rgba(30,170,177,0.1)]"
							>
								<p class="text-lg md:text-xl mb-4">
									<span class="text-[#FF5300] font-bold">Why It Matters</span>
									<span class="text-[#0097A7] font-medium">
										Before listing the property, it's crucial to ensure the
										probate process has officially begun and that you, as the
										executor (also known as the personal representative), have
										the legal authority to sell the home. Probate is the
										court-supervised process of administering a deceased
										individual's estate, which includes:
									</span>
								</p>
								<ul
									class="list-disc pl-6 sm:pl-8 mb-4 sm:mb-6 text-[#0097A7] font-medium text-lg space-y-2"
								>
									<li
										class="transform transition duration-300 hover:translate-x-1"
									>
										Proving the validity of the will (if one exists).
									</li>
									<li
										class="transform transition duration-300 hover:translate-x-1"
									>
										Identifying and valuing the decedent's assets.
									</li>
									<li
										class="transform transition duration-300 hover:translate-x-1"
									>
										Paying off debts and taxes.
									</li>
									<li
										class="transform transition duration-300 hover:translate-x-1"
									>
										Distributing remaining assets to beneficiaries.
									</li>
								</ul>
							</div>

							<p class="text-xl font-bold text-[#FF5300] mb-2 sm:mb-4">
								Actions to Take
							</p>
							<ul class="space-y-3 sm:space-y-4">
								<li
									class="flex items-start gap-3 bg-white rounded-lg p-4 shadow-md transform transition duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-[rgba(30,170,177,0.02)]"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="#FF5300"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="mt-1 flex-shrink-0 animate-pulse"
									>
										<line x1="5" y1="12" x2="19" y2="12"></line>
										<polyline points="12 5 19 12 12 19"></polyline>
									</svg>
									<p class="text-lg">
										<span class="text-[#FF5300] font-medium"
											>Obtain Letters of Administration or Letters
											Testamentary:</span
										>
										<span class="text-[#0097A7] font-medium">
											These documents confirm your authority to act on behalf of
											the estate.</span
										>
									</p>
								</li>
								<li
									class="flex items-start gap-3 bg-white rounded-lg p-4 shadow-md transform transition duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-[rgba(30,170,177,0.02)]"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="#FF5300"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="mt-1 flex-shrink-0 animate-pulse"
									>
										<line x1="5" y1="12" x2="19" y2="12"></line>
										<polyline points="12 5 19 12 12 19"></polyline>
									</svg>
									<p class="text-lg">
										<span class="text-[#FF5300] font-medium"
											>Consult with a Probate Attorney:</span
										>
										<span class="text-[#0097A7] font-medium">
											A legal professional can clarify local probate laws,
											timeline, and required filings.</span
										>
									</p>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
    `,
	});

	// Legal & Special Sections
	blockManager.add("probate-disclaimer", {
		label: "Legal Disclaimer",
		attributes: { class: "fa fa-exclamation-triangle" },
		category: "Legal & Special Sections",
		content: `
		<div class="rounded-xl shadow-lg border border-l-8 border-2 border-[#FF5300] bg-white transform transition duration-500 hover:shadow-xl">
			<div class="p-6 md:p-8">
				<p class="text-lg text-[#0097A7] font-medium flex items-start gap-3">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF5300" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 animate-pulse">
						<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
						<line x1="12" y1="9" x2="12" y2="13"></line>
						<line x1="12" y1="17" x2="12.01" y2="17"></line>
					</svg>
					Disclaimer: This blog post is for informational purposes only and does not constitute legal, financial, or tax advice. Always consult an attorney for details specific to your situation.
				</p>
			</div>
		</div>
    `,
	});

	blockManager.add("key-takeaways-grid", {
		label: "Key Takeaways Grid",
		attributes: { class: "fa fa-th-large" },
		category: "Legal & Special Sections",
		content: `
		<div class="mb-10">
			<h2 class="text-3xl md:text-4xl font-bold text-[#FF5300] mb-8 tracking-tight relative inline-block">
				Key Takeaways
			</h2>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
				<div class="rounded-xl shadow-lg border border-l-8 border-2 border-[#FF5300] bg-white transform transition duration-500 hover:shadow-xl hover:-translate-y-2 hover:bg-[rgba(30,170,177,0.05)]">
					<div class="p-6">
						<div class="flex gap-3">
							<div class="hidden sm:flex items-center justify-center h-10 w-10 rounded-full bg-[rgba(30,170,177,0.1)] transform transition duration-500 hover:scale-110">
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0097A7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 animate-pulse">
									<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
									<polyline points="22 4 12 14.01 9 11.01"></polyline>
								</svg>
							</div>
							<p class="text-lg">
								<span class="text-[#FF5300] font-medium">Takeaway Title:</span>
								<span class="text-[#0097A7] font-medium">Description of the key point that readers should remember.</span>
							</p>
						</div>
					</div>
				</div>

				<div class="rounded-xl shadow-lg border border-l-8 border-2 border-[#FF5300] bg-white transform transition duration-500 hover:shadow-xl hover:-translate-y-2 hover:bg-[rgba(30,170,177,0.05)]">
					<div class="p-6">
						<div class="flex gap-3">
							<div class="hidden sm:flex items-center justify-center h-10 w-10 rounded-full bg-[rgba(30,170,177,0.1)] transform transition duration-500 hover:scale-110">
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0097A7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 animate-pulse">
									<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
									<polyline points="22 4 12 14.01 9 11.01"></polyline>
								</svg>
							</div>
							<p class="text-lg">
								<span class="text-[#FF5300] font-medium">Takeaway Title:</span>
								<span class="text-[#0097A7] font-medium">Description of the key point that readers should remember.</span>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
    `,
	});
};

export default loadCustomBlocks;
