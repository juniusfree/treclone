import HomeComponent from "./components/home";

const Home = () => {
  return (
    <>
      <div className="sm:hidden p-4 text-sm">
        <p>
          Sorry! This site is not available on mobile devices. Please use a
          desktop or laptop computer to view this site.
        </p>
        <iframe
          className="w-full h-auto"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="Rick Astley - Never Gonna Give You Up (Official Music Video)"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe>
      </div>
      <div className="hidden sm:block">
        <HomeComponent />
      </div>
    </>
  );
};

export default Home;
