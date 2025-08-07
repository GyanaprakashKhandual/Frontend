import { useState } from "react"

export default function App() {
  const [backgroundClass, setBackgroundClass] = useState('bg-1');

  const gradients = [
    { class: 'bg-1', name: 'Sunset', colors: 'linear-gradient(135deg, #ff4e50, #fc913a, #f9d62e, #eae374)' },
    { class: 'bg-2', name: 'Lavender', colors: 'linear-gradient(135deg, #a18cd1, #fbc2eb, #f9d29d, #ffb199)' },
    { class: 'bg-3', name: 'Electric', colors: 'linear-gradient(135deg, #00c3ff, #ffff1c, #ff6f61, #d72638)' },
    { class: 'bg-4', name: 'Pastel', colors: 'linear-gradient(135deg, #5ee7df, #b490ca, #ff758c, #ff7eb3)' },
    { class: 'bg-5', name: 'Ocean', colors: 'linear-gradient(135deg, #43cea2, #185a9d, #ff9a9e, #fad0c4)' },
    { class: 'bg-6', name: 'Fire', colors: 'linear-gradient(135deg, #ff9966, #ff5e62, #bc4e9c, #f80759)' },
    { class: 'bg-7', name: 'Sky', colors: 'linear-gradient(135deg, #36d1dc, #5b86e5, #6a11cb, #2575fc)' },
    { class: 'bg-8', name: 'Neon', colors: 'linear-gradient(135deg, #12c2e9, #c471ed, #f64f59, #e53935)' },
    { class: 'bg-9', name: 'Mint', colors: 'linear-gradient(135deg, #00f2fe, #4facfe, #00c9ff, #92fe9d)' },
    { class: 'bg-10', name: 'Citrus', colors: 'linear-gradient(135deg, #0fd850, #f9f047, #fe8c00, #f83600)' },
    { class: 'bg-11', name: 'Dream', colors: 'linear-gradient(135deg, #8ec5fc, #e0c3fc, #f093fb, #f5576c)' },
    { class: 'bg-12', name: 'Vibrant', colors: 'linear-gradient(135deg, #ff6a00, #ee0979, #ff6fd8, #845ec2)' }
  ];

  const currentGradient = gradients.find(g => g.class === backgroundClass);

  return (
    <>
      <style>{`
        .bg-1 { background: linear-gradient(135deg, #ff4e50, #fc913a, #f9d62e, #eae374); }
        .bg-2 { background: linear-gradient(135deg, #a18cd1, #fbc2eb, #f9d29d, #ffb199); }
        .bg-3 { background: linear-gradient(135deg, #00c3ff, #ffff1c, #ff6f61, #d72638); }
        .bg-4 { background: linear-gradient(135deg, #5ee7df, #b490ca, #ff758c, #ff7eb3); }
        .bg-5 { background: linear-gradient(135deg, #43cea2, #185a9d, #ff9a9e, #fad0c4); }
        .bg-6 { background: linear-gradient(135deg, #ff9966, #ff5e62, #bc4e9c, #f80759); }
        .bg-7 { background: linear-gradient(135deg, #36d1dc, #5b86e5, #6a11cb, #2575fc); }
        .bg-8 { background: linear-gradient(135deg, #12c2e9, #c471ed, #f64f59, #e53935); }
        .bg-9 { background: linear-gradient(135deg, #00f2fe, #4facfe, #00c9ff, #92fe9d); }
        .bg-10 { background: linear-gradient(135deg, #0fd850, #f9f047, #fe8c00, #f83600); }
        .bg-11 { background: linear-gradient(135deg, #8ec5fc, #e0c3fc, #f093fb, #f5576c); }
        .bg-12 { background: linear-gradient(135deg, #ff6a00, #ee0979, #ff6fd8, #845ec2); }
        
        .gradient-btn {
          width: 60px;
          height: 40px;
          border-radius: 8px;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .gradient-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }
        
        .gradient-btn.active {
          border-color: white;
          box-shadow: 0 0 20px rgba(255,255,255,0.5);
        }
      `}</style>
      
      <div className={`w-full h-screen transition-all duration-500 ease-in-out ${backgroundClass}`}>
        <div className="flex flex-col justify-center items-center h-full">
          <div className="mb-6 text-center">
            <h1 className="text-white text-3xl font-bold mb-2 drop-shadow-lg">
              Gradient Background Changer
            </h1>
            <p className="text-white text-lg opacity-90 drop-shadow">
              Current: {currentGradient?.name}
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 shadow-2xl bg-white/20 backdrop-blur-md rounded-3xl p-6 border border-white/30">
            {gradients.map((gradient) => (
              <button
                key={gradient.class}
                onClick={() => setBackgroundClass(gradient.class)}
                className={`gradient-btn ${backgroundClass === gradient.class ? 'active' : ''}`}
                style={{ background: gradient.colors }}
                title={gradient.name}
              />
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-white text-sm opacity-75 drop-shadow">
              Click any gradient to change the background
            </p>
          </div>
        </div>
      </div>
    </>
  )
}