import IconAndTitle from "../../Components/IconAndTitle";

const ThankYou = () => {
  const conclusionMessages = [
    {
      id: 1,
      description:
        "As we conclude this guide on navigating probate, trust, or conservatorship real estate sales, we want to extend our heartfelt gratitude to you. Dealing with the loss of a loved one and managing their estate through probate can be emotionally challenging and overwhelming. We understand the weight of the responsibility you carry during this time, and we commend your strength and resilience.",
    },
    {
      id: 2,
      description:
        "Navigating the probate process requires patience, diligence, and a compassionate approach, and we're honored to have been a part of your journey. Whether you're a seller, buyer, or involved in any capacity in a probate sale, we appreciate the trust you've placed in us to provide guidance and support.",
    },
    {
      id: 3,
      description:
        "Our hope is that this guide has provided you with valuable insights, resources, and assistance to navigate probate sales with confidence and clarity. Remember, you're not alone in this process. Our team is here to support you every step of the way, offering expertise, empathy, and understanding.",
    },
    {
      id: 4,
      description:
        "Thank you for allowing us to serve you during this challenging time. We're grateful for the opportunity to assist you in achieving your goals and finding peace of mind amidst the complexities of probate sales.",
    },
  ];
  return (
    <div className="fade-in">
      <div>
        <div className="w-full mx-auto text-left mt-10">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-colorTeal relative overflow-hidden -mb-4">
            THANK <span className="text-colorOrange bg-clip-text">YOU</span>
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[250px] sm:max-w-lg w-full h-full bg-gradient-to-r from-colorTeal to-colorOrange opacity-20 blur-sm rounded-xl"></span>
          </h2>

          <div className="px-3 staggered-fade-in">
            <IconAndTitle array={conclusionMessages} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
