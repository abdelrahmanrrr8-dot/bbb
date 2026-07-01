import { useState } from 'react';
import { Lock, User, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAdmin } from '../../lib/admin';
import { useRouter } from '../../lib/router';

export function AdminLoginPage() {
  const { login } = useAdmin();
  const { navigate } = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate('/control-panel/dashboard');
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen bg-jet flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-sm shadow-2xl p-8 animate-slide-up">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-sm bg-gold-gradient flex items-center justify-center mx-auto mb-4 shadow-gold">
              <span className="text-3xl font-bold text-jet font-display">م</span>
            </div>
            <h1 className="text-2xl font-bold text-jet font-display">لوحة التحكم</h1>
            <p className="text-silver-500 text-sm mt-1">معرض محمد جودة</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-silver-700 mb-1.5">اسم المستخدم</label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-silver-400" />
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="input-field pr-11" placeholder="admin" autoFocus />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-silver-700 mb-1.5">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-silver-400" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pr-11 pl-11" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver-400 hover:text-silver-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {error && <p className="text-alert text-sm bg-red-50 p-3 rounded-sm">{error}</p>}
            <button type="submit" className="btn-gold w-full">تسجيل الدخول</button>
          </form>

          <button onClick={() => navigate('/')} className="inline-flex items-center gap-1 text-sm text-silver-500 hover:text-gold-500 mt-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />العودة للمتجر
          </button>
        </div>
      </div>
    </div>
  );
}
