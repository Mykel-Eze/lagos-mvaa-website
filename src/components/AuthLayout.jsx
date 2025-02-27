// Auth Layout Component
const AuthLayout = ({ children, title }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F0F7F6]">
      <main className="flex-1 flex flex-col items-center py-12 container">
        <h1 className="text-[32px] font-bold mb-2">{title}</h1>
        
        <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-md">
          {children}
        </div>
      </main>
      
      {/* <footer className="bg-white py-6 border-t">
        <div className="container mx-auto text-center text-gray-600">
          <p>© {new Date().getFullYear()} Lagos State MVAA. All rights reserved.</p>
        </div>
      </footer> */}
    </div>
  );
};

export default AuthLayout;