import About from "./About";
import Account from "./Account";
import Appearance from "./Appearance";
import AppPreferences from "./AppPreferences";
import BugFixes from "./BugFix";
import Notifications from "./Notifications";
import Privacy from "./Privacy";

const Main = ({ userData }) => {
  return (
    <>
      <div className="lg:p-10 h-screen flex flex-col w-full">
        <Account user={userData} />
        {/* <AppPreferences /> */}
        <Appearance />
        {/* <Notifications /> */}
        <Privacy />
        <About />
        <BugFixes />
      </div>
    </>
  );
};
export default Main;
