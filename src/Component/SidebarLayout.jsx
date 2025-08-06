import Sidebar from './Sidebar';
import TopNavbar from './Navbar';

const SidebarLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <TopNavbar />
        <main className="p-4 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
