
import Footer from "../Footer";

const Videos = () => {
  const videos = [
    {
      id: 1,
      title: "Understanding Annuities for Retirement",
      description: "Day 1: Discover the fundamentals of annuities and how they can protect your retirement savings.",
      duration: "8:30",
      thumbnail: "bg-gradient-to-br from-blue-600 to-blue-800",
      thumbnailUrl: "https://cdn.loom.com/sessions/thumbnails/915bb11ce617463e916237f619e55e3f-11bcac88c5391fb6-full-play.gif",
      embedUrl: "https://www.loom.com/embed/915bb11ce617463e916237f619e55e3f?sid=d171f29b-5b47-4576-9c05-e9fbdabb636e",
      featured: true
    },
    {
      id: 2,
      title: "Understanding Indexed Annuities",
      description: "Day 1: Learn how indexed annuities can provide market upside with downside protection.",
      duration: "7:45",
      thumbnail: "bg-gradient-to-br from-green-600 to-green-800",
      embedUrl: "https://www.loom.com/embed/95927667ce8a4564bc46956367c37654?sid=6e43bb03-1925-42cd-ab18-30c01bdd2d8c"
    },
    {
      id: 3,
      title: "Understanding the 401K Crisis",
      description: "Day 2: Learn the hidden risks in traditional retirement accounts and how to protect yourself.",
      duration: "9:15",
      thumbnail: "bg-gradient-to-br from-red-600 to-red-800",
      thumbnailUrl: "https://cdn.loom.com/sessions/thumbnails/a5c3e412a6f640458b7719d5f43c18b5-b328b68de5191fa7-full.jpg",
      embedUrl: "https://www.loom.com/embed/a5c3e412a6f640458b7719d5f43c18b5?sid=9b095119-3703-4ead-8acb-6bc22fe99ec8"
    },
    {
      id: 4,
      title: "Understanding Growth Annuities Part 1",
      description: "Day 3: Explore how growth annuities can help you build wealth while protecting your principal.",
      duration: "8:20",
      thumbnail: "bg-gradient-to-br from-purple-600 to-purple-800",
      thumbnailUrl: "https://cdn.loom.com/sessions/thumbnails/1c7ad33852af45ebbc79c7e13bbba3f3-afa64c83a498205d-full.jpg",
      embedUrl: "https://www.loom.com/embed/1c7ad33852af45ebbc79c7e13bbba3f3?sid=7053dae5-1e40-4660-8ff7-3cd282a869e4"
    },
    {
      id: 5,
      title: "Client Testimonies on Indexed Annuities",
      description: "Day 4: Hear real stories from clients who have benefited from indexed annuity strategies.",
      duration: "7:55",
      thumbnail: "bg-gradient-to-br from-orange-600 to-orange-800",
      thumbnailUrl: "https://cdn.loom.com/sessions/thumbnails/47443dd6ac814695b8ee4c47afd78930-19aa7a4790179011-full.jpg",
      embedUrl: "https://www.loom.com/embed/47443dd6ac814695b8ee4c47afd78930?sid=80cfec8a-13a2-4260-948d-30c502da2a3b"
    },
    {
      id: 6,
      title: "Understanding Indexed Annuities",
      description: "Day 5: Deep dive into indexed annuities and their role in retirement protection.",
      duration: "6:40",
      thumbnail: "bg-gradient-to-br from-indigo-600 to-indigo-800",
      thumbnailUrl: "https://cdn.loom.com/sessions/thumbnails/40f509c71f34404cbab0c5f88ed5be66-69c98ae6bbe6d94f-full.jpg",
      embedUrl: "https://www.loom.com/embed/40f509c71f34404cbab0c5f88ed5be66?sid=112b93e7-51e2-4d64-be9b-6f57307f48f3"
    },
    {
      id: 7,
      title: "Understanding Income Annuities",
      description: "Day 6: Learn how to ensure you never run out of money in retirement with income annuities.",
      duration: "8:10",
      thumbnail: "bg-gradient-to-br from-teal-600 to-teal-800",
      thumbnailUrl: "https://cdn.loom.com/sessions/thumbnails/b9a1f4923c8743a997a39d006561a30b-0ff351a5852ae4e8-full.jpg",
      embedUrl: "https://www.loom.com/embed/b9a1f4923c8743a997a39d006561a30b?sid=a623d195-bc2a-4c91-9168-3942b5a3bee0"
    },
    {
      id: 8,
      title: "Guide to Financial Freedom",
      description: "Day 7: Your comprehensive guide to achieving true financial freedom in retirement.",
      duration: "9:30",
      thumbnail: "bg-gradient-to-br from-emerald-600 to-emerald-800",
      thumbnailUrl: "https://cdn.loom.com/sessions/thumbnails/8177468ca6394fc2aa8df3e4fc2fb015-b5909019fed2281a-full.jpg",
      embedUrl: "https://www.loom.com/embed/8177468ca6394fc2aa8df3e4fc2fb015?sid=c23c649d-be7f-4cec-9bfa-08d14c3701e6"
    },
    {
      id: 9,
      title: "Protecting Your Retirement Nest Egg",
      description: "Day 8: Essential strategies to safeguard your retirement savings from market volatility.",
      duration: "7:25",
      thumbnail: "bg-gradient-to-br from-cyan-600 to-cyan-800",
      thumbnailUrl: "https://cdn.loom.com/sessions/thumbnails/446bdc451b07419986347de1d17a1c5b-8702d3414f1a5558-full.jpg",
      embedUrl: "https://www.loom.com/embed/446bdc451b07419986347de1d17a1c5b?sid=ebc40654-fa49-463e-8f5b-278f9cb7befe"
    },
    {
      id: 10,
      title: "Wealth Strategies for the Affluent",
      description: "Day 9: Advanced wealth protection strategies for high-net-worth individuals.",
      duration: "8:45",
      thumbnail: "bg-gradient-to-br from-violet-600 to-violet-800",
      thumbnailUrl: "https://cdn.loom.com/sessions/thumbnails/8a8b9e1204cb436abca7663233da345e-58a6b2b5c02f143c-full.jpg",
      embedUrl: "https://www.loom.com/embed/8a8b9e1204cb436abca7663233da345e?sid=f2ddae74-7585-4727-a962-7a4974de10fe"
    },
    {
      id: 11,
      title: "Understanding All Annuities Explained",
      description: "Day 10: Complete overview of all annuity types and how to choose the right one for you.",
      duration: "10:15",
      thumbnail: "bg-gradient-to-br from-rose-600 to-rose-800",
      embedUrl: "https://www.loom.com/embed/0345f353ebc1475ba5ad453f5c467049?sid=a68f0af2-75a7-4150-a7d6-8c9b5f5b8903"
    }
  ];

  const featuredVideo = videos[0];
  const otherVideos = videos.slice(1);

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#36596A] mb-4">
              Video Library
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn retirement planning through our comprehensive video series.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">Video library coming soon...</p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Videos;
