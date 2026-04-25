import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Map, Github, LogOut, LayoutDashboard } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { label: 'Journeys', icon: Map, path: '/admin/journeys' },
    { label: 'Projects', icon: Github, path: '/admin/projects' },
  ];

  return (
    <div className="min-h-screen bg-background flex relative z-10">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-secondary/30 hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <Link to="/" className="text-xl font-bold tracking-tight hover:text-muted-foreground transition-colors">
            dino<span className="text-muted-foreground">.cms</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
                             (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-foreground text-background font-medium' 
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-red-500/80 hover:bg-red-500/10 hover:text-red-500 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background">
          <Link to="/" className="text-lg font-bold tracking-tight">
            dino<span className="text-muted-foreground">.cms</span>
          </Link>
          <button onClick={handleLogout} className="p-2 text-muted-foreground hover:text-foreground">
            <LogOut size={20} />
          </button>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
