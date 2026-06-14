import { AppProvider, useApp } from './context/AppContext';
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import OTPScreen from './screens/OTPScreen';
import GPSScreen from './screens/GPSScreen';
import AppScreen from './screens/AppScreen';

function Router() {
  const { screen } = useApp();

  switch (screen) {
    case 'splash': return <SplashScreen />;
    case 'home':   return <HomeScreen />;
    case 'otp':    return <OTPScreen />;
    case 'gps':    return <GPSScreen />;
    case 'app':    return <AppScreen />;
    default:       return <HomeScreen />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}
