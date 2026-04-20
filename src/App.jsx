import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./Shared/Footer";
import Home from "./Pages/Home/Home";
import TopNav from "./Shared/TopNav";
import Commitment from "./Pages/Commitment";
import NavigatingTheSalesProcessHome from "./Pages/NavigatingTheSalesProcessHome";
import UnderstandingProbateSalesHome from "./Pages/UnderstandingProbateSalesHome";
import AdvantagesOfReverseMortgagesHome from "./Pages/AdvantagesOfReverseMortgagesHome";
import LegalAndEthicalConsiderationsHome from "./Pages/LegalAndEthicalConsiderationsHome";
import ProbateDecisionMakingSellingVsKeepingPropertyHome from "./Pages/ProbateDecisionMakingSellingVsKeepingPropertyHome";
import GlossaryOfProbateTermsHome from "./Pages/GlossaryOfProbateTermsHome";
import FaqHome from "./Pages/FaqHome";
import ContactUs from "./Pages/ContactUs";
import Testimonials from "./Pages/Testimonials";
import Listings from "./Pages/Listings";
import ListingDetails from "./Pages/ListingDetails";
import ListingsManage from "./Pages/Dashboard/Pages/ListingsManage";
import BlogList from "./Pages/Dashboard/Pages/Blogs/BlogList";
import Blog from "./Pages/Dashboard/Pages/Blogs/Blog";
import AddBlog from "./Pages/Dashboard/Pages/Blogs/AddBlog";
import BlogView from "./Pages/BlogView";
import AllBlogList from "./Pages/AllBlogList";
import Dashboard from "./Pages/Dashboard/Dashboard";
import PrivateRoute from "./Shared/PrivateRoute";
import LoginPage from "./Pages/Login";
import { DataProvider } from "./Shared/Context";
import ScrollTop from "./Shared/ScrollTop";
import SubscribersPage from "./Pages/Dashboard/Pages/SubscribersPage";
import DownloadRequestsPage from "./Pages/Dashboard/Pages/DownloadRequestsPage";
import VideoManage from "./Pages/Dashboard/Pages/VideoManage";
import Videos from "./Pages/Videos";
import Form from "./Pages/Form";
import Ai from "./Pages/Ai/Ai";
import TermsOfService from "./Pages/TermsOfService";
// import PrivacyPolicy from "./Pages/PrivacyPolicy";
import { HelmetProvider } from "react-helmet-async";
import ConservatorshipSales from "./Pages/ConservatorshipSales";
import DownloadRequestPage from "./Shared/DownloadRequestPage";
import StreamliningProbateRealEstateSales from "./Pages/StreamliningProbateRealEstateSales";
import YourResourceCenter from "./Pages/YourResourceCenter";
import Form2 from "./Pages/Form/Form2";
import StreamliningConservatorshipRealEstateSales from "./Pages/StreamliningConservatorshipRealEstateSales";
import VendorIntake from "./Pages/VendorIntake";
import TrustSale from "./Pages/TrustSale";
import ExecutingTrustRealEstateSales from "./Pages/ExecutingTrustRealEstateSales";
import FREEConsultationForm from "./Pages/FREEConsultationForm";
import CourtConfirmationOverbidCalculator from "./Pages/CourtConfirmationOverbidCalculator";
import OccupantAccessRiskAnalyzer from "./Pages/OccupantAccessRiskAnalyzer";
import ProbatePropertyInsuranceRiskChecker from "./Pages/ProbatePropertyInsuranceRiskChecker";
import ExecutorReadinessQuiz from "./Pages/ExecutorReadinessQuiz";
import EmotionalFirstAidBlog from "./Pages/EmotionalFirstAidBlog";
import InvoiceGenerator from "./Pages/InvoiceGenerator";
import InvoiceForm from "./Pages/InvoiceForm";
import InvoiceManagement from "./Pages/InvoiceManagement";
import InvoiceLogin from "./Pages/InvoiceLogin";
import InvoiceProtectedRoute from "./Shared/InvoiceProtectedRoute";
import QuizManagement from "./Pages/QuizManagement";
import Management from "./Pages/Management/Management";

const App = () => {
	// Check and apply saved theme on load
	/*   useEffect(() => {
      const theme = localStorage.getItem("theme");
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      }
    }, []); */

	// Toggle dark mode and save preference
	/*   const toggleDarkMode = () => {
      const isDark = document.documentElement.classList.toggle("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
    }; */

	return (
		<body className='text-[#333] dark:bg-darkBackground dark:text-darkText'>
			{/* <button
        onClick={toggleDarkMode}
        className='fixed bottom-2 left-2 mt-4 px-4 py-2 bg-colorTeal dark:bg-white text-white dark:text-colorTeal rounded-full flex items-center z-50'>
        <i className='fa-solid fa-wheelchair-move text-2xl'></i>
      </button> */}
			<HelmetProvider>
				<DataProvider>
					<BrowserRouter>
						{!window.location.pathname.includes("/management") && <TopNav />}
						<ScrollTop />
						{!window.location.pathname.includes("dashboard") && <Ai />}
						<div style={{ minHeight: "calc(100vh - 200px)" }}>
							<Routes>
								<Route path='/' element={<Home />} />
								<Route path='/login' element={<LoginPage />} />
								<Route
									path='/free-consultation'
									element={<FREEConsultationForm />}
								/>
								{/* <Route path='/privacy-policy' element={<PrivacyPolicy />} /> */}
								<Route path='/terms-of-service' element={<TermsOfService />} />
								<Route path='/blogs' element={<AllBlogList />} />
								<Route path='/videos' element={<Videos />} />
								<Route path='/blog/:id' element={<BlogView />} />
								<Route path='/listings' element={<Listings />} />
								<Route path='/listings/:id' element={<ListingDetails />} />
								<Route path='/commitment' element={<Commitment />} />
								{/* 
								<Route
									path='/navigating-the-sales-process'
									element={<NavigatingTheSalesProcessHome />}
								/> */}
								<Route
									path='/understanding-Probate-sales'
									element={<UnderstandingProbateSalesHome />}
								/>
								<Route
									path='/streamlining-probate-real-estate-sales'
									element={<StreamliningProbateRealEstateSales />}
								/>
								<Route
									path='/your-resource-center'
									element={<YourResourceCenter />}
								/>
								<Route
									path='/understanding-conservatorship-sales'
									element={<ConservatorshipSales />}
								/>
								<Route
									path='/reverse-mortgages'
									element={<AdvantagesOfReverseMortgagesHome />}
								/>
								<Route
									path='/legal-and-ethical-considerations'
									element={<LegalAndEthicalConsiderationsHome />}
								/>
								<Route
									path='/streamlining-conservatorship-real-estate-sales'
									element={<StreamliningConservatorshipRealEstateSales />}
								/>
								<Route path='/vendor-intake' element={<VendorIntake />} />
								<Route path='/trust-sale' element={<TrustSale />} />
								<Route
									path='/executing-trust-real-estate-sales'
									element={<ExecutingTrustRealEstateSales />}
								/>
								<Route
									path='/probate-decision-making-selling-vs-keeping-property'
									element={
										<ProbateDecisionMakingSellingVsKeepingPropertyHome />
									}
								/>
								<Route
									path='/glossary-of-probate-terms'
									element={<GlossaryOfProbateTermsHome />}
								/>
								<Route path='/faqs' element={<FaqHome />} />
								<Route
									path='/court-confirmation-overbid-calculator'
									element={<CourtConfirmationOverbidCalculator />}
								/>
								<Route
									path='/occupant-access-risk-analyzer'
									element={<OccupantAccessRiskAnalyzer />}
								/>
								<Route
									path='/probate-property-insurance-risk-checker'
									element={<ProbatePropertyInsuranceRiskChecker />}
								/>
								<Route
									path='/executor-readiness-quiz'
									element={<ExecutorReadinessQuiz />}
								/>
								<Route
									path='/emotional-first-aid'
									element={<EmotionalFirstAidBlog />}
								/>
								{/* <Route
									path='/invoice-generator'
									element={<InvoiceGenerator />}
								/> */}
								<Route path='/management-login' element={<InvoiceLogin />} />
								<Route path='/management' element={<Management />}>
									<Route path='invoices' element={<InvoiceManagement />} />
									<Route path='invoice-form/new' element={<InvoiceForm />} />
									<Route path='invoice-form/:id' element={<InvoiceForm />} />
									<Route
										path='quiz-users'
										element={<QuizManagement defaultTab='users' />}
									/>
									<Route
										path='quiz-submissions'
										element={<QuizManagement defaultTab='submissions' />}
									/>
								</Route>
								<Route path='/contact' element={<ContactUs />} />
								<Route path='/testimonials' element={<Testimonials />} />
								<Route path='/request' element={<DownloadRequestPage />} />
								<Route
									path='/dashboard'
									element={
										<PrivateRoute>
											<Dashboard />
										</PrivateRoute>
									}>
									<Route
										path='downloadRequests'
										element={<DownloadRequestsPage />}
									/>
									<Route path='subscribers' element={<SubscribersPage />} />
									<Route path='listings' element={<ListingsManage />} />
									<Route path='videos' element={<VideoManage />} />
									<Route path='blogs' element={<BlogList />} />
									<Route path='addBlog' element={<AddBlog />} />
									<Route path='blog/:id' element={<Blog />} />
								</Route>
							</Routes>
						</div>

						{!window.location.pathname.includes("/management") && <Footer />}
					</BrowserRouter>
				</DataProvider>
			</HelmetProvider>
		</body>
	);
};

export default App;
